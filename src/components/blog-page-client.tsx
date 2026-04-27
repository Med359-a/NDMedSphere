"use client";

import * as React from "react";
import Link from "next/link";
import { Container } from "@/components/container";
import type { BlogPostItem } from "@/lib/content-types";
import type { BlogPageConfig } from "@/lib/site-sections";
import { useAdmin } from "@/lib/use-admin";

type LoadState =
  | { status: "loading" }
  | { status: "ready" }
  | { status: "error"; message: string };

export function BlogPageClient({ page }: { page: BlogPageConfig }) {
  const admin = useAdmin();
  const isAdmin = admin.isAdmin;

  const [load, setLoad] = React.useState<LoadState>({ status: "loading" });
  const [items, setItems] = React.useState<BlogPostItem[]>([]);

  const [title, setTitle] = React.useState("");
  const [body, setBody] = React.useState("");
  const [file, setFile] = React.useState<File | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const refresh = React.useCallback(async () => {
    try {
      setLoad({ status: "loading" });
      const res = await fetch(`/api/blog-posts?page=${encodeURIComponent(page.slug)}`, {
        cache: "no-store",
      });
      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || `Failed to load posts (${res.status})`);
      }
      const data = (await res.json()) as BlogPostItem[];
      setItems(Array.isArray(data) ? data : []);
      setLoad({ status: "ready" });
    } catch (e) {
      setLoad({
        status: "error",
        message: e instanceof Error ? e.message : "Failed to load posts.",
      });
    }
  }, [page.slug]);

  React.useEffect(() => { void refresh(); }, [refresh]);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title", title.trim());
      fd.append("body", body.trim());
      fd.append("pageSlug", page.slug);
      fd.append("pageGroup", page.group);
      if (file) fd.append("file", file);

      const res = await fetch("/api/blog-posts", { method: "POST", body: fd });
      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || `Create failed (${res.status})`);
      }

      const payload = (await res.json()) as { item?: BlogPostItem };
      if (payload.item) setItems((prev) => [payload.item as BlogPostItem, ...prev]);
      else await refresh();

      setTitle(""); setBody(""); setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (e) {
      setLoad({ status: "error", message: e instanceof Error ? e.message : "Create failed." });
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id: string) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/blog-posts?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || `Delete failed (${res.status})`);
      }
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (e) {
      setLoad({ status: "error", message: e instanceof Error ? e.message : "Delete failed." });
    } finally {
      setDeletingId(null);
    }
  }

  const inputClass =
    "h-11 w-full rounded-xl border border-[#dbe8f5] bg-white px-3 text-sm shadow-sm outline-none transition focus:border-[#1666d1] focus:ring-4 focus:ring-[#1666d1]/12 dark:border-white/15 dark:bg-[#0f2040] dark:focus:border-sky-400";

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────── */}
      <section className="border-b border-[#dbe8f5] bg-white dark:border-white/[0.06] dark:bg-[#070f1f]">
        <Container className="py-16 sm:py-20">
          <div className={`grid gap-10 ${isAdmin ? "lg:grid-cols-2 lg:items-start" : ""}`}>
            <div className="space-y-5 animate-fade-up">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#1666d1]/20 bg-[#eff6ff] px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#1666d1] dark:border-sky-400/20 dark:bg-sky-400/10 dark:text-sky-300">
                {page.eyebrow}
              </div>
              <h1 className="font-display text-balance text-4xl font-bold tracking-tight text-[#0c2d6b] dark:text-white sm:text-5xl">
                {page.title}
              </h1>
              <p className="max-w-2xl text-pretty text-lg leading-8 text-[#4a6180] dark:text-slate-300">
                {page.intro}
              </p>
            </div>

            {isAdmin ? (
              <div className="animate-fade-up stagger-2 rounded-2xl border border-[#dbe8f5] bg-[#f4f8fd] p-7 shadow-sm dark:border-white/10 dark:bg-[#0d1b30]">
                <div className="text-sm font-bold text-[#0c2d6b] dark:text-white">Write blog post</div>
                <p className="mt-1.5 text-sm text-[#7a90ab] dark:text-slate-400">
                  Add a title, full body, and an optional image for this page.
                </p>
                <form onSubmit={onCreate} className="mt-5 grid gap-4">
                  <div className="grid gap-1.5">
                    <label className="text-xs font-semibold text-[#4a6180] dark:text-slate-400" htmlFor="blog-title">
                      Title
                    </label>
                    <input
                      id="blog-title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className={inputClass}
                      placeholder="Blog post title"
                      required
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <label className="text-xs font-semibold text-[#4a6180] dark:text-slate-400" htmlFor="blog-body">
                      Body
                    </label>
                    <textarea
                      id="blog-body"
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      className="min-h-36 w-full rounded-xl border border-[#dbe8f5] bg-white px-3 py-2.5 text-sm shadow-sm outline-none transition focus:border-[#1666d1] focus:ring-4 focus:ring-[#1666d1]/12 dark:border-white/15 dark:bg-[#0f2040]"
                      placeholder="Write the full blog post..."
                      required
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <label className="text-xs font-semibold text-[#4a6180] dark:text-slate-400" htmlFor="blog-image">
                      Image (optional)
                    </label>
                    <input
                      ref={fileInputRef}
                      id="blog-image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="block w-full rounded-xl border border-[#dbe8f5] bg-white px-3 py-2 text-sm shadow-sm file:mr-3 file:rounded-lg file:border-0 file:bg-[#1666d1] file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-[#1255b8] dark:border-white/15 dark:bg-[#0f2040]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={saving || !title.trim() || !body.trim()}
                    className="inline-flex h-11 items-center justify-center rounded-xl bg-[#1666d1] px-5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#1255b8] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? "Saving…" : "Publish post"}
                  </button>
                </form>
              </div>
            ) : null}
          </div>
        </Container>
      </section>

      {/* ── Posts Grid ───────────────────────────────── */}
      <section className="bg-[#f4f8fd] pb-20 dark:bg-[#0d1b30]">
        <Container className="py-16">
          <div className="mb-8 flex items-end justify-between gap-6 animate-fade-up">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#1666d1] dark:text-sky-400">
                {page.eyebrow}
              </div>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#0c2d6b] dark:text-white">
                Latest posts
              </h2>
              <p className="mt-1 text-sm text-[#7a90ab] dark:text-slate-400">
                Published entries for this page appear here.
              </p>
            </div>
            <button
              type="button"
              onClick={() => void refresh()}
              className="inline-flex items-center gap-2 rounded-xl border border-[#dbe8f5] bg-white px-4 py-2 text-sm font-semibold text-[#374c66] shadow-sm transition-all hover:border-[#1666d1]/30 hover:text-[#1666d1] dark:border-white/15 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>

          {load.status === "error" ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300">
              {load.message}
            </div>
          ) : null}

          {load.status === "loading" ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-72 animate-pulse rounded-2xl border border-[#dbe8f5] bg-white dark:border-white/10 dark:bg-[#0f2040]"
                />
              ))}
            </div>
          ) : null}

          {load.status !== "loading" && items.length === 0 ? (
            <div className="rounded-2xl border border-[#dbe8f5] bg-white p-16 text-center shadow-sm dark:border-white/10 dark:bg-[#0f2040]">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#eff6ff] dark:bg-sky-400/10">
                <svg className="h-6 w-6 text-[#1666d1] dark:text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <div className="text-base font-semibold text-[#0c2d6b] dark:text-white">No posts yet</div>
              <p className="mt-1.5 text-sm text-[#7a90ab] dark:text-slate-400">
                {isAdmin ? "Publish the first post using the form above." : "Check back soon."}
              </p>
            </div>
          ) : null}

          {load.status !== "loading" && items.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {items.map((item, index) => (
                <article
                  key={item.id}
                  className="animate-fade-up group overflow-hidden rounded-2xl border border-[#dbe8f5] bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-[#1666d1]/25 hover:shadow-[0_8px_32px_-8px_rgba(22,102,209,0.15)] dark:border-white/10 dark:bg-[#0f2040]"
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  <Link href={`/posts/${item.id}`} className="block">
                    {item.imageFileId ? (
                      <div className="aspect-[16/9] w-full overflow-hidden bg-[#f4f8fd] dark:bg-[#0d1b30]">
                        <img
                          src={`/api/blog-posts/image?id=${item.imageFileId}`}
                          alt={item.title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="flex aspect-[16/9] w-full items-center justify-center bg-gradient-to-br from-[#eff6ff] to-[#f4f8fd] dark:from-sky-900/30 dark:to-[#0d1b30]">
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#1666d1] dark:text-sky-400">
                          {page.title}
                        </span>
                      </div>
                    )}
                    <div className="p-5">
                      <h3 className="line-clamp-2 text-base font-semibold leading-snug text-[#0c2d6b] transition-colors group-hover:text-[#1666d1] dark:text-white dark:group-hover:text-sky-300">
                        {item.title}
                      </h3>
                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#4a6180] dark:text-slate-300">
                        {item.body}
                      </p>
                      <div className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-[#1666d1] dark:text-sky-400">
                        <span>Read more</span>
                        <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                  {isAdmin ? (
                    <div className="border-t border-[#dbe8f5] px-5 py-3 dark:border-white/[0.06]">
                      <button
                        type="button"
                        onClick={() => void onDelete(item.id)}
                        disabled={deletingId === item.id}
                        className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-100 disabled:opacity-60 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300 dark:hover:bg-rose-500/20"
                      >
                        {deletingId === item.id ? "Deleting…" : "Delete"}
                      </button>
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          ) : null}
        </Container>
      </section>

    </div>
  );
}
