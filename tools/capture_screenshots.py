"""Capture real screenshots of the demo projects and render image assets.

Optional developer tool. Requires:  pip install playwright pillow
Uses your installed Google Chrome or Microsoft Edge (no browser download needed).

Usage:  python tools/capture_screenshots.py

Produces:
  assets/img/projects/<slug>.webp   screenshots of working demos + this site
  assets/img/og-image.png           1200×630 social sharing image
  assets/img/favicon-32.png, apple-touch-icon.png, icon-192.png, icon-512.png
"""
import io
import threading
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from PIL import Image
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
IMG = ROOT / "assets" / "img"
PORT = 8765

SHOTS = {
    "e-commerce-store": "demos/shop/",
    "appointment-booking-system": "demos/booking/",
    "logistics-tracking-platform": "demos/tracking/?id=SR-2048-NG",
    "business-analytics-dashboard": "demos/dashboard/",
    "developer-portfolio": "index.html",
}


class Quiet(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


def save_webp(png_bytes, path, size=(1280, 800)):
    im = Image.open(io.BytesIO(png_bytes)).convert("RGB")
    im = im.resize(size, Image.LANCZOS)
    im.save(path, "WEBP", quality=82, method=6)


def main():
    server = ThreadingHTTPServer(("127.0.0.1", PORT), partial(Quiet, directory=str(ROOT)))
    threading.Thread(target=server.serve_forever, daemon=True).start()
    base = f"http://127.0.0.1:{PORT}/"
    try:
        with sync_playwright() as p:
            browser = None
            for channel in ("chrome", "msedge"):
                try:
                    browser = p.chromium.launch(channel=channel)
                    break
                except Exception as err:  # try the next installed browser
                    print(f"Could not launch {channel}: {err.__class__.__name__}")
            if browser is None:
                raise SystemExit("Install Google Chrome or Microsoft Edge to capture screenshots.")
            ctx = browser.new_context(viewport={"width": 1440, "height": 900}, device_scale_factor=1, color_scheme="light")
            page = ctx.new_page()
            for slug, url in SHOTS.items():
                page.goto(base + url, wait_until="networkidle")
                page.wait_for_timeout(1400)  # let entrance animations finish
                save_webp(page.screenshot(), IMG / "projects" / f"{slug}.webp")
                print("screenshot", slug)

            og = browser.new_page(viewport={"width": 1200, "height": 630})
            og.goto(base + "tools/og-image.html", wait_until="networkidle")
            og.wait_for_timeout(500)
            (IMG / "og-image.png").write_bytes(og.screenshot())
            print("og-image.png")

            for name, size in [("favicon-32.png", 32), ("apple-touch-icon.png", 180), ("icon-192.png", 192), ("icon-512.png", 512)]:
                ic = browser.new_page(viewport={"width": size, "height": size})
                ic.set_content(f'<html><body style="margin:0;background:transparent"><img src="{base}assets/img/favicon.svg" width="{size}" height="{size}" style="display:block"></body></html>')
                ic.wait_for_timeout(200)
                (IMG / name).write_bytes(ic.screenshot(omit_background=True))
                ic.close()
                print(name)
            browser.close()
    finally:
        server.shutdown()


if __name__ == "__main__":
    main()
