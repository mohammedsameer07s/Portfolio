document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.getElementById("hamburgerMenu");
    const nav = document.getElementById("mainNav");
    const header = document.querySelector(".site-header");
    const navLinks = nav ? [...nav.querySelectorAll("a")] : [];

    // Mobile navigation
    if (hamburger && nav) {
        hamburger.addEventListener("click", () => {
            const isOpen = hamburger.classList.toggle("active");
            nav.classList.toggle("active", isOpen);
            hamburger.setAttribute("aria-expanded", String(isOpen));
        });

        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                hamburger.classList.remove("active");
                nav.classList.remove("active");
                hamburger.setAttribute("aria-expanded", "false");
            });
        });

        document.addEventListener("click", event => {
            if (window.innerWidth <= 850 && !nav.contains(event.target) && !hamburger.contains(event.target)) {
                hamburger.classList.remove("active");
                nav.classList.remove("active");
                hamburger.setAttribute("aria-expanded", "false");
            }
        });
    }

    // Scroll reveal
    const revealElements = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealElements.forEach(element => observer.observe(element));

    // Active section in the left navigation
    const sections = [...document.querySelectorAll("main section[id]")];
    const setActiveLink = () => {
        const marker = window.scrollY + Math.min(window.innerHeight * 0.35, 280);
        let current = sections[0]?.id || "about";

        sections.forEach(section => {
            if (marker >= section.offsetTop) current = section.id;
        });

        navLinks.forEach(link => {
            link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
        });
    };

    const updateHeader = () => {
        if (header) header.classList.toggle("scrolled", window.scrollY > 30);
        setActiveLink();
    };

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    window.addEventListener("resize", setActiveLink);
});
