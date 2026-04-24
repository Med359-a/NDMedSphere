"use client";

import * as React from "react";
import { Container } from "@/components/container";
import type { BookItem } from "@/lib/content-types";
import { useAdmin } from "@/lib/use-admin";

type LoadState =
  | { status: "loading" }
  | { status: "ready" }
  | { status: "error"; message: string };

export function BooksClient() {
  const admin = useAdmin();
  const isAdmin = admin.isAdmin;

  const [load, setLoad] = React.useState<LoadState>({ status: "loading" });
  const [items, setItems] = React.useState<BookItem[]>([]);
  const [title, setTitle] = React.useState("");
  const [author, setAuthor] = React.useState("");
  const [url, setUrl] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [file, setFile] = React.useState<File | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const refresh = React.useCallback(async () => {
    try {
      setLoad({ status: "loading" });
      const res = await fetch("/api/books", { cache: "no-store" });
      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || `Failed to load books (${res.status})`);
      }
      const data = (await res.json()) as BookItem[];
      setItems(Array.isArray(data) ? data : []);
      setLoad({ status: "ready" });
    } catch (e) {
      setLoad({ status: "error", message: e instanceof Error ? e.message : "Failed to load books." });
    }
  }, []);

  React.useEffect(() => { void refresh(); }, [refresh]);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    try {
      let res: Response;
      if (file) {
        const fd = new FormData();
        fd.append("title", title.trim()); fd.append("author", author.trim());
        fd.append("url", url.trim()); fd.append("notes", notes.trim());
        fd.append("file", file);
        res = await fetch("/api/books", { method: "POST", body: fd });
      } else {
        res = await fetch("/api/books", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: title.trim(), author: author.trim(), url: url.trim(), notes: notes.trim() }),
        });
      }
      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || `Create failed (${res.status})`);
      }
      const payload = (await res.json()) as { item?: BookItem };
      if (payload.item) setItems((prev) => [payload.item!, ...prev]);
      else await refresh();
      setTitle(""); setAuthor(""); setUrl(""); setNotes(""); setFile(null);
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
      const res = await fetch(`/api/books?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || `Delete failed (${res.status})`);
      }
      setItems((prev) => prev.filter((b) => b.id !== id));
    } catch (e) {
      setLoad({ status: "error", message: e instanceof Error ? e.message : "Delete failed." });
    } finally {
      setDeletingId(null);
    }
  }

  const inputClass = "h-11 w-full rounded-xl border border-black/10 bg-white/80 px-3 text-sm shadow-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 dark:border-white/15 dark:bg-zinc-950/60";

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────── */}
      <section className="border-b border-black/[0.05] bg-white/50 backdrop-blur-sm dark:border-white/[0.06] dark:bg-zinc-950/40">
        <Container className="py-16 sm:py-20">
          <div className={`grid gap-10 ${isAdmin ? "lg:grid-cols-2 lg:items-start" : ""}`}>
            <div className="space-y-5 animate-fade-up">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/8 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-700 dark:border-amber-400/20 dark:bg-amber-400/8 dark:text-amber-300">
                Books
              </div>
              <h1 className="font-display text-balance text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
                Reading List
              </h1>
              <p className="max-w-xl text-pretty text-lg leading-8 text-zinc-600 dark:text-zinc-300">
                Browse recommended books and study notes. A curated selection of essential medical literature.
              </p>
            </div>

            {isAdmin && (
              <div className="animate-fade-up stagger-2 rounded-[2rem] border border-black/8 bg-white/80 p-8 shadow-sm backdrop-blur dark:border-white/10 dark:bg-zinc-950/60">
                <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Add Book</div>
                <form onSubmit={onCreate} className="mt-5 grid gap-4">
                  <div className="grid gap-1.5">
                    <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400" htmlFor="title">Title *</label>
                    <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} placeholder="Book title" required />
                  </div>
                  <div className="grid gap-1.5">
                    <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400" htmlFor="author">Author (optional)</label>
                    <input id="author" value={author} onChange={(e) => setAuthor(e.target.value)} className={inputClass} placeholder="Author" />
                  </div>
                  <div className="grid gap-1.5">
                    <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400" htmlFor="url">Link (optional)</label>
                    <input id="url" value={url} onChange={(e) => setUrl(e.target.value)} className={inputClass} placeholder="https://…" inputMode="url" />
                  </div>
                  <div className="grid gap-1.5">
                    <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400" htmlFor="notes">Notes (optional)</label>
                    <textarea
                      id="notes" value={notes} onChange={(e) => setNotes(e.target.value)}
                      className="min-h-24 w-full rounded-xl border border-black/10 bg-white/80 px-3 py-2.5 text-sm shadow-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 dark:border-white/15 dark:bg-zinc-950/60"
                      placeholder="Key takeaways, review notes…"
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400" htmlFor="file">Upload PDF (optional)</label>
                    <input
                      ref={fileInputRef} id="file" type="file" accept="application/pdf"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="block w-full rounded-xl border border-black/10 bg-white/80 px-3 py-2 text-sm shadow-sm file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-900 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-zinc-800 dark:border-white/15 dark:bg-zinc-950/60 dark:file:bg-zinc-100 dark:file:text-zinc-900"
                    />
                    {file && <div className="text-xs text-zinc-400">Selected: {file.name}</div>}
                  </div>
                  <button
                    type="submit"
                    disabled={saving || !title.trim()}
                    className="inline-flex h-11 items-center justify-center rounded-xl bg-zinc-900 px-5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-zinc-800 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
                  >
                    {saving ? "Saving…" : "Add Book"}
                  </button>
                </form>
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* ── List ─────────────────────────────────────── */}
      <section className="pb-20">
        <Container className="py-16">
          <div className="flex items-end justify-between gap-6 mb-8">
            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Books</h2>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Uploaded entries appear here.</p>
            </div>
            <button
              type="button"
              onClick={() => void refresh()}
              className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white/80 px-4 py-2 text-sm font-semibold text-zinc-700 shadow-sm backdrop-blur transition-all hover:bg-white hover:shadow-md dark:border-white/15 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>

          {load.status === "error" && (
            <div className="rounded-2xl border border-rose-500/20 bg-rose-50 px-5 py-4 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">
              {load.message}
            </div>
          )}

          {load.status === "loading" && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-48 animate-pulse rounded-2xl border border-black/8 bg-white/60 shadow-sm dark:border-white/10 dark:bg-zinc-950/50" />
              ))}
            </div>
          )}

          {load.status !== "loading" && items.length === 0 && (
            <div className="rounded-[2rem] border border-black/8 bg-white/60 p-16 text-center shadow-sm dark:border-white/10 dark:bg-zinc-950/50">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-white/5">
                <svg className="h-7 w-7 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="text-base font-semibold text-zinc-900 dark:text-zinc-50">No books yet</div>
              <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
                {isAdmin ? "Add your first book using the form above." : "Check back soon."}
              </p>
            </div>
          )}

          {load.status !== "loading" && items.length > 0 && (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {items.map((b, i) => (
                <div
                  key={b.id}
                  className="animate-fade-up group flex flex-col rounded-[2rem] border border-black/8 bg-white p-7 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg dark:border-white/10 dark:bg-zinc-950"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="flex items-start justify-between gap-4 flex-1">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 dark:bg-amber-400/10">
                          <svg className="h-4 w-4 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-semibold text-zinc-900 dark:text-zinc-50 leading-snug">{b.title}</div>
                          {b.author && (
                            <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{b.author}</div>
                          )}
                        </div>
                      </div>
                    </div>
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => void onDelete(b.id)}
                        disabled={deletingId === b.id}
                        className="shrink-0 rounded-lg border border-rose-500/20 bg-rose-50 px-2.5 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-100 disabled:opacity-60 dark:bg-rose-500/10 dark:text-rose-300 dark:hover:bg-rose-500/20"
                      >
                        {deletingId === b.id ? "…" : "Delete"}
                      </button>
                    )}
                  </div>

                  {b.notes && (
                    <p className="mt-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 border-t border-black/[0.05] pt-4 dark:border-white/[0.06]">
                      {b.notes}
                    </p>
                  )}

                  {(b.url || b.fileId) && (
                    <div className="mt-4 flex flex-wrap gap-3">
                      {b.url && (
                        <a
                          href={b.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 transition hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                        >
                          Open link
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                      {b.fileId && (
                        <a
                          href={`/api/books/download?id=${b.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-sky-600 transition hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300"
                        >
                          Download PDF
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}
