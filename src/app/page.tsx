"use client";

import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/container";
import { siteConfig } from "@/lib/site-config";
import heroImage from "@/image_50348545.jpg";
import logo from "../logo.png";
import { useLanguage } from "@/lib/i18n";

export default function Home() {
  const { t } = useLanguage();
  return (
    <div>
      {/* ── Hero ───────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <Container className="py-16 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">

            {/* Left: Logo + Text */}
            <div className="space-y-8 animate-fade-up">
              {/* Logo badge */}
              <div className="inline-flex items-center gap-3">
                <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-md ring-1 ring-black/[0.06] dark:border-white/15 dark:bg-zinc-900 dark:ring-white/10">
                  <Image
                    src={logo}
                    alt="NdMedSphere"
                    className="h-full w-full object-cover"
                    priority
                  />
                </div>
                <div>
                  <div className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-50">NdMedSphere</div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">Dr. David Rekhviashvili</div>
                </div>
              </div>

              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/8 px-3.5 py-1.5 text-xs font-semibold text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/8 dark:text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {t.home.tagline_badge}
                </div>

                <h1 className="font-display text-balance text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl lg:text-5xl">
                  DR.{" "}
                  <span className="text-zinc-900 dark:text-zinc-50">{siteConfig.name}</span>
                  <span className="block mt-1 text-3xl font-normal text-zinc-500 dark:text-zinc-400 sm:text-4xl">
                    — {siteConfig.title}
                  </span>
                </h1>

                <p className="max-w-xl text-pretty text-lg leading-8 text-zinc-600 dark:text-zinc-300">
                  {t.home.tagline_main}
                </p>

                <div className="flex flex-col gap-3 pt-1 sm:flex-row">
                  <Link
                    href="/videos"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-zinc-800 hover:shadow-md active:translate-y-px dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {t.home.cta_videos}
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white/80 px-6 py-3 text-sm font-semibold text-zinc-800 shadow-sm backdrop-blur transition-all hover:bg-white hover:shadow-md active:translate-y-px dark:border-white/15 dark:bg-white/5 dark:text-zinc-100 dark:hover:bg-white/10"
                  >
                    {t.home.cta_contact}
                  </Link>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {t.home.focus_areas.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-black/8 bg-white/70 px-3 py-1 text-xs font-medium text-zinc-600 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-zinc-300"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Portrait */}
            <div className="relative animate-fade-up stagger-2 lg:pt-4">
              <div className="absolute -inset-8 -z-10 rounded-[2.5rem] bg-gradient-to-br from-sky-500/15 via-emerald-500/10 to-transparent blur-3xl" />
              <div className="overflow-hidden rounded-[2rem] border border-black/8 bg-white/60 shadow-xl shadow-black/5 backdrop-blur dark:border-white/10 dark:bg-zinc-950/50 dark:shadow-black/30">
                <Image
                  src={heroImage}
                  alt={`${siteConfig.name} portrait`}
                  priority
                  className="h-[420px] w-full object-cover object-top sm:h-[520px]"
                  sizes="(min-width: 1024px) 520px, 100vw"
                />
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {[t.home.feature_1, t.home.feature_2, t.home.feature_3].map((item, i) => (
                  <div
                    key={item.k}
                    className="animate-fade-up rounded-2xl border border-black/8 bg-white/80 p-4 text-sm shadow-sm backdrop-blur dark:border-white/10 dark:bg-zinc-950/60"
                    style={{ animationDelay: `${200 + i * 60}ms` }}
                  >
                    <div className="text-xs font-medium text-zinc-400 dark:text-zinc-500">{item.k}</div>
                    <div className="mt-1 font-semibold text-zinc-900 dark:text-zinc-50">{item.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Pillars ─────────────────────────────────── */}
      <section className="border-y border-black/[0.05] bg-white/60 backdrop-blur-sm dark:border-white/[0.06] dark:bg-zinc-950/40">
        <Container className="py-14">
          <div className="grid gap-5 md:grid-cols-3">
            {[
              { eyebrow: "Clarity", item: t.home.grid_1, icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
              { eyebrow: "Precision", item: t.home.grid_2, icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
              { eyebrow: "Portfolio", item: t.home.grid_3, icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
            ].map(({ eyebrow, item, icon }) => (
              <div
                key={eyebrow}
                className="group rounded-2xl border border-black/8 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-zinc-950"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 dark:bg-emerald-400/10">
                  <svg className="h-5 w-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                  </svg>
                </div>
                <div className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">{eyebrow}</div>
                <div className="mt-1.5 text-base font-semibold text-zinc-900 dark:text-zinc-50">{item.title}</div>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">{item.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Portfolio Preview ────────────────────────── */}
      <section>
        <Container className="py-16">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                Portfolio
              </div>
              <h2 className="font-display text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                {t.home.portfolio_title}
              </h2>
              <p className="text-zinc-600 dark:text-zinc-300">{t.home.portfolio_body}</p>
            </div>
            <Link
              href="/videos"
              className="shrink-0 inline-flex items-center gap-1.5 rounded-xl border border-black/10 bg-white/80 px-5 py-2.5 text-sm font-semibold text-zinc-800 shadow-sm backdrop-blur transition-all hover:bg-white hover:shadow-md dark:border-white/15 dark:bg-white/5 dark:text-zinc-100 dark:hover:bg-white/10"
            >
              {t.home.portfolio_link}
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[t.home.card_1, t.home.card_2, t.home.card_3].map((s, i) => (
              <div
                key={s.title}
                className="animate-fade-up group rounded-2xl border border-black/8 bg-white/80 p-6 shadow-sm backdrop-blur transition-all hover:-translate-y-1 hover:bg-white hover:shadow-lg dark:border-white/10 dark:bg-zinc-950/60 dark:hover:bg-zinc-950"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="mb-3 text-2xl">{["🔬", "📚", "🤝"][i]}</div>
                <div className="text-base font-semibold text-zinc-900 dark:text-zinc-50">{s.title}</div>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">{s.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── CTA Banner ──────────────────────────────── */}
      <section className="pb-20">
        <Container>
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800 p-10 shadow-2xl dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900">
            {/* Decorative glow */}
            <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 -translate-y-1/4 translate-x-1/4 rounded-full bg-emerald-500/10 blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 left-0 h-48 w-48 translate-y-1/4 -translate-x-1/4 rounded-full bg-sky-500/8 blur-3xl" />

            <div className="relative grid gap-8 lg:grid-cols-2 lg:items-center">
              <div className="space-y-3">
                <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                  Ready to get started?
                </div>
                <h2 className="font-display text-3xl font-bold tracking-tight text-white">
                  {t.home.bottom_title}
                </h2>
                <p className="text-white/70">{t.home.bottom_body}</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
                <Link
                  href="/videos"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-zinc-900 shadow-sm transition-all hover:bg-zinc-50 hover:shadow-md"
                >
                  {t.home.bottom_cta}
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/8 px-6 py-3 text-sm font-semibold text-white shadow-sm backdrop-blur transition-all hover:bg-white/15"
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
