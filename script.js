/*  script.js – Malhar Mahajan portfolio */

const EMAIL_API = "https://malhar-portfolio-server.onrender.com/send-email";
const SECTIONS = document.querySelectorAll("section[id]");

const EXPERIENCE = [
  {
    id: "exp-simulations-intern",
    title: "Simulations Intern, Caterpillar (GTMS)",
    date: "May 2025 – Aug 2025",
    description:
      "Supported GTMS design decisions with thermal and CFD analyses on cooling components using NX and NASTRAN; helped accelerate NX Nastran adoption and documented best practices to improve model fidelity.",
    link: "experience/caterpillar_internship.html",
    image: "images/cat_logo.png",
    tags: ["NX", "NASTRAN", "CFD"],
  },
  {
    id: "exp-embedded-coop",
    title: "Embedded Controls Co-Op, Caterpillar (Technology Division)",
    date: "Aug 2025 – Present",
    description:
      "Architected situational speed target generators and wheel-level control logic for traction control in Simulink; developed multi-rate integration for vehicle sensing (IMU + wheel speed sensors) targeting ECM/ECU deployment with embedded C code generation; validated and tuned using Dynasty plant testing.",
    link: "experience/caterpillar_coop.html",
    image: "images/cat_logo.png",
    tags: ["Simulink", "Embedded C", "SITL/HITL"],
  },
];

const RESEARCH = [
  {
    id: "research-navair",
    title: "NAVAIR Thrust Stand",
    date: "Aug 2024 – Aug 2025",
    description:
      "Built a three-DOF thrust-stand testbed with a GA workflow in MATLAB for controller tuning; integrated Pixhawk 6C + Odroid M1S running ROS 2 Galactic; developed C++ Dynamixel moment-cancellation nodes and IMU signal processing with high-pass filtering.",
    link: "experience/navair.html",
    tags: ["ROS 2", "C++", "MATLAB", "GA"],
  },
  {
    id: "research-autonomous-uav",
    title: "Autonomous UAV Project",
    date: "May 2024 – Aug 2024",
    description:
      "Built an autonomous quadrotor with Jetson Nano + Intel RealSense D455 for real-time depth-based mapping and obstacle avoidance in Python/OpenCV; implemented MAVSDK flight control and validated in JMavSim and SITL/HITL environments.",
    link: "projects/autonomous_uav.html",
    tags: ["Python", "OpenCV", "MAVSDK", "Jetson"],
  },
  {
    id: "research-goaero",
    title: "GoAERO Team Lead & Preliminary Design Review",
    date: "Aug 2024 – Sep 2025",
    description:
      "Led avionics and programming for a heavy-lift UAV competing in the GoAERO Prize; built ROS 2 messaging, interfaces and integration between flight stack, sensors and compute; developed SITL/HITL + telemetry pipeline for flight-test readiness; won NASA University Innovation Prize ($30K).",
    link: "research/goaero.html",
    tags: ["ROS 2", "SITL/HITL", "NASA"],
  },
  {
    id: "research-gtms",
    title: "GTMS Internship",
    date: "May 2025 – Aug 2025",
    description:
      "Supported GTMS design decisions with thermal and CFD analyses on cooling components; helped accelerate NX Nastran adoption within the simulation group and documented best practices to improve model fidelity.",
    link: "research/gtms.html",
    tags: ["NX", "NASTRAN", "Thermal/CFD"],
  },
  {
    id: "research-stlf",
    title: "STLF Traction Control Components",
    date: "Aug 2025 – Present",
    description:
      "Architected situational speed target generators and wheel-level control logic for traction control; developed multi-rate integration for vehicle sensing (IMU + wheel speed sensors) targeting ECM/ECU deployment; validated and tuned using Dynasty plant testing.",
    link: "research/stlf.html",
    tags: ["Simulink", "Embedded C", "Dynasty"],
  },
  {
    id: "research-airtalent",
    title: "AirTalent Symposium Poster",
    date: "2025",
    description:
      "Created a poster showcasing advanced flight-control research and guidance, navigation and control methodology for the AirTalent Symposium.",
    link: "research/airtalent.html",
    tags: ["GNC", "Poster"],
  },
];

const UWB_COLLAB = [
  {
    id: "uwb-ava-validation",
    title: "UWB Inter-Vehicle Cross-Link",
    date: "Jan 2026 – Present",
    description:
      "Developing UWB-based inter-vehicle cross-link for collaborative navigation using Qorvo/Decawave modules under Dr. Joerger in the AVA Lab (NAViTi).",
    tags: ["UWB", "MATLAB"],
  },
  {
    id: "uwb-ava-integration",
    title: "MATLAB Tooling & Anomaly Quantification",
    date: "Jan 2026 – Present",
    description:
      "Built MATLAB tooling to parse UWB outputs, quantify anomalies under different environmental conditions and validate ranging accuracy for cooperative localization.",
    tags: ["MATLAB", "Data Analysis"],
  },
  {
    id: "uwb-ava-deliverables",
    title: "Sensor Fusion & Cooperative Localization",
    date: "Next Phase",
    description:
      "Fusing UWB ranging with inertial models using EKF and particle filters for cooperative localization and SLAM across multiple vehicles.",
    tags: ["EKF", "SLAM"],
  },
];

