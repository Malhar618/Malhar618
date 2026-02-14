    highlights: [
      "Applied CAE workflows to thermal and structural heavy-equipment components.",
      "Improved simulation consistency through documented modeling standards.",
    ],
    highlights: [
      "Bridges control design to deployable embedded code.",
      "Builds verification pipelines with SITL/HIL for controller robustness.",
    ],
    highlights: [
      "Restored critical test hardware for flight-controls experimentation.",
      "Implemented controller tuning workflows for faster iterative testing.",
    ],
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

/*
 * Data for the professional experience section.
 * Each entry represents a major role at a company and includes
 * an id used for in‑page anchors, a short summary and a link to a
 * dedicated detail page. An optional image can be provided to display
 * a company logo at the top of the card.
 */
const EXPERIENCE = [
  {
    id: "exp-simulations-intern",
    title: "Simulations Intern, Caterpillar",
    date: "May 2025 – Aug 2025",
    description:
      "Performed finite‑element analyses on radiator cores and battery cooling components using NX and NASTRAN; conducted lifting studies on generator modules and documented best practices to improve model fidelity.",
    link: "experience/caterpillar_internship.html",
    image: "images/cat_logo.png",
  },
  {
    id: "exp-embedded-coop",
    title: "Embedded Controls Co‑Op, Caterpillar",
    date: "Aug 2025 – Present",
    description:
      "Develops model‑based controllers in Simulink for traction, braking and position estimation; generates production C code integrated into engine control firmware; sets up SITL/HIL test rigs and collaborates with cross‑functional teams.",
    link: "experience/caterpillar_coop.html",
    image: "images/cat_logo.png",
  },
];

/*
 * Data for the research and extracurricular section.
 * This section encompasses fellowships, personal projects and leadership
 * activities. Each object includes an id for anchors, a title, a date
 * range, a concise description and an optional link to a detail page.
 */
const RESEARCH = [
  {
    id: "research-navair",
    // Keep the title concise to avoid truncation on narrow cards
    title: "NAVAIR Thrust Stand",
    date: "Fall 2024 – Spring 2025",
    description:
      "Renovated and recalibrated a three‑degree‑of‑freedom thrust stand for UAV control‑system tuning; integrated ROS2 and Dynamixel servos; developed C++ nodes and genetic‑algorithm‑based PID tuning.",
    link: "experience/navair.html",
  },
  {
    id: "research-autonomous-uav",
    title: "Autonomous UAV Project",
    date: "May 2024 – Aug 2024",
    description:
      "Designed and built an autonomous quadrotor from scratch, integrating sensors, writing flight‑control software and implementing waypoint navigation using a finite state machine.",
    link: "projects/autonomous_uav.html",
  },
  {
    id: "research-goaero",
    title: "GoAERO Team Lead &amp; Preliminary Design Review",
    date: "Aug 2024 – Sep 2025",
    description:
      "Led avionics and programming for a heavy‑lift UAV competing in the GoAERO Prize; oversaw ROS2‑based communication architecture and prepared the preliminary design review detailing avionics and flight‑control systems.",
    link: "research/goaero.html",
  },
  {
    id: "research-gtms",
    title: "GTMS Internship",
    date: "2025",
    description:
      "Researched cooling systems and traction‑control algorithms for heavy machinery; carried out finite‑element analyses and developed model‑based control prototypes.",
    link: "research/gtms.html",
  },
  {
    id: "research-stlf",
    title: "STLF Traction Control Components",
    date: "2025",
    description:
      "Collaborated with the STLF program to design common software modules for traction control; refined control algorithms and interface definitions across multiple platforms.",
    link: "research/stlf.html",
  },
  {
    id: "research-airtalent",
    title: "AirTalent Symposium Poster",
    date: "2025",
    description:
      "Created a poster showcasing advanced flight‑control research and guidance, navigation &amp; control methodology for the AirTalent Symposium.",
    link: "research/airtalent.html",
  },
  {
    id: "research-undergrad",
    title: "Undergraduate Research Presentation",
    date: "2025",
    description:
      "Presented undergraduate research on guidance, navigation &amp; control, highlighting thrust‑stand development and genetic‑algorithm‑based controller tuning.",
    link: "research/undergrad.html",
  },
];

/*
 * Mapping of individual skills to the id of the experience or research
 * card where that skill is most prominently demonstrated. When a user
 * clicks on a skill chip they will be navigated to the corresponding
 * card on the home page.
 */
const SKILL_LINKS = {
  "C++": "research-navair",
  "MATLAB/Simulink": "exp-embedded-coop",
  Python: "research-autonomous-uav",
  ROS2: "research-goaero",
  "Embedded C": "exp-embedded-coop",
  "Finite Element Analysis": "exp-simulations-intern",
  "Control Theory": "research-navair",
  "SolidWorks & CAD": "exp-simulations-intern",
  "Linux/Jetson": "research-autonomous-uav",
  "Genetic Algorithms": "research-navair",
  "Team Leadership": "research-goaero",
};

// Data for the skills section. Each entry lists a skill or tool.
const SKILLS = [
  "C++",
  "MATLAB/Simulink",
  "Python",
  "ROS2",
  "Embedded C",
  "Finite Element Analysis",
  "Control Theory",
  "SolidWorks & CAD",
  "Linux/Jetson",
  "Genetic Algorithms",
  "Team Leadership",
];

// The RESEARCH array has been redefined above.

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
  populateExperience();
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
function renderHighlights(highlights) {
  if (!Array.isArray(highlights) || highlights.length === 0) return "";
  const list = highlights.map((item) => `<li>${item}</li>`).join("");
  return `<ul class="card-highlights">${list}</ul>`;
}

      ${renderHighlights(item.highlights)}
      ${renderHighlights(item.highlights)}
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
// Render the Experience cards into the DOM
function populateExperience() {
  const container = document.getElementById("experience-grid");
  if (!container || !Array.isArray(EXPERIENCE)) return;
  container.innerHTML = "";
  EXPERIENCE.forEach((item) => {
    const card = document.createElement("div");
    card.className = "card";
    card.id = item.id;
    const logoPart = item.image
      ? `<img src="${item.image}" alt="Company logo" class="experience-logo" />`
      : "";
    card.innerHTML = `
      ${logoPart}
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
    const target = SKILL_LINKS[skill] || null;
    // use an anchor for skill chips so default anchor behaviour scrolls to the target id
    const el = document.createElement("a");
    el.className = "chip";
    el.textContent = skill;
    if (target) {
      // set href to link to the section id; include index.html prefix if needed
      el.href = `#${target}`;
    }
    container.appendChild(el);
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
    // assign an id so that skill chips can link to this card
    card.id = item.id;
    card.innerHTML = `
      <h3>${item.title}</h3>
      <p class="small">${item.date}</p>
      <p>${item.description}</p>
      ${item.link ? `<a class="button" href="${item.link}">Learn more</a>` : ""}
    `;
    container.appendChild(card);
  });
}
