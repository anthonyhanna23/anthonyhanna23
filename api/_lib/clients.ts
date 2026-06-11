// Mirror of the Instagram-connected clients in src/data/clients.ts.
// Kept separate so serverless functions don't bundle frontend code (image imports etc).
// Facebook-only clients (e.g. Flores Landscaping) are NOT listed here — the Instagram
// Login API doesn't cover Facebook Pages, so their work stays manually curated.
export interface ApiClient {
  slug: string;
  name: string;
}

export const API_CLIENTS: ApiClient[] = [
  { slug: "marc-rice", name: "Marc Rice" },
];

export function isValidClientSlug(slug: string): boolean {
  return API_CLIENTS.some((c) => c.slug === slug);
}