const SKILLS = {
  languages: {
    label: "Languages",
    items: ["C/C++", "Python", "MATLAB"],
  },
  focus: {
    label: "Focus Areas",
    items: [
      "Simulink & Code Generation",
      "Estimation & Filtering",
      "Controller Tuning & Validation",
    ],
  },
  tools: {
    label: "Tools & Frameworks",
    items: [
      "ROS 2",
      "Embedded C",
      "MAVSDK",
      "ArduPilot/PX4",
      "SITL/HITL",
      "Git/GitHub",
      "Linux",
      "Siemens NX",
      "SolidWorks & CAD",
    ],
  },
};

const SKILL_LINKS = {
  "C/C++": "research-navair",
  Python: "research-autonomous-uav",
  MATLAB: "research-navair",
  "Simulink & Code Generation": "exp-embedded-coop",
  "ROS 2": "research-goaero",
  "Embedded C": "exp-embedded-coop",
  "Estimation & Filtering": "uwb-ava-validation",
  "Controller Tuning & Validation": "exp-embedded-coop",
  MAVSDK: "research-autonomous-uav",
  "ArduPilot/PX4": "research-goaero",
  "SITL/HITL": "research-goaero",
  "Git/GitHub": "research-navair",
  Linux: "research-autonomous-uav",
  "Siemens NX": "exp-simulations-intern",
  "SolidWorks & CAD": "exp-simulations-intern",
};

window.addEventListener("DOMContentLoaded", () => {
  initAnimations();
  initNavHighlight();
  initContactForm();
  initHamburger();
  populateExperience();
  populateSkills();
  populateResearch();
  populateUwb();
  initScrollAnimations();
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

function initScrollAnimations() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined")
    return;

  gsap.registerPlugin(ScrollTrigger);

  /* Fade-up for about section */
  gsap.from(".about-grid", {
    scrollTrigger: { trigger: ".about-grid", start: "top 85%" },
    y: 40,
    opacity: 0,
    duration: 0.8,
    ease: "power3.out",
  });

  /* Stagger cards in each grid */
  document.querySelectorAll(".card-grid, .metric-cards").forEach((grid) => {
    gsap.from(grid.children, {
      scrollTrigger: { trigger: grid, start: "top 85%" },
      y: 40,
      opacity: 0,
      stagger: 0.1,
      duration: 0.7,
      ease: "power3.out",
    });
  });

  /* Skills categories */
  gsap.from(".skills-category", {
    scrollTrigger: {
      trigger: "#skills-section",
      start: "top 85%",
    },
    y: 30,
    opacity: 0,
    stagger: 0.15,
    duration: 0.7,
    ease: "power3.out",
  });
}

function initHamburger() {
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.querySelector(".nav-menu");
  if (!(toggle && menu)) return;

  toggle.addEventListener("click", () => {
    menu.classList.toggle("open");
    toggle.classList.toggle("open");
  });

  /* Close menu when a link is clicked */
  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("open");
      toggle.classList.remove("open");
    });
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
    statusEl.textContent = "Sending\u2026";

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
        "Could not send right now\u2014please try again later.";
    }
  });
}

function renderTags(tags) {
  if (!tags || tags.length === 0) return "";
  return `<div class="card-tags">${tags.map((t) => `<span class="card-tag">${t}</span>`).join("")}</div>`;
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
      ${renderTags(item.tags)}
      ${item.link ? `<a class="button" href="${item.link}">Learn more</a>` : ""}
    `;
    container.appendChild(card);
  });
}

function populateSkills() {
  const container = document.getElementById("skills-list");
  if (!container) return;
  container.innerHTML = "";

  Object.values(SKILLS).forEach((category) => {
    const group = document.createElement("div");
    group.className = "skills-category";

    const heading = document.createElement("h4");
    heading.className = "skills-category-label";
    heading.textContent = category.label;
    group.appendChild(heading);

    const chipWrap = document.createElement("div");
    chipWrap.className = "skills-chips";
    category.items.forEach((skill) => {
      const target = SKILL_LINKS[skill];
      const el = document.createElement("a");
      el.className = "chip";
      el.textContent = skill;
      el.href = target ? `#${target}` : "#skills-section";
      chipWrap.appendChild(el);
    });
    group.appendChild(chipWrap);

    container.appendChild(group);
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
      ${renderTags(item.tags)}
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
      ${renderTags(item.tags)}
    `;
    container.appendChild(card);
  });
}
