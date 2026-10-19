/* Home page: renders content from data.js and wires up interactions. */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    const { $, $$, esc, toast, copyText, waUrl, observeReveals, data: D } = window.Site;
    const icon = window.icon;
    const profile = D.profile;

    const STATUS_CLASS = { "Live": "status-live", "Demo Project": "status-demo", "Concept Project": "status-concept", "In Development": "status-dev" };
    const caseStudyUrl = (p) => "project.html?p=" + encodeURIComponent(p.slug);

    /* ---------- About ---------- */
    const hl = $("[data-about-highlights]");
    if (hl) {
      hl.innerHTML = (D.about.highlights || []).map((h, i) =>
        '<div class="highlight reveal" style="--d:' + i * 60 + 'ms"><h3>' + esc(h.title) + "</h3><p>" + esc(h.text) + "</p></div>"
      ).join("");
    }
    const photo = $("[data-profile-photo]");
    if (photo) {
      if (profile.photo) { photo.src = profile.photo; photo.alt = profile.photoAlt || profile.name; }
      photo.addEventListener("error", () => {
        // Replaceable fallback: initials avatar if the photo is missing.
        photo.outerHTML = '<div class="portrait-fallback" role="img" aria-label="' + esc(profile.name) + ' initials">' + esc(profile.initials) + "</div>";
      }, { once: true });
    }
    if (profile.location) {
      const loc = $("[data-location]");
      loc.hidden = false;
      $("[data-location-text]", loc).textContent = profile.location;
    }
    if (profile.cvUrl) {
      const cv = $("[data-cv-link]");
      cv.href = profile.cvUrl;
      cv.hidden = false;
      $("[data-cv-request]").hidden = true;
    }

    /* ---------- Skills ---------- */
    $("[data-skills]").innerHTML = D.skills.map((s, i) =>
      '<article class="skill-card reveal" style="--d:' + (i % 3) * 70 + 'ms">' +
        '<div class="skill-head"><span class="skill-icon">' + icon(s.icon) + "</span><h3>" + esc(s.category) + "</h3></div>" +
        '<ul class="chips" aria-label="' + esc(s.category) + ' skills">' + s.items.map((it) => '<li class="chip">' + esc(it) + "</li>").join("") + "</ul>" +
      "</article>"
    ).join("");

    /* ---------- Experience ---------- */
    const expIcons = ["code", "table", "support", "briefcase"];
    $("[data-experience]").innerHTML = D.experience.map((e, i) =>
      '<li class="tl-item reveal" style="--d:' + i * 80 + 'ms">' +
        '<span class="tl-node">' + icon(expIcons[i % expIcons.length]) + "</span>" +
        '<article class="tl-card">' +
          '<div class="tl-top"><div><h3 class="tl-role">' + esc(e.role) + "</h3>" +
            (e.company ? '<p class="tl-company">' + esc(e.company) + "</p>" : "") + "</div>" +
            (e.period ? '<span class="tl-period">' + esc(e.period) + "</span>" : "") +
          "</div>" +
          '<ul class="tl-points">' + e.points.map((p) => "<li>" + esc(p) + "</li>").join("") + "</ul>" +
          (e.tags && e.tags.length ? '<ul class="chips">' + e.tags.map((t) => '<li class="chip chip-sm">' + esc(t) + "</li>").join("") + "</ul>" : "") +
        "</article>" +
      "</li>"
    ).join("");

    /* ---------- Projects ---------- */
    const grid = $("[data-projects]");
    const filterBar = $("[data-filters]");
    const filterStatus = $("[data-filter-status]");

    function projectCard(p, i) {
      const num = String(i + 1).padStart(2, "0");
      const isShot = p.thumbType === "screenshot";
      const actions = [];
      if (p.demoUrl && p.slug !== "developer-portfolio") {
        actions.push('<a class="btn btn-primary btn-sm" href="' + esc(p.demoUrl) + '">' + icon("external") + " View Project</a>");
      }
      actions.push('<a class="btn btn-sm" href="' + caseStudyUrl(p) + '" aria-label="Read the ' + esc(p.title) + ' case study">Case Study</a>');
      if (p.codeUrl) {
        actions.push('<a class="btn btn-sm btn-ghost" href="' + esc(p.codeUrl) + '" target="_blank" rel="noopener">' + icon("github") + " View Code</a>");
      }
      return (
        '<article class="project-card reveal" data-filter="' + esc(p.filter) + '" style="--d:' + (i % 3) * 70 + 'ms">' +
          '<a class="project-thumb" href="' + caseStudyUrl(p) + '" tabindex="-1" aria-hidden="true">' +
            '<img src="' + esc(p.thumbnail) + '" alt="" loading="lazy" decoding="async" width="1280" height="800" />' +
            '<span class="thumb-label">' + icon(isShot ? "image" : "sparkle") + (isShot ? "Screenshot" : "Concept illustration") + "</span>" +
            '<span class="project-num">' + num + "</span>" +
          "</a>" +
          '<div class="project-body">' +
            '<div class="project-meta"><span class="project-cat">' + esc(p.category) + "</span>" +
              (p.status ? '<span class="status-badge ' + (STATUS_CLASS[p.status] || "status-concept") + '">' + esc(p.status) + "</span>" : "") +
            "</div>" +
            '<h3 class="project-title"><a href="' + caseStudyUrl(p) + '">' + esc(p.title) + "</a></h3>" +
            '<p class="project-desc">' + esc(p.summary) + "</p>" +
            '<ul class="chips" aria-label="Technologies">' + p.tech.map((t) => '<li class="chip chip-sm">' + esc(t) + "</li>").join("") + "</ul>" +
            '<div class="project-actions">' + actions.join("") + "</div>" +
          "</div>" +
        "</article>"
      );
    }

    grid.innerHTML = D.projects.length
      ? D.projects.map(projectCard).join("")
      : '<p class="empty-state">Projects coming soon.</p>';

    const counts = D.projects.reduce((acc, p) => { acc[p.filter] = (acc[p.filter] || 0) + 1; return acc; }, {});
    filterBar.innerHTML = D.projectFilters.map((f, i) => {
      const n = f.key === "all" ? D.projects.length : counts[f.key] || 0;
      return '<button type="button" class="filter-btn" data-filter-key="' + esc(f.key) + '" aria-pressed="' + (i === 0) + '">' + esc(f.label) + ' <span class="filter-count">' + n + "</span></button>";
    }).join("");

    function applyFilter(key) {
      let shown = 0;
      $$(".project-card", grid).forEach((card) => {
        const match = key === "all" || card.dataset.filter === key;
        card.classList.toggle("is-hidden", !match);
        if (match) { shown++; card.classList.add("is-in"); }
      });
      $$(".filter-btn", filterBar).forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.filterKey === key)));
      let empty = $(".empty-state", grid);
      if (!shown) {
        if (!empty) grid.insertAdjacentHTML("beforeend", '<p class="empty-state">No projects in this category yet.</p>');
      } else if (empty) empty.remove();
      const label = (D.projectFilters.find((f) => f.key === key) || {}).label;
      filterStatus.textContent = "Showing " + shown + " project" + (shown === 1 ? "" : "s") + (key === "all" ? "" : " in " + label);
    }
    filterBar.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-btn");
      if (btn) applyFilter(btn.dataset.filterKey);
    });

    /* ---------- Services ---------- */
    const typeSelect = $("#cf-type");
    $("[data-services]").innerHTML = D.services.map((s, i) =>
      '<article class="service-card reveal" style="--d:' + (i % 4) * 60 + 'ms">' +
        '<span class="skill-icon">' + icon(s.icon) + "</span>" +
        "<h3>" + esc(s.title) + "</h3>" +
        "<p>" + esc(s.text) + "</p>" +
        '<button type="button" class="link-arrow" data-service-type="' + esc(s.projectType) + '">' + esc(s.cta) + " " + icon("arrow-right") + "</button>" +
      "</article>"
    ).join("");

    // Populate the project-type dropdown from services (+ Other)
    const types = Array.from(new Set(D.services.map((s) => s.projectType))).concat(["Other"]);
    typeSelect.insertAdjacentHTML("beforeend", types.map((t) => "<option>" + esc(t) + "</option>").join(""));

    $("[data-services]").addEventListener("click", (e) => {
      const btn = e.target.closest("[data-service-type]");
      if (!btn) return;
      typeSelect.value = btn.dataset.serviceType;
      typeSelect.closest(".field").classList.remove("has-error");
      document.getElementById("contact").scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      setTimeout(() => $("#cf-name").focus({ preventScroll: true }), 500);
      toast("Project type set to “" + btn.dataset.serviceType + "”", "check");
    });

    // Pointer-follow glow on service cards
    $("[data-services]").addEventListener("pointermove", (e) => {
      const card = e.target.closest(".service-card");
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", e.clientX - r.left + "px");
      card.style.setProperty("--my", e.clientY - r.top + "px");
    });

    /* ---------- Email ---------- */
    if (profile.email) {
      const card = $("[data-email-card]");
      card.hidden = false;
      $("[data-email-text]", card).textContent = profile.email;
      $("[data-email-link]", card).href = "mailto:" + profile.email;
    }

    /* ---------- Active nav link ---------- */
    const links = $$(".nav-links a");
    const sections = links.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
    if ("IntersectionObserver" in window) {
      const navIo = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            links.forEach((a) => {
              const on = a.getAttribute("href") === "#" + en.target.id;
              a.classList.toggle("is-active", on);
              if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
            });
          }
        });
      }, { rootMargin: "-45% 0px -50% 0px" });
      sections.forEach((s) => navIo.observe(s));
    }

    /* ---------- Contact form ---------- */
    const form = $("#contact-form");
    const statusEl = $("[data-form-status]");
    const submitBtn = $("[data-submit]");
    const endpoint = (D.contactForm && D.contactForm.endpoint) || "";
    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!endpoint) {
      $("[data-form-mode-note]").textContent = "Your message will be prepared for WhatsApp" + (profile.email ? " or email" : "") + " so you can send it directly.";
    }

    const rules = {
      name: (v) => (v.trim().length < 2 ? "Please enter your full name." : ""),
      email: (v) => (!v.trim() ? "Please enter your email address." : !EMAIL_RE.test(v.trim()) ? "Please enter a valid email address, like name@example.com." : ""),
      projectType: (v) => (!v ? "Please choose a project type." : ""),
      details: (v) => (v.trim().length < 20 ? "Please share a little more detail (at least 20 characters)." : ""),
    };

    function validateField(input) {
      const rule = rules[input.name];
      if (!rule) return true;
      const msg = rule(input.value);
      const field = input.closest(".field");
      field.classList.toggle("has-error", !!msg);
      input.setAttribute("aria-invalid", msg ? "true" : "false");
      const err = $(".field-error", field);
      err.innerHTML = msg ? icon("alert") + "<span>" + esc(msg) + "</span>" : "";
      return !msg;
    }

    let attempted = false;
    form.addEventListener("input", (e) => { if (attempted || e.target.closest(".has-error")) validateField(e.target); });
    form.addEventListener("focusout", (e) => { if (e.target.value && rules[e.target.name]) validateField(e.target); });

    function setStatus(kind, title, body, actionsHtml) {
      statusEl.className = "form-status is-visible " + kind;
      statusEl.innerHTML =
        "<strong>" + icon(kind === "success" ? "check" : kind === "error" ? "alert" : "info") + esc(title) + "</strong>" +
        "<p>" + body + "</p>" + (actionsHtml ? '<div class="status-actions">' + actionsHtml + "</div>" : "");
    }

    function composeMessage(v) {
      return "Hello Emediong,\n\n" +
        "Name: " + v.name + "\nEmail: " + v.email + "\nProject type: " + v.projectType +
        (v.budget ? "\nBudget: " + v.budget : "") + "\n\nProject details:\n" + v.details;
    }

    function setLoading(on) {
      submitBtn.disabled = on;
      submitBtn.setAttribute("aria-busy", String(on));
      $("[data-submit-label]", submitBtn).textContent = on ? "Sending…" : "Send Enquiry";
      const ic = submitBtn.querySelector(".icon, .spinner");
      if (ic) ic.outerHTML = on ? '<span class="spinner" aria-hidden="true"></span>' : icon("send");
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      attempted = true;
      const fields = ["name", "email", "projectType", "details"].map((n) => form.elements[n]);
      const results = fields.map(validateField);
      if (results.includes(false)) {
        fields[results.indexOf(false)].focus();
        setStatus("error", "Please check the highlighted fields", "A few details are missing or need correcting.");
        return;
      }
      // Honeypot: silently stop bots
      if (form.elements.company.value) return;

      const v = {
        name: form.elements.name.value.trim(),
        email: form.elements.email.value.trim(),
        projectType: form.elements.projectType.value,
        budget: form.elements.budget.value,
        details: form.elements.details.value.trim(),
      };

      if (!endpoint) {
        // No delivery service configured: be honest and hand off to WhatsApp/email.
        const msg = composeMessage(v);
        const actions =
          '<a class="btn btn-whatsapp btn-sm" href="' + esc(waUrl(msg)) + '" target="_blank" rel="noopener">' + icon("whatsapp") + " Send via WhatsApp</a>" +
          (profile.email ? '<a class="btn btn-sm" href="mailto:' + esc(profile.email) + "?subject=" + encodeURIComponent("Project enquiry: " + v.projectType) + "&body=" + encodeURIComponent(msg) + '">' + icon("mail") + " Send via Email</a>" : "") +
          '<button type="button" class="btn btn-sm btn-ghost" data-copy-msg>' + icon("copy") + " Copy message</button>";
        setStatus("info", "Your message is ready to send", "Online form delivery isn't set up yet, so <strong>this message has not been sent</strong>. Tap below to send it to me instantly. Your details are already filled in.", actions);
        const copyBtn = $("[data-copy-msg]", statusEl);
        copyBtn.addEventListener("click", async () => toast((await copyText(msg)) ? "Message copied to clipboard" : "Couldn't copy the message", "check"));
        return;
      }

      setLoading(true);
      statusEl.className = "form-status";
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 15000);
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(v),
          signal: ctrl.signal,
        });
        if (!res.ok) {
          let detail = "";
          try { detail = (await res.json()).error || ""; } catch (err) { /* ignore */ }
          throw new Error(detail || "Request failed (" + res.status + ")");
        }
        setStatus("success", "Thank you, your message has been sent!", "I've received your enquiry and will reply to <strong>" + esc(v.email) + "</strong> as soon as possible.");
        form.reset();
        attempted = false;
      } catch (err) {
        const msg = composeMessage(v);
        setStatus("error", "Your message couldn't be sent",
          (err.name === "AbortError" ? "The request timed out." : esc(err.message || "Something went wrong.")) + " Please try again, or send it on WhatsApp instead.",
          '<a class="btn btn-whatsapp btn-sm" href="' + esc(waUrl(msg)) + '" target="_blank" rel="noopener">' + icon("whatsapp") + " Send via WhatsApp</a>");
      } finally {
        clearTimeout(timer);
        setLoading(false);
      }
    });

    window.hydrateIcons();
    observeReveals(document);
  });
})();
