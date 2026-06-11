import type { VercelRequest, VercelResponse } from "@vercel/node";
import { API_CLIENTS, isValidClientSlug } from "./_lib/clients.js";
import {
  getRedis,
  fetchMediaForClient,
  fetchProfile,
  exchangeForLongLivedToken,
  getHiddenIds,
  invalidateFeedCaches,
  isAdminAuthorized,
  tokenKey,
  HIDDEN_KEY,
  type FeedItem,
  type StoredToken,
} from "./_lib/instagram.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAdminAuthorized(req.headers["x-admin-key"])) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const redis = getRedis();

  try {
    if (req.method === "GET") {
      if (req.query.action === "posts") {
        if (!redis) return res.status(200).json({ posts: [], accounts: [] });

        const hidden = await getHiddenIds(redis);
        const accounts: { slug: string; name: string; connected: boolean; username?: string; refreshedAt?: string }[] = [];
        const posts: (FeedItem & { hidden: boolean })[] = [];

        for (const client of API_CLIENTS) {
          const stored = await redis.get<StoredToken>(tokenKey(client.slug));
          accounts.push({
            slug: client.slug,
            name: client.name,
            connected: Boolean(stored?.accessToken),
            username: stored?.username,
            refreshedAt: stored?.refreshedAt,
          });
          if (stored?.accessToken) {
            try {
              const items = await fetchMediaForClient(redis, client);
              posts.push(...items.map((item) => ({ ...item, hidden: hidden.has(item.id) })));
            } catch (err) {
              console.error(`Admin fetch failed for ${client.slug}:`, err);
            }
          }
        }

        posts.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
        return res.status(200).json({ posts, accounts });
      }
      return res.status(400).json({ error: "Unknown action" });
    }

    if (req.method === "POST") {
      const { action } = req.body ?? {};

      if (action === "login") {
        // Auth already passed above; this just validates the password for the admin gate.
        return res.status(204).end();
      }

      if (!redis) {
        return res.status(503).json({ error: "Storage not configured (Upstash Redis env vars missing)" });
      }

      if (action === "toggle") {
        const { id, hidden } = req.body;
        if (typeof id !== "string" || typeof hidden !== "boolean") {
          return res.status(400).json({ error: "id (string) and hidden (boolean) required" });
        }
        const current = await getHiddenIds(redis);
        if (hidden) current.add(id);
        else current.delete(id);
        await redis.set(HIDDEN_KEY, Array.from(current));
        await invalidateFeedCaches(redis);
        return res.status(200).json({ id, hidden });
      }

      if (action === "setToken") {
        const { slug, token } = req.body;
        if (typeof slug !== "string" || typeof token !== "string" || !isValidClientSlug(slug)) {
          return res.status(400).json({ error: "Valid slug and token required" });
        }

        // If an app secret is configured, try upgrading to a long-lived token;
        // tokens that are already long-lived fail the exchange, so fall back to as-is.
        let accessToken = token.trim();
        const appSecret = process.env.IG_APP_SECRET;
        if (appSecret) {
          try {
            accessToken = await exchangeForLongLivedToken(accessToken, appSecret);
          } catch {
            // already long-lived (or exchange unavailable) — validate below
          }
        }

        const profile = await fetchProfile(accessToken);
        const stored: StoredToken = {
          accessToken,
          igUserId: profile.id,
          username: profile.username,
          refreshedAt: new Date().toISOString(),
        };
        await redis.set(tokenKey(slug), stored);
        await invalidateFeedCaches(redis);
        return res.status(200).json({ slug, username: profile.username });
      }

      return res.status(400).json({ error: "Unknown action" });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error("Admin error:", err);
    return res.status(500).json({ error: err instanceof Error ? err.message : "Internal error" });
  }
}
