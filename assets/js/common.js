/* Shared behaviour for every page: theme, navigation, contact actions,
   footer, toast, reveal animations. Content comes from window.PORTFOLIO. */
(function () {
  "use strict";

  const D = window.PORTFOLIO || {};
  const profile = D.profile || {};
  const page = document.body.dataset.page || "home";
  // Prefix for links back to the home page ("" on the home page itself).
  const home = page === "home" ? "" : (document.body.dataset.home || "index.html");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

  function esc(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function waUrl(message) {
    const text = message || profile.whatsappMessage || "";
    return "https://wa.me/" + profile.whatsapp + (text ? "?text=" + encodeURIComponent(text) : "");
  }

  /* ---------- Toast ---------- */
  let toastTimer;
  function toast(msg, iconName) {
    const el = $("[data-toast]");
    if (!el) return;
    $("[data-toast-text]", el).textContent = msg;
    const ic = el.querySelector("svg");
    if (ic && iconName) ic.outerHTML = window.icon(iconName);
    el.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("is-visible"), 2600);
  }

  /* ---------- Clipboard ---------- */
  async function copyText(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (e) { /* fall through */ }
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.cssText = "position:fixed;top:-1000px;opacity:0";
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
    ta.remove();
    return ok;
  }

  /* ---------- Theme ---------- */
  function setTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    try { localStorage.setItem("theme", t); } catch (e) { /* storage unavailable */ }
    const meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", t === "light" ? "#f6f7fb" : "#07080b");
    $$("[data-theme-toggle]").forEach((b) => b.setAttribute("aria-label", t === "light" ? "Switch to dark theme" : "Switch to light theme"));
  }
  function initTheme() {
    setTheme(document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark");
    $$("[data-theme-toggle]").forEach((btn) =>
      btn.addEventListener("click", () => {
        const next = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
        setTheme(next);
      })
    );
  }

  /* ---------- Mobile menu ---------- */
  function initMenu() {
    const btn = $("[data-menu-toggle]");
    const menu = $("#mobile-menu");
    if (!btn || !menu) return;
    const open = () => {
      menu.hidden = false;
      requestAnimationFrame(() => menu.classList.add("is-open"));
      btn.setAttribute("aria-expanded", "true");
      btn.setAttribute("aria-label", "Close menu");
      btn.innerHTML = window.icon("close");
      document.body.style.overflow = "hidden";
      const first = menu.querySelector("a");
      if (first) first.focus();
    };
    const close = (returnFocus) => {
      menu.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
      btn.setAttribute("aria-label", "Open menu");
      btn.innerHTML = window.icon("menu");
      document.body.style.overflow = "";
      setTimeout(() => { if (!menu.classList.contains("is-open")) menu.hidden = true; }, 260);
      if (returnFocus) btn.focus();
    };
    btn.addEventListener("click", () => (btn.getAttribute("aria-expanded") === "true" ? close(true) : open()));
    menu.addEventListener("click", (e) => { if (e.target.closest("a")) close(false); });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && btn.getAttribute("aria-expanded") === "true") close(true);
      // Keep keyboard focus inside the open menu
      if (e.key === "Tab" && btn.getAttribute("aria-expanded") === "true") {
        const items = [btn].concat($$("a, button", menu));
        const i = items.indexOf(document.activeElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); items[items.length - 1].focus(); }
        else if (!e.shiftKey && i === items.length - 1) { e.preventDefault(); items[0].focus(); }
      }
    });
    window.matchMedia("(min-width: 961px)").addEventListener("change", (m) => { if (m.matches) close(false); });
  }

  /* ---------- Header state, back to top ---------- */
  function initScrollUi() {
    const header = $(".site-header");
    const topBtn = $("[data-back-to-top]");
    const onScroll = () => {
      const y = window.scrollY;
      if (header) header.classList.toggle("is-scrolled", y > 8);
      if (topBtn) topBtn.classList.toggle("is-visible", y > 900);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    if (topBtn) topBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));
  }

  /* ---------- Contact details everywhere ---------- */
  function initContactLinks() {
    $$("[data-wa-link]").forEach((a) => (a.href = waUrl()));
    $$("[data-tel-link]").forEach((a) => (a.href = "tel:" + profile.phoneInternational));
    $$("[data-phone-display]").forEach((el) => (el.textContent = profile.phoneDisplay));
    $$("[data-copy-phone]").forEach((btn) =>
      btn.addEventListener("click", async () => {
        const ok = await copyText(profile.phoneInternational);
        toast(ok ? "Phone number copied: " + profile.phoneInternational : "Couldn't copy — the number is " + profile.phoneDisplay, ok ? "check" : "alert");
      })
    );

    // Availability badge
    const av = profile.availability || {};
    $$("[data-availability]").forEach((el) => {
      el.dataset.status = av.status || "available";
      const label = $("[data-availability-label]", el);
      if (label && av.label) label.textContent = av.label;
    });
    const codeAv = $("[data-code-available]");
    if (codeAv) codeAv.textContent = av.status === "unavailable" ? "false" : "true";
  }

  /* ---------- Canonical / social URLs ---------- */
  function initMeta() {
    const base = (D.site && D.site.siteUrl || "").replace(/\/$/, "");
    const canon = $("[data-canonical]");
    if (!base) { if (canon) canon.remove(); return; }
    const path = document.body.dataset.canonicalPath || "/";
    if (canon) canon.href = base + path;
    const ogUrl = document.createElement("meta");
    ogUrl.setAttribute("property", "og:url");
    ogUrl.content = base + path;
    document.head.appendChild(ogUrl);
    $$('meta[property="og:image"], meta[name="twitter:image"]').forEach((m) => {
      const c = m.getAttribute("content");
      if (c && !/^https?:/.test(c)) m.setAttribute("content", base + "/" + c.replace(/^\.?\//, ""));
    });
  }

  /* ---------- Footer ---------- */
  const NAV = [
    ["Home", "#home"], ["About", "#about"], ["Skills", "#skills"], ["Experience", "#experience"],
    ["Projects", "#projects"], ["Services", "#services"], ["Contact", "#contact"],
  ];

  function renderFooter() {
    const el = $("#site-footer");
    if (!el) return;
    const year = new Date().getFullYear();
    const socials = (D.socials || []).filter((s) => s.url);
    const icon = window.icon;
    el.innerHTML =
      '<div class="container">' +
        '<div class="footer-grid">' +
          '<div class="footer-brand">' +
            '<a class="brand" href="' + (home || "#home") + '"><span class="brand-mark" aria-hidden="true">' + esc(profile.initials) + '</span><span class="brand-name">' + esc(profile.name.toUpperCase()) + "</span></a>" +
            '<p class="footer-role">' + esc(profile.titles.join(" | ")) + "</p>" +
            "<p>Thanks for stopping by. If you have a website to build, a system to fix or data to organise, I'd love to help you turn it into something that works beautifully.</p>" +
            (socials.length
              ? '<div class="socials">' + socials.map((s) => '<a class="icon-btn" href="' + esc(s.url) + '" target="_blank" rel="noopener me" aria-label="' + esc(s.label) + '">' + icon(s.icon) + "</a>").join("") + "</div>"
              : "") +
          "</div>" +
          '<nav class="footer-col" aria-label="Footer"><h4>Navigate</h4><ul>' +
            NAV.map((n) => '<li><a href="' + home + n[1] + '">' + n[0] + "</a></li>").join("") +
          "</ul></nav>" +
          '<div class="footer-col"><h4>Get in touch</h4><ul>' +
            '<li><a href="' + esc(waUrl()) + '" target="_blank" rel="noopener">' + icon("whatsapp") + "WhatsApp</a></li>" +
            '<li><a href="tel:' + esc(profile.phoneInternational) + '">' + icon("phone") + esc(profile.phoneDisplay) + "</a></li>" +
            (profile.email ? '<li><a href="mailto:' + esc(profile.email) + '">' + icon("mail") + esc(profile.email) + "</a></li>" : "") +
            '<li><a href="' + home + '#contact">' + icon("send") + "Project enquiry</a></li>" +
          "</ul></div>" +
        "</div>" +
        '<div class="footer-bottom">' +
          "<span>© " + year + " " + esc(profile.name) + ". All rights reserved.</span>" +
          '<span>Designed &amp; built by ' + esc(profile.shortName) + ".</span>" +
        "</div>" +
      "</div>";
  }

  /* ---------- Reveal on scroll ---------- */
  let io;
  function observeReveals(root) {
    const els = $$(".reveal:not(.is-in)", root);
    if (reduceMotion || !("IntersectionObserver" in window)) {
      els.forEach((e) => e.classList.add("is-in"));
      return;
    }
    if (!io) {
      io = new IntersectionObserver(
        (entries) => entries.forEach((en) => {
          if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
        }),
        { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
      );
    }
    els.forEach((e) => io.observe(e));
  }

  /* ---------- Boot ---------- */
  window.Site = { $, $$, esc, toast, copyText, waUrl, observeReveals, home, data: D };

  document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    renderFooter();
    window.hydrateIcons();
    initMenu();
    initScrollUi();
    initContactLinks();
    initMeta();
    // Page scripts render their content, then call observeReveals themselves.
    setTimeout(() => observeReveals(document), 0);
  });
})();
