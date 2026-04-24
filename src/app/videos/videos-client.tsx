"use client";

import * as React from "react";
import { Container } from "@/components/container";
import type { VideoItem } from "@/lib/video-types";
import { useAdmin } from "@/lib/use-admin";

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"] as const;
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** i;
  return `${value.toFixed(value >= 10 || i === 0 ? 0 : 1)} ${units[i]}`;
}

function getYoutubeId(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : "";
}

type LoadState =
  | { status: "loading" }
  | { status: "ready" }
  | { status: "error"; message: string };

export function VideosClient() {
  const admin = useAdmin();
  const isAdmin = admin.isAdmin;

  const [load, setLoad] = React.useState<LoadState>({ status: "loading" });
  const [items, setItems] = React.useState<VideoItem[]>([]);

  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [youtubeUrl, setYoutubeUrl] = React.useState("");
  const [files, setFiles] = React.useState<File[]>([]);
  const [uploading, setUploading] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState("");
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const refresh = React.useCallback(async () => {
    try {
      setLoad({ status: "loading" });
      const res = await fetch("/api/videos", { cache: "no-store" });
      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || `Failed to load videos (${res.status})`);
      }
      const data = (await res.json()) as VideoItem[];
      setItems(Array.isArray(data) ? data : []);
      setLoad({ status: "ready" });
    } catch (e) {
      setLoad({ status: "error", message: e instanceof Error ? e.message : "Failed to load videos." });
    }
  }, []);

  React.useEffect(() => { void refresh(); }, [refresh]);

  async function onUpload(e: React.FormEvent) {
    e.preventDefault();
    if (files.length === 0 && !youtubeUrl) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("title", title);
      fd.append("description", description);
      fd.append("youtubeUrl", youtubeUrl);
      for (const f of files) fd.append("files", f);
      const res = await fetch("/api/videos", { method: "POST", body: fd });
      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || `Upload failed (${res.status})`);
      }
      setTitle(""); setDescription(""); setYoutubeUrl(""); setFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
      await refresh();
    } catch (e) {
      setLoad({ status: "error", message: e instanceof Error ? e.message : "Upload failed." });
    } finally {
      setUploading(false);
    }
  }

  async function onDelete(id: string) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/videos?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || `Delete failed (${res.status})`);
      }
      setItems((prev) => prev.filter((v) => v.id !== id));
    } catch (e) {
      setLoad({ status: "error", message: e instanceof Error ? e.message : "Delete failed." });
    } finally {
      setDeletingId(null);
    }
  }

  const inputClass = "h-11 w-full rounded-xl border border-black/10 bg-white/80 px-3 text-sm shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 dark:border-white/15 dark:bg-zinc-950/60 dark:focus:border-blue-400";
  const textareaClass = "w-full rounded-xl border border-black/10 bg-white/80 px-3 py-2.5 text-sm shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 dark:border-white/15 dark:bg-zinc-950/60 dark:focus:border-blue-400";

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────── */}
      <section className="border-b border-black/[0.05] bg-white/50 backdrop-blur-sm dark:border-white/[0.06] dark:bg-zinc-950/40">
        <Container className="py-16 sm:py-20">
          <div className={`grid gap-10 ${isAdmin ? "lg:grid-cols-2 lg:items-start" : ""}`}>
            <div className="space-y-5 animate-fade-up">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/8 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-sky-700 dark:border-sky-400/20 dark:bg-sky-400/8 dark:text-sky-300">
                Videos
              </div>
              <h1 className="font-display text-balance text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
                {isAdmin ? "Videos of my work" : "Video Gallery"}
              </h1>
              <p className="max-w-xl text-pretty text-lg leading-8 text-zinc-600 dark:text-zinc-300">
                {isAdmin ? "Procedure demos, case walkthroughs, or educational clips." : "Browse our collection of medical procedure demonstrations and educational videos."}
              </p>
              <div className="relative max-w-sm">
                <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search videos…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-10 w-full rounded-xl border border-black/10 bg-white/80 pl-9 pr-3 text-sm shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 dark:border-white/15 dark:bg-zinc-950/60"
                />
              </div>
            </div>

            {isAdmin && (
              <div className="animate-fade-up stagger-2 rounded-[2rem] border border-black/8 bg-white/80 p-8 shadow-sm backdrop-blur dark:border-white/10 dark:bg-zinc-950/60">
                <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Upload Video</div>
                <form onSubmit={onUpload} className="mt-5 grid gap-4">
                  <div className="grid gap-1.5">
                    <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400" htmlFor="title">Title (optional)</label>
                    <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} placeholder="e.g. Suturing demo, Case review…" />
                  </div>
                  <div className="grid gap-1.5">
                    <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400" htmlFor="description">Description (optional)</label>
                    <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className={`${textareaClass} min-h-20`} placeholder="Add context, goals, or learning objectives…" />
                  </div>
                  <div className="grid gap-1.5">
                    <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400" htmlFor="youtubeUrl">YouTube Link (optional)</label>
                    <input id="youtubeUrl" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} className={inputClass} placeholder="https://www.youtube.com/watch?v=..." />
                  </div>
                  <div className="grid gap-1.5">
                    <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400" htmlFor="files">Video file(s)</label>
                    <input
                      ref={fileInputRef} id="files" type="file" accept="video/*" multiple
                      onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
                      className="block w-full rounded-xl border border-black/10 bg-white/80 px-3 py-2 text-sm shadow-sm file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-900 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-zinc-800 dark:border-white/15 dark:bg-zinc-950/60 dark:file:bg-zinc-100 dark:file:text-zinc-900"
                    />
                    {files.length > 0 && (
                      <div className="rounded-xl bg-zinc-50 px-4 py-3 text-sm dark:bg-white/5">
                        <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Selected</div>
                        <ul className="mt-2 grid gap-1">
                          {files.map((f) => (
                            <li key={`${f.name}-${f.size}`} className="flex justify-between gap-4 text-zinc-700 dark:text-zinc-200">
                              <span className="truncate text-xs">{f.name}</span>
                              <span className="shrink-0 text-xs text-zinc-400">{formatBytes(f.size)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={uploading || (files.length === 0 && !youtubeUrl)}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition-all hover:from-sky-500 hover:to-blue-500 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {uploading ? "Uploading…" : "Upload video(s)"}
                  </button>
                </form>
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* ── Gallery ───────────────────────────────────── */}
      <section className="pb-20">
        <Container className="py-16">
          <div className="flex items-end justify-between gap-6 mb-8">
            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Gallery</h2>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Uploaded videos appear here automatically.</p>
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
                <div key={i} className="h-72 animate-pulse rounded-2xl border border-black/8 bg-white/60 shadow-sm dark:border-white/10 dark:bg-zinc-950/50" />
              ))}
            </div>
          )}

          {load.status !== "loading" && items.length === 0 && (
            <div className="rounded-[2rem] border border-black/8 bg-white/60 p-16 text-center shadow-sm dark:border-white/10 dark:bg-zinc-950/50">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-white/5">
                <svg className="h-7 w-7 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="text-base font-semibold text-zinc-900 dark:text-zinc-50">No videos yet</div>
              <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
                {isAdmin ? "Upload your first video using the form above." : "Check back soon."}
              </p>
            </div>
          )}

          {load.status !== "loading" && items.length > 0 && (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {items
                .filter((v) => {
                  if (!search) return true;
                  const q = search.toLowerCase();
                  return v.title.toLowerCase().includes(q) || v.originalName?.toLowerCase().includes(q);
                })
                .map((v, i) => (
                  <div
                    key={v.id}
                    className="animate-fade-up group overflow-hidden rounded-2xl border border-black/8 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg dark:border-white/10 dark:bg-zinc-950"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <div className="bg-zinc-950">
                      {v.youtubeUrl ? (
                        <iframe
                          className="h-52 w-full"
                          src={`https://www.youtube.com/embed/${getYoutubeId(v.youtubeUrl)}`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <video
                          className="h-52 w-full object-cover"
                          controls
                          preload="metadata"
                          src={`/api/videos/stream?id=${encodeURIComponent(v.id)}`}
                        />
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="truncate font-semibold text-zinc-900 dark:text-zinc-50">
                            {v.title || v.originalName}
                          </div>
                          {v.size && (
                            <div className="mt-0.5 text-xs text-zinc-400 dark:text-zinc-500">
                              {formatBytes(v.size)}
                            </div>
                          )}
                        </div>
                        {isAdmin && (
                          <button
                            type="button"
                            onClick={() => void onDelete(v.id)}
                            disabled={deletingId === v.id}
                            className="shrink-0 rounded-lg border border-rose-500/20 bg-rose-50 px-2.5 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-100 disabled:opacity-60 dark:bg-rose-500/10 dark:text-rose-300 dark:hover:bg-rose-500/20"
                          >
                            {deletingId === v.id ? "…" : "Delete"}
                          </button>
                        )}
                      </div>
                      {v.description && (
                        <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 line-clamp-2">
                          {v.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}
