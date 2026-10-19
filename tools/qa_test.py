"""End-to-end QA checks for the portfolio (optional developer tool).

Requires:  pip install playwright
Usage:     python tools/qa_test.py            (screenshots go to ./qa-screens/)

Starts a local server, drives Chrome/Edge through every page and feature,
and prints PASS/FAIL for each check. Exits non-zero if anything fails.
"""
import json
import sys
import threading
import urllib.error
import urllib.parse
import urllib.request
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
SHOTS = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "qa-screens"
PORT = 8766
BASE = f"http://127.0.0.1:{PORT}/"
results = []


class Quiet(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


def check(name, ok, detail=""):
    results.append((name, bool(ok), detail))
    print(("PASS " if ok else "FAIL ") + name + (f"  [{detail}]" if detail and not ok else ""))


def attach_error_log(page, bucket):
    page.on("console", lambda m: m.type == "error" and bucket.append("console: " + m.text))
    page.on("pageerror", lambda e: bucket.append("pageerror: " + str(e)))

    def on_fail(req):
        # External fonts may fail when offline; that's not a site bug.
        if "fonts.g" not in req.url:
            bucket.append("requestfailed: " + req.url)
    page.on("requestfailed", on_fail)
    page.on("response", lambda r: r.status >= 400 and "fonts.g" not in r.url and bucket.append(f"HTTP {r.status}: {r.url}"))


def no_overflow(page):
    return page.evaluate("document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1")


def broken_images(page):
    return page.evaluate("""Array.from(document.images).filter(i => i.complete && i.naturalWidth === 0 && !i.closest('[hidden]')).map(i => i.src)""")


def url_ok(url):
    try:
        with urllib.request.urlopen(url, timeout=10) as r:
            return r.status == 200
    except urllib.error.HTTPError:
        return False


def main():
    SHOTS.mkdir(parents=True, exist_ok=True)
    server = ThreadingHTTPServer(("127.0.0.1", PORT), partial(Quiet, directory=str(ROOT)))
    threading.Thread(target=server.serve_forever, daemon=True).start()
    data_js = (ROOT / "assets/js/data.js").read_text(encoding="utf-8")
    import re
    slugs = re.findall(r'slug:\s*"([a-z0-9-]+)"', data_js)

    with sync_playwright() as p:
        browser = None
        for ch in ("chrome", "msedge"):
            try:
                browser = p.chromium.launch(channel=ch)
                break
            except Exception:
                pass
        ctx = browser.new_context(viewport={"width": 1440, "height": 900}, permissions=["clipboard-read", "clipboard-write"])
        errors = []
        page = ctx.new_page()
        attach_error_log(page, errors)

        # ---------------- Home page content ----------------
        page.goto(BASE, wait_until="networkidle")
        page.wait_for_timeout(600)
        check("home: title", "Emediong Ndong Odiong" in page.title())
        check("home: hero headline", "Building Digital Experiences That" in page.inner_text("h1"))
        check("home: 7 skill categories", page.locator(".skill-card").count() == 7)
        check("home: 3 experience items", page.locator(".tl-item").count() == 3)
        check("home: Deacons Publishers listed", "Deacons Publishers" in page.inner_text("#experience"))
        check("home: 15 projects", page.locator(".project-card").count() == 15, str(page.locator(".project-card").count()))
        check("home: 10 services", page.locator(".service-card").count() == 10)
        check("home: 5 filters", page.locator(".filter-btn").count() == 5)
        check("home: footer year", str(__import__("datetime").date.today().year) in page.inner_text("#site-footer"))
        check("home: footer name", "EMEDIONG NDONG ODIONG" in page.inner_text("#site-footer"))
        check("home: no broken images", not broken_images(page), str(broken_images(page)))
        page.screenshot(path=str(SHOTS / "desktop-home-full.png"), full_page=True)

        # ---------------- Links ----------------
        wa = page.eval_on_selector_all("[data-wa-link]", "els => els.map(e => e.href)")
        check("contact: WhatsApp links use wa.me/2348105182333", wa and all(h.startswith("https://wa.me/2348105182333") for h in wa), str(wa[:2]))
        tel = page.eval_on_selector_all("[data-tel-link]", "els => els.map(e => e.getAttribute('href'))")
        check("contact: tel links", tel and all(h == "tel:+2348105182333" for h in tel), str(tel))
        check("contact: WhatsApp opens in new tab", all(page.eval_on_selector_all("[data-wa-link]", "els => els.map(e => e.target === '_blank' && e.rel.includes('noopener'))")))

        anchors = page.eval_on_selector_all("a[href^='#']", "els => els.map(e => e.getAttribute('href'))")
        missing = [a for a in set(anchors) if len(a) > 1 and page.locator(a).count() == 0]
        check("links: all in-page anchors resolve", not missing, str(missing))

        hrefs = page.eval_on_selector_all("a[href]", "els => els.map(e => e.href)")
        internal = sorted({h.split("#")[0] for h in hrefs if h.startswith(BASE)})
        bad = [h for h in internal if not url_ok(h)]
        check(f"links: {len(internal)} internal URLs return 200", not bad, str(bad))

        # ---------------- Copy phone ----------------
        page.locator(".hero-quick [data-copy-phone]").click()
        page.wait_for_timeout(300)
        clip = page.evaluate("navigator.clipboard.readText()")
        check("contact: copy phone number", clip == "+2348105182333", clip)
        check("contact: copy toast shown", page.locator("[data-toast].is-visible").count() == 1)

        # ---------------- Filters ----------------
        expected = {"all": 15, "business": 4, "landing": 3, "ecommerce": 2, "webapp": 6}
        for key, n in expected.items():
            page.locator(f'.filter-btn[data-filter-key="{key}"]').click()
            visible = page.locator(".project-card:not(.is-hidden)").count()
            pressed = page.get_attribute(f'.filter-btn[data-filter-key="{key}"]', "aria-pressed")
            check(f"filter: {key} shows {n}", visible == n and pressed == "true", f"{visible}, pressed={pressed}")
        page.locator('.filter-btn[data-filter-key="all"]').click()

        # Concept projects must not have a View Project button
        concept_demo_btns = page.evaluate("""Array.from(document.querySelectorAll('.project-card')).filter(c => c.querySelector('.status-concept') && /View Project/.test(c.innerText)).length""")
        check("integrity: concept projects have no live link", concept_demo_btns == 0)
        check("integrity: no View Code buttons without repos", page.locator(".project-card >> text=View Code").count() == 0)

        # ---------------- Theme ----------------
        page.locator(".site-header [data-theme-toggle]").click()
        check("theme: switches to light", page.get_attribute("html", "data-theme") == "light")
        page.reload(wait_until="networkidle")
        check("theme: persists after reload", page.get_attribute("html", "data-theme") == "light")
        page.wait_for_timeout(500)
        page.screenshot(path=str(SHOTS / "desktop-home-light.png"))
        page.locator(".site-header [data-theme-toggle]").click()
        check("theme: back to dark", page.get_attribute("html", "data-theme") == "dark")

        # ---------------- Service CTA ----------------
        page.locator("[data-service-type='Landing Page']").click()
        page.wait_for_timeout(800)
        check("services: CTA pre-selects project type", page.input_value("#cf-type") == "Landing Page")

        # ---------------- Contact form ----------------
        page.fill("#cf-name", "")
        page.select_option("#cf-type", "")
        page.locator("[data-submit]").click()
        n_err = page.locator(".field.has-error").count()
        check("form: empty submit shows 4 errors", n_err == 4, str(n_err))
        check("form: focus moves to first invalid field", page.evaluate("document.activeElement.id") == "cf-name")
        page.fill("#cf-name", "Ada Okafor")
        page.fill("#cf-email", "ada@bad")
        page.select_option("#cf-type", "Landing Page")
        page.fill("#cf-details", "Short")
        page.locator("[data-submit]").click()
        check("form: invalid email flagged", page.locator("#cf-email").get_attribute("aria-invalid") == "true")
        check("form: short details flagged", page.locator("#cf-details").get_attribute("aria-invalid") == "true")
        page.fill("#cf-email", "ada@example.com")
        page.fill("#cf-details", "I need a landing page for my new product launch next month.")
        page.locator("[data-submit]").click()
        page.wait_for_timeout(300)
        status = page.inner_text("[data-form-status]")
        check("form: honest 'not sent' state without endpoint", "has not been sent" in status, status[:120])
        wa_msg = page.get_attribute("[data-form-status] a.btn-whatsapp", "href") or ""
        decoded = urllib.parse.unquote(wa_msg)
        check("form: WhatsApp hand-off includes the message", "Ada Okafor" in decoded and "landing page" in decoded and decoded.startswith("https://wa.me/2348105182333"))

        # Simulate a configured endpoint (requests are intercepted, nothing leaves the machine)
        ctx2 = browser.new_context(viewport={"width": 1280, "height": 900})
        p2 = ctx2.new_page()
        p2.add_init_script("document.addEventListener('DOMContentLoaded', () => { window.PORTFOLIO.contactForm.endpoint = '/api/contact'; }, {capture: true});")
        sent = []
        def fake_ok(route):
            sent.append(route.request.post_data)
            route.fulfill(status=200, content_type="application/json", body='{"ok":true}')
        p2.route("**/api/contact", fake_ok)
        p2.goto(BASE, wait_until="networkidle")
        p2.fill("#cf-name", "Ada Okafor"); p2.fill("#cf-email", "ada@example.com")
        p2.select_option("#cf-type", "Landing Page"); p2.fill("#cf-details", "I need a landing page for my new product launch next month.")
        p2.locator("[data-submit]").click()
        p2.wait_for_selector(".form-status.success", timeout=5000)
        check("form: endpoint mode posts JSON and shows success", sent and json.loads(sent[0])["email"] == "ada@example.com")
        check("form: resets after success", p2.input_value("#cf-name") == "")
        p2.unroute("**/api/contact")
        p2.route("**/api/contact", lambda r: r.fulfill(status=502, content_type="application/json", body='{"error":"Delivery failed"}'))
        p2.fill("#cf-name", "Ada Okafor"); p2.fill("#cf-email", "ada@example.com")
        p2.select_option("#cf-type", "Landing Page"); p2.fill("#cf-details", "I need a landing page for my new product launch next month.")
        p2.locator("[data-submit]").click()
        p2.wait_for_selector(".form-status.error", timeout=5000)
        check("form: server error shows error state + WhatsApp fallback", "couldn't be sent" in p2.inner_text("[data-form-status]") and p2.locator("[data-form-status] a.btn-whatsapp").count() == 1)
        ctx2.close()

        check("home: no console/network errors", not errors, "; ".join(errors[:5]))

        # ---------------- Case studies ----------------
        cs_errors = []
        cs = ctx.new_page()
        attach_error_log(cs, cs_errors)
        for slug in slugs:
            cs.goto(BASE + "project.html?p=" + slug, wait_until="networkidle")
            ok = cs.locator(".cs-title").count() == 1 and cs.locator(".cs-section").count() >= 5 and not broken_images(cs)
            check(f"case study: {slug}", ok)
        cs.screenshot(path=str(SHOTS / "desktop-case-study.png"), full_page=True)
        cs.goto(BASE + "project.html?p=does-not-exist", wait_until="networkidle")
        check("case study: unknown slug shows not-found", "Project not found" in cs.inner_text("main"))
        check("case studies: no console/network errors", not cs_errors, "; ".join(cs_errors[:5]))

        e404 = []
        nf = ctx.new_page(); attach_error_log(nf, e404)
        nf.goto(BASE + "404.html", wait_until="networkidle")
        check("404 page renders", "doesn't exist" in nf.inner_text("main") and nf.locator("#site-footer .footer-grid").count() == 1)
        check("404: no errors", not e404, "; ".join(e404[:3]))

        # ---------------- Responsive ----------------
        for name, vp in [("mobile", (375, 812)), ("tablet", (820, 1180)), ("laptop", (1280, 800))]:
            c = browser.new_context(viewport={"width": vp[0], "height": vp[1]}, is_mobile=name == "mobile", has_touch=name == "mobile")
            m = c.new_page()
            for path in ["", "project.html?p=e-commerce-store", "demos/shop/", "demos/booking/", "demos/tracking/?id=SR-1205-NG", "demos/dashboard/", "404.html"]:
                m.goto(BASE + path, wait_until="networkidle")
                m.wait_for_timeout(200)
                check(f"{name}: no horizontal overflow /{path}", no_overflow(m))
            m.goto(BASE, wait_until="networkidle")
            m.wait_for_timeout(700)
            m.screenshot(path=str(SHOTS / f"{name}-home.png"))
            m.screenshot(path=str(SHOTS / f"{name}-home-full.png"), full_page=True)
            if name == "mobile":
                check("mobile: desktop nav hidden", not m.locator(".nav-links").is_visible())
                m.locator("[data-menu-toggle]").click()
                m.wait_for_timeout(350)
                check("mobile: menu opens", m.locator("#mobile-menu.is-open").count() == 1 and m.get_attribute("[data-menu-toggle]", "aria-expanded") == "true")
                m.screenshot(path=str(SHOTS / "mobile-menu.png"))
                m.keyboard.press("Escape")
                m.wait_for_timeout(350)
                check("mobile: Escape closes menu", m.get_attribute("[data-menu-toggle]", "aria-expanded") == "false")
                m.locator("[data-menu-toggle]").click()
                m.wait_for_timeout(350)
                m.locator("#mobile-menu a[href='#projects']").click()
                m.wait_for_timeout(2500)  # smooth scroll over a long page
                top = m.evaluate("document.getElementById('projects').getBoundingClientRect().top")
                check("mobile: menu link navigates and closes", m.get_attribute("[data-menu-toggle]", "aria-expanded") == "false" and abs(top) < 120, str(top))
            c.close()

        # ---------------- Keyboard ----------------
        k = ctx.new_page()
        k.goto(BASE, wait_until="networkidle")
        k.keyboard.press("Tab")
        check("a11y: first Tab reaches skip link", k.evaluate("document.activeElement.className") == "skip-link")
        reduced = browser.new_context(reduced_motion="reduce").new_page()
        reduced.goto(BASE, wait_until="networkidle")
        check("a11y: reduced motion shows content immediately", reduced.evaluate("getComputedStyle(document.querySelector('.hero-title')).opacity") == "1")

        # ---------------- Demos ----------------
        derr = []
        d = ctx.new_page(); attach_error_log(d, derr)
        d.goto(BASE + "demos/shop/", wait_until="networkidle")
        d.evaluate("localStorage.clear()"); d.reload(wait_until="networkidle")
        d.fill("#q", "light")  # matches "Pendant Light" + the Lighting category
        check("shop: search filters", d.locator(".card").count() == 2)
        d.fill("#q", "")
        d.locator("[data-cat='Kitchen']").click()
        check("shop: category filter", d.locator(".card").count() == 3)
        d.locator("[data-add]").first.click(); d.locator("[data-add]").nth(1).click(); d.locator("[data-add]").first.click()
        check("shop: cart badge counts", d.inner_text("#count") == "3")
        d.reload(wait_until="networkidle")
        check("shop: cart persists", d.inner_text("#count") == "3")
        d.locator("#cartBtn").click(); d.wait_for_timeout(400)
        check("shop: drawer opens", d.locator("#cartRoot.open").count() == 1)
        d.locator("[data-inc]").first.click()
        check("shop: quantity increment", d.inner_text("#count") == "4")
        d.locator("#checkoutBtn").click(); d.wait_for_timeout(200)
        d.locator("#coForm button[type=submit]").click()
        check("shop: checkout validation", d.locator(".f.err").count() == 6)
        d.fill("#co-name", "Ada Okafor"); d.fill("#co-phone", "08031234567"); d.fill("#co-email", "ada@example.com")
        d.fill("#co-address", "12 Oron Road"); d.fill("#co-city", "Uyo"); d.select_option("#co-state", "Akwa Ibom")
        d.locator("#coForm button[type=submit]").click()
        check("shop: order placed + cart cleared", "Thanks, Ada" in d.inner_text("#dlgBody") and d.inner_text("#count") == "0")

        d.goto(BASE + "demos/booking/", wait_until="networkidle")
        d.evaluate("localStorage.clear()"); d.reload(wait_until="networkidle")
        d.locator("[data-svc='physio']").click(); d.locator("#next").click()
        # pick the first enabled day that has a free slot
        booked = False
        for _ in range(3):
            days = d.locator(".day:not([disabled])")
            for i in range(days.count()):
                days.nth(i).click()
                if d.locator(".slot:not([disabled])").count():
                    booked = True
                    break
            if booked:
                break
            d.locator("[data-mon='1']").click()
        check("booking: date with free slots found", booked)
        slot = d.locator(".slot:not([disabled])").first
        t = slot.inner_text(); slot.click(); d.locator("#next").click()
        d.locator("#details button[type=submit]").click()
        check("booking: details validation", d.locator(".f.err").count() == 3)
        d.fill("#f-name", "Ada Okafor"); d.fill("#f-phone", "0803 123 4567"); d.fill("#f-email", "ada@example.com")
        d.locator("#details button[type=submit]").click()
        check("booking: confirmation", "You're booked" in d.inner_text("#stepBody") and t in d.inner_text("#stepBody"))
        check("booking: count badge", d.inner_text("#bkCount") == "1")
        d.locator("#again").click(); d.locator("[data-svc='physio']").click(); d.locator("#next").click()
        # The booked slot must now be disabled on that date
        d.locator("#tab-mine").click()
        check("booking: my bookings lists it", d.locator(".bk").count() == 1)
        d.once("dialog", lambda dlg: dlg.accept())
        d.locator("[data-cancel]").click()
        check("booking: cancel removes it", d.locator(".bk").count() == 0)

        d.goto(BASE + "demos/tracking/", wait_until="networkidle")
        d.locator("button[data-id='SR-3391-NG']").click(); d.wait_for_timeout(300)
        check("tracking: delivered sample", "Delivered" in d.inner_text("#result") and "id=SR-3391-NG" in d.url)
        d.fill("#tn", "hello"); d.locator(".go").click()
        check("tracking: invalid format error", "look like" in d.inner_text("#err"))
        d.fill("#tn", "SR-0000-NG"); d.locator(".go").click()
        check("tracking: unknown number error", "couldn't find" in d.inner_text("#err"))
        d.goto(BASE + "demos/tracking/?id=SR-7710-NG", wait_until="networkidle")
        check("tracking: deep link + delay notice", "Heavy rainfall" in d.inner_text("#result"))

        d.goto(BASE + "demos/dashboard/", wait_until="networkidle")
        check("dashboard: 4 KPIs", d.locator(".kpi").count() == 4)
        check("dashboard: chart rendered", d.locator("#lineChart svg path").count() >= 2)
        d.locator("[data-days='7']").click()
        check("dashboard: range switch", "7 days" in d.inner_text("#kpis"))
        d.locator("[data-sort='amount']").click()
        amounts = d.eval_on_selector_all("#table tbody td.num", "els => els.map(e => +e.innerText.replace(/[^0-9]/g,''))")
        check("dashboard: sort by amount desc", amounts == sorted(amounts, reverse=True) and len(amounts) > 0)
        d.fill("#search", "zzzz")
        check("dashboard: search empty state", "No orders match" in d.inner_text("#table"))
        d.fill("#search", "")
        box = d.locator("#lineChart svg").bounding_box()
        d.mouse.move(box["x"] + box["width"] / 2, box["y"] + box["height"] / 2)
        check("dashboard: hover tooltip", d.locator("#tip.show").count() == 1)
        d.locator("#theme").click()
        check("dashboard: theme toggle", d.get_attribute("html", "data-theme") == "dark")
        d.screenshot(path=str(SHOTS / "dashboard-dark.png"))
        d.locator("#theme").click()
        d.locator("#toggleTable").click()
        check("dashboard: table view", d.locator("#revTable table").is_visible())
        check("demos: no console/network errors", not derr, "; ".join(derr[:5]))

        browser.close()
    server.shutdown()

    failed = [r for r in results if not r[1]]
    print(f"\n{len(results) - len(failed)}/{len(results)} checks passed")
    sys.exit(1 if failed else 0)


if __name__ == "__main__":
    main()
