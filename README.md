# Emediong Ndong Odiong — Portfolio

Personal portfolio for **Emediong Ndong Odiong**: Full-Stack Web Developer | Data Entry Professional | IT Support.

Built with plain **HTML, CSS and JavaScript**. There is no build step and nothing to install. The site runs on any static host, and the optional contact-form backend is a single Vercel serverless function.

---

## 1. Run it locally

You need a local web server (opening `index.html` directly works too, but some features such as copy-to-clipboard behave better over `http://`).

```bash
# From this folder, with Python installed:
python -m http.server 8000
# then open http://localhost:8000
```

Any static server works, for example the VS Code **Live Server** extension or `npx serve`.

## 2. Project structure

```
index.html              Home page (hero, about, skills, experience, projects, services, contact)
project.html            Reusable case-study template → project.html?p=<project-slug>
404.html                Custom "page not found" page
assets/
  css/styles.css        All site styles (design tokens at the top; dark + light themes)
  js/data.js            ★ ALL EDITABLE CONTENT lives here
  js/common.js          Shared behaviour: theme, menu, contact links, footer, animations
  js/main.js            Home page rendering, project filters, contact form
  js/project.js         Case-study page rendering
  js/icons.js           Inline SVG icon set
  img/                  Profile photo, favicons, social image, project thumbnails
demos/
  shop/                 E-commerce store demo (working)
  booking/              Appointment booking demo (working)
  tracking/             Delivery tracking demo (working)
  dashboard/            Analytics dashboard demo (working)
api/contact.js          Optional Vercel function that emails form enquiries (Resend)
tools/                  Optional helper scripts (thumbnails, screenshots, sitemap, QA)
vercel.json             Security and caching headers for Vercel
robots.txt, site.webmanifest, .env.example
```

## 3. Editing your content

Almost everything is in **`assets/js/data.js`**. Open it in any text editor. Each section has comments explaining the fields.

| What | Where |
|---|---|
| Availability badge | `profile.availability`: `status` is `"available"`, `"limited"` or `"unavailable"`, plus a `label` |
| Phone / WhatsApp | `profile.phoneDisplay`, `phoneInternational`, `whatsapp`, `whatsappMessage` |
| Email (optional) | `profile.email`: when set, an email card and `mailto:` options appear |
| Location (optional) | `profile.location`: hidden while empty |
| CV download | Put your PDF in `assets/files/` and set `profile.cvUrl` to e.g. `"assets/files/Emediong-Odiong-CV.pdf"`. Until then, a "Request my CV" link is shown instead. |
| Profile photo | Replace `assets/img/profile.webp` (square works best) or change `profile.photo`. If the image is missing, an initials avatar is shown automatically. |
| Social links | `socials`: add your real GitHub/LinkedIn/etc. URLs. Empty ones are hidden. |
| About "at a glance" cards | `about.highlights` |
| **Biography paragraphs** | In `index.html`, section `#about`. They are kept in the HTML so search engines read them without JavaScript. |
| Skills | `skills`: **review this list and remove anything you aren't confident with.** No proficiency levels are shown. |
| Experience | `experience`: **fill in `period` (dates)** and adjust the bullet points to match exactly what you did. The Data Entry `company` is blank on purpose; add the name only if you want it public. The Deacons Publishers bullets include a placeholder line asking you to describe your real duties. |
| Services | `services` (each service's `projectType` also feeds the contact form's dropdown) |
| Projects | `projects` (see below) |

### Adding, editing or removing a project

Each project in `projects` is one object. Copy an existing one to add a new project, or delete one to remove it. Key fields:

- `slug`: unique, lowercase with hyphens. It becomes the case-study URL `project.html?p=<slug>`.
- `filter`: `business`, `landing`, `ecommerce` or `webapp` (drives the filter buttons; counts update automatically).
- `status`: `Live`, `Demo Project`, `Concept Project` or `In Development`.
- `thumbnail` + `thumbType`: use `"screenshot"` for a real screenshot and `"illustration"` for artwork. Cards label this so visitors know what they're seeing.
- `demoUrl`: a link that **really works** (a deployed site or a local demo folder). Use `null` if none; the "View Project" button is then hidden.
- `codeUrl`: your real GitHub repo, or `null` to hide "View Code".
- `caseStudy`: overview, problem, goals, approach, features, challenges, `results` (**only verified results**; leave `[]` otherwise), optional `screenshots: [{ src, alt, caption }]`, and a `note`.

### Replacing a concept project with your real work

1. Build or deploy the project.
2. Take a screenshot (1280×800 or any 16:10 image) and save it as `assets/img/projects/<slug>.webp` (or `.png`/`.jpg`).
3. In `data.js`, update `thumbnail`, set `thumbType: "screenshot"`, set `status` (`"Live"` for deployed client work), and add `demoUrl`/`codeUrl`.
4. Rewrite the case study with what you actually did. Add real results only if you can back them up.
5. Only feature client work and client names with the client's permission.

