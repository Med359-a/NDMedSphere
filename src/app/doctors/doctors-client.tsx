"use client";

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

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
}

function initialsFromName(name: string) {
  const initials = name
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return initials || "DR";
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
      setLoad({
        status: "error",
        message: e instanceof Error ? e.message : "Failed to load doctors.",
      });
    }
  }, []);

  React.useEffect(() => {
    void refresh();
  }, [refresh]);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !biography.trim()) return;

    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", name.trim());
      fd.append("biography", biography.trim());
      if (file) {
        fd.append("file", file);
      }

      const res = await fetch("/api/doctors", {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || `Create failed (${res.status})`);
      }

      const payload = (await res.json()) as { item?: DoctorItem };
      const created = payload.item;
      if (created) setItems((prev) => [created, ...prev]);
      else await refresh();

      setName("");
      setBiography("");
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
      const res = await fetch(`/api/doctors?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || `Delete failed (${res.status})`);
      }
      setItems((prev) => prev.filter((doctor) => doctor.id !== id));
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
                {t.doctors.eyebrow}
              </div>
              <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
                {t.doctors.title}
              </h1>
              <p className="max-w-2xl text-pretty text-lg leading-8 text-zinc-700 dark:text-zinc-200">
                {t.doctors.intro}
              </p>
            </div>

            {isAdmin ? (
              <div className="rounded-[2rem] border border-black/10 bg-white/60 p-8 shadow-sm backdrop-blur dark:border-white/15 dark:bg-zinc-950/50">
                <div className="text-sm font-semibold">{t.doctors.admin_card_title}</div>
                <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                  {t.doctors.admin_card_body}
                </p>
                <form onSubmit={onCreate} className="mt-6 grid gap-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium" htmlFor="doctor-name">
                      {t.doctors.name_label}
                    </label>
                    <input
                      id="doctor-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-11 rounded-xl border border-black/10 bg-white/70 px-3 text-sm shadow-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 dark:border-white/15 dark:bg-zinc-950/40"
                      placeholder={t.doctors.name_placeholder}
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <label className="text-sm font-medium" htmlFor="doctor-biography">
                      {t.doctors.biography_label}
                    </label>
                    <textarea
                      id="doctor-biography"
                      value={biography}
                      onChange={(e) => setBiography(e.target.value)}
                      className="min-h-32 rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-sm shadow-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 dark:border-white/15 dark:bg-zinc-950/40"
                      placeholder={t.doctors.biography_placeholder}
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <label className="text-sm font-medium" htmlFor="doctor-photo">
                      {t.doctors.photo_label}
                    </label>
                    <input
                      ref={fileInputRef}
                      id="doctor-photo"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="block w-full rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-sm shadow-sm file:mr-4 file:rounded-lg file:border-0 file:bg-zinc-900 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-zinc-800 dark:border-white/15 dark:bg-zinc-950/40 dark:file:bg-white dark:file:text-zinc-900 dark:hover:file:bg-zinc-100"
                    />
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">
                      {t.doctors.photo_hint}
                    </div>
                    {file ? (
                      <div className="text-xs text-zinc-500 dark:text-zinc-400">
                        {t.doctors.selected_prefix} {file.name}
                      </div>
                    ) : null}
                  </div>

                  <button
                    type="submit"
                    disabled={saving || !name.trim() || !biography.trim()}
                    className="inline-flex h-11 items-center justify-center rounded-xl bg-zinc-900 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
                  >
                    {saving ? t.doctors.adding_button : t.doctors.add_button}
                  </button>
                </form>
              </div>
            ) : (
              <div className="rounded-[2rem] border border-black/10 bg-white/60 p-8 shadow-sm backdrop-blur dark:border-white/15 dark:bg-zinc-950/50">
                <div className="text-sm font-semibold">{t.doctors.related_title}</div>
                <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                  {t.doctors.related_body}
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/about"
                    className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white/60 px-5 py-3 text-sm font-semibold text-zinc-900 shadow-sm backdrop-blur transition hover:bg-white dark:border-white/15 dark:bg-zinc-950/50 dark:text-zinc-50 dark:hover:bg-zinc-950"
                  >
                    {t.doctors.related_about}
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white/60 px-5 py-3 text-sm font-semibold text-zinc-900 shadow-sm backdrop-blur transition hover:bg-white dark:border-white/15 dark:bg-zinc-950/50 dark:text-zinc-50 dark:hover:bg-zinc-950"
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
          <div className="flex items-end justify-between gap-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight">{t.doctors.list_title}</h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-300">{t.doctors.list_body}</p>
            </div>
            <button
              type="button"
              onClick={() => void refresh()}
              className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white/60 px-4 py-2 text-sm font-semibold text-zinc-900 shadow-sm backdrop-blur transition hover:bg-white dark:border-white/15 dark:bg-zinc-950/50 dark:text-zinc-50 dark:hover:bg-zinc-950"
            >
              {t.doctors.refresh}
            </button>
          </div>

          {load.status === "error" ? (
            <div className="mt-6 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-5 py-4 text-sm text-rose-800 dark:text-rose-200">
              {load.message}
            </div>
          ) : null}

          {load.status === "loading" ? (
            <div className="mt-10 grid gap-4 lg:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-80 animate-pulse rounded-[2rem] border border-black/10 bg-white/60 shadow-sm backdrop-blur dark:border-white/15 dark:bg-zinc-950/50"
                />
              ))}
            </div>
          ) : null}

          {load.status !== "loading" && items.length === 0 ? (
            <div className="mt-10 rounded-[2rem] border border-black/10 bg-white/60 p-10 text-center shadow-sm backdrop-blur dark:border-white/15 dark:bg-zinc-950/50">
              <div className="text-lg font-semibold">{t.doctors.empty_title}</div>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                {isAdmin ? t.doctors.empty_admin_body : t.doctors.empty_public_body}
              </p>
            </div>
          ) : null}

          {load.status !== "loading" && items.length ? (
            <div className="mt-10 grid gap-4 lg:grid-cols-2">
              {items.map((doctor) => (
                <article
                  key={doctor.id}
                  className="overflow-hidden rounded-[2rem] border border-black/10 bg-white/60 shadow-sm backdrop-blur dark:border-white/15 dark:bg-zinc-950/50"
                >
                  <div className="grid md:grid-cols-[16rem_minmax(0,1fr)]">
                    <div className="relative min-h-72 overflow-hidden border-b border-black/10 bg-gradient-to-br from-emerald-500/15 via-sky-500/10 to-zinc-900/5 dark:border-white/10 md:border-b-0 md:border-r">
                      {doctor.imageFileId ? (
                        <img
                          src={`/api/doctors/image?id=${doctor.imageFileId}`}
                          alt={doctor.name}
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-emerald-500/20 via-sky-500/15 to-zinc-900/10">
                          <div className="flex h-24 w-24 items-center justify-center rounded-full border border-white/40 bg-white/50 text-3xl font-semibold tracking-wide text-zinc-900 shadow-sm backdrop-blur dark:border-white/15 dark:bg-zinc-950/50 dark:text-zinc-50">
                            {initialsFromName(doctor.name)}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="p-8">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <h3 className="text-2xl font-semibold tracking-tight">{doctor.name}</h3>
                          <div className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                            {formatDate(doctor.createdAt)}
                          </div>
                        </div>
                        {isAdmin ? (
                          <button
                            type="button"
                            onClick={() => void onDelete(doctor.id)}
                            disabled={deletingId === doctor.id}
                            className="shrink-0 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-500/15 disabled:cursor-not-allowed disabled:opacity-70 dark:text-rose-200"
                          >
                            {deletingId === doctor.id ? "Deleting…" : "Delete"}
                          </button>
                        ) : null}
                      </div>

                      <div className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                        {t.doctors.biography_heading}
                      </div>
                      <p className="mt-3 whitespace-pre-line text-sm leading-7 text-zinc-700 dark:text-zinc-300">
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
