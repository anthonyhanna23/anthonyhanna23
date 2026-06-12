import type { VercelRequest, VercelResponse } from "@vercel/node";
import { API_CLIENTS } from "./_lib/clients.js";
import { getRedis, getCachedFeedForClient, getVisibleIds, type FeedItem } from "./_lib/instagram.js";

// Public feed: merged, hidden-filtered Instagram media for all connected clients.
// Never errors toward the visitor — any failure returns an empty list so the
// frontend silently falls back to its hardcoded work items.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  res.setHeader("Cache-Control", "public, s-maxage=900, stale-while-revalidate=86400");

  try {
    const redis = getRedis();
    if (!redis) {
      return res.status(200).json({ items: [], updatedAt: new Date().toISOString() });
    }

    const [visible, ...feeds] = await Promise.all([
      getVisibleIds(redis),
      ...API_CLIENTS.map((client) =>
        getCachedFeedForClient(redis, client).catch((err) => {
          console.error(`Feed fetch failed for ${client.slug}:`, err);
          return [] as FeedItem[];
        }),
      ),
    ]);

    const items = feeds
      .flat()
      .filter((item) => visible.has(item.id))
      .sort((a, b) => b.timestamp.localeCompare(a.timestamp));

    return res.status(200).json({ items, updatedAt: new Date().toISOString() });
  } catch (err) {
    console.error("Feed error:", err);
    return res.status(200).json({ items: [], updatedAt: new Date().toISOString() });
  }
}
