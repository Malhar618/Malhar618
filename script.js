/*  script.js – Malhar Mahajan portfolio
    ────────────────────────────────────
    • GSAP‑powered intro + scroll animations
    • Navbar active‑section highlighting
    • Mobile menu toggle
    • “Back to top” button
    • Contact‑form POST → Render backend
*/

/* ============================== */
/* ⮞  CONFIG                      */
/* ============================== */

const EMAIL_API =
  "https://malhar-portfolio-server.onrender.com/send-email"; // change only if you move your Render service
const SECTIONS   = document.querySelectorAll("section[id]"); // every major page section

/* ============================== */
/* ⮞  MAIN                        */
/* ============================== */
window.addEventListener("DOMContentLoaded", () => {
  initAnimations();
  initNavHighlight();
  initMobileNav();
  initBackToTop();
  initContactForm();
});

/* ============================== */
/* ⮞  GSAP / SCROLL ANIMATION     */
/* ============================== */
function initAnimations() {
  if (typeof gsap === "undefined") return; // fail‑safe – GSAP CDN not loaded

  /* Hero rocket liftoff (once) */
  gsap.from("#rocket", {
    yPercent: 100,
    opacity: 0,
    duration: 1.6,
    ease: "power3.out",
  });

  /* Hero text stagger */
  gsap.from(".hero‑stagger", {
    y: 40,
    opacity: 0,
    stagger: 0.15,
    delay: 0.4,
    duration: 1,
    ease: "power3.out",
  });

  /* Scroll‑triggered fades for any .reveal elements */
  SECTIONS.forEach((section) => {
    const els = section.querySelectorAll(".reveal");
    els.forEach((el) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
      });
    });
  });
}

/* ============================== */
/* ⮞  NAVBAR ACTIVE LINK          */
/* ============================== */
function initNavHighlight() {
  const navLinks = document.querySelectorAll(".nav-menu a[href^='#']");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = entry.target.id;
        const link = document.querySelector(`.nav-menu a[href="#${id}"]`);
        if (!link) return;
        if (entry.isIntersecting) {
          navLinks.forEach((l) => l.classList.remove("active"));
          link.classList.add("active");
        }
      });
    },
    {
      threshold: 0.5,
    }
  );

  SECTIONS.forEach((section) => observer.observe(section));
}

/* ============================== */
/* ⮞  MOBILE NAV TOGGLE           */
/* ============================== */
function initMobileNav() {
  const burger = document.querySelector(".burger");
  const menu   = document.querySelector(".nav-menu");

  if (!(burger && menu)) return;

  burger.addEventListener("click", () => {
    menu.classList.toggle("open");
    burger.classList.toggle("open");
  });

  /* close after click */
  menu.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => {
      menu.classList.remove("open");
      burger.classList.remove("open");
    })
  );
}

/* ============================== */
/* ⮞  BACK‑TO‑TOP BUTTON          */
/* ============================== */
function initBackToTop() {
  const btn = document.querySelector("#backToTop");
  if (!btn) return;

  window.addEventListener("scroll", () =>
    btn.classList.toggle("show", window.scrollY > 600)
  );

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ============================== */
/* ⮞  CONTACT FORM                */
/* ============================== */
function initContactForm() {
  const form = document.querySelector("#contact-form");
  const statusEl = document.querySelector("#status");
  if (!(form && statusEl)) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    statusEl.textContent = "Sending…";

    const payload = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      subject: form.subject.value.trim(),
      message: form.message.value.trim(),
    };

    try {
      const res = await fetch(EMAIL_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        statusEl.textContent = "Your message has been sent. Thank you!";
        form.reset();
      } else {
        throw new Error(data.message || "Server error");
      }
    } catch (err) {
      console.error(err);
      statusEl.textContent =
        "Could not send right now—please try again later.";
    }
  });
}
