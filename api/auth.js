import * as notion from "./_lib/notion.js";

function cors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-app-password");
}

// GET  /api/auth  -> { required: bool }   (is a password configured?)
// POST /api/auth  -> validates the x-app-password header. 200 ok, 401 wrong.
export default async function handler(req, res) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(204).end();

  if (req.method === "GET") {
    return res.status(200).json({ required: notion.passwordRequired() });
  }

  if (req.method === "POST") {
    if (!notion.passwordRequired()) return res.status(200).json({ ok: true, required: false });
    if (notion.checkPassword(req)) return res.status(200).json({ ok: true });
    return res.status(401).json({ ok: false, error: "Wrong password." });
  }

  res.setHeader("Allow", "GET, POST, OPTIONS");
  return res.status(405).json({ error: "Method not allowed." });
}
