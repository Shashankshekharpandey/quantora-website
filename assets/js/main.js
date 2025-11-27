// Quantora Analytics – Minimal interaction layer
// - Mobile navigation toggle
// - Scroll-based reveal animations
// - Contact form success message (front-end only)

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const navToggle = document.querySelector(".nav-toggle");
  const siteNav = document.querySelector(".site-nav");

  // Mobile navigation toggle
  if (navToggle && siteNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = body.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Close nav if user clicks a link
    siteNav.addEventListener("click", (event) => {
      const target = event.target;
      if (target instanceof HTMLElement && target.tagName === "A" && body.classList.contains("nav-open")) {
        body.classList.remove("nav-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Scroll reveal animations
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
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
      }
    );

    animated.forEach((el) => observer.observe(el));
  } else {
    animated.forEach((el) => el.classList.add("is-visible"));
  }

  // AJAX Form Submission Handler
  const handleFormSubmission = async (event) => {
    event.preventDefault();
    const form = event.target;
    const btn = form.querySelector('button[type="submit"]');
    const statusEl = form.querySelector('.form-status') || document.createElement('p');

    if (!form.querySelector('.form-status')) {
      statusEl.className = 'form-status';
      form.appendChild(statusEl);
    }

    // Basic validation
    if (!form.checkValidity()) {
      statusEl.textContent = "Please complete all required fields.";
      statusEl.className = "form-status error";
      return;
    }

    const originalBtnText = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;

    try {
      const data = new FormData(form);
      const response = await fetch(form.action, {
        method: form.method,
        body: data,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        statusEl.textContent = "Thanks! Your message has been sent.";
        statusEl.className = "form-status success";
        form.reset();
      } else {
        const result = await response.json();
        if (Object.hasOwn(result, 'errors')) {
          statusEl.textContent = result["errors"].map(error => error["message"]).join(", ");
        } else {
          statusEl.textContent = "Oops! There was a problem submitting your form.";
        }
        statusEl.className = "form-status error";
      }
    } catch (error) {
      statusEl.textContent = "Oops! There was a problem submitting your form.";
      statusEl.className = "form-status error";
    } finally {
      btn.textContent = originalBtnText;
      btn.disabled = false;
    }
  };

  // Attach handler to forms
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", handleFormSubmission);
  }

  const internshipForm = document.getElementById("internshipForm");
  if (internshipForm) {
    internshipForm.addEventListener("submit", handleFormSubmission);
  }

  // Footer year helper
  const yearSpans = document.querySelectorAll("#footer-year");
  const year = new Date().getFullYear();
  yearSpans.forEach((span) => {
    span.textContent = String(year);
  });

  // Count-up animation for metrics
  const metrics = document.querySelectorAll(".metric-value[data-target]");

  if ("IntersectionObserver" in window && metrics.length > 0) {
    const countUpObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.getAttribute("data-target"));
          const suffix = el.getAttribute("data-suffix") || "";
          const prefix = el.getAttribute("data-prefix") || "";
          const duration = 2000; // 2 seconds
          const frameDuration = 1000 / 60;
          const totalFrames = Math.round(duration / frameDuration);
          let frame = 0;

          const easeOutQuad = t => t * (2 - t);

          const counter = setInterval(() => {
            frame++;
            const progress = easeOutQuad(frame / totalFrames);
            const currentCount = Math.round(target * progress * 10) / 10; // 1 decimal place if needed

            // Format: if integer, show integer. If float, show 1 decimal.
            const formatted = Number.isInteger(currentCount) ? currentCount : currentCount.toFixed(1);

            el.textContent = `${prefix}${formatted}${suffix}`;

            if (frame === totalFrames) {
              clearInterval(counter);
              el.textContent = `${prefix}${target}${suffix}`; // Ensure exact final value
            }
          }, frameDuration);

          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    metrics.forEach(el => countUpObserver.observe(el));
  }
});


