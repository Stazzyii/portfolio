"""Generate sitemap.xml once you know your live domain.

Usage:  python tools/generate_sitemap.py https://your-domain.com

Reads the project slugs from assets/js/data.js, writes sitemap.xml to the
project root, and points robots.txt at it.
"""
import re
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def main():
    if len(sys.argv) != 2 or not re.match(r"^https?://", sys.argv[1]):
        sys.exit("Usage: python tools/generate_sitemap.py https://your-domain.com")
    base = sys.argv[1].rstrip("/")
    data = (ROOT / "assets" / "js" / "data.js").read_text(encoding="utf-8")
    slugs = re.findall(r'slug:\s*"([a-z0-9-]+)"', data)
    today = date.today().isoformat()

    urls = [(f"{base}/", "1.0")] + [(f"{base}/project.html?p={s}", "0.7") for s in slugs]
    body = "\n".join(
        f"  <url><loc>{u.replace('&', '&amp;')}</loc><lastmod>{today}</lastmod><priority>{p}</priority></url>"
        for u, p in urls
    )
    (ROOT / "sitemap.xml").write_text(
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + body + "\n</urlset>\n",
        encoding="utf-8",
    )

    robots = ROOT / "robots.txt"
    text = re.sub(r"^#?\s*Sitemap:.*$", f"Sitemap: {base}/sitemap.xml", robots.read_text(encoding="utf-8"), flags=re.M)
    robots.write_text(text, encoding="utf-8")
    print(f"Wrote sitemap.xml with {len(urls)} URLs and updated robots.txt")
    print("Remember to also set site.siteUrl in assets/js/data.js")


if __name__ == "__main__":
    main()
