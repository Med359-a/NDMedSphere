"use client";

import Image from "next/image";
import * as React from "react";
import { Container } from "@/components/container";
import type { VideoItem } from "@/lib/video-types";
import { useAdmin } from "@/lib/use-admin";

type MediaFilter = "all" | "video" | "image";

type LoadState =
  | { status: "loading" }
  | { status: "ready" }
  | { status: "error"; message: string };

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"] as const;
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** index;
  return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
}

function getYoutubeId(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : "";
}

function isVideoLike(item: VideoItem) {
  return item.mediaType === "youtube" || item.mediaType === "video";
}

function getDisplayTitle(item: VideoItem) {
  return item.title || item.originalName || "Untitled media";
}

function MediaPreview({
  item,
  className,
  priority = false,
}: {
  item: VideoItem;
  className?: string;
  priority?: boolean;
}) {
  if (item.mediaType === "image") {
    return (
      <div className={`relative overflow-hidden bg-[#f4f8fd] dark:bg-[#0d1b30] ${className ?? ""}`}>
        <Image
          src={`/api/videos/stream?id=${encodeURIComponent(item.id)}`}
          alt={getDisplayTitle(item)}
          fill
          unoptimized
          priority={priority}
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
      </div>
    );
  }

  if (item.mediaType === "youtube") {
    return (
      <div className={`relative overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.35),transparent_45%),linear-gradient(135deg,#0b2c59,#104894)] ${className ?? ""}`}>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(3,7,18,0.35))]" />
        <div className="relative flex h-full flex-col justify-between p-5 text-white">
          <span className="inline-flex w-fit items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em]">
            YouTube
          </span>
          <div>
            <div className="max-w-[15rem] text-lg font-semibold leading-snug">
              {getDisplayTitle(item)}
            </div>
            <div className="mt-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#1666d1] shadow-lg">
              <svg className="ml-0.5 h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-zinc-950 ${className ?? ""}`}>
      <video
        className="h-full w-full object-cover"
        muted
        playsInline
        preload="metadata"
        src={`/api/videos/stream?id=${encodeURIComponent(item.id)}`}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/70 via-black/30 to-transparent px-4 pb-4 pt-10 text-white">
        <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em]">
          Video
        </span>
        {item.size ? (
          <span className="text-xs text-white/70">{formatBytes(item.size)}</span>
        ) : null}
      </div>
    </div>
  );
}

