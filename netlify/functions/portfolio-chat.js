exports.handler = async (event) => {
  const headers = {
    "Content-Type": "application/json",
    "Cache-Control": "no-store"
  };

  const send = (statusCode, data) => ({
    statusCode,
    headers,
    body: JSON.stringify(data)
  });

  if (event.httpMethod !== "POST") {
    return send(405, { error: "Method not allowed." });
  }

  try {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      console.error("GROQ_API_KEY is missing.");
      return send(500, {
        error: "AI service is not configured. Please try again later."
      });
    }

    const body = JSON.parse(event.body || "{}");

    // Supports both the current frontend and chat history.
    let messages = [];

    if (Array.isArray(body.messages)) {
      messages = body.messages;
    } else if (typeof body.message === "string") {
      messages = [{ role: "user", content: body.message }];
    }

    messages = messages
      .filter(
        (m) =>
          m &&
          ["user", "assistant"].includes(m.role) &&
          typeof m.content === "string"
      )
      .slice(-12)
      .map((m) => ({
        role: m.role,
        content: m.content.slice(0, 4000)
      }));

    if (
      messages.length === 0 ||
      messages[messages.length - 1].role !== "user"
    ) {
      return send(400, { error: "Please enter a valid message." });
    }

    const systemPrompt = `
You are the AI portfolio assistant for Mohammed Sameer.

Answer questions about Sameer's portfolio, skills, education,
projects, experience, and contact options.

Known information:
- Name: Mohammed Sameer
- Education: BCA
- Skills: Python, PHP, JavaScript, HTML, CSS, MySQL, Git, GitHub
- Projects: E-Labour, Find My Child, ExpenseFlow
- GitHub: https://github.com/mohammedsameer07s
- LinkedIn: https://linkedin.com/in/mohammed-sameer-65a860308
- Portfolio: https://sameer7.netlify.app

Be friendly, professional, concise, and truthful.
Do not invent qualifications, work experience, or project details.
If you do not know an answer, say so and suggest contacting Sameer.
`;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: systemPrompt },
            ...messages
          ],
          temperature: 0.5,
          max_tokens: 600
        })
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error("Groq API error:", response.status, result);

      if (response.status === 429) {
        return send(429, {
          error: "AI request limit reached. Please try again later."
        });
      }

      return send(502, {
        error: "AI provider error. Please try again later."
      });
    }

    const reply = result.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      return send(502, {
        error: "The AI returned an empty response. Please try again."
      });
    }

    return send(200, {
      success: true,
      reply
    });
  } catch (error) {
    console.error("Portfolio chatbot error:", error);

    return send(500, {
      error: "Something went wrong. Please try again later."
    });
  }
};
