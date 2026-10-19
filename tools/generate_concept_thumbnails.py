"""Generate the SVG concept illustrations used for Concept Project cards.

Usage:  python tools/generate_concept_thumbnails.py
Output: assets/img/projects/<slug>.svg

These are stylised layout illustrations, not screenshots. When a concept
project is actually built, replace its thumbnail with a real screenshot
and change `thumbType` to "screenshot" in assets/js/data.js.
"""
from pathlib import Path

W, H = 1280, 800
OUT = Path(__file__).resolve().parent.parent / "assets" / "img" / "projects"
FONT = "Segoe UI, Inter, Helvetica, Arial, sans-serif"


def rect(x, y, w, h, fill, r=0, extra=""):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}" {extra}/>'


def text(x, y, s, size, fill, weight=600, anchor="start", family=FONT, extra=""):
    s = s.replace("&", "&amp;").replace("<", "&lt;")
    return (f'<text x="{x}" y="{y}" font-family="{family}" font-size="{size}" font-weight="{weight}" '
            f'fill="{fill}" text-anchor="{anchor}" {extra}>{s}</text>')


def frame(inner, bg1, bg2, page_bg, chrome="#ffffff", chrome_line="#e6e8ee", dots="#d5d9e2", url="concept"):
    """Wrap page content in a browser window on a gradient backdrop."""
    x, y, w, h = 90, 70, 1100, 700
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{bg1}"/><stop offset="1" stop-color="{bg2}"/></linearGradient>
  <clipPath id="win"><rect x="{x}" y="{y}" width="{w}" height="{h}" rx="18"/></clipPath>
  <filter id="sh" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="24" stdDeviation="26" flood-color="#000" flood-opacity="0.28"/></filter>
</defs>
<rect width="{W}" height="{H}" fill="url(#bg)"/>
<g filter="url(#sh)"><rect x="{x}" y="{y}" width="{w}" height="{h}" rx="18" fill="{page_bg}"/></g>
<g clip-path="url(#win)">
  <rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{page_bg}"/>
  <rect x="{x}" y="{y}" width="{w}" height="44" fill="{chrome}"/>
  <rect x="{x}" y="{y + 43}" width="{w}" height="1" fill="{chrome_line}"/>
  <circle cx="{x + 24}" cy="{y + 22}" r="6" fill="#ff5f57"/><circle cx="{x + 44}" cy="{y + 22}" r="6" fill="#febc2e"/><circle cx="{x + 64}" cy="{y + 22}" r="6" fill="#28c840"/>
  <rect x="{x + 370}" y="{y + 12}" width="360" height="20" rx="10" fill="{dots}" opacity="0.55"/>
  {text(x + 550, y + 27, url, 12, "#6b7280", 500, "middle")}
  <g transform="translate({x},{y + 44})">{inner}</g>
