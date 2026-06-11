// Single swap point for the scheduling link.
// Set VITE_CALENDLY_URL in .env / Vercel env vars once the real Calendly account exists.
export const CALENDLY_URL: string | null =
  import.meta.env.VITE_CALENDLY_URL ?? null;
