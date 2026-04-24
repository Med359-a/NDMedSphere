"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { Container } from "@/components/container";
import type { DoctorItem } from "@/lib/content-types";
import { useAdmin } from "@/lib/use-admin";
import { useLanguage } from "@/lib/i18n";

type LoadState =
  | { status: "loading" }
  | { status: "ready" }
  | { status: "error"; message: string };

function initialsFromName(name: string) {
  return (
    name
      .split(/\s+/)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .filter(Boolean)
      .slice(0, 2)
      .join("") || "DR"
  );
}

export function DoctorsClient() {
  const admin = useAdmin();
  const isAdmin = admin.isAdmin;
  const { t } = useLanguage();

  const [load, setLoad] = React.useState<LoadState>({ status: "loading" });
  const [items, setItems] = React.useState<DoctorItem[]>([]);
  const [name, setName] = React.useState("");
  const [biography, setBiography] = React.useState("");
  const [file, setFile] = React.useState<File | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const refresh = React.useCallback(async () => {
    try {
      setLoad({ status: "loading" });
      const res = await fetch("/api/doctors", { cache: "no-store" });
      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || `Failed to load doctors (${res.status})`);
      }
      const data = (await res.json()) as DoctorItem[];
      setItems(Array.isArray(data) ? data : []);
      setLoad({ status: "ready" });
    } catch (e) {
      setLoad({ status: "error", message: e instanceof Error ? e.message : "Failed to load doctors." });
    }
  }, []);

  React.useEffect(() => { void refresh(); }, [refresh]);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !biography.trim()) return;
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", name.trim()); fd.append("biography", biography.trim());
      if (file) fd.append("file", file);
      const res = await fetch("/api/doctors", { method: "POST", body: fd });
      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || `Create failed (${res.status})`);
      }
      const payload = (await res.json()) as { item?: DoctorItem };
      if (payload.item) setItems((prev) => [payload.item!, ...prev]);
      else await refresh();
      setName(""); setBiography(""); setFile(null);
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
      const res = await fetch(`/api/doctors?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || `Delete failed (${res.status})`);
      }
      setItems((prev) => prev.filter((d) => d.id !== id));
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
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/8 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-blue-700 dark:border-blue-400/20 dark:bg-blue-400/8 dark:text-blue-300">
                {t.doctors.eyebrow}
              </div>
              <h1 className="font-display text-balance text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
                {t.doctors.title}
              </h1>
              <p className="max-w-xl text-pretty text-lg leading-8 text-zinc-600 dark:text-zinc-300">
                {t.doctors.intro}
              </p>
            </div>

            {isAdmin ? (
              <div className="animate-fade-up stagger-2 rounded-[2rem] border border-black/8 bg-white/80 p-8 shadow-sm backdrop-blur dark:border-white/10 dark:bg-zinc-950/60">
                <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{t.doctors.admin_card_title}</div>
                <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">{t.doctors.admin_card_body}</p>
                <form onSubmit={onCreate} className="mt-5 grid gap-4">
                  <div className="grid gap-1.5">
                    <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400" htmlFor="doctor-name">{t.doctors.name_label}</label>
                    <input id="doctor-name" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder={t.doctors.name_placeholder} required />
                  </div>
                  <div className="grid gap-1.5">
                    <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400" htmlFor="doctor-biography">{t.doctors.biography_label}</label>
                    <textarea
                      id="doctor-biography" value={biography} onChange={(e) => setBiography(e.target.value)}
                      className="min-h-32 w-full rounded-xl border border-black/10 bg-white/80 px-3 py-2.5 text-sm shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 dark:border-white/15 dark:bg-zinc-950/60"
                      placeholder={t.doctors.biography_placeholder} required
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400" htmlFor="doctor-photo">{t.doctors.photo_label}</label>
                    <input
                      ref={fileInputRef} id="doctor-photo" type="file" accept="image/*"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="block w-full rounded-xl border border-black/10 bg-white/80 px-3 py-2 text-sm shadow-sm file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-900 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-zinc-800 dark:border-white/15 dark:bg-zinc-950/60 dark:file:bg-zinc-100 dark:file:text-zinc-900"
                    />
                    <div className="text-xs text-zinc-400 dark:text-zinc-500">{t.doctors.photo_hint}</div>
                    {file && <div className="text-xs text-zinc-400">{t.doctors.selected_prefix} {file.name}</div>}
                  </div>
                  <button
                    type="submit"
                    disabled={saving || !name.trim() || !biography.trim()}
                    className="inline-flex h-11 items-center justify-center rounded-xl bg-zinc-900 px-5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-zinc-800 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
                  >
                    {saving ? t.doctors.adding_button : t.doctors.add_button}
                  </button>
                </form>
              </div>
            ) : (
              <div className="animate-fade-up stagger-2 rounded-[2rem] border border-black/8 bg-white/80 p-8 shadow-sm backdrop-blur dark:border-white/10 dark:bg-zinc-950/60">
                <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{t.doctors.related_title}</div>
                <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">{t.doctors.related_body}</p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link href="/about" className="inline-flex items-center justify-center gap-2 rounded-xl border border-black/10 bg-white/80 px-5 py-2.5 text-sm font-semibold text-zinc-800 shadow-sm transition-all hover:bg-white hover:shadow-md dark:border-white/15 dark:bg-white/5 dark:text-zinc-100 dark:hover:bg-white/10">
                    {t.doctors.related_about}
                  </Link>
                  <Link href="/contact" className="inline-flex items-center justify-center gap-2 rounded-xl border border-black/10 bg-white/80 px-5 py-2.5 text-sm font-semibold text-zinc-800 shadow-sm transition-all hover:bg-white hover:shadow-md dark:border-white/15 dark:bg-white/5 dark:text-zinc-100 dark:hover:bg-white/10">
                    {t.doctors.related_contact}
                  </Link>
                </div>
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* ── Profiles ─────────────────────────────────── */}
      <section className="pb-20">
        <Container className="py-16">
          <div className="flex items-end justify-between gap-6 mb-8">
            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">{t.doctors.list_title}</h2>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{t.doctors.list_body}</p>
            </div>
            <button
              type="button"
              onClick={() => void refresh()}
              className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white/80 px-4 py-2 text-sm font-semibold text-zinc-700 shadow-sm backdrop-blur transition-all hover:bg-white hover:shadow-md dark:border-white/15 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {t.doctors.refresh}
            </button>
          </div>

          {load.status === "error" && (
            <div className="rounded-2xl border border-rose-500/20 bg-rose-50 px-5 py-4 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">
              {load.message}
            </div>
          )}

          {load.status === "loading" && (
            <div className="grid gap-5 lg:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-80 animate-pulse rounded-[2rem] border border-black/8 bg-white/60 shadow-sm dark:border-white/10 dark:bg-zinc-950/50" />
              ))}
            </div>
          )}

          {load.status !== "loading" && items.length === 0 && (
            <div className="rounded-[2rem] border border-black/8 bg-white/60 p-16 text-center shadow-sm dark:border-white/10 dark:bg-zinc-950/50">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-white/5">
                <svg className="h-7 w-7 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="text-base font-semibold text-zinc-900 dark:text-zinc-50">{t.doctors.empty_title}</div>
              <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
                {isAdmin ? t.doctors.empty_admin_body : t.doctors.empty_public_body}
              </p>
            </div>
          )}

          {load.status !== "loading" && items.length > 0 && (
            <div className="grid gap-6 lg:grid-cols-2">
              {items.map((doctor, i) => (
                <article
                  key={doctor.id}
                  className="animate-fade-up overflow-hidden rounded-[2rem] border border-black/8 bg-white shadow-sm transition-all hover:shadow-lg dark:border-white/10 dark:bg-zinc-950"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="grid md:grid-cols-[220px_minmax(0,1fr)]">
                    {/* Photo */}
                    <div className="relative min-h-64 overflow-hidden border-b border-black/[0.05] dark:border-white/[0.06] md:border-b-0 md:border-r">
                      {doctor.imageFileId ? (
                        <Image
                          src={`/api/doctors/image?id=${doctor.imageFileId}`}
                          alt={doctor.name}
                          fill
                          unoptimized
                          sizes="220px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full min-h-64 items-center justify-center bg-gradient-to-br from-blue-500/15 via-sky-500/10 to-zinc-100 dark:from-blue-500/10 dark:via-sky-500/8 dark:to-zinc-900">
                          <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/60 bg-white/70 text-2xl font-bold text-zinc-700 shadow-sm backdrop-blur dark:border-white/20 dark:bg-zinc-900/70 dark:text-zinc-200">
                            {initialsFromName(doctor.name)}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-7">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-display text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                          {doctor.name}
                        </h3>
                        {isAdmin && (
                          <button
                            type="button"
                            onClick={() => void onDelete(doctor.id)}
                            disabled={deletingId === doctor.id}
                            className="shrink-0 rounded-lg border border-rose-500/20 bg-rose-50 px-2.5 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-100 disabled:opacity-60 dark:bg-rose-500/10 dark:text-rose-300 dark:hover:bg-rose-500/20"
                          >
                            {deletingId === doctor.id ? "…" : "Delete"}
                          </button>
                        )}
                      </div>
                      <div className="mt-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                        {t.doctors.biography_heading}
                      </div>
                      <p className="mt-2 whitespace-pre-line text-sm leading-7 text-zinc-600 dark:text-zinc-300">
                        {doctor.biography}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}
