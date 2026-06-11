import type { VercelRequest, VercelResponse } from "@vercel/node";
import { API_CLIENTS } from "../_lib/clients.js";
import { getRedis, refreshLongLivedToken, tokenKey, type StoredToken } from "../_lib/instagram.js";

const MIN_AGE_MS = 24 * 60 * 60 * 1000; // Meta only allows refresh once a token is >24h old

// Runs daily via Vercel Cron (see vercel.json). Long-lived Instagram tokens last
// 60 days; refreshing whenever one is >24h old means a missed run never matters.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const redis = getRedis();
  if (!redis) {
    return res.status(200).json({ refreshed: [], skipped: "storage not configured" });
  }

  const refreshed: string[] = [];
  const failed: string[] = [];

  for (const client of API_CLIENTS) {
    const stored = await redis.get<StoredToken>(tokenKey(client.slug));
    if (!stored?.accessToken) continue;
    if (Date.now() - new Date(stored.refreshedAt).getTime() < MIN_AGE_MS) continue;

    try {
      const newToken = await refreshLongLivedToken(stored.accessToken);
      await redis.set(tokenKey(client.slug), {
        ...stored,
        accessToken: newToken,
        refreshedAt: new Date().toISOString(),
      } satisfies StoredToken);
      refreshed.push(client.slug);
    } catch (err) {
      console.error(`Token refresh failed for ${client.slug}:`, err);
      failed.push(client.slug);
    }
  }

  return res.status(200).json({ refreshed, failed });
}
