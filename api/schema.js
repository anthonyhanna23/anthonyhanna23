import * as notion from "./_lib/notion.js";

// Diagnostic endpoint: visit /api/schema to confirm the app can reach your
// database and see how each Notion column was detected. Safe to keep — it
// only reveals column names and types, never the API key.
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    const info = await notion.describe();
    res.status(200).json({ ok: true, ...info });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err.message || err) });
  }
}
