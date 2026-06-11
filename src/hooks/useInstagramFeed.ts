import { useQuery } from "@tanstack/react-query";
import type { FeedResponse, FeedItem } from "@/lib/instagram";

// Live Instagram feed with silent fallback: isLive is false when the API
// errors or returns nothing (e.g. no tokens seeded yet), so callers can
// render their hardcoded fallback content instead.
export function useInstagramFeed(): { items: FeedItem[]; isLive: boolean } {
  const { data, error } = useQuery<FeedResponse>({
    queryKey: ["/api/feed"],
    staleTime: 15 * 60 * 1000,
  });

  const items = data?.items ?? [];
  return { items, isLive: !error && items.length > 0 };
}
