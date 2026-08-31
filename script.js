/* =========================================================
   MOHAMMED SAMEER — CYBER PORTFOLIO JS
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* ================= HAMBURGER ================= */

  const hamburger = document.getElementById("hamburgerMenu");
  const nav = document.getElementById("mainNav");

  if (hamburger && nav) {

    hamburger.addEventListener("click", () => {
      nav.classList.toggle("active");
      hamburger.classList.toggle("active");
    });

    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("active");
        hamburger.classList.remove("active");
      });
    });
  }


  /* ================= SCROLL REVEAL ================= */

  const revealElements = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    (entries) => {

      entries.forEach(entry => {

        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          revealObserver.unobserve(entry.target);
        }

      });

    },
    {
      threshold: 0.12
    }
  );

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });


  /* ================= THEME ================= */

  const themeToggle = document.getElementById("themeToggle");

  const savedTheme = localStorage.getItem("sameer-theme");

  if (savedTheme === "light") {
    document.body.classList.add("light-mode");

    if (themeToggle) {
      themeToggle.textContent = "☀️";
    }
  }

  if (themeToggle) {

    themeToggle.addEventListener("click", () => {

      document.body.classList.toggle("light-mode");

      const isLight =
        document.body.classList.contains("light-mode");

      themeToggle.textContent =
        isLight ? "☀️" : "🌙";

      localStorage.setItem(
        "sameer-theme",
        isLight ? "light" : "dark"
      );

    });

  }


  /* ================= PROJECT TILT ================= */

  const cards = document.querySelectorAll(".project-card");

  cards.forEach(card => {

    card.addEventListener("mousemove", event => {

      if (window.innerWidth < 800) return;

      const rect = card.getBoundingClientRect();

      const x =
        event.clientX - rect.left;

      const y =
        event.clientY - rect.top;

      const rotateY =
        ((x / rect.width) - 0.5) * 7;

      const rotateX =
        ((y / rect.height) - 0.5) * -7;

      card.style.transform =
        `perspective(900px)
         rotateX(${rotateX}deg)
         rotateY(${rotateY}deg)
         translateY(-8px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });

  });


  /* ================= TERMINAL TYPING ================= */

  const statusText = document.querySelector(".hero-copy::before");

  /*
     CSS pseudo element cannot be changed directly,
     so create a tiny terminal status element.
  */

  const heroCopy = document.querySelector(".hero-copy");

  if (heroCopy) {

    const terminal = document.createElement("div");

    terminal.className = "terminal-status";

    terminal.textContent =
      "> initializing_portfolio...";

    heroCopy.insertBefore(
      terminal,
      heroCopy.firstChild
    );

    let messages = [
      "> initializing_portfolio...",
      "> loading_projects...",
      "> loading_skills...",
      "> security_protocol: ACTIVE",
      "> system_status: ONLINE"
    ];

    let index = 0;

    setInterval(() => {

      index =
        (index + 1) % messages.length;

      terminal.textContent =
        messages[index];

    }, 2200);

  }


  /* ================= CURSOR GLOW ================= */

  const cursorGlow =
    document.createElement("div");

  cursorGlow.className =
    "cursor-glow";

  document.body.appendChild(cursorGlow);

  document.addEventListener("mousemove", event => {

    cursorGlow.style.left =
      event.clientX + "px";

    cursorGlow.style.top =
      event.clientY + "px";

  });


  /* ================= BUTTON RIPPLE ================= */

  document
    .querySelectorAll("button, .cta-btn, .resume-btn")
    .forEach(button => {

      button.addEventListener("click", function (event) {

        const ripple =
          document.createElement("span");

        ripple.className = "ripple";

        const rect =
          this.getBoundingClientRect();

        ripple.style.left =
          event.clientX - rect.left + "px";

        ripple.style.top =
          event.clientY - rect.top + "px";

        this.appendChild(ripple);

        setTimeout(() => {
          ripple.remove();
        }, 600);

      });

    });

});


/* ================= EXTRA CYBER CSS ================= */

const cyberStyle = document.createElement("style");

cyberStyle.textContent = `

.terminal-status {
  display: inline-block;
  margin-bottom: 12px;
  padding: 7px 11px;

  color: #00ff9c;
  background: rgba(0,255,156,.035);

  border-left: 2px solid #00ff9c;

  font-size: 10px;
  letter-spacing: 1px;

  text-shadow: 0 0 8px rgba(0,255,156,.6);

  animation: terminalBlink 1.5s infinite;
}

@keyframes terminalBlink {
  50% {
    opacity: .55;
  }
}

.cursor-glow {
  position: fixed;

  width: 180px;
  height: 180px;

  border-radius: 50%;

  pointer-events: none;
  z-index: -1;

  transform: translate(-50%, -50%);

  background: radial-gradient(
    circle,
    rgba(0,255,156,.07),
    transparent 70%
  );

  transition:
    left .12s ease-out,
    top .12s ease-out;
}

.ripple {
  position: absolute;

  width: 10px;
  height: 10px;

  border-radius: 50%;

  background: rgba(255,255,255,.5);

  transform: translate(-50%, -50%);

  animation: rippleAnimation .6s ease-out forwards;

  pointer-events: none;
}

@keyframes rippleAnimation {
  from {
    width: 10px;
    height: 10px;
    opacity: .7;
  }

  to {
    width: 220px;
    height: 220px;
    opacity: 0;
  }
}

.hamburger-menu.active span:nth-child(1) {
  transform: translateY(6px) rotate(45deg);
}

.hamburger-menu.active span:nth-child(2) {
  opacity: 0;
}

.hamburger-menu.active span:nth-child(3) {
  transform: translateY(-6px) rotate(-45deg);
}

`;

document.head.appendChild(cyberStyle);
