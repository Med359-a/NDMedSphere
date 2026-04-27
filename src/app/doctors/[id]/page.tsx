import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/container";
import { getSupabaseAdmin } from "@/lib/supabase";
import { toDoctorItem, type DoctorRow } from "@/lib/supabase-content";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

async function fetchDoctor(id: string) {
  const { data, error } = await getSupabaseAdmin()
    .from("doctors")
    .select("id, name, biography, niche, rating, image_path, created_at")
    .eq("id", id)
    .limit(1);
  if (error || !data?.length) return null;
  return toDoctorItem(data[0] as DoctorRow);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const doctor = await fetchDoctor(id);
  if (!doctor) return { title: `Doctor — ${siteConfig.name}` };
  return {
    title: `${doctor.name} — ${siteConfig.name}`,
    description: doctor.biography.slice(0, 160),
  };
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      className={`h-5 w-5 ${filled ? "text-amber-400" : "text-[#dbe8f5] dark:text-zinc-600"}`}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.922-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.784.57-1.838-.196-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81H7.03a1 1 0 00.951-.69l1.068-3.292z" />
    </svg>
  );
}

function initialsFromName(name: string) {
  return (
    name.split(/\s+/).map((p) => p[0]?.toUpperCase() ?? "").filter(Boolean).slice(0, 2).join("") || "DR"
  );
}

export default async function DoctorDetailPage({ params }: Props) {
  const { id } = await params;
  const doctor = await fetchDoctor(id);
  if (!doctor) notFound();

  return (
    <div>
      {/* ── Header ───────────────────────────────────── */}
      <section className="border-b border-[#dbe8f5] bg-white dark:border-white/[0.06] dark:bg-[#070f1f]">
        <Container className="py-6">
          <Link
            href="/doctors"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#7a90ab] transition hover:text-[#0c2d6b] dark:text-slate-400 dark:hover:text-white"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Doctors
          </Link>
        </Container>
      </section>

      {/* ── Profile hero ─────────────────────────────── */}
      <section className="bg-white dark:bg-[#070f1f]">
        <Container className="py-12 sm:py-16">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:gap-12">
            {/* Photo */}
            <div className="relative mx-auto h-72 w-56 shrink-0 overflow-hidden rounded-2xl border border-[#dbe8f5] shadow-[0_8px_32px_-8px_rgba(12,45,107,0.18)] sm:mx-0 sm:h-80 sm:w-64 dark:border-white/10">
              {doctor.imageFileId ? (
                <Image
                  src={`/api/doctors/image?id=${doctor.imageFileId}`}
                  alt={doctor.name}
                  fill
                  unoptimized
                  sizes="256px"
                  className="object-cover object-top"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#eff6ff] via-[#f4f8fd] to-white dark:from-sky-900/20 dark:via-[#0d1b30] dark:to-[#0f2040]">
                  <span className="text-4xl font-bold text-[#0c2d6b] dark:text-white">
                    {initialsFromName(doctor.name)}
                  </span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 space-y-5">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#1666d1] dark:text-sky-400">
                  Physician Profile
                </div>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#0c2d6b] dark:text-white sm:text-4xl">
                  {doctor.name}
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-[#1666d1]/20 bg-[#eff6ff] px-4 py-1.5 text-sm font-semibold text-[#1666d1] dark:border-sky-400/20 dark:bg-sky-400/10 dark:text-sky-300">
                  {doctor.niche}
                </span>
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon key={i} filled={i + 1 <= doctor.rating} />
                  ))}
                  <span className="ml-1 text-sm font-semibold text-[#7a90ab] dark:text-slate-400">
                    {doctor.rating}/5
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 rounded-2xl border border-[#dbe8f5] bg-[#f4f8fd] p-5 sm:grid-cols-3 dark:border-white/10 dark:bg-[#0d1b30]">
                {[
                  { label: "Specialty", value: doctor.niche },
                  { label: "Rating", value: `${doctor.rating} / 5 stars` },
                  { label: "Platform", value: siteConfig.name },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7a90ab] dark:text-slate-500">
                      {item.label}
                    </div>
                    <div className="mt-1 text-sm font-semibold text-[#374c66] dark:text-slate-200">
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Biography ────────────────────────────────── */}
      <section className="border-t border-[#dbe8f5] bg-[#f4f8fd] pb-20 dark:border-white/[0.06] dark:bg-[#0d1b30]">
        <Container className="py-12">
          <div className="max-w-3xl">
            <div className="mb-4 text-[11px] font-bold uppercase tracking-[0.24em] text-[#1666d1] dark:text-sky-400">
              Biography
            </div>
            <div className="prose prose-slate max-w-none dark:prose-invert">
              {doctor.biography.split(/\n+/).filter(Boolean).map((para, i) => (
                <p key={i} className="mb-4 text-base leading-8 text-[#4a6180] dark:text-slate-300 last:mb-0">
                  {para}
                </p>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-12 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/doctors"
              className="inline-flex items-center gap-2 rounded-xl border border-[#dbe8f5] bg-white px-5 py-2.5 text-sm font-semibold text-[#374c66] shadow-sm transition hover:border-[#1666d1]/30 hover:text-[#1666d1] dark:border-white/15 dark:bg-white/5 dark:text-slate-200"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              All doctors
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-[#1666d1] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1255b8]"
            >
              Contact
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
