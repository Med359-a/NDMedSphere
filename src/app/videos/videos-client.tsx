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

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
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
  const [files, setFiles] = React.useState<File[]>([]);
  const [uploading, setUploading] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
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
      setLoad({
        status: "error",
        message: e instanceof Error ? e.message : "Failed to load videos.",
      });
    }
  }, []);

  React.useEffect(() => {
    void refresh();
  }, [refresh]);

  async function onUpload(e: React.FormEvent) {
    e.preventDefault();
    if (files.length === 0) return;

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("title", title);
      fd.append("description", description);
      for (const f of files) fd.append("files", f);

      const res = await fetch("/api/videos", { method: "POST", body: fd });
      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || `Upload failed (${res.status})`);
      }

      setTitle("");
      setDescription("");
      setFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
      await refresh();
    } catch (e) {
      setLoad({
        status: "error",
        message: e instanceof Error ? e.message : "Upload failed.",
      });
    } finally {
      setUploading(false);
    }
  }

  async function onDelete(id: string) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/videos?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || `Delete failed (${res.status})`);
      }
      setItems((prev) => prev.filter((v) => v.id !== id));
    } catch (e) {
      setLoad({
        status: "error",
        message: e instanceof Error ? e.message : "Delete failed.",
      });
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <section className="border-b border-black/5 bg-white/50 backdrop-blur dark:border-white/10 dark:bg-zinc-950/40">
        <Container className="py-14 sm:py-18">
          <div className={`grid gap-8 ${isAdmin ? "lg:grid-cols-2 lg:items-end" : ""}`}>
            <div className="space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Videos
              </div>
              <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
                {isAdmin ? "Upload videos of your work" : "Video gallery"}
              </h1>
              <p className="max-w-xl text-pretty text-lg leading-8 text-zinc-700 dark:text-zinc-200">
                {isAdmin ? (
                  <>
                    Add procedure demos, case walkthroughs, or educational clips. Videos are
                    saved locally to <code>public/uploads/videos</code> and tracked in{" "}
                    <code>data/videos.json</code>.
                  </>
                ) : (
                  <>Browse uploaded videos. Uploading and deletion are admin-only.</>
                )}
              </p>
            </div>

            {isAdmin ? (
              <div className="rounded-[2rem] border border-black/10 bg-white/60 p-8 shadow-sm backdrop-blur dark:border-white/15 dark:bg-zinc-950/50">
                <div className="text-sm font-semibold">Upload</div>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                  Tip: keep videos short and remove any patient-identifying information.
                </p>

                <form onSubmit={onUpload} className="mt-6 grid gap-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium" htmlFor="title">
                      Title (optional)
                    </label>
                    <input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="h-11 rounded-xl border border-black/10 bg-white/70 px-3 text-sm shadow-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 dark:border-white/15 dark:bg-zinc-950/40"
                      placeholder="e.g. Suturing demo, Case review, Education clip…"
                    />
                  </div>

                  <div className="grid gap-2">
                    <label className="text-sm font-medium" htmlFor="description">
                      Description (optional)
                    </label>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="min-h-24 rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-sm shadow-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 dark:border-white/15 dark:bg-zinc-950/40"
                      placeholder="Add context, goals, or what viewers should learn…"
                    />
                  </div>

                  <div className="grid gap-2">
                    <label className="text-sm font-medium" htmlFor="files">
                      Video file(s)
                    </label>
                    <input
                      ref={fileInputRef}
                      id="files"
                      type="file"
                      accept="video/*"
                      multiple
                      onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
                      className="block w-full rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-sm shadow-sm file:mr-4 file:rounded-lg file:border-0 file:bg-zinc-900 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-zinc-800 dark:border-white/15 dark:bg-zinc-950/40 dark:file:bg-white dark:file:text-zinc-900 dark:hover:file:bg-zinc-100"
                    />

                    {files.length ? (
                      <div className="rounded-xl bg-zinc-900/5 px-4 py-3 text-sm text-zinc-700 dark:bg-white/10 dark:text-zinc-200">
                        <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                          Selected
                        </div>
                        <ul className="mt-2 grid gap-1">
                          {files.map((f) => (
                            <li
                              key={`${f.name}-${f.size}`}
                              className="flex justify-between gap-4"
                            >
                              <span className="truncate">{f.name}</span>
                              <span className="shrink-0 text-zinc-500 dark:text-zinc-400">
                                {formatBytes(f.size)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>

                  <button
                    type="submit"
                    disabled={uploading || files.length === 0}
                    className="inline-flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-sky-600 to-emerald-600 px-5 text-sm font-semibold text-white shadow-sm shadow-emerald-500/20 transition disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {uploading ? "Uploading…" : "Upload video(s)"}
                  </button>
                </form>
              </div>
            ) : null}
          </div>
        </Container>
      </section>

      <section className="pb-20">
        <Container className="py-16">
          <div className="flex items-end justify-between gap-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight">Gallery</h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-300">
                Uploaded videos appear here automatically.
              </p>
            </div>
            <button
              type="button"
              onClick={() => void refresh()}
              className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white/60 px-4 py-2 text-sm font-semibold text-zinc-900 shadow-sm backdrop-blur transition hover:bg-white dark:border-white/15 dark:bg-zinc-950/50 dark:text-zinc-50 dark:hover:bg-zinc-950"
            >
              Refresh
            </button>
          </div>

          {load.status === "error" ? (
            <div className="mt-6 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-5 py-4 text-sm text-rose-800 dark:text-rose-200">
              {load.message}
            </div>
          ) : null}

          {load.status === "loading" ? (
            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-72 animate-pulse rounded-2xl border border-black/10 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-white/15 dark:bg-zinc-950/50"
                />
              ))}
            </div>
          ) : null}

          {load.status !== "loading" && items.length === 0 ? (
            <div className="mt-10 rounded-[2rem] border border-black/10 bg-white/60 p-10 text-center shadow-sm backdrop-blur dark:border-white/15 dark:bg-zinc-950/50">
              <div className="text-lg font-semibold">No videos yet</div>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                Upload your first work video using the form above.
              </p>
            </div>
          ) : null}

          {load.status !== "loading" && items.length ? (
            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {items.map((v) => (
                <div
                  key={v.id}
                  className="overflow-hidden rounded-2xl border border-black/10 bg-white/60 shadow-sm backdrop-blur dark:border-white/15 dark:bg-zinc-950/50"
                >
                  <div className="bg-black">
                    <video
                      className="h-56 w-full object-cover"
                      controls
                      preload="metadata"
                      src={`/uploads/videos/${v.filename}`}
                    />
                  </div>
                  <div className="space-y-2 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold">
                          {v.title || v.originalName}
                        </div>
                        <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                          {formatDate(v.createdAt)} • {formatBytes(v.size)}
                        </div>
                      </div>
                      {isAdmin ? (
                        <button
                          type="button"
                          onClick={() => void onDelete(v.id)}
                          disabled={deletingId === v.id}
                          className="shrink-0 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-500/15 disabled:cursor-not-allowed disabled:opacity-70 dark:text-rose-200"
                        >
                          {deletingId === v.id ? "Deleting…" : "Delete"}
                        </button>
                      ) : null}
                    </div>

                    {v.description ? (
                      <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                        {v.description}
                      </p>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </Container>
      </section>
    </div>
  );
}