</g>
</svg>'''


def nav(brand, ink, accent, links=("Home", "About", "Services", "Contact"), cta="Get in touch", bg=None, cta_ink="#fff"):
    s = rect(0, 0, 1100, 64, bg) if bg else ""
    s += text(40, 40, brand, 22, ink, 700)
    for i, l in enumerate(links):
        s += text(560 + i * 100, 39, l, 15, ink, 500, extra='opacity="0.7"')
    s += rect(950, 16, 120, 34, accent, 17) + text(1010, 38, cta, 13, cta_ink, 700, "middle")
    return s


def lines(x, y, widths, color, h=12, gap=22, r=6, op=1):
    return "".join(rect(x, y + i * gap, w, h, color, r, f'opacity="{op}"') for i, w in enumerate(widths))


# ---------------------------------------------------------------- designs
def corporate():
    ink, acc = "#0d1b3e", "#2453d6"
    s = nav("Meridian Partners", ink, acc)
    s += text(40, 170, "Strategy and advisory", 46, ink, 700)
    s += text(40, 226, "for growing businesses.", 46, acc, 700)
    s += lines(40, 262, [430, 380], "#8a94ab", 12, 24, op=0.5)
    s += rect(40, 330, 160, 50, acc, 10) + text(120, 361, "Book a consultation", 13, "#fff", 700, "middle")
    s += rect(214, 330, 130, 50, "#fff", 10, f'stroke="{ink}" stroke-opacity="0.2"') + text(279, 361, "Our services", 13, ink, 600, "middle")
    s += rect(620, 100, 440, 300, "#dfe7fb", 20)
    s += rect(660, 140, 170, 100, "#fff", 12) + lines(680, 165, [90, 120, 70], "#c4cee6", 10, 20)
    s += rect(850, 140, 170, 220, acc, 12, 'opacity="0.9"')
    for i, hgt in enumerate([60, 100, 80, 140]):
        s += rect(872 + i * 36, 330 - hgt, 22, hgt, "#fff", 4, 'opacity="0.85"')
    s += rect(660, 260, 170, 100, "#fff", 12) + text(680, 312, "98%", 30, ink, 700) + lines(680, 328, [100], "#c4cee6", 8)
    for i, t in enumerate(["Business Strategy", "Financial Advisory", "Operations"]):
        x = 40 + i * 345
        s += rect(x, 440, 325, 190, "#fff", 16, 'stroke="#e3e8f2"')
        s += rect(x + 24, 466, 44, 44, "#e7eefd", 12) + rect(x + 37, 479, 18, 18, acc, 5)
        s += text(x + 24, 548, t, 19, ink, 700) + lines(x + 24, 566, [260, 220], "#9aa3b8", 10, 20, op=0.5)
    return frame(s, "#c9d6f5", "#7f98e0", "#f6f8fc", url="meridian-partners.concept")


def restaurant():
    ink, gold = "#f3e9dc", "#d9a25b"
    s = rect(0, 0, 1100, 656, "#16100c")
    s += nav("SAVORA", ink, gold, ("Menu", "About", "Gallery", "Visit"), "Reserve", cta_ink="#16100c")
    s += text(40, 200, "Slow-cooked flavour,", 50, ink, 600, family="Georgia, serif")
    s += text(40, 262, "served with warmth.", 50, gold, 600, family="Georgia, serif", extra='font-style="italic"')
    s += lines(40, 296, [400, 330], "#b8a891", 11, 22, op=0.5)
    s += rect(40, 360, 170, 50, gold, 25) + text(125, 391, "Book a table", 14, "#16100c", 700, "middle")
    s += rect(224, 360, 150, 50, "none", 25, f'stroke="{gold}"') + text(299, 391, "View menu", 14, gold, 600, "middle")
    s += f'<circle cx="840" cy="250" r="190" fill="#2a1d15"/><circle cx="840" cy="250" r="150" fill="#f3e9dc"/><circle cx="840" cy="250" r="118" fill="#e9dccb"/>'
    s += '<circle cx="800" cy="225" r="46" fill="#b8572f"/><circle cx="880" cy="215" r="34" fill="#6d8a3b"/><circle cx="860" cy="292" r="40" fill="#d9a25b"/><circle cx="790" cy="300" r="22" fill="#8a2e1d"/>'
    s += rect(0, 470, 1100, 186, "#1e1611")
    for i, (n, p) in enumerate([("Pepper Soup", "₦6,500"), ("Grilled Croaker", "₦12,000"), ("Jollof & Plantain", "₦7,800"), ("Afang Special", "₦9,500")]):
        x = 40 + i * 262
        s += text(x, 520, ["STARTERS", "MAINS", "MAINS", "LOCAL"][i], 11, gold, 700, extra='letter-spacing="2"')
        s += text(x, 552, n, 19, ink, 600, family="Georgia, serif") + text(x + 230, 552, p, 15, gold, 600, "end")
        s += lines(x, 570, [220, 170], "#7a6a58", 9, 18, op=0.6)
    return frame(s, "#3a2a1f", "#0f0a07", "#16100c", chrome="#221913", chrome_line="#33261c", dots="#4a3a2c", url="savora-restaurant.concept")


def house(x, y, c1, c2):
    return (rect(x, y, 330, 170, c1, 0) + f'<path d="M{x+115} {y+120} L{x+165} {y+70} L{x+215} {y+120} Z" fill="{c2}"/>'
            + rect(x + 128, y + 118, 74, 52, c2) + rect(x + 158, y + 138, 16, 32, c1))


def real_estate():
    ink, acc = "#0f2a2e", "#0f8b8d"
    s = nav("Homestead", ink, acc, ("Buy", "Rent", "Sell", "Agents"), "List property")
    s += text(40, 128, "Find a home you'll love.", 34, ink, 700)
    s += rect(40, 150, 1020, 64, "#fff", 14, 'stroke="#dde6e7"')
    for i, (lab, val) in enumerate([("Location", "Uyo, Akwa Ibom"), ("Type", "Apartment"), ("Price", "Up to ₦30M"), ("Beds", "2+")]):
        x = 64 + i * 220
        s += text(x, 174, lab, 11, "#7a8b8d", 600) + text(x, 198, val, 15, ink, 600)
    s += rect(930, 160, 116, 44, acc, 10) + text(988, 188, "Search", 14, "#fff", 700, "middle")
    palette = [("#d7ebe9", "#0f8b8d"), ("#f0e6d8", "#c58a43"), ("#e4e6f2", "#5a64a8")]
    for i in range(3):
        x = 40 + i * 345
        s += f'<g><clipPath id="c{i}"><rect x="{x}" y="240" width="330" height="380" rx="16"/></clipPath><g clip-path="url(#c{i})">'
        s += rect(x, 240, 330, 380, "#fff") + house(x, 240, *palette[i]) + "</g></g>"
        s += rect(x, 240, 330, 380, "none", 16, 'stroke="#dde6e7"')
        s += rect(x + 16, 256, 74, 26, "#fff", 13) + text(x + 53, 274, "For sale" if i != 1 else "For rent", 11, ink, 700, "middle")
        s += text(x + 20, 448, ["₦28,500,000", "₦2,400,000/yr", "₦45,000,000"][i], 22, ink, 700)
        s += text(x + 20, 476, ["3-bed apartment, Ewet", "2-bed flat, Shelter Afrique", "4-bed duplex, Osongama"][i], 14, "#5b6b6d", 500)
        s += rect(x + 20, 500, 290, 1, "#e5ecec")
        for j, f in enumerate(["3 beds", "2 baths", "140 m²"]):
            s += text(x + 20 + j * 96, 532, f, 13, "#5b6b6d", 600)
        s += rect(x + 20, 556, 290, 40, "#eef6f6", 10) + text(x + 165, 581, "Contact agent", 13, acc, 700, "middle")
    return frame(s, "#bfe3df", "#5fb3ad", "#f5f9f9", url="homestead-properties.concept")


def saas():
    ink, acc = "#ffffff", "#8b5cf6"
    s = rect(0, 0, 1100, 656, "#0c0a1a")
    s += '<defs><radialGradient id="glow" cx="0.5" cy="0" r="0.7"><stop offset="0" stop-color="#7c3aed" stop-opacity="0.45"/><stop offset="1" stop-color="#7c3aed" stop-opacity="0"/></radialGradient></defs>'
    s += rect(0, 0, 1100, 500, "url(#glow)")
    s += nav("Flowdesk", ink, acc, ("Product", "Pricing", "Customers", "Docs"), "Start free")
    s += rect(470, 92, 160, 28, "#1d1838", 14, 'stroke="#3b2f6e"') + text(550, 111, "New: AI summaries", 12, "#c4b5fd", 600, "middle")
    s += text(550, 172, "Your team's work,", 46, ink, 700, "middle")
    s += text(550, 228, "finally in one place.", 46, "#c4b5fd", 700, "middle")
    s += lines(330, 252, [440], "#8f88b3", 12, op=0.6) + lines(380, 274, [340], "#8f88b3", 12, op=0.6)
    s += rect(420, 306, 130, 46, acc, 10) + text(485, 335, "Get started", 14, "#fff", 700, "middle")
    s += rect(560, 306, 120, 46, "#1d1838", 10, 'stroke="#3b2f6e"') + text(620, 335, "Watch demo", 14, "#ddd6fe", 600, "middle")
    s += rect(150, 386, 800, 300, "#151230", 16, 'stroke="#2f2758"')
    s += rect(150, 386, 180, 300, "#120f29", 16) + lines(172, 420, [120, 90, 110, 80, 100], "#2f2758", 12, 30)
    for i in range(3):
        x = 350 + i * 195
        s += rect(x, 410, 180, 250, "#1b1739", 12)
        s += text(x + 16, 438, ["To do", "In progress", "Done"][i], 13, "#a5a0c8", 700)
        for j in range(3 - (i == 2)):
            s += rect(x + 12, 456 + j * 66, 156, 54, "#25204a", 10) + lines(x + 24, 470 + j * 66, [110, 70], "#4a4180", 8, 16)
            s += rect(x + 130, 488 + j * 66, 26, 10, ["#f472b6", "#60a5fa", "#34d399"][(i + j) % 3], 5)
    return frame(s, "#2e1065", "#0b0617", "#0c0a1a", chrome="#141127", chrome_line="#241f44", dots="#2f2758", url="flowdesk-app.concept")


def school():
    ink, acc, yel = "#13284b", "#1f5fbf", "#f5b800"
    s = rect(0, 0, 230, 656, "#13284b")
    s += rect(24, 24, 36, 36, yel, 10) + text(72, 49, "Brightfield", 18, "#fff", 700)
    for i, t in enumerate(["Dashboard", "Students", "Results", "Timetable", "Announcements", "Fees"]):
        y = 104 + i * 46
        if i == 0:
            s += rect(14, y - 26, 202, 38, "#21407a", 10)
        s += rect(30, y - 14, 14, 14, "#7f9cd1", 4) + text(56, y - 2, t, 14, "#dbe5f7" if i == 0 else "#9fb2d6", 600)
    s += text(262, 52, "Good morning, Mrs. Etuk", 24, ink, 700) + lines(262, 66, [260], "#9aa8bf", 10, op=0.6)
    for i, (lab, val, c) in enumerate([("Students", "1,248", acc), ("Attendance", "96.4%", "#11a36a"), ("Classes", "42", yel), ("Events", "5", "#e0523f")]):
        x = 262 + i * 208
        s += rect(x, 104, 192, 110, "#fff", 14, 'stroke="#e3e9f3"') + rect(x + 18, 122, 32, 32, c, 9, 'opacity="0.18"') + rect(x + 27, 131, 14, 14, c, 4)
        s += text(x + 18, 186, val, 26, ink, 700) + text(x + 18, 204, lab, 12, "#6b7a93", 600)
    s += rect(262, 236, 520, 390, "#fff", 14, 'stroke="#e3e9f3"') + text(286, 270, "Term results overview", 16, ink, 700)
    for i, v in enumerate([62, 74, 58, 81, 69, 88, 77]):
        x = 300 + i * 66
        s += rect(x, 590 - v * 3.2, 34, v * 3.2, acc if i != 5 else yel, 6)
        s += text(x + 17, 612, ["JSS1", "JSS2", "JSS3", "SS1", "SS2", "SS3", "Avg"][i], 11, "#6b7a93", 600, "middle")
    s += rect(798, 236, 278, 390, "#fff", 14, 'stroke="#e3e9f3"') + text(822, 270, "Announcements", 16, ink, 700)
    for i, t in enumerate(["Inter-house sports", "PTA meeting", "Mid-term break", "Science fair"]):
        y = 298 + i * 78
        s += rect(822, y, 230, 64, "#f3f6fb", 10) + rect(836, y + 14, 36, 36, [acc, yel, "#11a36a", "#e0523f"][i], 9, 'opacity="0.85"')
        s += text(884, y + 30, t, 13, ink, 700) + lines(884, y + 40, [120], "#a6b2c6", 8)
    return frame(s, "#cfdcf3", "#7fa0d8", "#f4f7fc", url="brightfield-school.concept")


def learning():
    ink, acc = "#0f2e1f", "#16a34a"
    s = nav("Learnly", ink, acc, ("Courses", "Paths", "Mentors", "Pricing"), "Sign up")
    s += rect(40, 86, 1020, 130, "#0f2e1f", 18)
    s += text(72, 136, "Continue learning", 14, "#86efac", 700) + text(72, 172, "Web Development Foundations", 26, "#fff", 700)
    s += rect(72, 188, 420, 8, "#24533a", 4) + rect(72, 188, 290, 8, "#4ade80", 4) + text(504, 197, "68%", 13, "#bbf7d0", 700)
    s += rect(890, 120, 140, 50, "#4ade80", 12) + text(960, 151, "Resume lesson", 13, "#0f2e1f", 700, "middle")
    s += text(40, 262, "Popular courses", 20, ink, 700)
    covers = [("#dcfce7", "#16a34a", "HTML & CSS"), ("#e0f2fe", "#0284c7", "JavaScript"), ("#fef3c7", "#d97706", "Excel for Data"), ("#fae8ff", "#a21caf", "UI Design")]
    for i, (bg, fg, t) in enumerate(covers):
        x = 40 + i * 258
        s += rect(x, 284, 242, 340, "#fff", 16, 'stroke="#e2ebe5"')
        s += rect(x + 12, 296, 218, 130, bg, 12) + f'<circle cx="{x + 121}" cy="361" r="34" fill="{fg}" opacity="0.9"/>'
        s += f'<path d="M{x + 112} 346 L{x + 136} 361 L{x + 112} 376 Z" fill="#fff"/>'
        s += text(x + 18, 456, t, 17, ink, 700) + lines(x + 18, 472, [180, 130], "#9db0a4", 9, 18, op=0.6)
        s += text(x + 18, 540, "12 lessons · 4h 30m", 12, "#5f7467", 600)
        s += rect(x + 18, 560, 206, 6, "#e7efe9", 3) + rect(x + 18, 560, [150, 60, 0, 110][i], 6, fg, 3)
        s += text(x + 18, 600, "★ 4.8", 13, "#ca8a04", 700) + text(x + 224, 600, "Free" if i == 0 else "₦15,000", 14, ink, 700, "end")
    return frame(s, "#c8f0d6", "#5cc489", "#f6faf7", url="learnly-academy.concept")


def publisher():
    ink, acc = "#2b1b17", "#8c2f39"
    s = rect(0, 0, 1100, 656, "#f8f3ea")
    s += nav("Inkwell Press", ink, acc, ("Catalogue", "Authors", "Submissions", "About"), "Shop books")
    s += text(40, 160, "Stories that stay", 50, ink, 500, family="Georgia, serif")
    s += text(40, 220, "with you.", 50, acc, 500, family="Georgia, serif", extra='font-style="italic"')
    s += lines(40, 250, [380, 320], "#9b8b7e", 11, 22, op=0.6)
    s += rect(40, 310, 170, 48, acc, 6) + text(125, 340, "Browse catalogue", 13, "#fff", 700, "middle")
    books = [("#8c2f39", "#f3d9b1"), ("#1f3a5f", "#f2e6d0"), ("#c98b2b", "#2b1b17"), ("#2f5d50", "#efe3c8"), ("#5a3d7a", "#f3e6d8")]
    for i, (c, t) in enumerate(books):
        x = 540 + i * 104
        y = 96 + (i % 2) * 26
        s += rect(x, y, 92, 260, c, 4, 'stroke="#00000022"') + rect(x, y, 8, 260, "#00000033", 0)
        s += rect(x + 18, y + 34, 58, 6, t, 3, 'opacity="0.9"') + rect(x + 18, y + 48, 42, 6, t, 3, 'opacity="0.6"')
        s += rect(x + 18, y + 220, 50, 5, t, 2, 'opacity="0.7"')
    s += rect(0, 410, 1100, 1, "#e4d9c8")
    s += text(40, 452, "NEW RELEASES", 12, acc, 700, extra='letter-spacing="3"')
    for i, (n, a) in enumerate([("The River Remembers", "A. Udo"), ("Lessons in Light", "M. Effiong"), ("A House of Paper", "K. Bassey"), ("Northbound", "T. Akpan")]):
        x = 40 + i * 262
        s += rect(x, 474, 64, 96, books[i][0], 3) + text(x + 80, 504, n, 15, ink, 700, family="Georgia, serif")
        s += text(x + 80, 526, a, 13, "#7a6a5e", 500) + text(x + 80, 560, "₦4,500", 14, acc, 700)
    return frame(s, "#efe2cc", "#c9a97d", "#f8f3ea", url="inkwell-press.concept")


def bakery():
    ink, acc = "#4a2433", "#e0607e"
    s = rect(0, 0, 1100, 656, "#fff7f3")
    s += nav("Crumb & Co.", ink, acc, ("Cakes", "Pastries", "Catering", "Order"), "Order now")
    s += text(40, 170, "Baked fresh,", 48, ink, 700, family="Georgia, serif")
    s += text(40, 228, "made for celebrations.", 48, acc, 700, family="Georgia, serif")
    s += lines(40, 258, [420, 360], "#b48e98", 11, 22, op=0.6)
    s += rect(40, 316, 190, 50, acc, 25) + text(135, 347, "Order a custom cake", 13, "#fff", 700, "middle")
    s += rect(244, 316, 150, 50, "#fff", 25, f'stroke="{acc}"') + text(319, 347, "Catering menu", 13, acc, 600, "middle")
    # Layered cake
    s += f'<circle cx="840" cy="230" r="170" fill="#fde4e1"/>'
    s += rect(740, 250, 200, 90, "#f6c7c0", 14) + rect(760, 180, 160, 80, "#fbd9d3", 14) + rect(780, 120, 120, 66, "#ffe9e4", 14)
    s += rect(740, 250, 200, 16, "#e0607e", 8, 'opacity="0.7"') + rect(760, 180, 160, 14, "#e0607e", 7, 'opacity="0.55"')
    s += '<circle cx="840" cy="108" r="12" fill="#c2334f"/>' + rect(720, 336, 240, 12, "#e8b8ad", 6)
    for i, (n, p, c) in enumerate([("Red Velvet", "₦25,000", "#c2334f"), ("Chocolate Fudge", "₦28,000", "#6b3a2a"), ("Vanilla Bloom", "₦22,000", "#f2c98f"), ("Small Chops Tray", "₦18,000", "#d9893b")]):
        x = 40 + i * 262
        s += rect(x, 420, 246, 200, "#fff", 18, 'stroke="#f3dcd6"')
        s += f'<circle cx="{x + 64}" cy="486" r="40" fill="{c}" opacity="0.9"/><circle cx="{x + 64}" cy="486" r="24" fill="#fff" opacity="0.35"/>'
        s += text(x + 122, 480, n, 15, ink, 700) + text(x + 122, 502, p, 14, acc, 700)
        s += lines(x + 24, 548, [196, 150], "#d5b7bd", 9, 18, op=0.7)
        s += rect(x + 24, 584, 90, 24, "#fdecee", 12) + text(x + 69, 600, "Add to order", 10, acc, 700, "middle")
    return frame(s, "#ffd9df", "#f093a7", "#fff7f3", url="crumb-and-co.concept")


def tattoo():
    ink, red = "#f2f2f2", "#e23b3b"
    s = rect(0, 0, 1100, 656, "#0b0b0b")
    s += nav("IRON & INK", ink, red, ("Artists", "Gallery", "Aftercare", "Studio"), "Book consult")
    s += text(40, 170, "ART THAT", 64, ink, 800, extra='letter-spacing="2"')
    s += text(40, 236, "LASTS FOREVER.", 64, red, 800, extra='letter-spacing="2"')
    s += lines(40, 270, [400, 300], "#5e5e5e", 11, 22)
    s += rect(40, 326, 200, 52, red, 4) + text(140, 358, "BOOK A CONSULTATION", 13, "#fff", 800, "middle")
    s += text(40, 430, "STYLES", 12, "#8a8a8a", 700, extra='letter-spacing="3"')
    for i, t in enumerate(["Fine line", "Blackwork", "Realism", "Traditional", "Lettering"]):
        s += rect(40 + i * 116, 446, 104, 34, "#1a1a1a" if i else red, 17, 'stroke="#2c2c2c"') + text(92 + i * 116, 468, t, 12, ink, 600, "middle")
    # gallery masonry
    tiles = [(600, 90, 220, 260), (836, 90, 224, 160), (836, 266, 224, 240), (600, 366, 220, 240), (836, 522, 224, 90)]
    for i, (x, y, w, h) in enumerate(tiles):
        s += rect(x, y, w, h, "#161616", 8, 'stroke="#262626"')
        cx, cy = x + w / 2, y + h / 2
        if i == 0:
            s += f'<path d="M{cx} {cy-80} C{cx+60} {cy-40} {cx+60} {cy+40} {cx} {cy+80} C{cx-60} {cy+40} {cx-60} {cy-40} {cx} {cy-80} Z" fill="none" stroke="{ink}" stroke-width="3"/><circle cx="{cx}" cy="{cy}" r="18" fill="{red}"/>'
        elif i == 1:
            s += f'<path d="M{cx-70} {cy+30} Q{cx} {cy-70} {cx+70} {cy+30}" fill="none" stroke="{ink}" stroke-width="3"/><path d="M{cx-40} {cy+30} Q{cx} {cy-20} {cx+40} {cy+30}" fill="none" stroke="{red}" stroke-width="3"/>'
        elif i == 2:
            s += f'<circle cx="{cx}" cy="{cy}" r="70" fill="none" stroke="{ink}" stroke-width="3"/><circle cx="{cx}" cy="{cy}" r="44" fill="none" stroke="{ink}" stroke-width="2" stroke-dasharray="6 6"/><path d="M{cx} {cy-30} L{cx+26} {cy+20} L{cx-26} {cy+20} Z" fill="{red}"/>'
        elif i == 3:
            s += f'<path d="M{cx-60} {cy+60} L{cx} {cy-70} L{cx+60} {cy+60}" fill="none" stroke="{ink}" stroke-width="3"/><path d="M{cx-35} {cy+10} H{cx+35}" stroke="{red}" stroke-width="3"/>'
        else:
            s += text(cx, cy + 10, "Est. 2026", 22, "#8a8a8a", 400, "middle", family="Georgia, serif", extra='font-style="italic"')
    return frame(s, "#2a2a2a", "#050505", "#0b0b0b", chrome="#141414", chrome_line="#222", dots="#2c2c2c", url="iron-and-ink.concept")


def healthcare():
    ink, acc = "#0d3550", "#1386c9"
    s = nav("CarePoint Clinic", ink, acc, ("Services", "Doctors", "Patients", "Contact"), "Book visit")
    s += rect(0, 64, 1100, 40, "#e6f3fb") + text(40, 90, "Emergency? Call 112 · Open daily 8:00–20:00", 14, ink, 600)
    s += text(40, 180, "Caring for you and", 44, ink, 700)
    s += text(40, 234, "your family.", 44, acc, 700)
    s += lines(40, 264, [430, 360], "#8aa3b5", 12, 24, op=0.6)
    s += rect(40, 326, 190, 52, acc, 12) + text(135, 358, "Request appointment", 14, "#fff", 700, "middle")
    s += rect(244, 326, 150, 52, "#fff", 12, f'stroke="{acc}" stroke-opacity="0.4"') + text(319, 358, "Our services", 14, acc, 600, "middle")
    s += f'<circle cx="840" cy="250" r="160" fill="#e6f3fb"/><circle cx="840" cy="250" r="110" fill="#fff"/>'
    s += rect(816, 180, 48, 140, acc, 10) + rect(770, 226, 140, 48, acc, 10)
    s += rect(640, 340, 190, 66, "#fff", 14, 'stroke="#dbe9f3"') + f'<circle cx="672" cy="373" r="16" fill="#20b07a"/>' + text(698, 368, "Next available", 11, "#6a8396", 600) + text(698, 388, "Today, 2:30 pm", 14, ink, 700)
    for i, (t, c) in enumerate([("General Medicine", acc), ("Paediatrics", "#20b07a"), ("Maternity", "#d6577a"), ("Laboratory", "#7c5cd6")]):
        x = 40 + i * 258
        s += rect(x, 446, 242, 180, "#fff", 16, 'stroke="#dbe9f3"')
        s += rect(x + 22, 470, 46, 46, c, 12, 'opacity="0.15"') + rect(x + 37, 478, 16, 30, c, 4) + rect(x + 30, 485, 30, 16, c, 4)
        s += text(x + 22, 552, t, 17, ink, 700) + lines(x + 22, 570, [190, 150], "#a9bccb", 9, 18, op=0.7)
    return frame(s, "#d3ecf8", "#79bde3", "#f7fbfe", url="carepoint-clinic.concept")


DESIGNS = {
    "corporate-business-website": corporate,
    "restaurant-website": restaurant,
    "real-estate-platform": real_estate,
    "saas-landing-page": saas,
    "school-management-website": school,
    "online-learning-platform": learning,
    "publisher-website": publisher,
    "catering-bakery-website": bakery,
    "tattoo-studio-booking": tattoo,
    "healthcare-information-website": healthcare,
}

if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    for slug, fn in DESIGNS.items():
        (OUT / f"{slug}.svg").write_text(fn(), encoding="utf-8")
        print("wrote", slug)
