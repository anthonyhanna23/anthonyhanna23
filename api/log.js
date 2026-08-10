import * as notion from "./_lib/notion.js";

function cors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-app-password");
}

async function readBody(req) {
  if (req.body) {
    return typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  }
  return await new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (c) => (data += c));
    req.on("end", () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on("error", reject);
  });
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(204).end();

  if (!notion.checkPassword(req)) {
    return res.status(401).json({ error: "Password required." });
  }

  try {
    if (req.method === "POST") {
      const entry = await readBody(req);
      if (!entry || !entry.task || !entry.assignee) {
        return res.status(400).json({ error: "Missing assignee or task." });
      }
      const page = await notion.createEntry(entry);
      return res.status(200).json({ ok: true, id: page.id });
    }

    if (req.method === "DELETE") {
      const id = (req.query && req.query.id) || "";
      if (!id) return res.status(400).json({ error: "Missing id." });
      await notion.archiveEntry(id);
      return res.status(200).json({ ok: true });
    }

    res.setHeader("Allow", "POST, DELETE, OPTIONS");
    return res.status(405).json({ error: "Method not allowed." });
  } catch (err) {
    return res.status(500).json({ error: String(err.message || err) });
  }
}
