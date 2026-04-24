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
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => {
        const value = index + 1;
        const filled = value <= rating;
        const icon = (
          <svg
            className={`h-5 w-5 transition ${filled ? "text-amber-400" : "text-zinc-300 dark:text-zinc-600"}`}
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.922-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.784.57-1.838-.196-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81H7.03a1 1 0 00.951-.69l1.068-3.292z" />
          </svg>
        );

        if (!interactive || !onSelect) {
          return <div key={value}>{icon}</div>;
        }

        return (
          <button
            key={value}
            type="button"
            onClick={() => onSelect(value)}
            className="rounded-md outline-none transition hover:scale-105 focus:ring-2 focus:ring-blue-500/30"
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

  React.useEffect(() => {
    setActiveNiche(normalizeNiche(initialNiche));
  }, [initialNiche]);

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

      if (normalizedNiche) {
        params.set("niche", normalizedNiche);
      } else {
        params.delete("niche");
      }

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

  React.useEffect(() => {
    void refresh();
  }, [refresh]);

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
      if (payload.item) {
        setItems((prev) => [payload.item as DoctorItem, ...prev]);
      } else {
        await refresh();
      }

      setName("");
      setBiography("");
      setNiche(DOCTOR_NICHES[0]);
      setRating(5);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      setLoad({
        status: "error",
        message: error instanceof Error ? error.message : "Create failed.",
      });
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id: string) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/doctors?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || `Delete failed (${res.status})`);
      }

      setItems((prev) => prev.filter((doctor) => doctor.id !== id));
    } catch (error) {
      setLoad({
        status: "error",
        message: error instanceof Error ? error.message : "Delete failed.",
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
                <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  {t.doctors.admin_card_title}
                </div>
                <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
                  {t.doctors.admin_card_body}
                </p>
                <form onSubmit={onCreate} className="mt-5 grid gap-4">
                  <div className="grid gap-1.5">
                    <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400" htmlFor="doctor-name">
                      {t.doctors.name_label}
                    </label>
                    <input
                      id="doctor-name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      className={inputClass}
                      placeholder={t.doctors.name_placeholder}
                      required
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400" htmlFor="doctor-niche">
                      {t.doctors.niche_label}
                    </label>
                    <select
                      id="doctor-niche"
                      value={niche}
                      onChange={(event) => setNiche(event.target.value)}
                      className={inputClass}
                    >
                      {DOCTOR_NICHES.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid gap-1.5">
                    <div className="flex items-center justify-between gap-3">
                      <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400" htmlFor="doctor-rating">
                        {t.doctors.rating_label}
                      </label>
                      <div className="text-xs font-semibold text-zinc-400 dark:text-zinc-500">
                        {rating}/5
                      </div>
                    </div>
                    <div
                      id="doctor-rating"
                      className="rounded-2xl border border-black/8 bg-zinc-50 px-4 py-3 dark:border-white/10 dark:bg-white/5"
                    >
                      <RatingStars rating={rating} interactive onSelect={setRating} />
                      <div className="mt-2 text-xs text-zinc-400 dark:text-zinc-500">
                        {t.doctors.rating_hint}
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-1.5">
                    <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400" htmlFor="doctor-biography">
                      {t.doctors.biography_label}
                    </label>
                    <textarea
                      id="doctor-biography"
                      value={biography}
                      onChange={(event) => setBiography(event.target.value)}
                      className="min-h-32 w-full rounded-xl border border-black/10 bg-white/80 px-3 py-2.5 text-sm shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 dark:border-white/15 dark:bg-zinc-950/60"
                      placeholder={t.doctors.biography_placeholder}
                      required
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400" htmlFor="doctor-photo">
                      {t.doctors.photo_label}
                    </label>
                    <input
                      ref={fileInputRef}
                      id="doctor-photo"
                      type="file"
                      accept="image/*"
                      onChange={(event) => setFile(event.target.files?.[0] || null)}
                      className="block w-full rounded-xl border border-black/10 bg-white/80 px-3 py-2 text-sm shadow-sm file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-900 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-zinc-800 dark:border-white/15 dark:bg-zinc-950/60 dark:file:bg-zinc-100 dark:file:text-zinc-900"
                    />
                    <div className="text-xs text-zinc-400 dark:text-zinc-500">
                      {t.doctors.photo_hint}
                    </div>
                    {file ? (
                      <div className="text-xs text-zinc-400">
                        {t.doctors.selected_prefix} {file.name}
                      </div>
                    ) : null}
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
                <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  {t.doctors.related_title}
                </div>
                <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                  {t.doctors.related_body}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {DOCTOR_NICHES.slice(0, 8).map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => applyNicheFilter(item)}
                      className="rounded-full border border-blue-500/15 bg-blue-500/8 px-3 py-1 text-xs font-medium text-blue-700 dark:border-blue-400/20 dark:bg-blue-400/10 dark:text-blue-300"
                    >
                      {item}
                    </button>
                  ))}
                </div>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/about"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-black/10 bg-white/80 px-5 py-2.5 text-sm font-semibold text-zinc-800 shadow-sm transition-all hover:bg-white hover:shadow-md dark:border-white/15 dark:bg-white/5 dark:text-zinc-100 dark:hover:bg-white/10"
                  >
                    {t.doctors.related_about}
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-black/10 bg-white/80 px-5 py-2.5 text-sm font-semibold text-zinc-800 shadow-sm transition-all hover:bg-white hover:shadow-md dark:border-white/15 dark:bg-white/5 dark:text-zinc-100 dark:hover:bg-white/10"
                  >
                    {t.doctors.related_contact}
                  </Link>
                </div>
              </div>
            )}
          </div>
        </Container>
      </section>

      <section className="pb-20">
        <Container className="py-16">
          <div className="mb-8 flex items-end justify-between gap-6">
            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                {t.doctors.list_title}
              </h2>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                {t.doctors.list_body}
              </p>
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

          {load.status !== "loading" && items.length > 0 ? (
            <div className="mb-8 rounded-[1.75rem] border border-black/8 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-zinc-950/60">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-400 dark:text-zinc-500">
                    {t.doctors.filter_label}
                  </div>
                  <div className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    {t.doctors.filter_results_prefix} {filteredItems.length} {t.doctors.filter_results_suffix}
                  </div>
                </div>
                {activeNiche ? (
                  <button
                    type="button"
                    onClick={() => applyNicheFilter(null)}
                    className="rounded-full border border-blue-500/20 bg-blue-500/8 px-3 py-1.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-500/12 dark:border-blue-400/20 dark:bg-blue-400/10 dark:text-blue-300"
                  >
                    {t.doctors.filter_clear}
                  </button>
                ) : null}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => applyNicheFilter(null)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                    activeNiche === null
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-black/10 bg-zinc-50 text-zinc-600 hover:border-blue-500/25 hover:text-blue-700 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 dark:hover:text-blue-300"
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
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-black/10 bg-zinc-50 text-zinc-600 hover:border-blue-500/25 hover:text-blue-700 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 dark:hover:text-blue-300"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {load.status === "error" ? (
            <div className="rounded-2xl border border-rose-500/20 bg-rose-50 px-5 py-4 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">
              {load.message}
            </div>
          ) : null}

          {load.status === "loading" ? (
            <div className="grid gap-5 lg:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-80 animate-pulse rounded-[2rem] border border-black/8 bg-white/60 shadow-sm dark:border-white/10 dark:bg-zinc-950/50"
                />
              ))}
            </div>
          ) : null}

          {load.status !== "loading" && items.length === 0 ? (
            <div className="rounded-[2rem] border border-black/8 bg-white/60 p-16 text-center shadow-sm dark:border-white/10 dark:bg-zinc-950/50">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-white/5">
                <svg className="h-7 w-7 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                {t.doctors.empty_title}
              </div>
              <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
                {isAdmin ? t.doctors.empty_admin_body : t.doctors.empty_public_body}
              </p>
            </div>
          ) : null}

          {load.status !== "loading" && items.length > 0 && filteredItems.length === 0 ? (
            <div className="rounded-[2rem] border border-black/8 bg-white/60 p-16 text-center shadow-sm dark:border-white/10 dark:bg-zinc-950/50">
              <div className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                {t.doctors.filter_empty_title}
              </div>
              <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
                {t.doctors.filter_empty_body}
              </p>
              <button
                type="button"
                onClick={() => applyNicheFilter(null)}
                className="mt-5 inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
              >
                {t.doctors.filter_clear}
              </button>
            </div>
          ) : null}

          {load.status !== "loading" && filteredItems.length > 0 ? (
            <div className="grid gap-6 lg:grid-cols-2">
              {filteredItems.map((doctor, index) => (
                <article
                  key={doctor.id}
                  className="animate-fade-up overflow-hidden rounded-[2rem] border border-black/8 bg-white shadow-sm transition-all hover:shadow-lg dark:border-white/10 dark:bg-zinc-950"
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <div className="grid md:grid-cols-[220px_minmax(0,1fr)]">
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

                    <div className="p-7">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="font-display text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                            {doctor.name}
                          </h3>
                          <div className="mt-3 flex flex-wrap items-center gap-3">
                            <button
                              type="button"
                              onClick={() => applyNicheFilter(doctor.niche)}
                              className="rounded-full border border-blue-500/15 bg-blue-500/8 px-3 py-1 text-xs font-semibold text-blue-700 transition hover:bg-blue-500/14 dark:border-blue-400/20 dark:bg-blue-400/10 dark:text-blue-300"
                            >
                              {doctor.niche}
                            </button>
                            <div className="flex items-center gap-2">
                              <RatingStars rating={doctor.rating} />
                              <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500">
                                {doctor.rating}/5
                              </span>
                            </div>
                          </div>
                        </div>
                        {isAdmin ? (
                          <button
                            type="button"
                            onClick={() => void onDelete(doctor.id)}
                            disabled={deletingId === doctor.id}
                            className="shrink-0 rounded-lg border border-rose-500/20 bg-rose-50 px-2.5 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-100 disabled:opacity-60 dark:bg-rose-500/10 dark:text-rose-300 dark:hover:bg-rose-500/20"
                          >
                            {deletingId === doctor.id ? "…" : "Delete"}
                          </button>
                        ) : null}
                      </div>
                      <div className="mt-5 text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
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
          ) : null}
        </Container>
      </section>
    </div>
  );
}
