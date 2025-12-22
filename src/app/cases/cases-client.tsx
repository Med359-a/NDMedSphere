"use client";

import Link from "next/link";
import * as React from "react";
import { Container } from "@/components/container";
import type { CaseItem } from "@/lib/content-types";
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

function splitTags(raw: string) {
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export function CasesClient() {
  const admin = useAdmin();
  const isAdmin = admin.isAdmin;

  const [load, setLoad] = React.useState<LoadState>({ status: "loading" });
  const [items, setItems] = React.useState<CaseItem[]>([]);

  const [title, setTitle] = React.useState("");
  const [summary, setSummary] = React.useState("");
  const [tags, setTags] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  const refresh = React.useCallback(async () => {
    try {
      setLoad({ status: "loading" });
      const res = await fetch("/api/cases", { cache: "no-store" });
      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || `Failed to load cases (${res.status})`);
      }
      const data = (await res.json()) as CaseItem[];
      setItems(Array.isArray(data) ? data : []);
      setLoad({ status: "ready" });
    } catch (e) {
      setLoad({
        status: "error",
        message: e instanceof Error ? e.message : "Failed to load cases.",
      });
    }
  }, []);

  React.useEffect(() => {
    void refresh();
  }, [refresh]);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !summary.trim()) return;

    setSaving(true);
    try {
      const res = await fetch("/api/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          summary: summary.trim(),
          tags: splitTags(tags),
        }),
      });

      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || `Create failed (${res.status})`);
      }

      const payload = (await res.json()) as { item?: CaseItem };
      const created = payload.item;
      if (created) setItems((prev) => [created, ...prev]);
      else await refresh();

      setTitle("");
      setSummary("");
      setTags("");
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
      const res = await fetch(`/api/cases?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || `Delete failed (${res.status})`);
      }
      setItems((prev) => prev.filter((c) => c.id !== id));
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
          <div className="grid gap-10 lg:grid-cols-2 lg:items-end">
            <div className="space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Cases
              </div>
              <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
                Case summaries
              </h1>
              <p className="max-w-xl text-pretty text-lg leading-8 text-zinc-700 dark:text-zinc-200">
                Browse de-identified cases and clinical decision-making. Editing is
                admin-only.
              </p>
            </div>

            {isAdmin ? (
              <div className="rounded-[2rem] border border-black/10 bg-white/60 p-8 shadow-sm backdrop-blur dark:border-white/15 dark:bg-zinc-950/50">
                <div className="text-sm font-semibold">Add case</div>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                  Keep everything de-identified and privacy-safe.
                </p>
                <form onSubmit={onCreate} className="mt-6 grid gap-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium" htmlFor="case-title">
                      Title
                    </label>
                    <input
                      id="case-title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="h-11 rounded-xl border border-black/10 bg-white/70 px-3 text-sm shadow-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 dark:border-white/15 dark:bg-zinc-950/40"
                      placeholder="Short case title"
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <label className="text-sm font-medium" htmlFor="case-summary">
                      Summary
                    </label>
                    <textarea
                      id="case-summary"
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                      className="min-h-28 rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-sm shadow-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 dark:border-white/15 dark:bg-zinc-950/40"
                      placeholder="De-identified summary + key learning points..."
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <label className="text-sm font-medium" htmlFor="case-tags">
                      Tags (optional)
                    </label>
                    <input
                      id="case-tags"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      className="h-11 rounded-xl border border-black/10 bg-white/70 px-3 text-sm shadow-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 dark:border-white/15 dark:bg-zinc-950/40"
                      placeholder="Presentation, Workup, Outcome"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={saving || !title.trim() || !summary.trim()}
                    className="inline-flex h-11 items-center justify-center rounded-xl bg-zinc-900 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
                  >
                    {saving ? "Saving…" : "Add"}
                  </button>
                </form>
              </div>
            ) : (
              <div className="rounded-[2rem] border border-amber-500/25 bg-amber-500/10 p-8 shadow-sm backdrop-blur dark:border-amber-400/25">
                <div className="text-sm font-semibold text-amber-900 dark:text-amber-200">
                  Privacy reminder
                </div>
                <p className="mt-2 text-sm leading-6 text-amber-900/80 dark:text-amber-200/80">
                  Avoid any patient-identifying details. Use generalized timelines and
                  omit unique descriptors.
                </p>
                <div className="mt-5">
                  <Link
                    href="/videos"
                    className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
                  >
                    View related videos →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </Container>
      </section>

      <section className="pb-20">
        <Container className="py-16">
          <div className="flex items-end justify-between gap-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight">Cases</h2>
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
                  className="h-56 animate-pulse rounded-2xl border border-black/10 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-white/15 dark:bg-zinc-950/50"
                />
              ))}
            </div>
          ) : null}

          {load.status !== "loading" && items.length === 0 ? (
            <div className="mt-10 rounded-[2rem] border border-black/10 bg-white/60 p-10 text-center shadow-sm backdrop-blur dark:border-white/15 dark:bg-zinc-950/50">
              <div className="text-lg font-semibold">No cases yet</div>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                {isAdmin ? "Add your first case using the form above." : "Check back soon."}
              </p>
            </div>
          ) : null}

          {load.status !== "loading" && items.length ? (
            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {items.map((c) => (
                <div
                  key={c.id}
                  className="rounded-[2rem] border border-black/10 bg-white/60 p-8 shadow-sm backdrop-blur dark:border-white/15 dark:bg-zinc-950/50"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="truncate text-lg font-semibold">{c.title}</div>
                      <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                        {formatDate(c.createdAt)}
                      </div>
                    </div>
                    {isAdmin ? (
                      <button
                        type="button"
                        onClick={() => void onDelete(c.id)}
                        disabled={deletingId === c.id}
                        className="shrink-0 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-500/15 disabled:cursor-not-allowed disabled:opacity-70 dark:text-rose-200"
                      >
                        {deletingId === c.id ? "Deleting…" : "Delete"}
                      </button>
                    ) : null}
                  </div>

                  <p className="mt-4 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                    {c.summary}
                  </p>

                  {c.tags.length ? (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {c.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full bg-zinc-900/5 px-3 py-1 text-xs font-medium text-zinc-700 dark:bg-white/10 dark:text-zinc-200"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
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

