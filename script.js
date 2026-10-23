/* =====================================
   SAMEER'S AI PORTFOLIO CHATBOT
===================================== */

document.addEventListener("DOMContentLoaded", () => {
  const chatButton = document.getElementById("chatbot-toggle");
  const chatWindow = document.getElementById("chatbot-window");
  const chatForm = document.getElementById("chatbot-form");
  const chatInput = document.getElementById("chatbot-input");
  const chatMessages = document.getElementById("chatbot-messages");

  // Stop safely if chatbot HTML has not been added yet.
  if (!chatButton || !chatWindow || !chatForm || !chatInput || !chatMessages) {
    console.info("Portfolio chatbot UI has not been added yet.");
    return;
  }

  const history = [];

  function addMessage(text, sender) {
    const message = document.createElement("div");
    message.className = `chat-message ${sender}`;
    message.textContent = text;
    chatMessages.appendChild(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return message;
  }

  chatButton.addEventListener("click", () => {
    const isOpen = chatWindow.classList.toggle("open");
    chatButton.setAttribute("aria-expanded", String(isOpen));

    if (isOpen) {
      chatInput.focus();
    }
  });

  chatForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const question = chatInput.value.trim();

    if (!question) return;

    addMessage(question, "user");
    chatInput.value = "";
    chatInput.disabled = true;

    const loadingMessage = addMessage("Thinking...", "assistant");

    try {
      const response = await fetch(
        "/.netlify/functions/portfolio-chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            messages: [
              ...history,
              { role: "user", content: question }
            ]
          })
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success || !data.reply) {
        throw new Error(data.error || "The chatbot is temporarily unavailable.");
      }

      loadingMessage.textContent = data.reply;

      history.push(
        { role: "user", content: question },
        { role: "assistant", content: data.reply }
      );

      // Keep the conversation history manageable.
      if (history.length > 10) {
        history.splice(0, history.length - 10);
      }
    } catch (error) {
      loadingMessage.textContent =
        error.message ||
        "Sorry, I couldn't connect. Please try again.";
    } finally {
      chatInput.disabled = false;
      chatInput.focus();
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  });
});
