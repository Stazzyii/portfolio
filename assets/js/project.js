/* Case study page: project.html?p=<slug>
   Renders any project from data.js using one reusable template. */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    const { $, esc, observeReveals, data: D } = window.Site;
    const icon = window.icon;
    const root = $("[data-case-study]");

    const params = new URLSearchParams(location.search);
    const slug = params.get("p") || "";
    const idx = D.projects.findIndex((p) => p.slug === slug);
    const p = D.projects[idx];

    if (!p) {
      document.title = "Project not found — Emediong Ndong Odiong";
      root.innerHTML =
        '<div class="nf"><div>' +
          '<div class="nf-code grad-text">404</div>' +
          "<h1>Project not found</h1>" +
          "<p>This case study doesn't exist or may have been moved.</p>" +
          '<div class="hero-actions"><a class="btn btn-primary" href="index.html#projects">' + icon("arrow-left") + " Back to projects</a></div>" +
        "</div></div>";
      root.removeAttribute("aria-busy");
      return;
    }

    const cs = p.caseStudy || {};
    const STATUS_CLASS = { "Live": "status-live", "Demo Project": "status-demo", "Concept Project": "status-concept", "In Development": "status-dev" };
    const isShot = p.thumbType === "screenshot";

    // Metadata
    const title = p.title + " — Case Study | Emediong Ndong Odiong";
    document.title = title;
    const setMeta = (sel, val) => { const m = document.querySelector(sel); if (m) m.setAttribute("content", val); };
    setMeta('meta[name="description"]', p.summary);
    setMeta('meta[property="og:title"]', title);
    setMeta('meta[property="og:description"]', p.summary);
    document.body.dataset.canonicalPath = "/project.html?p=" + p.slug;
    const base = (D.site.siteUrl || "").replace(/\/$/, "");
    const canon = $("[data-canonical]");
    if (base && canon) canon.href = base + "/project.html?p=" + p.slug;

    const list = (items) => '<ul class="cs-list">' + items.map((t) => "<li>" + icon("check") + esc(t) + "</li>").join("") + "</ul>";
    let n = 0;
    const section = (heading, body) => {
      n++;
      return '<section class="cs-section reveal"><h2><span class="num">' + String(n).padStart(2, "0") + "</span>" + esc(heading) + "</h2>" + body + "</section>";
    };

    const sections = [];
    if (cs.overview) sections.push(section("Project overview", "<p>" + esc(cs.overview) + "</p>"));
    if (cs.problem) sections.push(section("The problem", "<p>" + esc(cs.problem) + "</p>"));
    if (cs.goals && cs.goals.length) sections.push(section("Goals & requirements", list(cs.goals)));
    if (cs.approach) sections.push(section("Design approach", "<p>" + esc(cs.approach) + "</p>"));
    if (cs.features && cs.features.length) sections.push(section(p.status === "Concept Project" ? "Planned features" : "Features implemented", list(cs.features)));
    sections.push(section("Technologies", '<ul class="chips">' + p.tech.map((t) => '<li class="chip">' + esc(t) + "</li>").join("") + "</ul>"));
    if (cs.screenshots && cs.screenshots.length) {
      sections.push(section("Screenshots", cs.screenshots.map((s) =>
        '<figure class="cs-cover" style="margin-top:16px"><img src="' + esc(s.src) + '" alt="' + esc(s.alt || "") + '" loading="lazy" decoding="async" />' +
        (s.caption ? "<figcaption>" + esc(s.caption) + "</figcaption>" : "") + "</figure>").join("")));
    }
    if (cs.challenges && cs.challenges.length) sections.push(section(p.status === "Concept Project" ? "Anticipated challenges" : "Development challenges", list(cs.challenges)));
    sections.push(section("Results",
      cs.results && cs.results.length
        ? list(cs.results)
        : '<p class="cs-pending">' + (p.status === "Concept Project" ? "This is a concept project, so there are no results to report yet." : "No measured results have been recorded for this project yet.") + "</p>"));

    const actions = [];
    if (p.demoUrl) actions.push('<a class="btn btn-primary btn-block" href="' + esc(p.demoUrl) + '">' + icon("external") + (p.slug === "developer-portfolio" ? " Go to home page" : " View live demo") + "</a>");
    if (p.codeUrl) actions.push('<a class="btn btn-block" href="' + esc(p.codeUrl) + '" target="_blank" rel="noopener">' + icon("github") + " View source code</a>");
    if (!actions.length) actions.push('<p style="color:var(--text-3);font-size:.9rem">No live demo or public repository yet' + (p.status === "Concept Project" ? ". This is a concept project." : ".") + "</p>");
    actions.push('<a class="btn btn-ghost btn-block" href="index.html#contact" style="margin-top:10px">' + icon("send") + " Start a similar project</a>");

    const prev = D.projects[(idx - 1 + D.projects.length) % D.projects.length];
    const next = D.projects[(idx + 1) % D.projects.length];

    root.innerHTML =
      '<header class="cs-hero">' +
        '<nav class="breadcrumb" aria-label="Breadcrumb"><a href="index.html#projects">' + icon("arrow-left") + " All projects</a><span>/</span><span aria-current=\"page\">" + esc(p.title) + "</span></nav>" +
        '<div class="cs-badges">' +
          '<span class="eyebrow" style="margin:0">' + esc(p.category) + "</span>" +
          (p.status ? '<span class="status-badge ' + (STATUS_CLASS[p.status] || "status-concept") + '">' + esc(p.status) + "</span>" : "") +
        "</div>" +
        '<h1 class="cs-title">' + esc(p.title) + "</h1>" +
        '<p class="cs-summary">' + esc(p.summary) + "</p>" +
        '<figure class="cs-cover"><img src="' + esc(p.thumbnail) + '" alt="' + esc((isShot ? "Screenshot of the " : "Concept illustration of the ") + p.title) + '" width="1280" height="800" />' +
          "<figcaption>" + icon(isShot ? "image" : "sparkle") + (isShot ? "Screenshot of the working build." : "Concept illustration, not a screenshot of a live product.") + "</figcaption></figure>" +
        (cs.note ? '<p class="cs-note">' + icon("info") + "<span>" + esc(cs.note) + "</span></p>" : "") +
      "</header>" +
      '<div class="cs-layout">' +
        "<article>" + sections.join("") + "</article>" +
        '<aside class="cs-aside">' +
          '<div class="cs-box"><h3>Project details</h3><dl>' +
            "<div><dt>Category</dt><dd>" + esc(p.category) + "</dd></div>" +
            "<div><dt>Status</dt><dd>" + esc(p.status || "—") + "</dd></div>" +
            "<div><dt>Built with</dt><dd>" + esc(p.tech.join(", ")) + "</dd></div>" +
          "</dl></div>" +
          '<div class="cs-box"><h3>Links</h3>' + actions.join("") + "</div>" +
        "</aside>" +
      "</div>" +
      '<nav class="cs-nav" aria-label="More projects">' +
        '<a href="project.html?p=' + encodeURIComponent(prev.slug) + '"><small>' + icon("arrow-left") + "Previous project</small><strong>" + esc(prev.title) + "</strong></a>" +
        '<a class="next" href="project.html?p=' + encodeURIComponent(next.slug) + '"><small>Next project' + icon("arrow-right") + "</small><strong>" + esc(next.title) + "</strong></a>" +
      "</nav>";

    root.removeAttribute("aria-busy");
    window.hydrateIcons(root);
    observeReveals(root);
  });
})();
