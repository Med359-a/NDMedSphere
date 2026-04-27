"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";
import { Container } from "@/components/container";
import type { DoctorItem } from "@/lib/content-types";
import { useLanguage } from "@/lib/i18n";
import { DOCTOR_NICHES } from "@/lib/site-sections";
import { useAdmin } from "@/lib/use-admin";

type LoadState =
  | { status: "loading" }
  | { status: "ready" }
  | { status: "error"; message: string };

function initialsFromName(name: string) {
  return (
    name
      .split(/\s+/)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .filter(Boolean)
      .slice(0, 2)
      .join("") || "DR"
  );
}

function RatingStars({
  rating,
  interactive = false,
  onSelect,
}: {
  rating: number;
  interactive?: boolean;
  onSelect?: (value: number) => void;
}) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, index) => {
        const value = index + 1;
        const filled = value <= rating;
        const icon = (
          <svg
            className={`h-4 w-4 transition ${filled ? "text-amber-400" : "text-[#dbe8f5] dark:text-zinc-600"}`}
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.922-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.784.57-1.838-.196-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81H7.03a1 1 0 00.951-.69l1.068-3.292z" />
          </svg>
        );

        if (!interactive || !onSelect) return <div key={value}>{icon}</div>;

        return (
          <button
            key={value}
            type="button"
            onClick={() => onSelect(value)}
            className="rounded outline-none transition hover:scale-110 focus:ring-2 focus:ring-[#1666d1]/30"
            aria-label={`Set rating to ${value} star${value === 1 ? "" : "s"}`}
          >
            {icon}
          </button>
        );
      })}
    </div>
  );
}

function normalizeNiche(value: string | null | undefined) {
  return value && DOCTOR_NICHES.includes(value as (typeof DOCTOR_NICHES)[number]) ? value : null;
}

