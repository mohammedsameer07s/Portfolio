document.addEventListener("DOMContentLoaded", () => {

    const hamburger = document.getElementById("hamburgerMenu");
    const nav = document.getElementById("mainNav");

    if (hamburger && nav) {
        hamburger.addEventListener("click", () => {
            const active = hamburger.classList.toggle("active");
            nav.classList.toggle("active");

            hamburger.setAttribute(
                "aria-expanded",
                active ? "true" : "false"
            );
        });

        nav.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                hamburger.classList.remove("active");
                nav.classList.remove("active");
                hamburger.setAttribute("aria-expanded", "false");
            });
        });
    }

    /* Scroll reveal */
    const revealElements = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("active");
                }
            });
        },
        {
            threshold: 0.12
        }
    );

    revealElements.forEach(element => {
        observer.observe(element);
    });

    /* Navbar shadow while scrolling */
    const header = document.querySelector(".site-header");

    window.addEventListener("scroll", () => {
        if (window.scrollY > 30) {
            header.style.transform = "translateY(-2px)";
        } else {
            header.style.transform = "translateY(0)";
        }
    });

});