function MediaModal({
  item,
  onClose,
}: {
  item: VideoItem;
  onClose: () => void;
}) {
  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/78 p-4-sm" onClick={onClose}>
      <div
        className="relative max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/12 bg-white shadow-2xl dark:bg-slate-950"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-slate-950/75 text-white shadow-lg transition hover:bg-slate-900"
          aria-label="Close media"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <div className="grid max-h-[92vh] overflow-auto lg:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.8fr)]">
          <div className="relative min-h-[320px] bg-slate-950 lg:min-h-[620px]">
            {item.mediaType === "image" ? (
              <Image
                src={`/api/videos/stream?id=${encodeURIComponent(item.id)}`}
                alt={getDisplayTitle(item)}
                fill
                unoptimized
                sizes="100vw"
                className="object-contain"
              />
            ) : item.mediaType === "youtube" ? (
              <iframe
                className="h-full min-h-[320px] w-full lg:min-h-[620px]"
                src={`https://www.youtube.com/embed/${getYoutubeId(item.youtubeUrl ?? "")}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                className="h-full min-h-[320px] w-full bg-black object-contain lg:min-h-[620px]"
                controls
                autoPlay
                playsInline
                src={`/api/videos/stream?id=${encodeURIComponent(item.id)}`}
              />
            )}
          </div>

          <div className="flex flex-col gap-5 p-6 sm:p-8">
            <div className="space-y-3">
              <div className="inline-flex items-center rounded-full border border-[#1666d1]/20 bg-[#eff6ff] px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#1666d1] dark:border-sky-400/20 dark:bg-sky-400/10 dark:text-sky-300">
                {item.mediaType === "image" ? "Image" : "Video"}
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-[#0c2d6b] dark:text-white">
                {getDisplayTitle(item)}
              </h2>
              {item.description ? (
                <p className="text-sm leading-7 text-[#4a6180] dark:text-slate-300">
                  {item.description}
                </p>
              ) : (
                <p className="text-sm leading-7 text-[#7a90ab] dark:text-slate-400">
                  {item.mediaType === "image"
                    ? "This uploaded image opens in full view here."
                    : "Open the full media item to review the content comfortably."}
                </p>
              )}
            </div>

            <div className="grid gap-3 rounded-xl border border-[#dbe8f5] bg-[#f4f8fd] p-5 dark:border-white/10 dark:bg-[#0d1b30]">
              {item.originalName ? (
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#7a90ab] dark:text-[#7a90ab]">
                    File
                  </div>
                  <div className="mt-1 text-sm font-medium text-[#374c66] dark:text-slate-200">
                    {item.originalName}
                  </div>
                </div>
              ) : null}
              {item.size ? (
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#7a90ab] dark:text-[#7a90ab]">
                    Size
                  </div>
                  <div className="mt-1 text-sm font-medium text-[#374c66] dark:text-slate-200">
                    {formatBytes(item.size)}
                  </div>
                </div>
              ) : null}
              {item.youtubeUrl ? (
                <a
                  href={item.youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#1666d1] transition hover:text-blue-500 dark:text-sky-400"
                >
                  Open YouTube link
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h4m0 0v4m0-4L10 14" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 9v10h10" />
                  </svg>
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function VideosClient() {
  const admin = useAdmin();
  const isAdmin = admin.isAdmin;

  const [load, setLoad] = React.useState<LoadState>({ status: "loading" });
  const [items, setItems] = React.useState<VideoItem[]>([]);
  const [selectedItem, setSelectedItem] = React.useState<VideoItem | null>(null);

  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [youtubeUrl, setYoutubeUrl] = React.useState("");
  const [files, setFiles] = React.useState<File[]>([]);
  const [uploading, setUploading] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState<MediaFilter>("all");
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const refresh = React.useCallback(async () => {
    try {
      setLoad({ status: "loading" });
      const res = await fetch("/api/videos", { cache: "no-store" });
      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || `Failed to load media (${res.status})`);
      }
      const data = (await res.json()) as VideoItem[];
      setItems(Array.isArray(data) ? data : []);
      setLoad({ status: "ready" });
    } catch (error) {
      setLoad({
        status: "error",
        message: error instanceof Error ? error.message : "Failed to load media.",
      });
    }
  }, []);

  React.useEffect(() => {
    void refresh();
  }, [refresh]);

  async function onUpload(event: React.FormEvent) {
    event.preventDefault();
    if (files.length === 0 && !youtubeUrl.trim()) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("youtubeUrl", youtubeUrl.trim());
      for (const file of files) formData.append("files", file);

      const res = await fetch("/api/videos", { method: "POST", body: formData });
      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || `Upload failed (${res.status})`);
      }

      setTitle("");
      setDescription("");
      setYoutubeUrl("");
      setFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
      await refresh();
    } catch (error) {
      setLoad({
        status: "error",
        message: error instanceof Error ? error.message : "Upload failed.",
      });
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
      setItems((prev) => prev.filter((item) => item.id !== id));
      setSelectedItem((prev) => (prev?.id === id ? null : prev));
    } catch (error) {
      setLoad({
        status: "error",
        message: error instanceof Error ? error.message : "Delete failed.",
      });
    } finally {
      setDeletingId(null);
    }
  }

  const visibleItems = React.useMemo(() => {
    return items.filter((item) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "image" ? item.mediaType === "image" : isVideoLike(item));

      if (!matchesFilter) return false;
      if (!search.trim()) return true;

      const query = search.trim().toLowerCase();
      return [item.title, item.description, item.originalName]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(query));
    });
  }, [filter, items, search]);

  const allCount = items.length;
  const videoCount = items.filter(isVideoLike).length;
  const imageCount = items.filter((item) => item.mediaType === "image").length;

  const inputClass =
    "h-11 w-full rounded-xl border border-[#dbe8f5] bg-white px-3 text-sm shadow-sm outline-none transition focus:border-[#1666d1] focus:ring-4 focus:ring-[#1666d1]/12 dark:border-white/15 dark:bg-[#0f2040] dark:focus:border-sky-400";
  const textareaClass =
    "w-full rounded-xl border border-[#dbe8f5] bg-white px-3 py-2.5 text-sm shadow-sm outline-none transition focus:border-[#1666d1] focus:ring-4 focus:ring-[#1666d1]/12 dark:border-white/15 dark:bg-[#0f2040] dark:focus:border-sky-400";

  return (
    <div>
      <section className="border-b border-[#dbe8f5] bg-white dark:border-white/[0.06] dark:bg-[#070f1f]">
        <Container className="py-16 sm:py-20">
          <div className={`grid gap-10 ${isAdmin ? "lg:grid-cols-2 lg:items-start" : ""}`}>
            <div className="space-y-5 animate-fade-up">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#1666d1]/20 bg-[#eff6ff] px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#1666d1] dark:border-sky-400/20 dark:bg-sky-400/10 dark:text-sky-300">
                Medications
              </div>
              <h1 className="font-display text-balance text-4xl font-bold tracking-tight text-[#0c2d6b] dark:text-white sm:text-5xl">
                Media Library
              </h1>
              <p className="max-w-2xl text-pretty text-lg leading-8 text-[#4a6180] dark:text-slate-300">
                Videos, reference images, and clinical media — organized and searchable.
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: "all" as const, label: "All", count: allCount },
                  { key: "video" as const, label: "Videos", count: videoCount },
                  { key: "image" as const, label: "Images", count: imageCount },
                ].map((option) => (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => setFilter(option.key)}
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      filter === option.key
                        ? "border-[#1666d1] bg-[#1666d1] text-white" : "border-[#dbe8f5] bg-[#f4f8fd] text-[#374c66] hover:border-[#1666d1]/30 hover:text-[#1666d1] dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
                    }`}
                  >
                    <span>{option.label}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs ${filter === option.key ? "bg-white/20" : "bg-white/20 dark:bg-white/10"}`}>
                      {option.count}
                    </span>
                  </button>
                ))}
              </div>
              <div className="relative max-w-sm">
                <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7a90ab]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search medications media..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="h-10 w-full rounded-xl border border-[#dbe8f5] bg-white pl-9 pr-3 text-sm shadow-sm outline-none transition focus:border-[#1666d1] focus:ring-4 focus:ring-[#1666d1]/12 dark:border-white/15 dark:bg-[#0f2040]"
                />
              </div>
            </div>

            {isAdmin ? (
              <div className="animate-fade-up stagger-2 rounded-2xl border border-[#dbe8f5] bg-[#f4f8fd] p-7 shadow-sm dark:border-white/10 dark:bg-[#0d1b30]">
                <div className="text-sm font-semibold text-[#0c2d6b] dark:text-white">Upload media</div>
                <p className="mt-1.5 text-sm text-[#7a90ab] dark:text-slate-400">
                  Add a YouTube link, upload a video, or upload an image. Images will appear as clean image cards with a title and open in a full view.
                </p>
                <form onSubmit={onUpload} className="mt-5 grid gap-4">
                  <div className="grid gap-1.5">
                    <label className="text-xs font-semibold text-[#7a90ab] dark:text-slate-400" htmlFor="title">
                      Title (optional)
                    </label>
                    <input
                      id="title"
                      value={title}
                      onChange={(event) => setTitle(event.target.value)}
                      className={inputClass}
                      placeholder="e.g. Medication guide, dosage chart..."
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <label className="text-xs font-semibold text-[#7a90ab] dark:text-slate-400" htmlFor="description">
                      Description (optional)
                    </label>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(event) => setDescription(event.target.value)}
                      className={`${textareaClass} min-h-20`}
                      placeholder="Add context or notes for this item..."
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <label className="text-xs font-semibold text-[#7a90ab] dark:text-slate-400" htmlFor="youtubeUrl">
                      YouTube Link (optional)
                    </label>
                    <input
                      id="youtubeUrl"
                      value={youtubeUrl}
                      onChange={(event) => setYoutubeUrl(event.target.value)}
                      className={inputClass}
                      placeholder="https://www.youtube.com/watch?v=..."
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <label className="text-xs font-semibold text-[#7a90ab] dark:text-slate-400" htmlFor="files">
                      Images or video files
                    </label>
                    <input
                      ref={fileInputRef}
                      id="files"
                      type="file"
                      accept="video/*,image/*"
                      multiple
                      onChange={(event) => setFiles(Array.from(event.target.files ?? []))}
                      className="block w-full rounded-xl border border-[#dbe8f5] bg-white px-3 py-2 text-sm shadow-sm file:mr-3 file:rounded-lg file:border-0 file:bg-[#1666d1] file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-[#1255b8] dark:border-white/15 dark:bg-[#0f2040]"
                    />
                    {files.length > 0 ? (
                      <div className="rounded-xl bg-[#f4f8fd] px-4 py-3 text-sm dark:bg-white/5">
                        <div className="text-[10px] font-semibold uppercase tracking-wider text-[#7a90ab] dark:text-[#7a90ab]">
                          Selected
                        </div>
                        <ul className="mt-2 grid gap-1">
                          {files.map((file) => (
                            <li key={`${file.name}-${file.size}`} className="flex justify-between gap-4 text-[#374c66] dark:text-slate-200">
                              <span className="truncate text-xs">
                                {file.name} {file.type.startsWith("image/") ? "(image)" : "(video)"}
                              </span>
                              <span className="shrink-0 text-xs text-[#7a90ab]">{formatBytes(file.size)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>
                  <button
                    type="submit"
                    disabled={uploading || (files.length === 0 && !youtubeUrl.trim())}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition-all hover:from-sky-500 hover:to-blue-500 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {uploading ? "Uploading..." : "Upload media"}
                  </button>
                </form>
              </div>
            ) : null}
          </div>
        </Container>
      </section>

      <section className="bg-[#f4f8fd] pb-20 dark:bg-[#0d1b30]">
        <Container className="py-16">
          <div className="mb-8 flex items-end justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-[#0c2d6b] dark:text-white">
                Library
              </h2>
              <p className="mt-1 text-sm text-[#7a90ab] dark:text-slate-400">
                Filter the collection by format and open any item for a larger view.
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
            <div className="rounded-2xl border border-rose-500/20 bg-rose-50 px-5 py-4 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">
              {load.message}
            </div>
          ) : null}

          {load.status === "loading" ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eff6ff] dark:bg-sky-400/10">
                <svg className="h-7 w-7 text-[#7a90ab]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="text-base font-semibold text-[#0c2d6b] dark:text-white">
                No media yet
              </div>
              <p className="mt-1.5 text-sm text-[#7a90ab] dark:text-slate-400">
                {isAdmin ? "Upload your first item using the form above." : "Check back soon."}
              </p>
            </div>
          ) : null}

          {load.status !== "loading" && items.length > 0 && visibleItems.length === 0 ? (
            <div className="rounded-2xl border border-[#dbe8f5] bg-white p-16 text-center shadow-sm dark:border-white/10 dark:bg-[#0f2040]">
              <div className="text-base font-semibold text-[#0c2d6b] dark:text-white">
                No matching items
              </div>
              <p className="mt-1.5 text-sm text-[#7a90ab] dark:text-slate-400">
                Try another search or switch the media filter.
              </p>
            </div>
          ) : null}

          {load.status !== "loading" && visibleItems.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {visibleItems.map((item, index) => (
                <article
                  key={item.id}
                  className="animate-fade-up group overflow-hidden rounded-2xl border border-[#dbe8f5] bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-[#1666d1]/25 hover:shadow-[0_8px_32px_-8px_rgba(22,102,209,0.15)] dark:border-white/10 dark:bg-[#0f2040]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedItem(item)}
                    className="block w-full text-left"
                  >
                    <MediaPreview
                      item={item}
                      className={item.mediaType === "image" ? "aspect-[4/3]" : "aspect-[4/3]"}
                    />
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="truncate text-lg font-semibold text-[#0c2d6b] dark:text-white">
                            {getDisplayTitle(item)}
                          </div>
                          {item.mediaType !== "image" && item.description ? (
                            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#4a6180] dark:text-slate-300">
                              {item.description}
                            </p>
                          ) : null}
                          {item.mediaType === "image" ? (
                            <div className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#1666d1] dark:text-sky-400">
                              Open image
                            </div>
                          ) : (
                            <div className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#1666d1] dark:text-sky-400">
                              <span>Open media</span>
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <span className="shrink-0 rounded-full border border-[#dbe8f5] bg-[#f4f8fd] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#7a90ab] dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
                          {item.mediaType === "image" ? "Image" : "Video"}
                        </span>
                      </div>
                    </div>
                  </button>
                  {isAdmin ? (
                    <div className="border-t border-[#dbe8f5] px-5 py-4 dark:border-white/[0.06]">
                      <button
                        type="button"
                        onClick={() => void onDelete(item.id)}
                        disabled={deletingId === item.id}
                        className="rounded-xl border border-rose-500/20 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-100 disabled:opacity-60 dark:bg-rose-500/10 dark:text-rose-300 dark:hover:bg-rose-500/20"
                      >
                        {deletingId === item.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          ) : null}
        </Container>
      </section>

      {selectedItem ? <MediaModal item={selectedItem} onClose={() => setSelectedItem(null)} /> : null}
    </div>
  );
}
