/**
 * Vercel Serverless Function: POST /api/contact
 *
 * Sends contact-form enquiries to your inbox using Resend (https://resend.com).
 * Secrets live ONLY in environment variables on the server — never in the
 * front-end code. See .env.example and README.md for setup.
 *
 * To enable: set `contactForm.endpoint = "/api/contact"` in assets/js/data.js.
 */

const MAX = { name: 100, email: 160, projectType: 120, budget: 60, details: 4000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Very small in-memory rate limit (per server instance). Good enough to
// slow down casual abuse; use a proper store for high-traffic sites.
const hits = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 10 * 60 * 1000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

module.exports = async function handler(req, res) {
  const allowed = process.env.ALLOWED_ORIGIN;
  if (allowed) {
    res.setHeader("Access-Control-Allow-Origin", allowed);
    res.setHeader("Vary", "Origin");
  }
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(204).end();
  }
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (allowed && req.headers.origin && req.headers.origin !== allowed) {
    return res.status(403).json({ error: "Origin not allowed" });
  }

  const { RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL } = process.env;
  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL || !CONTACT_FROM_EMAIL) {
    return res.status(503).json({ error: "The contact service isn't configured yet." });
  }

  const ip = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "unknown";
  if (rateLimited(ip)) return res.status(429).json({ error: "Too many messages. Please try again later." });

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch (e) { return res.status(400).json({ error: "Invalid request." }); }
  }
  body = body || {};

  // Honeypot field: real users never fill it in.
  if (body.company) return res.status(200).json({ ok: true });

  const data = {};
  for (const key of Object.keys(MAX)) data[key] = String(body[key] || "").trim().slice(0, MAX[key]);

  if (data.name.length < 2) return res.status(400).json({ error: "Please enter your full name." });
  if (!EMAIL_RE.test(data.email)) return res.status(400).json({ error: "Please enter a valid email address." });
  if (!data.projectType) return res.status(400).json({ error: "Please choose a project type." });
  if (data.details.length < 20) return res.status(400).json({ error: "Please add more project details." });

  const html = `
    <h2>New project enquiry</h2>
    <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
    <p><strong>Project type:</strong> ${escapeHtml(data.projectType)}</p>
    <p><strong>Budget:</strong> ${escapeHtml(data.budget || "Not specified")}</p>
    <p><strong>Details:</strong></p>
    <p style="white-space:pre-wrap">${escapeHtml(data.details)}</p>`;

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: CONTACT_FROM_EMAIL,
        to: [CONTACT_TO_EMAIL],
        reply_to: data.email,
        subject: `Portfolio enquiry: ${data.projectType} from ${data.name}`,
        html,
        text: `Name: ${data.name}\nEmail: ${data.email}\nProject type: ${data.projectType}\nBudget: ${data.budget || "Not specified"}\n\n${data.details}`,
      }),
    });
    if (!r.ok) {
      console.error("Resend error", r.status, await r.text());
      return res.status(502).json({ error: "The message couldn't be delivered right now." });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Contact function error", err);
    return res.status(500).json({ error: "Something went wrong sending your message." });
  }
};
