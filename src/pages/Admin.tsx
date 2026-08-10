import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Eye, EyeOff, RefreshCw, CheckCircle2, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import type { FeedItem } from "@/lib/instagram";

const ADMIN_KEY_STORAGE = "picco-admin-key";

interface AdminPost extends FeedItem {
  hidden: boolean;
}

interface AdminAccount {
  slug: string;
  name: string;
  connected: boolean;
  username?: string;
  refreshedAt?: string;
}

interface AdminData {
  posts: AdminPost[];
  accounts: AdminAccount[];
}

function tokenAgeDays(refreshedAt?: string): number | null {
  if (!refreshedAt) return null;
  return Math.floor((Date.now() - new Date(refreshedAt).getTime()) / (24 * 60 * 60 * 1000));
}

const DAY_FILTERS = [
  { label: "7 days", value: 7 },
  { label: "30 days", value: 30 },
  { label: "60 days", value: 60 },
  { label: "All time", value: 0 },
] as const;

export default function Admin() {
  const [adminKey, setAdminKey] = useState(() => sessionStorage.getItem(ADMIN_KEY_STORAGE) ?? "");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [daysFilter, setDaysFilter] = useState<number>(30);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const adminFetch = async (init?: RequestInit & { query?: string }) => {
    const res = await fetch(`/api/admin${init?.query ?? ""}`, {
      ...init,
      headers: {
        "x-admin-key": adminKey,
        ...(init?.body ? { "Content-Type": "application/json" } : {}),
      },
    });
    if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`);
    return res;
  };

  const postsQuery = daysFilter > 0 ? `?action=posts&days=${daysFilter}` : "?action=posts";

  const { data, isLoading, error } = useQuery<AdminData>({
    queryKey: ["admin-posts", adminKey, daysFilter],
    enabled: Boolean(adminKey),
    queryFn: async () => (await adminFetch({ query: postsQuery })).json(),
  });

  const adminPostsKey = ["admin-posts", adminKey, daysFilter] as const;

  const toggleMutation = useMutation({
    mutationFn: async ({ id, hidden }: { id: string; hidden: boolean }) => {
      await adminFetch({ method: "POST", body: JSON.stringify({ action: "toggle", id, hidden }) });
    },
    onMutate: async ({ id, hidden }) => {
      await queryClient.cancelQueries({ queryKey: adminPostsKey });
      const previous = queryClient.getQueryData<AdminData>(adminPostsKey);
      queryClient.setQueryData<AdminData>(adminPostsKey, (old) =>
        old ? { ...old, posts: old.posts.map((p) => (p.id === id ? { ...p, hidden } : p)) } : old,
      );
      return { previous };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/feed"] });
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(adminPostsKey, context.previous);
      toast({ title: "Update failed", description: "Couldn't save the change. Try again.", variant: "destructive" });
    },
  });

  const [tokenInputs, setTokenInputs] = useState<Record<string, string>>({});
  const tokenMutation = useMutation({
    mutationFn: async ({ slug, token }: { slug: string; token: string }) => {
      const res = await adminFetch({ method: "POST", body: JSON.stringify({ action: "setToken", slug, token }) });
      return res.json() as Promise<{ slug: string; username: string }>;
    },
    onSuccess: (result) => {
      toast({ title: "Account connected!", description: `Now pulling posts from @${result.username}.` });
      setTokenInputs((prev) => ({ ...prev, [result.slug]: "" }));
      queryClient.invalidateQueries({ queryKey: ["admin-posts", adminKey] });
    },
    onError: (err) => {
      toast({ title: "Connection failed", description: String(err), variant: "destructive" });
    },
  });

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    const res = await fetch("/api/admin", {
      method: "POST",
      headers: { "x-admin-key": passwordInput, "Content-Type": "application/json" },
      body: JSON.stringify({ action: "login" }),
    });
    if (res.ok) {
      sessionStorage.setItem(ADMIN_KEY_STORAGE, passwordInput);
      setAdminKey(passwordInput);
    } else {
      setLoginError("Wrong password.");
    }
  }

  if (!adminKey) {
    return (
      <div className="pt-40 min-h-screen bg-background">
        <div className="container mx-auto px-6 max-w-md">
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-8">
            Admin<span className="text-primary">.</span>
          </h1>
          <form onSubmit={handleLogin} className="bg-white p-8 rounded-3xl border border-black/5 shadow-xl space-y-4">
            <Input
              type="password"
              placeholder="Password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="h-12 bg-neutral-50 border-neutral-200 focus-visible:ring-primary"
            />
            {loginError && <p className="text-sm text-destructive font-medium">{loginError}</p>}
            <Button type="submit" className="w-full h-12 font-bold uppercase tracking-wide text-primary bg-foreground hover:bg-primary hover:text-foreground transition-all">
              Log In
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 min-h-screen bg-background pb-24">
      <div className="container mx-auto px-6">
        <div className="flex items-end justify-between mb-8">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">
            Picco <span className="text-primary">Admin</span>
          </h1>
          <button
            onClick={() => {
              sessionStorage.removeItem(ADMIN_KEY_STORAGE);
              setAdminKey("");
            }}
            className="text-sm font-bold uppercase tracking-wide text-neutral-400 hover:text-foreground transition-colors"
          >
            Log out
          </button>
        </div>

        <Tabs defaultValue="content" className="w-full">
          <TabsList className="mb-10 h-auto rounded-full bg-neutral-100 p-1">
            <TabsTrigger
              value="content"
              className="rounded-full px-5 py-2 text-sm font-bold uppercase tracking-wide data-[state=active]:bg-foreground data-[state=active]:text-primary data-[state=active]:shadow"
            >
              Content Control
            </TabsTrigger>
            <TabsTrigger
              value="tracker"
              className="rounded-full px-5 py-2 text-sm font-bold uppercase tracking-wide data-[state=active]:bg-foreground data-[state=active]:text-primary data-[state=active]:shadow"
            >
              Time Tracker
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content">

        {/* Connected accounts */}
        <div className="mb-16">
          <h2 className="text-primary font-bold tracking-[0.3em] uppercase text-xs mb-6">Instagram Accounts</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {(data?.accounts ?? []).map((account) => {
              const age = tokenAgeDays(account.refreshedAt);
              return (
                <div key={account.slug} className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold uppercase tracking-tight text-lg">{account.name}</h3>
                      {account.connected ? (
                        <p className="text-sm text-neutral-500 flex items-center gap-1.5">
                          <CheckCircle2 size={14} className="text-green-600" />
                          @{account.username} · token {age ?? "?"}d old
                          {age !== null && age > 50 && (
                            <span className="text-amber-600 flex items-center gap-1">
                              <AlertTriangle size={14} /> refresh due
                            </span>
                          )}
                        </p>
                      ) : (
                        <p className="text-sm text-neutral-400">Not connected</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Paste Instagram access token..."
                      value={tokenInputs[account.slug] ?? ""}
                      onChange={(e) => setTokenInputs((prev) => ({ ...prev, [account.slug]: e.target.value }))}
                      className="h-11 bg-neutral-50 border-neutral-200 focus-visible:ring-primary font-mono text-xs"
                    />
                    <Button
                      disabled={!tokenInputs[account.slug] || tokenMutation.isPending}
                      onClick={() => tokenMutation.mutate({ slug: account.slug, token: tokenInputs[account.slug] })}
                      className="h-11 font-bold uppercase tracking-wide bg-foreground text-primary hover:bg-primary hover:text-foreground transition-all"
                    >
                      {tokenMutation.isPending ? <RefreshCw size={16} className="animate-spin" /> : "Connect"}
                    </Button>
                  </div>
                </div>
              );
            })}
            {!isLoading && (data?.accounts ?? []).length === 0 && (
              <p className="text-neutral-400">
                No accounts configured. Storage may not be set up yet (Upstash Redis env vars).
              </p>
            )}
          </div>
        </div>

        {/* Post grid */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
            <h2 className="text-primary font-bold tracking-[0.3em] uppercase text-xs">Posts</h2>
            <div className="flex gap-2">
              {DAY_FILTERS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setDaysFilter(f.value)}
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide transition-all ${
                    daysFilter === f.value
                      ? "bg-primary text-black"
                      : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          <p className="text-neutral-500 mb-8">
            Click the eye to show or hide a post on the site. Lime border = visible.
          </p>

          {isLoading && <p className="text-neutral-400 animate-pulse">Loading posts…</p>}
          {Boolean(error) && <p className="text-destructive">Failed to load posts. Check the console / Vercel logs.</p>}
          {!isLoading && !error && (data?.posts ?? []).length === 0 && (
            <p className="text-neutral-400">No posts yet — connect an Instagram account above.</p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {(data?.posts ?? []).map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`relative aspect-[9/16] rounded-xl overflow-hidden border-2 transition-all ${
                  post.hidden ? "border-transparent opacity-50" : "border-primary"
                }`}
              >
                <img
                  src={post.thumbnailUrl}
                  alt={post.caption.slice(0, 60) || "Instagram post"}
                  className={`w-full h-full object-cover ${post.hidden ? "grayscale" : ""}`}
                />
                {/* Trial reel: is_shared_to_feed=false is the reliable signal.
                    CLIPS mediaProductType is a fallback for the active trial window. */}
                {(post.isSharedToFeed === false || post.mediaProductType === "CLIPS") && (
                  <div className="absolute top-3 left-3 bg-amber-400 text-black text-[10px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full">
                    Trial Reel
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-8">
                  <p className="text-white text-xs font-bold uppercase tracking-wide truncate">{post.clientName}</p>
                  <p className="text-white/60 text-xs truncate">{post.caption || "No caption"}</p>
                </div>
                <button
                  onClick={() => toggleMutation.mutate({ id: post.id, hidden: !post.hidden })}
                  className={`absolute top-3 right-3 p-2.5 rounded-full transition-all ${
                    post.hidden ? "bg-black/60 text-white" : "bg-primary text-black"
                  }`}
                  aria-label={post.hidden ? "Show post" : "Hide post"}
                >
                  {post.hidden ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
          </TabsContent>

          <TabsContent value="tracker">
            <p className="text-neutral-500 mb-6">
              Shared clock-in / clock-out — each finished task writes straight to Notion. You and Dominic see the same live log.
            </p>
            <iframe
              src="/time-tracker.html"
              title="Picco Task Clocker"
              className="w-full rounded-2xl border border-black/5 bg-white shadow-sm"
              style={{ height: "calc(100vh - 18rem)", minHeight: 640 }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
