// SCROLL ANIMATION
const reveals = document.querySelectorAll(".reveal, .reveal-img");

window.addEventListener("scroll", () => {
  reveals.forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < window.innerHeight - 100) {
      el.classList.add("active");
    }
  });
});

// STICKY HEADER SCROLL EFFECT
const header = document.querySelector('.page-header');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// DARK/LIGHT MODE TOGGLE
const themeToggle = document.getElementById("themeToggle");
const htmlElement = document.documentElement;

// Check saved theme preference or default to dark
const savedTheme = localStorage.getItem("theme") || "dark";
if (savedTheme === "light") {
  htmlElement.classList.add("light-mode");
  themeToggle.textContent = "☀️";
}

themeToggle.addEventListener("click", () => {
  htmlElement.classList.toggle("light-mode");
  const isLight = htmlElement.classList.contains("light-mode");
  localStorage.setItem("theme", isLight ? "light" : "dark");
  themeToggle.textContent = isLight ? "☀️" : "🌙";
});

// HAMBURGER MENU TOGGLE
const hamburgerMenu = document.getElementById("hamburgerMenu");
const mainNav = document.getElementById("mainNav");

hamburgerMenu.addEventListener("click", () => {
  hamburgerMenu.classList.toggle("active");
  mainNav.classList.toggle("active");
});

// Close menu when a link is clicked
document.querySelectorAll(".main-nav a").forEach(link => {
  link.addEventListener("click", () => {
    hamburgerMenu.classList.remove("active");
    mainNav.classList.remove("active");
  });
});

// Close menu when clicking outside
document.addEventListener("click", (e) => {
  if (!e.target.closest(".page-header")) {
    hamburgerMenu.classList.remove("active");
    mainNav.classList.remove("active");
  }
});

// SMOOTH SCROLL FOR NAVIGATION
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#') {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  });
});

// EMAIL FORM HANDLING WITH LOADING STATE
function sendEmail(event) {
  event.preventDefault();

  const form = document.getElementById("contactForm");
  const submitBtn = document.getElementById("submitBtn");
  const formMessage = document.getElementById("formMessage");
  const btnText = submitBtn.querySelector(".btn-text");
  const btnSpinner = submitBtn.querySelector(".btn-spinner");

  const params = {
    from_name: document.getElementById("name").value,
    from_email: document.getElementById("email").value,
    subject: document.getElementById("subject").value,
    message: document.getElementById("message").value
  };

  // Show loading state
  submitBtn.disabled = true;
  btnText.style.display = "none";
  btnSpinner.style.display = "inline-block";
  formMessage.style.display = "none";

  emailjs.send("service_q9yq17m", "template_vl14zcj", params)
    .then(() => {
      // Success state
      submitBtn.disabled = false;
      btnText.style.display = "inline";
      btnSpinner.style.display = "none";
      
      formMessage.textContent = "✓ Message sent successfully! I'll get back to you soon.";
      formMessage.className = "form-message success";
      formMessage.style.display = "block";
      
      form.reset();
      
      // Hide message after 5 seconds
      setTimeout(() => {
        formMessage.style.display = "none";
      }, 5000);
    })
    .catch(error => {
      // Error state
      console.error("EmailJS error:", error);
      submitBtn.disabled = false;
      btnText.style.display = "inline";
      btnSpinner.style.display = "none";
      
      const errorMessage = error && error.text ? error.text : "Please try again later.";
      formMessage.textContent = `✗ Failed to send message. ${errorMessage}`;
      formMessage.className = "form-message error";
      formMessage.style.display = "block";
      
      // Hide message after 5 seconds
      setTimeout(() => {
        formMessage.style.display = "none";
      }, 5000);
    });
}

// INITIALIZE
document.addEventListener("DOMContentLoaded", () => {
  // Trigger initial animation for elements already in view
  reveals.forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < window.innerHeight - 100) {
      el.classList.add("active");
    }
  });
});
