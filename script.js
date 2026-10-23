
document.addEventListener("DOMContentLoaded", () => {

  const year = document.getElementById("current-year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");
  const navItems = document.querySelectorAll(".nav-link");

  function closeMenu() {
    navLinks?.classList.remove("open");
    document.body.classList.remove("menu-open");

    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation menu");
      menuToggle.innerHTML =
        '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
    }
  }

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");

      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
      );

      menuToggle.innerHTML = isOpen
        ? '<i class="fa-solid fa-xmark" aria-hidden="true"></i>'
        : '<i class="fa-solid fa-bars" aria-hidden="true"></i>';

      document.body.classList.toggle("menu-open", isOpen);
    });

    navItems.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", (event) => {
      if (
        navLinks.classList.contains("open") &&
        !event.target.closest(".side-nav")
      ) {
        closeMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 800) {
        closeMenu();
      }
    });
  }

  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            currentObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealElements.forEach((element) => observer.observe(element));
  } else {
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });
  }

  const sections = document.querySelectorAll("main section[id]");
  const sideNav = document.querySelector(".side-nav");

  function updateNavigation() {
    const scrollPosition = window.scrollY + 180;
    let currentSection = "";

    sections.forEach((section) => {
      if (
        scrollPosition >= section.offsetTop &&
        scrollPosition < section.offsetTop + section.offsetHeight
      ) {
        currentSection = section.id;
      }
    });

    navItems.forEach((link) => {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === `#${currentSection}`
      );
    });

    sideNav?.classList.toggle("scrolled", window.scrollY > 30);
  }

  window.addEventListener("scroll", updateNavigation, { passive: true });
  updateNavigation();


  const themeButton = document.getElementById("theme-toggle");

  function applyTheme(theme) {
    const isLight = theme === "light";

    document.body.classList.toggle("light-theme", isLight);
    document.documentElement.style.colorScheme = isLight ? "light" : "dark";

    if (themeButton) {
      themeButton.innerHTML = isLight
        ? '<i class="fa-solid fa-moon" aria-hidden="true"></i>'
        : '<i class="fa-solid fa-sun" aria-hidden="true"></i>';

      themeButton.setAttribute(
        "aria-label",
        isLight ? "Switch to dark mode" : "Switch to light mode"
      );

      themeButton.title = isLight
        ? "Switch to dark mode"
        : "Switch to light mode";
    }
  }

  let initialTheme = "dark";

  try {
    initialTheme =
      localStorage.getItem("sameer-portfolio-theme") || "dark";
  } catch (error) {
    console.info("Theme preference storage is unavailable.");
  }

  applyTheme(initialTheme);

  if (themeButton) {
    themeButton.addEventListener("click", () => {
      const isCurrentlyLight =
        document.body.classList.contains("light-theme");

      const nextTheme = isCurrentlyLight ? "dark" : "light";

      applyTheme(nextTheme);

      try {
        localStorage.setItem("sameer-portfolio-theme", nextTheme);
      } catch (error) {
        console.info("Could not save theme preference.");
      }
    });
  }


  
  const chatButton = document.getElementById("chat-launcher");
  const chatPanel = document.getElementById("chat-panel");
  const chatClose = document.getElementById("chat-close");
  const chatForm = document.getElementById("chat-form");
  const chatInput = document.getElementById("chat-input");
  const chatMessages = document.getElementById("chat-messages");

  if (
    chatButton &&
    chatPanel &&
    chatClose &&
    chatForm &&
    chatInput &&
    chatMessages
  ) {
    const conversationHistory = [];
    const sendButton = chatForm.querySelector('button[type="submit"]');

    function toggleChat(show) {
      chatPanel.classList.toggle("open", show);
      chatPanel.setAttribute("aria-hidden", String(!show));
      chatButton.setAttribute("aria-expanded", String(show));

      if (show) {
        chatInput.focus();
      }
    }

    chatButton.setAttribute("aria-expanded", "false");

    chatButton.addEventListener("click", () => {
      toggleChat(!chatPanel.classList.contains("open"));
    });

    chatClose.addEventListener("click", () => {
      toggleChat(false);
    });

    function addChatMessage(text, sender) {
      const message = document.createElement("div");

      message.className = `chat-message ${sender}`;
      message.textContent = text;

      chatMessages.appendChild(message);
      chatMessages.scrollTop = chatMessages.scrollHeight;

      return message;
    }

    chatForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const question = chatInput.value.trim();

      if (!question || chatInput.disabled) return;

      addChatMessage(question, "user");

      chatInput.value = "";
      chatInput.disabled = true;

      if (sendButton) sendButton.disabled = true;

      const loadingMessage = addChatMessage("Thinking...", "bot");

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
                ...conversationHistory,
                {
                  role: "user",
                  content: question
                }
              ]
            })
          }
        );

        let data;

        try {
          data = await response.json();
        } catch (error) {
          throw new Error(
            "The server returned an invalid response. Please try again."
          );
        }

        if (!response.ok || !data.success || !data.reply) {
          throw new Error(
            data.error || "The AI assistant is temporarily unavailable."
          );
        }

        loadingMessage.textContent = data.reply;

        conversationHistory.push(
          { role: "user", content: question },
          { role: "assistant", content: data.reply }
        );

        // Keep the latest 10 messages for context.
        if (conversationHistory.length > 10) {
          conversationHistory.splice(
            0,
            conversationHistory.length - 10
          );
        }
      } catch (error) {
        console.error("Portfolio chatbot error:", error);

        loadingMessage.textContent =
          error.message ||
          "Sorry, I couldn't connect. Please try again.";
      } finally {
        chatInput.disabled = false;

        if (sendButton) sendButton.disabled = false;

        chatInput.focus();
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }
    });
  } else {
    console.warn(
      "Chatbot could not start because one or more HTML elements are missing."
    );
  }
});
