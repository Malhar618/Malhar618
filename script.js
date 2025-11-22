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

// API endpoint for the contact form
const EMAIL_API =
  "https://malhar-portfolio-server.onrender.com/send-email";

// Capture all sections with an id for navigation highlighting
const SECTIONS   = document.querySelectorAll("section[id]");

// Data for the highlights section. Each entry summarises a recent milestone.
const HIGHLIGHTS = [
  {
    title: "Embedded Controls Co‑Op, Caterpillar",
    date: "Aug 2025 – Present",
    description:
      "Testing traction control system models in MATLAB/Simulink and generating production‑ready C code integrated into ECU firmware.",
    link: "experience/caterpillar.html",
  },
  {
    title: "NAVAIR Fellowship – 3‑DOF Thrust Stand",
    date: "Fall 2024 – Spring 2025",
    description:
      "Designed and built a 3‑DOF thrust stand testbed for UAV control tuning. Integrated ROS2, Dynamixel servo control and genetic algorithms.",
    link: "experience/navair.html",
  },
  {
    title: "Team Lead, Avionics &amp; Programming – GoAERO @VTech",
    date: "Aug 2024 – Sep 2025",
    description:
      "Led avionics integration for a heavy‑lift UAV, oversaw ROS2‑based flight communication architecture and helped win the NASA University Innovation prize.",
    link: "#projects",
  },
  {
    title: "Autonomous UAV Project",
    date: "May 2024 – Aug 2024",
    description:
      "Engineered an autonomous quadrotor using a Jetson Nano and Intel RealSense D455 for real‑time mapping, MAVSDK control and gesture recognition.",
    link: "projects/autonomous_uav.html",
  },
];

// Data for the skills section. Each entry lists a skill or tool.
const SKILLS = [
  "C++",
  "MATLAB/Simulink",
  "Python",
  "ROS2",
  "Embedded C",
  "Finite Element Analysis",
  "Control Theory",
  "SolidWorks &amp; CAD",
  "Linux/Jetson",
  "Genetic Algorithms",
  "Team Leadership",
];

// Data for the research and deliverables section. Each entry summarises a report, poster or set of deliverables.
const RESEARCH = [
  {
    title: "GTMS Internship",
    date: "2025",
    description:
      "Conducted research and development on cooling systems and traction control algorithms for heavy machinery; contributed to finite element analyses and model‑based software.",
    link: "",
  },
  {
    title: "STLF Traction Control Components",
    date: "2025",
    description:
      "Collaborated on common traction control software components within the STLF program; refined traction algorithms and interface definitions for heavy equipment.",
    link: "",
  },
  {
    title: "GoAERO Preliminary Design Review",
    date: "2024",
    description:
      "Prepared a preliminary design review for a heavy‑lift UAV, capturing avionics and flight‑control architecture for the GoAERO competition.",
    link: "",
  },
  {
    title: "AirTalent Symposium Poster",
    date: "2025",
    description:
      "Created a poster showcasing advanced flight‑control research and guidance, navigation &amp; control methodology at the AirTalent Symposium.",
    link: "",
  },
  {
    title: "Undergraduate Research Presentation",
    date: "2025",
    description:
      "Presented undergraduate research on guidance, navigation &amp; control, focusing on thrust‑stand testbed development and genetic algorithm tuning.",
    link: "",
  },
  {
    title: "NAVAIR Thrust Stand Deliverables",
    date: "2025",
    description:
      "Compiled deliverables for the NAVAIR thrust stand project, including test documentation, calibration procedures and results.",
    link: "",
  },
];

/* ============================== */
/* ⮞  MAIN                        */
/* ============================== */
window.addEventListener("DOMContentLoaded", () => {
  // Initialise animations and interactive behaviours once the DOM is ready
  initAnimations();
  initNavHighlight();
  initMobileNav();
  initBackToTop();
  initContactForm();
  // Populate dynamic sections
  populateHighlights();
  populateSkills();
  populateResearch();
});

/* ============================== */
/* ⮞  GSAP / SCROLL ANIMATION     */
/* ============================== */
function initAnimations() {
  if (typeof gsap === "undefined") return; // fail‑safe – GSAP CDN not loaded

  // Removed unused rocket animation. The hero is static apart from staggered text.

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

/* ============================== */
/* ⮞  DYNAMIC SECTION BUILDERS     */
/* ============================== */

// Render the Recent Highlights cards into the DOM
function populateHighlights() {
  const container = document.getElementById("highlights-grid");
  if (!container || !Array.isArray(HIGHLIGHTS)) return;
  // Clear any existing content to allow safe re-run
  container.innerHTML = "";
  HIGHLIGHTS.forEach((item) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${item.title}</h3>
      <p class="small">${item.date}</p>
      <p>${item.description}</p>
      ${item.link ? `<a class="button" href="${item.link}">Learn more</a>` : ""}
    `;
    container.appendChild(card);
  });
}

// Render the Skills chips into the DOM
function populateSkills() {
  const container = document.getElementById("skills-list");
  if (!container || !Array.isArray(SKILLS)) return;
  container.innerHTML = "";
  SKILLS.forEach((skill) => {
    const chip = document.createElement("span");
    chip.className = "chip";
    chip.textContent = skill;
    container.appendChild(chip);
  });
}

// Render the Research & Deliverables cards into the DOM
function populateResearch() {
  const container = document.getElementById("research-grid");
  if (!container || !Array.isArray(RESEARCH)) return;
  container.innerHTML = "";
  RESEARCH.forEach((item) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${item.title}</h3>
      <p class="small">${item.date}</p>
      <p>${item.description}</p>
      ${item.link ? `<a class="button" href="${item.link}">Learn more</a>` : ""}
    `;
    container.appendChild(card);
  });
}
