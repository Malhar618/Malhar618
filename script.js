const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const sectionLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
const sections = [...document.querySelectorAll("main section[id]")];

function setActiveLink(hash) {
  sectionLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === hash);
  });
}

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navMenu.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      const href = event.target.getAttribute("href") || "";
      if (href.startsWith("#")) setActiveLink(href);
      navMenu.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

if (sections.length && sectionLinks.length) {
  const updateActiveFromScroll = () => {
    const headerOffset = 96;
    const current = sections.reduce((best, section) => {
      const top = section.getBoundingClientRect().top - headerOffset;
      if (top <= 0 && (!best || top > best.top)) return { id: section.id, top };
      return best;
    }, null);

    if (current) setActiveLink(`#${current.id}`);
  };

  window.addEventListener("scroll", updateActiveFromScroll, { passive: true });
  window.addEventListener("hashchange", () => {
    if (window.location.hash) setActiveLink(window.location.hash);
  });
  if (window.location.hash) setActiveLink(window.location.hash);
  updateActiveFromScroll();
}

const contactForm = document.querySelector("#contact-form");
const statusEl = document.querySelector("#status");
const directEmail = "malhar05@vt.edu";

function showEmailFallback(payload) {
  const mailto = new URL(`mailto:${directEmail}`);
  mailto.searchParams.set("subject", payload.subject || "Portfolio contact");
  mailto.searchParams.set("body", `Name: ${payload.name}\nEmail: ${payload.email}\n\n${payload.message}`);
  statusEl.innerHTML = `Email service is not configured on this server. <a href="${mailto.toString()}">Open an email draft instead.</a>`;
  statusEl.classList.add("error");
}

if (contactForm && statusEl) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    statusEl.textContent = "Sending...";
    statusEl.className = "form-status";

    const formData = new FormData(contactForm);
    const payload = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      subject: String(formData.get("subject") || "").trim(),
      message: String(formData.get("message") || "").trim(),
      company: String(formData.get("company") || "").trim(),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        if (response.status === 503) {
          showEmailFallback(payload);
          return;
        }
        throw new Error(data.message || "Message failed");
      }

      contactForm.reset();
      statusEl.textContent = "Message sent. I will follow up by email.";
      statusEl.classList.add("success");
    } catch (error) {
      console.error(error);
      statusEl.textContent = "The form could not send right now. Email me directly at malhar05@vt.edu.";
      statusEl.classList.add("error");
    }
  });
}
