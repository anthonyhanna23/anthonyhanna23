import { Redis } from "@upstash/redis";
import { createHash, timingSafeEqual } from "node:crypto";
import { API_CLIENTS, type ApiClient } from "./clients";

const IG_GRAPH = "https://graph.instagram.com";
export const FEED_CACHE_TTL_SECONDS = 15 * 60;

export interface StoredToken {
  accessToken: string;
  igUserId: string;
  username: string;
  refreshedAt: string; // ISO timestamp
}

export interface FeedItem {
  id: string;
  clientSlug: string;
  clientName: string;
  caption: string;
  mediaType: string;
  thumbnailUrl: string;
  permalink: string;
  timestamp: string;
}

interface IgMedia {
  id: string;
  caption?: string;
  media_type: string;
  media_url?: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
}

export function getRedis(): Redis | null {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export const tokenKey = (slug: string) => `ig:token:${slug}`;
export const feedCacheKey = (slug: string) => `ig:feedcache:${slug}`;
export const HIDDEN_KEY = "ig:hidden";

export async function getHiddenIds(redis: Redis): Promise<Set<string>> {
  const hidden = await redis.get<string[]>(HIDDEN_KEY);
  return new Set(hidden ?? []);
}

async function igFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${IG_GRAPH}${path}`);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Instagram API ${res.status}: ${body}`);
  }
  return res.json() as Promise<T>;
}

export async function fetchProfile(accessToken: string): Promise<{ id: string; username: string }> {
  return igFetch(`/me?fields=id,username&access_token=${encodeURIComponent(accessToken)}`);
}

export async function exchangeForLongLivedToken(shortToken: string, appSecret: string): Promise<string> {
  const data = await igFetch<{ access_token: string }>(
    `/access_token?grant_type=ig_exchange_token&client_secret=${encodeURIComponent(appSecret)}&access_token=${encodeURIComponent(shortToken)}`,
  );
  return data.access_token;
}

export async function refreshLongLivedToken(accessToken: string): Promise<string> {
  const data = await igFetch<{ access_token: string }>(
    `/refresh_access_token?grant_type=ig_refresh_token&access_token=${encodeURIComponent(accessToken)}`,
  );
  return data.access_token;
}

export async function fetchMediaForClient(redis: Redis, client: ApiClient): Promise<FeedItem[]> {
  const stored = await redis.get<StoredToken>(tokenKey(client.slug));
  if (!stored?.accessToken) return [];

  const data = await igFetch<{ data: IgMedia[] }>(
    `/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=24&access_token=${encodeURIComponent(stored.accessToken)}`,
  );

  return (data.data ?? [])
    .map((m) => ({
      id: m.id,
      clientSlug: client.slug,
      clientName: client.name,
      caption: m.caption ?? "",
      mediaType: m.media_type,
      // media_url is absent for some media (e.g. copyrighted audio); thumbnail_url only exists for VIDEO
      thumbnailUrl: (m.media_type === "VIDEO" ? m.thumbnail_url : m.media_url) ?? m.thumbnail_url ?? m.media_url ?? "",
      permalink: m.permalink,
      timestamp: m.timestamp,
    }))
    .filter((item) => item.thumbnailUrl !== "");
}

export async function getCachedFeedForClient(redis: Redis, client: ApiClient): Promise<FeedItem[]> {
  const cached = await redis.get<FeedItem[]>(feedCacheKey(client.slug));
  if (cached) return cached;
  const items = await fetchMediaForClient(redis, client);
  if (items.length > 0) {
    await redis.set(feedCacheKey(client.slug), items, { ex: FEED_CACHE_TTL_SECONDS });
  }
  return items;
}

export async function invalidateFeedCaches(redis: Redis): Promise<void> {
  await Promise.all(API_CLIENTS.map((c) => redis.del(feedCacheKey(c.slug))));
}

export function isAdminAuthorized(providedKey: unknown): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || typeof providedKey !== "string") return false;
  // Hash both sides so timingSafeEqual gets equal-length buffers
  const a = createHash("sha256").update(providedKey).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}
