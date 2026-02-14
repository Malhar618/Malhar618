/*  script.js – Malhar Mahajan portfolio */

const EMAIL_API = "https://malhar-portfolio-server.onrender.com/send-email";
const SECTIONS = document.querySelectorAll("section[id]");

const EXPERIENCE = [
  {
    id: "exp-simulations-intern",
    title: "Simulations Intern, Caterpillar",
    date: "May 2025 – Aug 2025",
    description:
      "Performed finite-element analyses on radiator cores and battery cooling components using NX and NASTRAN; conducted lifting studies on generator modules and documented best practices to improve model fidelity.",
    link: "experience/caterpillar_internship.html",
    image: "images/cat_logo.png",
  },
  {
    id: "exp-embedded-coop",
    title: "Embedded Controls Co-Op, Caterpillar",
    date: "Aug 2025 – Present",
    description:
      "Develops model-based controllers in Simulink for traction, braking and position estimation; generates production C code integrated into engine control firmware; sets up SITL/HIL test rigs and collaborates with cross-functional teams.",
    link: "experience/caterpillar_coop.html",
    image: "images/cat_logo.png",
  },
];

const RESEARCH = [
  {
    id: "research-navair",
    title: "NAVAIR Thrust Stand",
    date: "Fall 2024 – Spring 2025",
    description:
      "Renovated and recalibrated a three-degree-of-freedom thrust stand for UAV control-system tuning; integrated ROS2 and Dynamixel servos; developed C++ nodes and genetic-algorithm PID tuning.",
    link: "experience/navair.html",
  },
  {
    id: "research-autonomous-uav",
    title: "Autonomous UAV Project",
    date: "May 2024 – Aug 2024",
    description:
      "Designed and built an autonomous quadrotor from scratch, integrating sensors, writing flight-control software and implementing waypoint navigation using a finite-state machine.",
    link: "projects/autonomous_uav.html",
  },
  {
    id: "research-goaero",
    title: "GoAERO Team Lead & Preliminary Design Review",
    date: "Aug 2024 – Sep 2025",
    description:
      "Led avionics and programming for a heavy-lift UAV competing in the GoAERO Prize; oversaw ROS2 communication architecture and delivered the preliminary design review for avionics and flight-control systems.",
    link: "research/goaero.html",
  },
  {
    id: "research-gtms",
    title: "GTMS Internship",
    date: "2025",
    description:
      "Researched cooling systems and traction-control algorithms for heavy machinery; carried out finite-element analyses and developed model-based control prototypes.",
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
      "Created a poster showcasing advanced flight-control research and guidance, navigation and control methodology for the AirTalent Symposium.",
    link: "research/airtalent.html",
  },
  {
    id: "research-undergrad",
    title: "Undergraduate Research Presentation",
    date: "2025",
    description:
      "Presented undergraduate research on guidance, navigation and control, highlighting thrust-stand development and genetic-algorithm controller tuning.",
    link: "research/undergrad.html",
  },
];

const UWB_COLLAB = [
  {
    id: "uwb-ava-validation",
    title: "AVA Lab Experimental Validation",
    date: "UWB Cross-Collaboration",
    description:
      "Supported AVA Lab validation activities under Dr. Joerger by translating control concepts into test-ready workflows and documenting repeatable procedures for reliable data capture.",
  },
  {
    id: "uwb-ava-integration",
    title: "Autonomy + Controls Integration",
    date: "Systems Collaboration",
    description:
      "Contributed to cross-team integration where embedded implementation constraints, estimator behavior, and mission-level autonomy logic had to align for robust operation.",
  },
  {
    id: "uwb-ava-deliverables",
    title: "Technical Communication & Deliverables",
    date: "Research Communication",
    description:
      "Prepared concise technical updates and cross-functional handoff material to help researchers and student teams move faster from concept to usable results.",
  },
];

const SKILL_LINKS = {
  "C++": "research-navair",
  "MATLAB/Simulink": "exp-embedded-coop",
  Python: "research-autonomous-uav",
  ROS2: "research-goaero",
  "Embedded C": "exp-embedded-coop",
  "Finite Element Analysis": "exp-simulations-intern",
  "Control Theory": "uwb-ava-validation",
  "SolidWorks & CAD": "exp-simulations-intern",
  "Linux/Jetson": "research-autonomous-uav",
  "Genetic Algorithms": "research-navair",
  "Team Leadership": "research-goaero",
};

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

window.addEventListener("DOMContentLoaded", () => {
  initAnimations();
  initNavHighlight();
  initContactForm();
  populateExperience();
  populateSkills();
  populateResearch();
  populateUwb();
});

function initAnimations() {
  if (typeof gsap === "undefined") return;

  gsap.from(".hero-stagger", {
    y: 30,
    opacity: 0,
    stagger: 0.15,
    delay: 0.2,
    duration: 0.9,
    ease: "power3.out",
  });
}

function initNavHighlight() {
  const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
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
    { threshold: 0.45 }
  );

  SECTIONS.forEach((section) => observer.observe(section));
}

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
      statusEl.textContent = "Could not send right now—please try again later.";
    }
  });
}

function populateExperience() {
  const container = document.getElementById("experience-grid");
  if (!container) return;
  container.innerHTML = "";
  EXPERIENCE.forEach((item) => {
    const card = document.createElement("div");
    card.className = "card";
    card.id = item.id;
    card.innerHTML = `
      ${item.image ? `<img src="${item.image}" alt="Company logo" class="experience-logo" />` : ""}
      <h3>${item.title}</h3>
      <p class="small">${item.date}</p>
      <p>${item.description}</p>
      ${item.link ? `<a class="button" href="${item.link}">Learn more</a>` : ""}
    `;
    container.appendChild(card);
  });
}

function populateSkills() {
  const container = document.getElementById("skills-list");
  if (!container) return;
  container.innerHTML = "";
  SKILLS.forEach((skill) => {
    const target = SKILL_LINKS[skill];
    const el = document.createElement("a");
    el.className = "chip";
    el.textContent = skill;
    el.href = target ? `#${target}` : "#skills-section";
    container.appendChild(el);
  });
}

function populateResearch() {
  const container = document.getElementById("research-grid");
  if (!container) return;
  container.innerHTML = "";
  RESEARCH.forEach((item) => {
    const card = document.createElement("div");
    card.className = "card";
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

function populateUwb() {
  const container = document.getElementById("uwb-grid");
  if (!container) return;
  container.innerHTML = "";
  UWB_COLLAB.forEach((item) => {
    const card = document.createElement("div");
    card.className = "card";
    card.id = item.id;
    card.innerHTML = `
      <h3>${item.title}</h3>
      <p class="small">${item.date}</p>
      <p>${item.description}</p>
    `;
    container.appendChild(card);
  });
}
