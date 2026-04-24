"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { Container } from "@/components/container";
import { siteConfig } from "@/lib/site-config";
import heroImage from "@/image_50348545.jpg";
import { useLanguage } from "@/lib/i18n";
function ArrowRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M13 7l5 5m0 0l-5 5m5-5H6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const pillarCards = [
  {
    eyebrow: "Clarity",
    titleKey: "grid_1" as const,
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h8M8 14h5m-7 7h12a2 2 0 002-2V7.828a2 2 0 00-.586-1.414l-3.828-3.828A2 2 0 0014.172 2H6a2 2 0 00-2 2v15a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    eyebrow: "Standards",
    titleKey: "grid_2" as const,
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 4v5c0 4.387-2.88 8.194-7 9-4.12-.806-7-4.613-7-9V7l7-4zm-1 10l2 2 4-4" />
      </svg>
    ),
  },
  {
    eyebrow: "Access",
    titleKey: "grid_3" as const,
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 7h14M5 12h14M5 17h8" />
      </svg>
    ),
  },
];

const platformCards = [
  {
    eyebrow: "Media Library",
    title: "Videos & Clinical Media",
    body: "Reference videos, medical images, and educational media organized and searchable.",
    href: "/videos",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80",
    featured: true,
  },
  {
    eyebrow: "Clinical Cases",
    title: "Case Walkthroughs & Quizzes",
    body: "Interactive diagnostic reasoning exercises across specialties.",
    href: "/cases",
    image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&w=800&q=80",
    featured: false,
  },
  {
    eyebrow: "USMLE Prep",
    title: "Exam Preparation",
    body: "Structured content and practice questions for USMLE Steps.",
    href: "/usmle",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80",
    featured: false,
  },
  {
    eyebrow: "Medical Books",
    title: "Curated Book Library",
    body: "Essential reading across medicine, from foundational texts to clinical references.",
    href: "/books",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80",
    featured: false,
  },
  {
    eyebrow: "Medical News",
    title: "Clinical Updates",
    body: "Current medical research, clinical guidelines, and healthcare news.",
    href: "/medical-news",
    image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80",
    featured: false,
  },
];

