document.addEventListener("DOMContentLoaded", () => {

  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");
  const navItems = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("main section[id]");
  const yearElement = document.getElementById("current-year");


  /* CURRENT YEAR */

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }


  /* MOBILE MENU */

  if (menuToggle && navLinks) {

    menuToggle.addEventListener("click", () => {

      const isOpen =
        navLinks.classList.toggle("open");

      menuToggle.setAttribute(
        "aria-expanded",
        String(isOpen)
      );

      menuToggle.setAttribute(
        "aria-label",
        isOpen
          ? "Close navigation menu"
          : "Open navigation menu"
      );

      document.body.classList.toggle(
        "menu-open",
        isOpen
      );

      const icon =
        menuToggle.querySelector("i");

      if (icon) {

        icon.className = isOpen
          ? "fa-solid fa-xmark"
          : "fa-solid fa-bars";

        icon.setAttribute(
          "aria-hidden",
          "true"
        );

      }

    });

  }


  /* CLOSE MOBILE MENU */

  navItems.forEach((link) => {

    link.addEventListener("click", () => {

      if (!navLinks || !menuToggle) {
        return;
      }

      navLinks.classList.remove("open");

      menuToggle.setAttribute(
        "aria-expanded",
        "false"
      );

      menuToggle.setAttribute(
        "aria-label",
        "Open navigation menu"
      );

      document.body.classList.remove(
        "menu-open"
      );

      const icon =
        menuToggle.querySelector("i");

      if (icon) {
        icon.className =
          "fa-solid fa-bars";

        icon.setAttribute(
          "aria-hidden",
          "true"
        );
      }

    });

  });


  /* CLOSE MENU WHEN CLICKING OUTSIDE */

  document.addEventListener("click", (event) => {

    if (!navLinks || !menuToggle) {
      return;
    }

    const clickedInsideNav =
      event.target.closest(".side-nav");

    if (!clickedInsideNav &&
        navLinks.classList.contains("open")) {

      navLinks.classList.remove("open");

      menuToggle.setAttribute(
        "aria-expanded",
        "false"
      );

      menuToggle.setAttribute(
        "aria-label",
        "Open navigation menu"
      );

      document.body.classList.remove(
        "menu-open"
      );

      const icon =
        menuToggle.querySelector("i");

      if (icon) {
        icon.className =
          "fa-solid fa-bars";
      }

    }

  });


  /* REVEAL ANIMATION */

  const revealElements =
    document.querySelectorAll(".reveal");


  if ("IntersectionObserver" in window) {

    const revealObserver =
      new IntersectionObserver(
        (entries, observer) => {

          entries.forEach((entry) => {

            if (entry.isIntersecting) {

              entry.target.classList.add(
                "visible"
              );

              observer.unobserve(
                entry.target
              );

            }

          });

        },
        {
          threshold: 0.12
        }
      );


    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });

  } else {

    revealElements.forEach((element) => {
      element.classList.add("visible");
    });

  }


  /* ACTIVE NAVIGATION */

  const updateActiveNavigation = () => {

    const scrollPosition =
      window.scrollY + 180;


    let currentSection = "";


    sections.forEach((section) => {

      const top = section.offsetTop;
      const height = section.offsetHeight;

      if (
        scrollPosition >= top &&
        scrollPosition < top + height
      ) {
        currentSection = section.id;
      }

    });


    navItems.forEach((link) => {

      const target =
        link.getAttribute("href");

      link.classList.toggle(
        "active",
        target === `#${currentSection}`
      );

    });

  };


  /* HEADER SCROLL EFFECT */

  const handleScroll = () => {

    updateActiveNavigation();

    const nav =
      document.querySelector(".side-nav");

    if (!nav) {
      return;
    }

    if (window.scrollY > 30) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }

  };


  window.addEventListener(
    "scroll",
    handleScroll,
    { passive: true }
  );


  /* RESIZE */

  window.addEventListener(
    "resize",
    () => {

      if (
        window.innerWidth > 800 &&
        navLinks &&
        navLinks.classList.contains("open")
      ) {

        navLinks.classList.remove("open");

        if (menuToggle) {

          menuToggle.setAttribute(
            "aria-expanded",
            "false"
          );

          menuToggle.setAttribute(
            "aria-label",
            "Open navigation menu"
          );

          const icon =
            menuToggle.querySelector("i");

          if (icon) {
            icon.className =
              "fa-solid fa-bars";
          }

        }

        document.body.classList.remove(
          "menu-open"
        );

      }

    }
  );


  /* INITIAL STATE */

  handleScroll();

});