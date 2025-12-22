"use client";

import * as React from "react";
import { Container } from "@/components/container";
import type { BookItem } from "@/lib/content-types";
import { useAdmin } from "@/lib/use-admin";

type LoadState =
  | { status: "loading" }
  | { status: "ready" }
  | { status: "error"; message: string };

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
}

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
      setLoad({
        status: "error",
        message: e instanceof Error ? e.message : "Failed to load books.",
      });
    }
  }, []);

  React.useEffect(() => {
    void refresh();
  }, [refresh]);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    setSaving(true);
    try {
      let res: Response;

      if (file) {
        const fd = new FormData();
        fd.append("title", title.trim());
        fd.append("author", author.trim());
        fd.append("url", url.trim());
        fd.append("notes", notes.trim());
        fd.append("file", file);

        res = await fetch("/api/books", { method: "POST", body: fd });
      } else {
        res = await fetch("/api/books", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: title.trim(),
            author: author.trim(),
            url: url.trim(),
            notes: notes.trim(),
          }),
        });
      }

      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || `Create failed (${res.status})`);
      }

      const payload = (await res.json()) as { item?: BookItem };
      const created = payload.item;
      if (created) {
        setItems((prev) => [created, ...prev]);
      } else {
        await refresh();
      }

      setTitle("");
      setAuthor("");
      setUrl("");
      setNotes("");
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
      const res = await fetch(`/api/books?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || `Delete failed (${res.status})`);
      }
      setItems((prev) => prev.filter((b) => b.id !== id));
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
                Books
              </div>
              <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
                Reading list
              </h1>
              <p className="max-w-2xl text-pretty text-lg leading-8 text-zinc-700 dark:text-zinc-200">
                Browse recommended books and study notes. Editing is admin-only.
              </p>
            </div>

            {isAdmin ? (
              <div className="rounded-[2rem] border border-black/10 bg-white/60 p-8 shadow-sm backdrop-blur dark:border-white/15 dark:bg-zinc-950/50">
                <div className="text-sm font-semibold">Add book</div>
                <form onSubmit={onCreate} className="mt-6 grid gap-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium" htmlFor="title">
                      Title
                    </label>
                    <input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="h-11 rounded-xl border border-black/10 bg-white/70 px-3 text-sm shadow-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 dark:border-white/15 dark:bg-zinc-950/40"
                      placeholder="Book title"
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <label className="text-sm font-medium" htmlFor="author">
                      Author (optional)
                    </label>
                    <input
                      id="author"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className="h-11 rounded-xl border border-black/10 bg-white/70 px-3 text-sm shadow-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 dark:border-white/15 dark:bg-zinc-950/40"
                      placeholder="Author"
                    />
                  </div>

                  <div className="grid gap-2">
                    <label className="text-sm font-medium" htmlFor="url">
                      Link (optional)
                    </label>
                    <input
                      id="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="h-11 rounded-xl border border-black/10 bg-white/70 px-3 text-sm shadow-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 dark:border-white/15 dark:bg-zinc-950/40"
                      placeholder="https://..."
                      inputMode="url"
                    />
                  </div>

                  <div className="grid gap-2">
                    <label className="text-sm font-medium" htmlFor="notes">
                      Notes (optional)
                    </label>
                    <textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="min-h-24 rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-sm shadow-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 dark:border-white/15 dark:bg-zinc-950/40"
                      placeholder="Short notes, key takeaways..."
                    />
                  </div>

                  <div className="grid gap-2">
                    <label className="text-sm font-medium" htmlFor="file">
                      Upload PDF (optional)
                    </label>
                    <input
                      ref={fileInputRef}
                      id="file"
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="block w-full rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-sm shadow-sm file:mr-4 file:rounded-lg file:border-0 file:bg-zinc-900 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-zinc-800 dark:border-white/15 dark:bg-zinc-950/40 dark:file:bg-white dark:file:text-zinc-900 dark:hover:file:bg-zinc-100"
                    />
                    {file ? (
                      <div className="text-xs text-zinc-500 dark:text-zinc-400">
                        Selected: {file.name}
                      </div>
                    ) : null}
                  </div>

                  <button
                    type="submit"
                    disabled={saving || !title.trim()}
                    className="inline-flex h-11 items-center justify-center rounded-xl bg-zinc-900 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
                  >
                    {saving ? "Saving…" : "Add"}
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
              <h2 className="text-2xl font-semibold tracking-tight">Books</h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-300">
                Uploaded entries appear here.
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
                  className="h-48 animate-pulse rounded-2xl border border-black/10 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-white/15 dark:bg-zinc-950/50"
                />
              ))}
            </div>
          ) : null}

          {load.status !== "loading" && items.length === 0 ? (
            <div className="mt-10 rounded-[2rem] border border-black/10 bg-white/60 p-10 text-center shadow-sm backdrop-blur dark:border-white/15 dark:bg-zinc-950/50">
              <div className="text-lg font-semibold">No books yet</div>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                {isAdmin ? "Add your first book using the form above." : "Check back soon."}
              </p>
            </div>
          ) : null}

          {load.status !== "loading" && items.length ? (
            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {items.map((b) => (
                <div
                  key={b.id}
                  className="rounded-[2rem] border border-black/10 bg-white/60 p-8 shadow-sm backdrop-blur dark:border-white/15 dark:bg-zinc-950/50"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="truncate text-lg font-semibold">{b.title}</div>
                      <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                        {b.author ? `${b.author} • ` : ""}
                        {formatDate(b.createdAt)}
                      </div>
                    </div>
                    {isAdmin ? (
                      <button
                        type="button"
                        onClick={() => void onDelete(b.id)}
                        disabled={deletingId === b.id}
                        className="shrink-0 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-500/15 disabled:cursor-not-allowed disabled:opacity-70 dark:text-rose-200"
                      >
                        {deletingId === b.id ? "Deleting…" : "Delete"}
                      </button>
                    ) : null}
                  </div>

                  {b.url ? (
                    <a
                      href={b.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex items-center text-sm font-semibold text-emerald-700 hover:underline dark:text-emerald-400"
                    >
                      Open link →
                    </a>
                  ) : null}

                  {b.fileId ? (
                    <a
                      href={`/api/books/download?id=${b.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 ml-4 inline-flex items-center text-sm font-semibold text-emerald-700 hover:underline dark:text-emerald-400"
                    >
                      Download PDF ↓
                    </a>
                  ) : null}

                  {b.notes ? (
                    <p className="mt-4 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                      {b.notes}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}
        </Container>
      </section>
    </div>
  );
}