export default function Home() {
  const { t } = useLanguage();

  const featured = platformCards[0];
  const rest = platformCards.slice(1);

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-[#dbe8f5] bg-white dark:border-white/[0.06] dark:bg-[#070f1f]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_700px_500px_at_70%_50%,rgba(22,102,209,0.06),transparent_70%)] dark:bg-[radial-gradient(ellipse_700px_500px_at_70%_50%,rgba(22,102,209,0.12),transparent_70%)]" />

        <Container className="relative py-16 sm:py-20 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[1fr_460px] lg:items-center xl:grid-cols-[1fr_500px]">
            {/* Left: Content */}
            <div className="space-y-8 animate-fade-up">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#1666d1]/20 bg-[#eff6ff] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#1666d1] dark:border-sky-400/20 dark:bg-sky-400/10 dark:text-sky-300">
                <span className="h-1.5 w-1.5 rounded-full bg-[#1666d1] animate-pulse-dot dark:bg-sky-400" />
                {t.home.tagline_badge}
              </div>

              <div className="space-y-3">
                <h1 className="font-display text-balance text-4xl font-bold tracking-tight text-[#0c2d6b] dark:text-white sm:text-5xl lg:text-[3.25rem]">
                  Dr. {siteConfig.name}
                </h1>
                <p className="text-2xl font-normal text-[#4a6180] dark:text-slate-300 sm:text-3xl">
                  {siteConfig.title}
                </p>
              </div>

              <p className="max-w-xl text-pretty text-lg leading-8 text-[#4a6180] dark:text-slate-300">
                {t.home.tagline_main}
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/videos"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1666d1] px-6 py-3 text-sm font-semibold text-white shadow-[0_2px_8px_rgba(22,102,209,0.3)] transition-all hover:bg-[#1255b8] hover:shadow-[0_4px_16px_rgba(22,102,209,0.35)] active:translate-y-px"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {t.home.cta_videos}
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#dbe8f5] bg-white px-6 py-3 text-sm font-semibold text-[#374c66] shadow-sm transition-all hover:border-[#1666d1]/40 hover:bg-[#f4f8fd] hover:text-[#1666d1] active:translate-y-px dark:border-white/15 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10 dark:hover:text-sky-300"
                >
                  {t.home.cta_contact}
                </Link>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {t.home.focus_areas.map((label, index) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-2 rounded-full border border-[#dbe8f5] bg-[#f4f8fd] px-3.5 py-1.5 text-xs font-semibold text-[#374c66] dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
                  >
                    <span className="text-[10px] font-bold text-[#1666d1] dark:text-sky-400">0{index + 1}</span>
                    {label}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: Hero Image */}
            <div className="animate-fade-up stagger-2 relative">
              <div className="absolute -inset-4 -z-10 rounded-[2.5rem] bg-[radial-gradient(circle_at_60%_40%,rgba(22,102,209,0.12),transparent_60%)] blur-2xl" />
              <div className="relative overflow-hidden rounded-[2rem] border border-[#dbe8f5] bg-white shadow-[0_8px_40px_-12px_rgba(12,45,107,0.20),0_2px_8px_rgba(12,45,107,0.06)] dark:border-white/10 dark:bg-[#0d1b30]">
                <div className="absolute right-4 top-4 z-10 rounded-full border border-white/20 bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#0c2d6b] shadow-sm backdrop-blur dark:border-white/20 dark:bg-[#0c2d6b]/90 dark:text-white">
                  Clinical Portfolio
                </div>
                <div className="relative h-[400px] w-full sm:h-[500px]">
                  <Image
                    src={heroImage}
                    alt={`${siteConfig.name} portrait`}
                    priority
                    className="h-full w-full object-cover object-top"
                    sizes="(min-width: 1024px) 520px, 100vw"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white/60 to-transparent dark:from-[#0d1b30]/60" />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Platform Showcase ─────────────────────────── */}
      <section className="bg-[#f4f8fd] dark:bg-[#0d1b30]">
        <Container className="py-16 sm:py-20">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between animate-fade-up">
            <div className="space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#1666d1] dark:text-sky-400">
                Explore the Platform
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-[#0c2d6b] dark:text-white sm:text-3xl">
                {t.home.portfolio_title}
              </h2>
            </div>
          </div>

          {/* Featured + secondary grid */}
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Featured large card */}
            <Link
              href={featured.href}
              className="group relative overflow-hidden rounded-2xl shadow-sm transition-all hover:shadow-lg"
            >
              <div className="relative h-64 w-full sm:h-80 lg:h-full lg:min-h-[420px]">
                <Image
                  src={featured.image}
                  alt={featured.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c2d6b]/90 via-[#0c2d6b]/30 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-7">
                  <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-sky-300">
                    {featured.eyebrow}
                  </div>
                  <h3 className="text-xl font-bold text-white sm:text-2xl">{featured.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">{featured.body}</p>
                  <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-sky-300 transition-all group-hover:gap-2.5">
                    Explore <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </Link>

            {/* 2×2 secondary grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {rest.map((card) => (
                <Link
                  key={card.href}
                  href={card.href}
                  className="group relative overflow-hidden rounded-2xl shadow-sm transition-all hover:shadow-lg"
                >
                  <div className="relative h-52 w-full sm:h-full sm:min-h-[196px]">
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c2d6b]/85 via-[#0c2d6b]/25 to-transparent" />

                    <div className="absolute inset-0 flex flex-col justify-end p-5">
                      <div className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.22em] text-sky-300">
                        {card.eyebrow}
                      </div>
                      <h3 className="text-sm font-bold text-white leading-snug">{card.title}</h3>
                      <div className="mt-2.5 inline-flex items-center gap-1 text-xs font-semibold text-sky-300 opacity-0 transition-all group-hover:opacity-100 group-hover:gap-1.5">
                        Explore <ArrowRight className="h-3 w-3" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── Pillars / Features ───────────────────────── */}
      <section className="bg-white dark:bg-[#070f1f]">
        <Container className="py-16">
          <div className="mb-10 max-w-2xl space-y-2 animate-fade-up">
            <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#1666d1] dark:text-sky-400">
              Platform Pillars
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-[#0c2d6b] dark:text-white sm:text-3xl">
              What makes NdMedSphere different
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {pillarCards.map(({ eyebrow, titleKey, icon }, i) => {
              const item = t.home[titleKey];
              return (
                <div
                  key={eyebrow}
                  className="animate-fade-up group rounded-2xl border border-[#dbe8f5] bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-[#1666d1]/25 hover:shadow-[0_8px_32px_-8px_rgba(22,102,209,0.15)] dark:border-white/10 dark:bg-[#0f2040]"
                  style={{ animationDelay: `${i * 70}ms` }}
                >
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[#eff6ff] text-[#1666d1] transition-colors group-hover:bg-[#1666d1] group-hover:text-white dark:bg-sky-400/10 dark:text-sky-400">
                    {icon}
                  </div>
                  <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[#1666d1] dark:text-sky-400">
                    {eyebrow}
                  </div>
                  <div className="text-base font-semibold text-[#0c2d6b] dark:text-white">
                    {item.title}
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-[#4a6180] dark:text-slate-300">
                    {item.body}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>


{/* ── CTA Banner ───────────────────────────────── */}
      <section className="pb-20 pt-16 bg-white dark:bg-[#070f1f]">
        <Container>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0c2d6b] via-[#1255b8] to-[#1666d1] p-10 shadow-[0_24px_64px_-20px_rgba(12,45,107,0.50)]">
            <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 -translate-y-1/3 translate-x-1/3 rounded-full bg-white/10 blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 left-0 h-48 w-48 translate-y-1/3 -translate-x-1/4 rounded-full bg-[#0891b2]/30 blur-3xl" />
            <div className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

            <div className="relative grid gap-8 lg:grid-cols-2 lg:items-center">
              <div className="space-y-4">
                <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-sky-200/80">
                  Ready to explore?
                </div>
                <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  {t.home.bottom_title}
                </h2>
                <p className="text-sky-50/80 leading-7">{t.home.bottom_body}</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
                <Link
                  href="/videos"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-[#0c2d6b] shadow-sm transition-all hover:bg-sky-50 hover:shadow-md active:translate-y-px"
                >
                  {t.home.bottom_cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-lg border border-white/25 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition-all hover:bg-white/18 active:translate-y-px"
                >
                  {t.home.cta_contact}
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
