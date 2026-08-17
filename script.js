const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const sectionLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
const sections = [...document.querySelectorAll("main section[id]")];

function setActiveLink(hash) {
  sectionLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === hash;
    link.classList.toggle("active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "true");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function closeMenu() {
  navMenu.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
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
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navMenu.classList.contains("is-open")) {
      closeMenu();
      navToggle.focus();
    }
  });

  document.addEventListener("click", (event) => {
    if (
      navMenu.classList.contains("is-open") &&
      event.target instanceof Node &&
      !navMenu.contains(event.target) &&
      !navToggle.contains(event.target)
    ) {
      closeMenu();
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

const siteHeader = document.querySelector(".site-header");

if (siteHeader) {
  const updateHeaderShadow = () => {
    siteHeader.classList.toggle("is-scrolled", window.scrollY > 12);
  };
  window.addEventListener("scroll", updateHeaderShadow, { passive: true });
  updateHeaderShadow();
}

const contactForm = document.querySelector("#contact-form");
const statusEl = document.querySelector("#status");
const directEmail = "malhar05@vt.edu";

function showEmailFallback(payload) {
  const mailto = new URL(`mailto:${directEmail}`);
  mailto.searchParams.set("subject", payload.subject || "Portfolio contact");
  mailto.searchParams.set("body", `Name: ${payload.name}\nEmail: ${payload.email}\n\n${payload.message}`);
  statusEl.innerHTML = `This site can't send mail directly. <a href="${mailto.toString()}">Open a pre-filled email draft instead</a> &mdash; your message is carried over.`;
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
      if (response.status === 400 && data.message) {
        statusEl.textContent = data.message;
        statusEl.classList.add("error");
        return;
      }
      if (!response.ok) {
        showEmailFallback(payload);
        return;
      }

      contactForm.reset();
      statusEl.textContent = "Message sent. I will follow up by email.";
      statusEl.classList.add("success");
    } catch (error) {
      console.error(error);
      showEmailFallback(payload);
    }
  });
}
