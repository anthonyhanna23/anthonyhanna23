// Shared Notion helpers for the Time Tracker admin tab.
// ESM (this project is "type": "module"); ported from the standalone
// Picco Task Clocker's lib/notion.js. Lives in api/_lib so Vercel does not
// expose it as its own serverless function.
// Uses the global fetch available on Vercel's Node 18+ runtime.

const API = "https://api.notion.com/v1";
const NOTION_VERSION = process.env.NOTION_VERSION || "2022-06-28";

function headers() {
  const key = process.env.NOTION_API_KEY;
  if (!key) throw new Error("NOTION_API_KEY environment variable is not set.");
  return {
    Authorization: "Bearer " + key,
    "Notion-Version": NOTION_VERSION,
    "Content-Type": "application/json",
  };
}

function dbId() {
  const id = process.env.NOTION_DATABASE_ID;
  if (!id) throw new Error("NOTION_DATABASE_ID environment variable is not set.");
  return id;
}

// ---- schema (cached per warm lambda) ----
let _schema = null;
async function getSchema() {
  if (_schema) return _schema;
  const res = await fetch(API + "/databases/" + dbId(), { headers: headers() });
  if (!res.ok) {
    throw new Error("Notion 'retrieve database' failed (" + res.status + "): " + (await res.text()));
  }
  const data = await res.json();
  _schema = data.properties; // { propName: { id, type, ... } }
  return _schema;
}

function norm(s) {
  return String(s).toLowerCase().replace(/\s+/g, " ").trim();
}

// Which Notion column each logical field maps to. Includes the user's
// original "Asignee" spelling plus common variants, matched case-insensitively.
const FIELD_MATCH = {
  assignee: ["assignee", "asignee", "who", "person"],
  task: ["task"],
  date: ["date", "day"],
  start: ["time started", "start", "started", "time start"],
  end: ["time ended", "end", "ended", "time end"],
  taken: ["time taken", "taken", "duration", "time spent"],
};

// Map each logical field -> actual property name present in the database.
function resolveMap(schema) {
  const props = Object.keys(schema);
  const map = {};
  for (const field in FIELD_MATCH) {
    const wanted = FIELD_MATCH[field];
    const found = props.find((p) => wanted.indexOf(norm(p)) !== -1);
    if (found) map[field] = found;
  }
  return map;
}

function titlePropName(schema) {
  return Object.keys(schema).find((p) => schema[p].type === "title");
}

// Build a Notion property value for a given column type + logical field.
function buildValue(type, field, entry) {
  const text = entry[field] == null ? "" : String(entry[field]);
  switch (type) {
    case "title":
      return { title: [{ text: { content: text } }] };
    case "rich_text":
      return { rich_text: [{ text: { content: text } }] };
    case "select":
      return text ? { select: { name: text } } : { select: null };
    case "status":
      return text ? { status: { name: text } } : undefined;
    case "multi_select":
      return { multi_select: text ? [{ name: text }] : [] };
    case "number": {
      if (field === "taken") return { number: Math.round((entry.ms || 0) / 60000) };
      const n = Number(text.replace(/[^0-9.\-]/g, ""));
      return { number: isNaN(n) ? null : n };
    }
    case "date": {
      let iso = null;
      if (field === "date") iso = entry.startISO ? entry.startISO.slice(0, 10) : null;
      else if (field === "start") iso = entry.startISO || null;
      else if (field === "end") iso = entry.endISO || null;
      return iso ? { date: { start: iso } } : { date: null };
    }
    case "people":
      // A name can't be mapped to a Notion user id, so skip people columns.
      return undefined;
    default:
      return { rich_text: [{ text: { content: text } }] };
  }
}

async function buildProperties(entry) {
  const schema = await getSchema();
  const map = resolveMap(schema);
  const titleName = titlePropName(schema);
  const properties = {};

  for (const field in map) {
    const propName = map[field];
    const type = schema[propName].type;
    const value = buildValue(type, field, entry);
    if (value !== undefined) properties[propName] = value;
  }

  // Notion requires the title property; make sure it's populated with something useful.
  if (titleName && !properties[titleName]) {
    const fallback = entry.task || entry.assignee + " — " + entry.date;
    properties[titleName] = { title: [{ text: { content: String(fallback) } }] };
  }

  return properties;
}

export async function createEntry(entry) {
  const properties = await buildProperties(entry);
  const res = await fetch(API + "/pages", {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ parent: { database_id: dbId() }, properties }),
  });
  if (!res.ok) {
    throw new Error("Notion 'create page' failed (" + res.status + "): " + (await res.text()));
  }
  return res.json();
}

export async function archiveEntry(pageId) {
  const res = await fetch(API + "/pages/" + pageId, {
    method: "PATCH",
    headers: headers(),
    body: JSON.stringify({ archived: true }),
  });
  if (!res.ok) {
    throw new Error("Notion 'archive page' failed (" + res.status + "): " + (await res.text()));
  }
  return res.json();
}

// ---- reading back for the shared log ----
function fmtDate(iso) {
  // iso may be a date-only ("2026-08-10") or full timestamp.
  const d = new Date(iso.length <= 10 ? iso + "T00:00:00" : iso);
  if (isNaN(d)) return iso;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}
function fmtTime(iso) {
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function readProp(prop, field) {
  if (!prop) return "";
  switch (prop.type) {
    case "title":
      return prop.title.map((t) => t.plain_text).join("");
    case "rich_text":
      return prop.rich_text.map((t) => t.plain_text).join("");
    case "select":
      return prop.select ? prop.select.name : "";
    case "status":
      return prop.status ? prop.status.name : "";
    case "multi_select":
      return prop.multi_select.map((s) => s.name).join(", ");
    case "number":
      return prop.number == null ? "" : String(prop.number);
    case "date":
      if (!prop.date) return "";
      return field === "date" ? fmtDate(prop.date.start) : fmtTime(prop.date.start);
    case "people":
      return prop.people.map((u) => u.name || "").join(", ");
    default:
      return "";
  }
}

export async function listEntries(limit) {
  const schema = await getSchema();
  const map = resolveMap(schema);
  const res = await fetch(API + "/databases/" + dbId() + "/query", {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      page_size: limit || 100,
      sorts: [{ timestamp: "created_time", direction: "descending" }],
    }),
  });
  if (!res.ok) {
    throw new Error("Notion 'query database' failed (" + res.status + "): " + (await res.text()));
  }
  const data = await res.json();
  return data.results.map((pg) => {
    const p = pg.properties;
    const get = (field) => (map[field] ? readProp(p[map[field]], field) : "");
    return {
      id: pg.id,
      assignee: get("assignee"),
      task: get("task"),
      date: get("date"),
      start: get("start"),
      end: get("end"),
      taken: get("taken"),
    };
  });
}

// Small diagnostic view of how columns were detected.
export async function describe() {
  const schema = await getSchema();
  const map = resolveMap(schema);
  const columns = Object.keys(schema).map((name) => ({ name: name, type: schema[name].type }));
  return { detected: map, titleColumn: titlePropName(schema), columns: columns };
}

// ---- optional shared-password gate ----
// If APP_PASSWORD is set, the app requires a login and every request must send
// a matching `x-app-password` header.
export function passwordRequired() {
  return !!process.env.APP_PASSWORD;
}

export function checkPassword(req) {
  const expected = process.env.APP_PASSWORD;
  if (!expected) return true; // gate disabled
  const got = (req.headers && req.headers["x-app-password"]) || "";
  return got === expected;
}
