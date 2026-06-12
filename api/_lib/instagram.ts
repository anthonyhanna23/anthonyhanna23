import { Redis } from "@upstash/redis";
import { createHash, timingSafeEqual } from "node:crypto";
import { API_CLIENTS, type ApiClient } from "./clients.js";

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
  mediaProductType: string;
  // undefined for non-VIDEO media; false = trial reel (not shared to followers)
  isSharedToFeed?: boolean;
  thumbnailUrl: string;
  permalink: string;
  timestamp: string;
}

interface IgMedia {
  id: string;
  caption?: string;
  media_type: string;
  media_product_type?: string;
  is_shared_to_feed?: boolean;
  media_url?: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
}

interface IgMediaPage {
  data: IgMedia[];
  paging?: { cursors?: { after?: string }; next?: string };
}

function igMediaToFeedItem(m: IgMedia, client: ApiClient): FeedItem | null {
  const thumbnailUrl =
    (m.media_type === "VIDEO" ? m.thumbnail_url : m.media_url) ?? m.thumbnail_url ?? m.media_url ?? "";
  if (!thumbnailUrl) return null;
  return {
    id: m.id,
    clientSlug: client.slug,
    clientName: client.name,
    caption: m.caption ?? "",
    mediaType: m.media_type,
    mediaProductType: m.media_product_type ?? "FEED",
    isSharedToFeed: m.is_shared_to_feed,
    thumbnailUrl,
    permalink: m.permalink,
    timestamp: m.timestamp,
  };
}

export function getRedis(): Redis | null {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export const tokenKey = (slug: string) => `ig:token:${slug}`;
export const feedCacheKey = (slug: string) => `ig:feedcache:${slug}`;
export const VISIBLE_KEY = "ig:visible";

export async function getVisibleIds(redis: Redis): Promise<Set<string>> {
  const visible = await redis.get<string[]>(VISIBLE_KEY);
  return new Set(visible ?? []);
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

const IG_MEDIA_FIELDS = "id,caption,media_type,media_product_type,is_shared_to_feed,media_url,thumbnail_url,permalink,timestamp";

export async function fetchMediaForClient(redis: Redis, client: ApiClient): Promise<FeedItem[]> {
  const stored = await redis.get<StoredToken>(tokenKey(client.slug));
  if (!stored?.accessToken) return [];

  const data = await igFetch<IgMediaPage>(
    `/me/media?fields=${IG_MEDIA_FIELDS}&limit=100&access_token=${encodeURIComponent(stored.accessToken)}`,
  );

  return (data.data ?? []).map((m) => igMediaToFeedItem(m, client)).filter((item): item is FeedItem => item !== null);
}

// Paginated fetch used by the admin page. Fetches up to 10 pages (1 000 posts max).
// Pass sinceIso to stop early once posts older than that date are reached.
export async function fetchAllMediaForClient(
  redis: Redis,
  client: ApiClient,
  sinceIso?: string,
): Promise<FeedItem[]> {
  const stored = await redis.get<StoredToken>(tokenKey(client.slug));
  if (!stored?.accessToken) return [];

  const all: FeedItem[] = [];
  let after: string | undefined;
  const cutoff = sinceIso ? new Date(sinceIso).getTime() : null;
  const MAX_PAGES = 10;

  for (let page = 0; page < MAX_PAGES; page++) {
    const cursor = after ? `&after=${encodeURIComponent(after)}` : "";
    const data = await igFetch<IgMediaPage>(
      `/me/media?fields=${IG_MEDIA_FIELDS}&limit=100&access_token=${encodeURIComponent(stored.accessToken)}${cursor}`,
    );

    if (!data.data?.length) break;

    for (const m of data.data) {
      if (cutoff && new Date(m.timestamp).getTime() < cutoff) {
        // Posts are in reverse-chronological order; once we're past the cutoff we're done.
        return all;
      }
      const item = igMediaToFeedItem(m, client);
      if (item) all.push(item);
    }

    if (!data.paging?.next) break;
    after = data.paging?.cursors?.after;
    if (!after) break;
  }

  return all;
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
