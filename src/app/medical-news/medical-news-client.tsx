"use client";

import Link from "next/link";
import * as React from "react";
import { Container } from "@/components/container";
import type { StudyItem } from "@/lib/content-types";
import { useAdmin } from "@/lib/use-admin";
import { StudyModal } from "@/components/study-modal";

type LoadState =
  | { status: "loading" }
  | { status: "ready" }
  | { status: "error"; message: string };

export function MedicalNewsClient() {
  const admin = useAdmin();
  const isAdmin = admin.isAdmin;

  const [load, setLoad] = React.useState<LoadState>({ status: "loading" });
  const [items, setItems] = React.useState<StudyItem[]>([]);
  const [selectedItem, setSelectedItem] = React.useState<StudyItem | null>(null);

  const [title, setTitle] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [tags, setTags] = React.useState("");
  const [url, setUrl] = React.useState("");
  const [file, setFile] = React.useState<File | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const refresh = React.useCallback(async () => {
    try {
      setLoad({ status: "loading" });
      const res = await fetch("/api/medical-news", { cache: "no-store" });
      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || `Failed to load notes (${res.status})`);
      }
      const data = (await res.json()) as StudyItem[];
      setItems(Array.isArray(data) ? data : []);
      setLoad({ status: "ready" });
    } catch (e) {
      setLoad({ status: "error", message: e instanceof Error ? e.message : "Failed to load notes." });
    }
  }, []);

  React.useEffect(() => { void refresh(); }, [refresh]);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !notes.trim()) return;
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title", title.trim()); fd.append("notes", notes.trim());
      fd.append("tags", tags); fd.append("url", url.trim());
      if (file) fd.append("file", file);
      const res = await fetch("/api/medical-news", { method: "POST", body: fd });
      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || `Create failed (${res.status})`);
      }
      const payload = (await res.json()) as { item?: StudyItem };
      if (payload.item) setItems((prev) => [payload.item!, ...prev]);
      else await refresh();
      setTitle(""); setNotes(""); setTags(""); setUrl(""); setFile(null);
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
      const res = await fetch(`/api/medical-news?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || `Delete failed (${res.status})`);
      }
      setItems((prev) => prev.filter((s) => s.id !== id));
    } catch (e) {
      setLoad({ status: "error", message: e instanceof Error ? e.message : "Delete failed." });
    } finally {
      setDeletingId(null);
    }
  }

  const inputClass = "h-11 w-full rounded-xl border border-black/10 bg-white/80 px-3 text-sm shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 dark:border-white/15 dark:bg-zinc-950/60";

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────── */}
      <section className="border-b border-black/[0.05] bg-white/50 backdrop-blur-sm dark:border-white/[0.06] dark:bg-zinc-950/40">
        <Container className="py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <div className="space-y-5 animate-fade-up">
              <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/8 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-rose-700 dark:border-rose-400/20 dark:bg-rose-400/8 dark:text-rose-300">
                Medical News
              </div>
              <h1 className="font-display text-balance text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
                Latest Updates
              </h1>
              <p className="max-w-xl text-pretty text-lg leading-8 text-zinc-600 dark:text-zinc-300">
                Stay current with the latest developments in medical science and clinical practice.
              </p>
            </div>

            {isAdmin ? (
              <div className="animate-fade-up stagger-2 rounded-[2rem] border border-black/8 bg-white/80 p-8 shadow-sm backdrop-blur dark:border-white/10 dark:bg-zinc-950/60">
                <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Add Article</div>
                <form onSubmit={onCreate} className="mt-5 grid gap-4">
                  <div className="grid gap-1.5">
                    <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400" htmlFor="study-title">Title *</label>
                    <input id="study-title" value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} placeholder="Topic / headline" required />
                  </div>
                  <div className="grid gap-1.5">
                    <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400" htmlFor="study-notes">Notes *</label>
                    <textarea
                      id="study-notes" value={notes} onChange={(e) => setNotes(e.target.value)}
                      className="min-h-28 w-full rounded-xl border border-black/10 bg-white/80 px-3 py-2.5 text-sm shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 dark:border-white/15 dark:bg-zinc-950/60"
                      placeholder="Key points, summary, links, takeaways…"
                      required
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400" htmlFor="study-url">Link (optional)</label>
                    <input id="study-url" value={url} onChange={(e) => setUrl(e.target.value)} className={inputClass} placeholder="https://…" inputMode="url" />
                  </div>
                  <div className="grid gap-1.5">
                    <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400" htmlFor="study-file">Image (optional)</label>
                    <input
                      ref={fileInputRef} id="study-file" type="file" accept="image/*"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="block w-full rounded-xl border border-black/10 bg-white/80 px-3 py-2 text-sm shadow-sm file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-900 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-zinc-800 dark:border-white/15 dark:bg-zinc-950/60 dark:file:bg-zinc-100 dark:file:text-zinc-900"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={saving || !title.trim() || !notes.trim()}
                    className="inline-flex h-11 items-center justify-center rounded-xl bg-zinc-900 px-5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-zinc-800 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
                  >
                    {saving ? "Saving…" : "Add Article"}
                  </button>
                </form>
              </div>
            ) : (
              <div className="animate-fade-up stagger-2 rounded-[2rem] border border-black/8 bg-white/80 p-8 shadow-sm backdrop-blur dark:border-white/10 dark:bg-zinc-950/60">
                <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Related Resources</div>
                <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                  Explore the reading list and clinical case studies.
                </p>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  {[
                    { href: "/books", label: "📚 Books" },
                    { href: "/cases", label: "🔬 Cases" },
                    { href: "/usmle", label: "📝 USMLE" },
                    { href: "/videos", label: "🎥 Videos" },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center justify-center rounded-xl border border-black/8 bg-zinc-50 px-4 py-2.5 text-sm font-medium text-zinc-700 transition-all hover:border-black/15 hover:bg-white hover:shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* ── Articles Grid ─────────────────────────────── */}
      <section className="pb-20">
        <Container className="py-16">
          <div className="flex items-end justify-between gap-6 mb-8">
            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Articles</h2>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Click any card to read the full note.</p>
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
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-64 animate-pulse rounded-2xl border border-black/8 bg-white/60 shadow-sm dark:border-white/10 dark:bg-zinc-950/50" />
              ))}
            </div>
          )}

          {load.status !== "loading" && items.length === 0 && (
            <div className="rounded-[2rem] border border-black/8 bg-white/60 p-16 text-center shadow-sm dark:border-white/10 dark:bg-zinc-950/50">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-white/5">
                <svg className="h-7 w-7 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <div className="text-base font-semibold text-zinc-900 dark:text-zinc-50">No articles yet</div>
              <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
                {isAdmin ? "Add your first article using the form above." : "Check back soon."}
              </p>
            </div>
          )}

          {load.status !== "loading" && items.length > 0 && (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {items.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedItem(s)}
                  className="animate-fade-up group relative flex flex-col cursor-pointer rounded-[2rem] border border-black/8 bg-white p-0 shadow-sm text-left overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-zinc-950"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  {s.imageFileId ? (
                    <div className="aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                      <img
                        src={`/api/medical-news/image?id=${s.imageFileId}`}
                        alt={s.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video w-full flex items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-50 dark:from-zinc-800 dark:to-zinc-900">
                      <svg className="h-10 w-10 text-zinc-300 dark:text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                    </div>
                  )}

                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 leading-snug group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                        {s.title}
                      </h3>
                      {isAdmin && (
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); void onDelete(s.id); }}
                          disabled={deletingId === s.id}
                          className="shrink-0 rounded-lg border border-rose-500/20 bg-rose-50 px-2.5 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-100 disabled:opacity-60 dark:bg-rose-500/10 dark:text-rose-300 dark:hover:bg-rose-500/20"
                        >
                          {deletingId === s.id ? "…" : "Delete"}
                        </button>
                      )}
                    </div>
                    <div className="mt-auto pt-4 flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400">
                      Read note
                      <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {selectedItem && (
            <StudyModal item={selectedItem} onClose={() => setSelectedItem(null)} />
          )}
        </Container>
      </section>
    </div>
  );
}