The concept illustrations are generated by `python tools/generate_concept_thumbnails.py` if you want to tweak them.

## 4. Contact form delivery

The form validates input in the browser. What happens on submit depends on `contactForm.endpoint` in `data.js`:

| `endpoint` | Behaviour |
|---|---|
| `""` *(default)* | Nothing is sent to a server. After validation, the visitor sees **"this message has not been sent"** and gets one-tap buttons to send the prepared message via **WhatsApp** (and email, if `profile.email` is set) or copy it. The site never pretends a message was delivered. |
| `"/api/contact"` | Uses the included Vercel function to email you via [Resend](https://resend.com). |
| A Formspree URL | e.g. `"https://formspree.io/f/abcdwxyz"`. Create a free form at formspree.io and paste its endpoint. No server code needed. |

### Setting up `/api/contact` (Vercel + Resend)

1. Create a Resend account and verify a sending domain (or use their test sender while trying it out).
2. In Vercel → *Project → Settings → Environment Variables*, add the variables from `.env.example`:
   - `RESEND_API_KEY`: your Resend API key (**secret: never put it in front-end code or commit it**)
   - `CONTACT_TO_EMAIL`: the inbox that should receive enquiries
   - `CONTACT_FROM_EMAIL`: e.g. `Portfolio <hello@your-domain.com>` on your verified domain
   - `ALLOWED_ORIGIN` *(optional)*: `https://your-domain.com`
3. Set `contactForm.endpoint: "/api/contact"` in `data.js` and redeploy.
4. Send yourself a test enquiry from the live site.

The function validates and length-limits every field, escapes HTML, ignores bot submissions (hidden honeypot field), applies a basic rate limit and returns clear error messages. If delivery fails, the visitor is offered WhatsApp as a fallback.

## 5. Deployment

There's no build step. Upload the folder as-is.

### Vercel (recommended, supports the contact function)

1. Push this folder to a GitHub repository.
2. In Vercel: *Add New → Project → Import* the repo.
3. Framework preset: **Other**. Build command: *(leave empty)*. Output directory: *(leave empty / root)*.
4. Add environment variables if you're using `/api/contact` (see above).
5. Deploy. Vercel serves `404.html` automatically for missing pages.

Or with the CLI: `npm i -g vercel` then `vercel` (preview) and `vercel --prod`.

### Netlify / Cloudflare Pages / GitHub Pages

These work for the static site (publish directory = project root). The `api/contact.js` function is Vercel-specific, so on these hosts use Formspree or the WhatsApp hand-off instead.

> `404.html` uses root-relative paths (`/assets/...`), so it expects the site to live at the root of a domain. On a GitHub Pages *project* site (`username.github.io/repo/`), use a custom domain or adjust those paths.

### Custom domain

1. Buy a domain from any registrar.
2. In Vercel → *Project → Settings → Domains*, add it and create the DNS records Vercel shows you (usually an `A` record for the root and a `CNAME` for `www`).
3. Once it's live:
   - Set `site.siteUrl` in `data.js` (e.g. `"https://your-domain.com"`, no trailing slash). This enables canonical URLs and absolute social-preview links.
   - Run `python tools/generate_sitemap.py https://your-domain.com` to create `sitemap.xml` and update `robots.txt`.
   - Optionally submit the sitemap in [Google Search Console](https://search.google.com/search-console).

## 6. Optional developer tools (`tools/`)

These are only for maintenance. The website doesn't need them.

| Script | Purpose | Needs |
|---|---|---|
| `generate_concept_thumbnails.py` | Regenerates the concept SVG illustrations | Python |
| `capture_screenshots.py` | Re-captures real screenshots of the demos and this site, the social image (`og-image.png`) and icon PNGs | `pip install playwright pillow` + Chrome or Edge |
| `qa_test.py` | Runs 112 end-to-end browser checks (content, links, filters, theme, form states, mobile menu, overflow at 3 screen sizes, all case studies, all demos) | `pip install playwright` + Chrome or Edge |
| `generate_sitemap.py` | Creates `sitemap.xml` for your domain | Python |

Re-run `capture_screenshots.py` after changing the hero or a demo so the thumbnails stay accurate.

## 7. Accessibility & performance notes

- Semantic landmarks, a skip link, visible focus states, keyboard-operable menu, filters, calendar and tables.
- Respects `prefers-reduced-motion`; scroll animations switch off automatically.
- Dark theme by default; the light/dark choice is remembered per visitor.
- Non-critical images are lazy-loaded; thumbnails are compressed WebP/SVG.
- No frameworks or runtime dependencies, just Google Fonts.
