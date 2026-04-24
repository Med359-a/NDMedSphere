"use client";

import * as React from "react";
import { Container } from "@/components/container";
import { BlogPostModal } from "@/components/blog-post-modal";
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
  const [selectedItem, setSelectedItem] = React.useState<BlogPostItem | null>(null);

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

  React.useEffect(() => {
    void refresh();
  }, [refresh]);

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

      setTitle("");
      setBody("");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (e) {
      setLoad({
        status: "error",
        message: e instanceof Error ? e.message : "Create failed.",
      });
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id: string) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/blog-posts?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || `Delete failed (${res.status})`);
      }
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (e) {
      setLoad({
        status: "error",
        message: e instanceof Error ? e.message : "Delete failed.",
      });
    } finally {
      setDeletingId(null);
    }
  }

  const inputClass =
    "h-11 w-full rounded-xl border border-black/10 bg-white/80 px-3 text-sm shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 dark:border-white/15 dark:bg-zinc-950/60";

  return (
    <div>
      <section className="border-b border-black/[0.05] bg-white/50 backdrop-blur-sm dark:border-white/[0.06] dark:bg-zinc-950/40">
        <Container className="py-16 sm:py-20">
          <div className={`grid gap-10 ${isAdmin ? "lg:grid-cols-2 lg:items-start" : ""}`}>
            <div className="space-y-5 animate-fade-up">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/8 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-blue-700 dark:border-blue-400/20 dark:bg-blue-400/8 dark:text-blue-300">
                {page.eyebrow}
              </div>
              <h1 className="font-display text-balance text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
                {page.title}
              </h1>
              <p className="max-w-2xl text-pretty text-lg leading-8 text-zinc-600 dark:text-zinc-300">
                {page.intro}
              </p>
            </div>

            {isAdmin ? (
              <div className="animate-fade-up stagger-2 rounded-[2rem] border border-black/8 bg-white/80 p-8 shadow-sm backdrop-blur dark:border-white/10 dark:bg-zinc-950/60">
                <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  Write blog post
                </div>
                <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
                  Add a title, full body, and an optional image for this page.
                </p>
                <form onSubmit={onCreate} className="mt-5 grid gap-4">
                  <div className="grid gap-1.5">
                    <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400" htmlFor="blog-title">
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
                    <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400" htmlFor="blog-body">
                      Body
                    </label>
                    <textarea
                      id="blog-body"
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      className="min-h-36 w-full rounded-xl border border-black/10 bg-white/80 px-3 py-2.5 text-sm shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 dark:border-white/15 dark:bg-zinc-950/60"
                      placeholder="Write the full blog post..."
                      required
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400" htmlFor="blog-image">
                      Image (optional)
                    </label>
                    <input
                      ref={fileInputRef}
                      id="blog-image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="block w-full rounded-xl border border-black/10 bg-white/80 px-3 py-2 text-sm shadow-sm file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-900 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-zinc-800 dark:border-white/15 dark:bg-zinc-950/60 dark:file:bg-zinc-100 dark:file:text-zinc-900"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={saving || !title.trim() || !body.trim()}
                    className="inline-flex h-11 items-center justify-center rounded-xl bg-zinc-900 px-5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-zinc-800 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
                  >
                    {saving ? "Saving…" : "Publish post"}
                  </button>
                </form>
              </div>
            ) : null}
          </div>
        </Container>
      </section>

      <section className="pb-20">
        <Container className="py-16">
          <div className="mb-8 flex items-end justify-between gap-6">
            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                Latest posts
              </h2>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Published entries for this page appear here.
              </p>
            </div>
            <button
              type="button"
              onClick={() => void refresh()}
              className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white/80 px-4 py-2 text-sm font-semibold text-zinc-700 shadow-sm backdrop-blur transition-all hover:bg-white hover:shadow-md dark:border-white/15 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10"
            >
              Refresh
            </button>
          </div>

          {load.status === "error" ? (
            <div className="rounded-2xl border border-rose-500/20 bg-rose-50 px-5 py-4 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">
              {load.message}
            </div>
          ) : null}

          {load.status === "loading" ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-72 animate-pulse rounded-2xl border border-black/8 bg-white/60 shadow-sm dark:border-white/10 dark:bg-zinc-950/50"
                />
              ))}
            </div>
          ) : null}

          {load.status !== "loading" && items.length === 0 ? (
            <div className="rounded-[2rem] border border-black/8 bg-white/60 p-16 text-center shadow-sm dark:border-white/10 dark:bg-zinc-950/50">
              <div className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                No posts yet
              </div>
              <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
                {isAdmin ? "Publish the first post using the form above." : "Check back soon."}
              </p>
            </div>
          ) : null}

          {load.status !== "loading" && items.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {items.map((item, index) => (
                <article
                  key={item.id}
                  className="animate-fade-up group overflow-hidden rounded-2xl border border-black/8 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg dark:border-white/10 dark:bg-zinc-950"
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedItem(item)}
                    className="block w-full text-left"
                  >
                    {item.imageFileId ? (
                      <div className="aspect-[4/3] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                        <img
                          src={`/api/blog-posts/image?id=${item.imageFileId}`}
                          alt={item.title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="flex aspect-[4/3] w-full items-center justify-center bg-gradient-to-br from-blue-50 to-slate-50 dark:from-blue-950/30 dark:to-zinc-900">
                        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-300">
                          {page.title}
                        </span>
                      </div>
                    )}
                    <div className="p-5">
                      <h3 className="line-clamp-2 text-lg font-semibold leading-snug text-zinc-900 transition-colors group-hover:text-blue-700 dark:text-zinc-50 dark:group-hover:text-blue-300">
                        {item.title}
                      </h3>
                      <p className="mt-2 line-clamp-4 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                        {item.body}
                      </p>
                      <div className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400">
                        <span>Open post</span>
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                    </div>
                  </button>
                  {isAdmin ? (
                    <div className="border-t border-black/[0.05] px-5 py-4 dark:border-white/[0.06]">
                      <button
                        type="button"
                        onClick={() => void onDelete(item.id)}
                        disabled={deletingId === item.id}
                        className="rounded-xl border border-rose-500/20 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-100 disabled:opacity-60 dark:bg-rose-500/10 dark:text-rose-300 dark:hover:bg-rose-500/20"
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

      {selectedItem ? (
        <BlogPostModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      ) : null}
    </div>
  );
}
