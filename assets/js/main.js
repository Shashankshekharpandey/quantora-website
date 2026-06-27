// Quantora Analytics – Interaction Layer
// Mobile nav · Scroll reveal · Forms · FAQ accordion · Count-up · Sticky header

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const navToggle = document.querySelector(".nav-toggle");
  const siteNav = document.querySelector(".site-nav");

  // ─── Mobile navigation toggle ───────────────────────────────────────────────
  if (navToggle && siteNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = body.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    siteNav.addEventListener("click", (event) => {
      const target = event.target;
      if (target instanceof HTMLElement && target.tagName === "A" && body.classList.contains("nav-open")) {
        body.classList.remove("nav-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });

    // Close nav on outside click
    document.addEventListener("click", (e) => {
      if (body.classList.contains("nav-open") && !navToggle.contains(e.target) && !siteNav.contains(e.target)) {
        body.classList.remove("nav-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // ─── Sticky header shadow on scroll ─────────────────────────────────────────
  const siteHeader = document.querySelector(".site-header");
  if (siteHeader) {
    const onScroll = () => {
      if (window.scrollY > 10) {
        siteHeader.classList.add("scrolled");
      } else {
        siteHeader.classList.remove("scrolled");
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // ─── Scroll reveal animations ────────────────────────────────────────────────
  const animated = document.querySelectorAll("[data-animate]");
  if ("IntersectionObserver" in window && animated.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    animated.forEach((el) => observer.observe(el));
  } else {
    animated.forEach((el) => el.classList.add("is-visible"));
  }

  // ─── FAQ Accordion ───────────────────────────────────────────────────────────
  const faqItems = document.querySelectorAll(".faq-question");
  faqItems.forEach((btn) => {
    btn.addEventListener("click", () => {
      const expanded = btn.getAttribute("aria-expanded") === "true";
      const answerId = btn.getAttribute("aria-controls");
      const answer = document.getElementById(answerId);
      const icon = btn.querySelector(".faq-icon");

      // Collapse all others
      faqItems.forEach((other) => {
        if (other !== btn) {
          other.setAttribute("aria-expanded", "false");
          const otherId = other.getAttribute("aria-controls");
          const otherAnswer = document.getElementById(otherId);
          const otherIcon = other.querySelector(".faq-icon");
          if (otherAnswer) otherAnswer.hidden = true;
          if (otherIcon) otherIcon.textContent = "+";
          other.closest(".faq-item").classList.remove("faq-open");
        }
      });

      // Toggle current
      btn.setAttribute("aria-expanded", String(!expanded));
      if (answer) answer.hidden = expanded;
      if (icon) icon.textContent = expanded ? "+" : "−";
      btn.closest(".faq-item").classList.toggle("faq-open", !expanded);
    });
  });

  // ─── AJAX Form Submission ────────────────────────────────────────────────────
  const handleFormSubmission = async (event) => {
    event.preventDefault();
    const form = event.target;
    const btn = form.querySelector('button[type="submit"]');
    let statusEl = form.querySelector(".form-status");
    if (!statusEl) {
      statusEl = document.createElement("p");
      statusEl.className = "form-status";
      form.appendChild(statusEl);
    }

    if (!form.checkValidity()) {
      statusEl.textContent = "Please complete all required fields.";
      statusEl.className = "form-status error";
      return;
    }

    const originalBtnText = btn.textContent;
    btn.textContent = "Sending…";
    btn.disabled = true;

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        statusEl.textContent = "✓ Message sent! We'll reply within 24 hours.";
        statusEl.className = "form-status success";
        form.reset();
      } else {
        const result = await response.json().catch(() => ({}));
        statusEl.textContent = result.errors
          ? result.errors.map((e) => e.message).join(", ")
          : "Oops! There was a problem. Please email us directly.";
        statusEl.className = "form-status error";
      }
    } catch {
      statusEl.textContent = "Oops! There was a problem. Please email us directly.";
      statusEl.className = "form-status error";
    } finally {
      btn.textContent = originalBtnText;
      btn.disabled = false;
    }
  };

  ["contact-form", "internshipForm"].forEach((id) => {
    const form = document.getElementById(id);
    if (form) form.addEventListener("submit", handleFormSubmission);
  });

  // ─── Footer year ─────────────────────────────────────────────────────────────
  const year = new Date().getFullYear();
  document.querySelectorAll("#footer-year").forEach((el) => {
    el.textContent = String(year);
  });

  // ─── Count-up animations ─────────────────────────────────────────────────────
  const metrics = document.querySelectorAll(".metric-value[data-target]");
  if ("IntersectionObserver" in window && metrics.length) {
    const countObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = parseFloat(el.getAttribute("data-target"));
          const suffix = el.getAttribute("data-suffix") || "";
          const prefix = el.getAttribute("data-prefix") || "";
          const duration = 1800;
          const fps = 60;
          const totalFrames = Math.round((duration / 1000) * fps);
          let frame = 0;
          const ease = (t) => t * (2 - t);
          const timer = setInterval(() => {
            frame++;
            const val = Math.round(target * ease(frame / totalFrames) * 10) / 10;
            el.textContent = `${prefix}${Number.isInteger(val) ? val : val.toFixed(1)}${suffix}`;
            if (frame >= totalFrames) {
              clearInterval(timer);
              el.textContent = `${prefix}${target}${suffix}`;
            }
          }, 1000 / fps);
          obs.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );
    metrics.forEach((el) => countObserver.observe(el));
  }

  // ─── Internship program selector ─────────────────────────────────────────────
  window.selectProgram = function (programName) {
    const programField = document.getElementById("program");
    if (programField) programField.value = programName;
    const formSection = document.getElementById("apply-form");
    if (formSection) {
      formSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
});
