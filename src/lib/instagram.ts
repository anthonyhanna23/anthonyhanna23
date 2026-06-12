// Mirror of the FeedItem shape returned by /api/feed (see api/_lib/instagram.ts).
export interface FeedItem {
  id: string;
  clientSlug: string;
  clientName: string;
  caption: string;
  mediaType: string;
  mediaProductType: string;
  thumbnailUrl: string;
  permalink: string;
  timestamp: string;
}

export interface FeedResponse {
  items: FeedItem[];
  updatedAt: string;
}
