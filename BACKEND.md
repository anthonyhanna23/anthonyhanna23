# Picco Media — Backend Reference

## Architecture Overview

| Component | File | Purpose |
|---|---|---|
| Contact form email | `api/contact.js` | Sends lead emails via Gmail/nodemailer |
| Instagram feed API | `api/feed.ts` | Public endpoint serving approved IG posts |
| Admin panel API | `api/admin.ts` | Manage IG tokens + approve/hide posts |
| Token auto-refresh | `api/cron/refresh-tokens.ts` | Daily cron keeps 60-day IG tokens alive |
| Redis storage | `api/_lib/instagram.ts` | Upstash Redis stores tokens + feed cache |
| Vercel cron schedule | `vercel.json` | Fires token refresh at 6am UTC daily |

---

## Environment Variables

Set all of these in **Vercel → Project → Settings → Environment Variables**.

| Variable | Purpose | How to get it |
|---|---|---|
| `EMAIL_USER` | Gmail address that sends contact form emails | Already set |
| `EMAIL_PASS` | Gmail app password | Already set |
| `ADMIN_PASSWORD` | Password to log into `/admin` | Choose any strong password |
| `CRON_SECRET` | Authenticates Vercel's daily cron request | Run `openssl rand -hex 32` |
| `IG_APP_SECRET` | Exchanges short-lived IG tokens for 60-day tokens | Meta developer portal → App Settings → Basic → App Secret |
| `VITE_CALENDLY_URL` | Your Calendly booking link shown on /contact | Your Calendly event URL |
| `KV_REST_API_URL` | Upstash Redis connection URL | Auto-injected by Vercel Marketplace |
| `KV_REST_API_TOKEN` | Upstash Redis auth token | Auto-injected by Vercel Marketplace |

After adding/changing env vars in Vercel, always **redeploy** for them to take effect.

To sync vars locally: `vercel env pull` (requires Vercel CLI: `npm i -g vercel` then `vercel link`).

---

## How the Token Chain Works

1. **Short-lived Instagram token** — Generated manually from the Meta developer portal. Valid ~1 hour. Paste this into `/admin` once to kick off the chain.

2. **IG_APP_SECRET** — When you paste the short-lived token, the backend calls Meta's API using this secret to exchange it for a 60-day token. Proves the request is from your legitimate app.

3. **Long-lived token (60 days)** — Stored in Upstash Redis under `ig:token:<client-slug>`. This is what `api/feed.ts` uses to fetch posts. Cached for 15 minutes per client.

4. **Daily cron refresh** — Runs every day at 6am UTC. Refreshes the 60-day token before it expires. As long as this runs at least once every 60 days (it runs daily), you never need to paste a new token.

### CRON_SECRET explained

The cron endpoint `/api/cron/refresh-tokens` is a public URL — anyone could hit it. CRON_SECRET prevents that. When Vercel fires the cron, it automatically attaches the secret as a header:

```
Authorization: Bearer <your-CRON_SECRET>
```

The endpoint rejects any request without it. You never need to know or use this value yourself — Vercel handles it entirely. It's safe that you can't see it in Vercel after setting it; that's intentional. If you ever need to reset it, generate a new random string, update it in Vercel, and redeploy.

---

## Post Visibility: Default Hidden

**All new posts are hidden by default.** They will not appear on the site until you manually approve them in `/admin`.

- Go to `/admin` → log in → scroll to the post grid
- Posts with a **lime border** are visible on the site
- Posts that are **faded/grey** are hidden
- Click the **eye icon** on any post to toggle it

The approved post IDs are stored in Redis under `ig:visible`. Only posts in that set appear on the public feed.

---

## Setting Up Instagram Feed for a New Client

### Step 1 — Meta Developer Portal

1. Go to **developers.facebook.com** → log in with the Facebook account that manages your app
2. Open your existing app (no need to create a new one per client)
3. Go to **App roles → Instagram Testers**
4. Click **Add Instagram Testers** → enter the client's Instagram username
5. The client needs to accept the invite:
   - Open Instagram app → Settings → scroll to find **Website Permissions** or **Apps and Websites** → **Tester Invites** → Accept
6. Back in the developer portal → **API setup with Instagram login → Generate access tokens**
7. Click **Add account** → log in with the client's Instagram account → authorize all permissions
8. Copy the generated token immediately (expires in ~1 hour)

### Step 2 — Add the client to the codebase

Open `api/_lib/clients.ts` and add a line:

```ts
export const API_CLIENTS: ApiClient[] = [
  { slug: "marc-rice", name: "Marc Rice" },
  { slug: "new-client-slug", name: "New Client Display Name" }, // add here
];
```

The slug should be lowercase, hyphenated, and unique. Deploy after making this change.

### Step 3 — Connect in /admin

1. Go to **yoursite.com/admin** → log in
2. You'll see a new card for the client
3. Paste the token from Step 1 → click **Connect**
4. Their posts will load in the grid — approve the ones you want visible

---

## Tokens: When You'd Need to Reconnect

You only need to paste a new token if:

- The client **revokes access** to your Meta app from their Instagram settings
- Your **Meta app is disabled** by Meta
- You accidentally delete the token from Redis

Outside of those cases, the daily cron handles everything automatically.

---

## Adding/Removing Clients

**To add a client:** Follow the steps above — add to `api/_lib/clients.ts` and connect via `/admin`.

**To remove a client:** Remove their entry from `api/_lib/clients.ts` and delete their token from Redis via the Upstash dashboard (`ig:token:<slug>`).
