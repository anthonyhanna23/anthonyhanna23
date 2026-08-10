import * as notion from "./_lib/notion.js";

function cors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-app-password");
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(204).end();

  if (!notion.checkPassword(req)) {
    return res.status(401).json({ error: "Password required." });
  }

  try {
    const entries = await notion.listEntries(100);
    res.status(200).json({ entries: entries });
  } catch (err) {
    res.status(500).json({ error: String(err.message || err) });
  }
}