export function DoctorsClient({ initialNiche = null }: { initialNiche?: string | null }) {
  const admin = useAdmin();
  const isAdmin = admin.isAdmin;
  const { t } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();

  const [load, setLoad] = React.useState<LoadState>({ status: "loading" });
  const [items, setItems] = React.useState<DoctorItem[]>([]);
  const [name, setName] = React.useState("");
  const [biography, setBiography] = React.useState("");
  const [niche, setNiche] = React.useState<string>(DOCTOR_NICHES[0]);
  const [rating, setRating] = React.useState(5);
  const [file, setFile] = React.useState<File | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [activeNiche, setActiveNiche] = React.useState<string | null>(() => normalizeNiche(initialNiche));
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => { setActiveNiche(normalizeNiche(initialNiche)); }, [initialNiche]);

  const availableNiches = React.useMemo(
    () => DOCTOR_NICHES.filter((option) => items.some((doctor) => doctor.niche === option)),
    [items],
  );

  const filteredItems = React.useMemo(
    () => (activeNiche ? items.filter((doctor) => doctor.niche === activeNiche) : items),
    [activeNiche, items],
  );

  const applyNicheFilter = React.useCallback(
    (nextNiche: string | null) => {
      const normalizedNiche = normalizeNiche(nextNiche);
      setActiveNiche(normalizedNiche);

      const params =
        typeof window === "undefined"
          ? new URLSearchParams()
          : new URLSearchParams(window.location.search);

      if (normalizedNiche) params.set("niche", normalizedNiche);
      else params.delete("niche");

      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router],
  );

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
    } catch (error) {
      setLoad({
        status: "error",
        message: error instanceof Error ? error.message : "Failed to load doctors.",
      });
    }
  }, []);

  React.useEffect(() => { void refresh(); }, [refresh]);

  async function onCreate(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim() || !biography.trim()) return;

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("biography", biography.trim());
      formData.append("niche", niche);
      formData.append("rating", String(rating));
      if (file) formData.append("file", file);

      const res = await fetch("/api/doctors", { method: "POST", body: formData });
      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || `Create failed (${res.status})`);
      }

      const payload = (await res.json()) as { item?: DoctorItem };
      if (payload.item) setItems((prev) => [payload.item as DoctorItem, ...prev]);
      else await refresh();

      setName(""); setBiography(""); setNiche(DOCTOR_NICHES[0]); setRating(5); setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      setLoad({ status: "error", message: error instanceof Error ? error.message : "Create failed." });
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
      setItems((prev) => prev.filter((doctor) => doctor.id !== id));
    } catch (error) {
      setLoad({ status: "error", message: error instanceof Error ? error.message : "Delete failed." });
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
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <div className="space-y-5 animate-fade-up">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#1666d1]/20 bg-[#eff6ff] px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#1666d1] dark:border-sky-400/20 dark:bg-sky-400/10 dark:text-sky-300">
                {t.doctors.eyebrow}
              </div>
              <h1 className="font-display text-balance text-4xl font-bold tracking-tight text-[#0c2d6b] dark:text-white sm:text-5xl">
                {t.doctors.title}
              </h1>
              <p className="max-w-xl text-pretty text-lg leading-8 text-[#4a6180] dark:text-slate-300">
                {t.doctors.intro}
              </p>
            </div>

            {isAdmin ? (
              <div className="animate-fade-up stagger-2 rounded-2xl border border-[#dbe8f5] bg-[#f4f8fd] p-7 shadow-sm dark:border-white/10 dark:bg-[#0d1b30]">
                <div className="text-sm font-bold text-[#0c2d6b] dark:text-white">{t.doctors.admin_card_title}</div>
                <p className="mt-1.5 text-sm text-[#7a90ab] dark:text-slate-400">{t.doctors.admin_card_body}</p>
                <form onSubmit={onCreate} className="mt-5 grid gap-4">
                  <div className="grid gap-1.5">
                    <label className="text-xs font-semibold text-[#4a6180] dark:text-slate-400" htmlFor="doctor-name">
                      {t.doctors.name_label}
                    </label>
                    <input
                      id="doctor-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={inputClass}
                      placeholder={t.doctors.name_placeholder}
                      required
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <label className="text-xs font-semibold text-[#4a6180] dark:text-slate-400" htmlFor="doctor-niche">
                      {t.doctors.niche_label}
                    </label>
                    <select id="doctor-niche" value={niche} onChange={(e) => setNiche(e.target.value)} className={inputClass}>
                      {DOCTOR_NICHES.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid gap-1.5">
                    <div className="flex items-center justify-between gap-3">
                      <label className="text-xs font-semibold text-[#4a6180] dark:text-slate-400" htmlFor="doctor-rating">
                        {t.doctors.rating_label}
                      </label>
                      <div className="text-xs font-semibold text-[#7a90ab] dark:text-slate-500">{rating}/5</div>
                    </div>
                    <div id="doctor-rating" className="rounded-xl border border-[#dbe8f5] bg-white px-4 py-3 dark:border-white/10 dark:bg-[#0f2040]">
                      <RatingStars rating={rating} interactive onSelect={setRating} />
                      <div className="mt-2 text-xs text-[#7a90ab] dark:text-slate-500">{t.doctors.rating_hint}</div>
                    </div>
                  </div>
                  <div className="grid gap-1.5">
                    <label className="text-xs font-semibold text-[#4a6180] dark:text-slate-400" htmlFor="doctor-biography">
                      {t.doctors.biography_label}
                    </label>
                    <textarea
                      id="doctor-biography"
                      value={biography}
                      onChange={(e) => setBiography(e.target.value)}
                      className="min-h-32 w-full rounded-xl border border-[#dbe8f5] bg-white px-3 py-2.5 text-sm shadow-sm outline-none transition focus:border-[#1666d1] focus:ring-4 focus:ring-[#1666d1]/12 dark:border-white/15 dark:bg-[#0f2040]"
                      placeholder={t.doctors.biography_placeholder}
                      required
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <label className="text-xs font-semibold text-[#4a6180] dark:text-slate-400" htmlFor="doctor-photo">
                      {t.doctors.photo_label}
                    </label>
                    <input
                      ref={fileInputRef}
                      id="doctor-photo"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="block w-full rounded-xl border border-[#dbe8f5] bg-white px-3 py-2 text-sm shadow-sm file:mr-3 file:rounded-lg file:border-0 file:bg-[#1666d1] file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-[#1255b8] dark:border-white/15 dark:bg-[#0f2040]"
                    />
                    <div className="text-xs text-[#7a90ab] dark:text-slate-500">{t.doctors.photo_hint}</div>
                    {file ? <div className="text-xs text-[#7a90ab]">{t.doctors.selected_prefix} {file.name}</div> : null}
                  </div>
                  <button
                    type="submit"
                    disabled={saving || !name.trim() || !biography.trim()}
                    className="inline-flex h-11 items-center justify-center rounded-xl bg-[#1666d1] px-5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#1255b8] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? t.doctors.adding_button : t.doctors.add_button}
                  </button>
                </form>
              </div>
            ) : (
              <div className="animate-fade-up stagger-2 rounded-2xl border border-[#dbe8f5] bg-[#f4f8fd] p-7 shadow-sm dark:border-white/10 dark:bg-[#0d1b30]">
                <div className="text-sm font-bold text-[#0c2d6b] dark:text-white">{t.doctors.related_title}</div>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <Link
                    href="/about"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#dbe8f5] bg-white px-5 py-2.5 text-sm font-semibold text-[#374c66] shadow-sm transition-all hover:border-[#1666d1]/30 hover:text-[#1666d1] dark:border-white/15 dark:bg-white/5 dark:text-slate-100 dark:hover:bg-white/10"
                  >
                    {t.doctors.related_about}
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#dbe8f5] bg-white px-5 py-2.5 text-sm font-semibold text-[#374c66] shadow-sm transition-all hover:border-[#1666d1]/30 hover:text-[#1666d1] dark:border-white/15 dark:bg-white/5 dark:text-slate-100 dark:hover:bg-white/10"
                  >
                    {t.doctors.related_contact}
                  </Link>
                </div>
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* ── Doctors List ──────────────────────────────── */}
      <section className="bg-[#f4f8fd] pb-20 dark:bg-[#0d1b30]">
        <Container className="py-16">
          <div className="mb-8 flex items-end justify-between gap-6 animate-fade-up">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#1666d1] dark:text-sky-400">
                Directory
              </div>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#0c2d6b] dark:text-white">
                {t.doctors.list_title}
              </h2>
              <p className="mt-1 text-sm text-[#7a90ab] dark:text-slate-400">{t.doctors.list_body}</p>
            </div>
            <button
              type="button"
              onClick={() => void refresh()}
              className="inline-flex items-center gap-2 rounded-xl border border-[#dbe8f5] bg-white px-4 py-2 text-sm font-semibold text-[#374c66] shadow-sm transition-all hover:border-[#1666d1]/30 hover:text-[#1666d1] dark:border-white/15 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {t.doctors.refresh}
            </button>
          </div>

          {/* Filter bar */}
          {load.status !== "loading" && items.length > 0 ? (
            <div className="mb-8 animate-fade-up rounded-2xl border border-[#dbe8f5] bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#0f2040]">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#7a90ab] dark:text-slate-500">
                    {t.doctors.filter_label}
                  </div>
                  <div className="mt-0.5 text-sm text-[#4a6180] dark:text-slate-400">
                    {t.doctors.filter_results_prefix} {filteredItems.length} {t.doctors.filter_results_suffix}
                  </div>
                </div>
                {activeNiche ? (
                  <button
                    type="button"
                    onClick={() => applyNicheFilter(null)}
                    className="rounded-full border border-[#1666d1]/25 bg-[#eff6ff] px-3 py-1.5 text-xs font-semibold text-[#1666d1] transition hover:bg-[#1666d1] hover:text-white dark:border-sky-400/20 dark:bg-sky-400/10 dark:text-sky-300"
                  >
                    {t.doctors.filter_clear}
                  </button>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => applyNicheFilter(null)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                    activeNiche === null
                      ? "border-[#1666d1] bg-[#1666d1] text-white"
                      : "border-[#dbe8f5] bg-[#f4f8fd] text-[#374c66] hover:border-[#1666d1]/30 hover:text-[#1666d1] dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
                  }`}
                >
                  {t.doctors.filter_all}
                </button>
                {availableNiches.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => applyNicheFilter(option)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                      activeNiche === option
                        ? "border-[#1666d1] bg-[#1666d1] text-white"
                        : "border-[#dbe8f5] bg-[#f4f8fd] text-[#374c66] hover:border-[#1666d1]/30 hover:text-[#1666d1] dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {load.status === "error" ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300">
              {load.message}
            </div>
          ) : null}

          {load.status === "loading" ? (
            <div className="grid gap-5 lg:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
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
                <svg className="h-7 w-7 text-[#1666d1] dark:text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="text-base font-semibold text-[#0c2d6b] dark:text-white">{t.doctors.empty_title}</div>
              <p className="mt-1.5 text-sm text-[#7a90ab] dark:text-slate-400">
                {isAdmin ? t.doctors.empty_admin_body : t.doctors.empty_public_body}
              </p>
            </div>
          ) : null}

          {load.status !== "loading" && items.length > 0 && filteredItems.length === 0 ? (
            <div className="rounded-2xl border border-[#dbe8f5] bg-white p-16 text-center shadow-sm dark:border-white/10 dark:bg-[#0f2040]">
              <div className="text-base font-semibold text-[#0c2d6b] dark:text-white">{t.doctors.filter_empty_title}</div>
              <p className="mt-1.5 text-sm text-[#7a90ab] dark:text-slate-400">{t.doctors.filter_empty_body}</p>
              <button
                type="button"
                onClick={() => applyNicheFilter(null)}
                className="mt-5 inline-flex items-center justify-center rounded-xl bg-[#1666d1] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1255b8]"
              >
                {t.doctors.filter_clear}
              </button>
            </div>
          ) : null}

          {load.status !== "loading" && filteredItems.length > 0 ? (
            <div className="grid gap-5 lg:grid-cols-2">
              {filteredItems.map((doctor, index) => (
                <Link
                  key={doctor.id}
                  href={`/doctors/${doctor.id}`}
                  className="animate-fade-up group block overflow-hidden rounded-2xl border border-[#dbe8f5] bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-[#1666d1]/25 hover:shadow-[0_8px_32px_-8px_rgba(22,102,209,0.16)] dark:border-white/10 dark:bg-[#0f2040]"
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <div className="grid md:grid-cols-[200px_minmax(0,1fr)]">
                    {/* Photo column — fixed height so it never stretches with biography */}
                    <div className="relative h-56 shrink-0 self-start overflow-hidden border-b border-[#dbe8f5] md:h-64 md:border-b-0 md:border-r dark:border-white/[0.06]">
                      {doctor.imageFileId ? (
                        <Image
                          src={`/api/doctors/image?id=${doctor.imageFileId}`}
                          alt={doctor.name}
                          fill
                          unoptimized
                          sizes="200px"
                          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#eff6ff] via-[#f4f8fd] to-white dark:from-sky-900/20 dark:via-[#0d1b30] dark:to-[#0f2040]">
                          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#dbe8f5] bg-white text-2xl font-bold text-[#0c2d6b] shadow-sm dark:border-white/15 dark:bg-[#0d1b30] dark:text-white">
                            {initialsFromName(doctor.name)}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Info column */}
                    <div className="min-w-0 overflow-hidden p-6">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="font-display text-xl font-bold tracking-tight text-[#0c2d6b] dark:text-white">
                            {doctor.name}
                          </h3>
                          <div className="mt-2.5 flex flex-wrap items-center gap-2.5">
                            <button
                              type="button"
                              onClick={() => applyNicheFilter(doctor.niche)}
                              className="rounded-full border border-[#1666d1]/20 bg-[#eff6ff] px-3 py-1 text-xs font-semibold text-[#1666d1] transition hover:bg-[#1666d1] hover:text-white dark:border-sky-400/20 dark:bg-sky-400/10 dark:text-sky-300"
                            >
                              {doctor.niche}
                            </button>
                            <div className="flex items-center gap-1.5">
                              <RatingStars rating={doctor.rating} />
                              <span className="text-xs font-semibold text-[#7a90ab] dark:text-slate-500">
                                {doctor.rating}/5
                              </span>
                            </div>
                          </div>
                        </div>
                        {isAdmin ? (
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); void onDelete(doctor.id); }}
                            disabled={deletingId === doctor.id}
                            className="shrink-0 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-100 disabled:opacity-60 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300"
                          >
                            {deletingId === doctor.id ? "…" : "Delete"}
                          </button>
                        ) : null}
                      </div>

                      <div className="mt-4 border-t border-[#dbe8f5] pt-4 dark:border-white/[0.06]">
                        <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#7a90ab] dark:text-slate-500">
                          {t.doctors.biography_heading}
                        </div>
                        <p className="line-clamp-3 break-words text-sm leading-7 text-[#4a6180] dark:text-slate-300">
                          {doctor.biography}
                        </p>
                        <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#1666d1] dark:text-sky-400">
                          Read full profile
                          <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : null}
        </Container>
      </section>

    </div>
  );
}
