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
      <section className="relative overflow-hidden pt-8">
        <Container className="py-16 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Left Section: Logo and Content side-by-side on desktop to avoid overlap */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[auto_1fr] lg:items-start lg:gap-10 lg:pt-4">
              {/* Logo container */}
              <div className="flex justify-center lg:justify-start">
                <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-full border border-black/10 bg-white/60 shadow-sm backdrop-blur transition-transform hover:scale-105 dark:border-white/15 dark:bg-zinc-950/50 sm:h-40 sm:w-40 xl:h-48 xl:w-48">
                  <Image
                    src={logo}
                    alt="Logo"
                    className="h-full w-full object-cover"
                    priority
                  />
                </div>
              </div>

              {/* Text content */}
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-3 py-1 text-xs font-medium text-zinc-700 shadow-sm backdrop-blur dark:border-white/15 dark:bg-zinc-950/50 dark:text-zinc-200">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  {t.home.tagline_badge}
                </div>

                <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
                  {siteConfig.name}
                  <span className="text-zinc-500 dark:text-zinc-300">
                    {" "}
                    — {siteConfig.title}
                  </span>
                </h1>

                <p className="max-w-xl text-pretty text-lg leading-8 text-zinc-700 dark:text-zinc-200">
                  {t.home.tagline_main}
                </p>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/videos"
                    className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 active:translate-y-px dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
                  >
                    {t.home.cta_videos}
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white/60 px-5 py-3 text-sm font-semibold text-zinc-900 shadow-sm backdrop-blur transition hover:bg-white active:translate-y-px dark:border-white/15 dark:bg-zinc-950/50 dark:text-zinc-50 dark:hover:bg-zinc-950"
                  >
                    {t.home.cta_contact}
                  </Link>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {t.home.focus_areas.map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-zinc-900/5 px-3 py-1 text-xs font-medium text-zinc-700 dark:bg-white/10 dark:text-zinc-200"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Section: Portrait */}
            <div className="relative">
              <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-sky-500/20 via-emerald-500/10 to-transparent blur-2xl" />
              <div className="overflow-hidden rounded-[2rem] border border-black/10 bg-white/60 shadow-sm backdrop-blur dark:border-white/15 dark:bg-zinc-950/50">
                <Image
                  src={heroImage}
                  alt={`${siteConfig.name} portrait`}
                  priority
                  className="h-[420px] w-full object-cover sm:h-[520px]"
                  sizes="(min-width: 1024px) 520px, 100vw"
                />
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {[
                  t.home.feature_1,
                  t.home.feature_2,
                  t.home.feature_3,
                ].map((item) => (
                  <div
                    key={item.k}
                    className="rounded-2xl border border-black/10 bg-white/60 p-4 text-sm shadow-sm backdrop-blur dark:border-white/15 dark:bg-zinc-950/50"
                  >
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">
                      {item.k}
                    </div>
                    <div className="mt-1 font-semibold">{item.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-y border-black/5 bg-white/50 backdrop-blur dark:border-white/10 dark:bg-zinc-950/40">
        <Container className="py-14">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 dark:bg-zinc-950 dark:ring-white/10">
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                Clarity
              </div>
              <div className="mt-2 text-lg font-semibold">{t.home.grid_1.title}</div>
              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                {t.home.grid_1.body}
              </p>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 dark:bg-zinc-950 dark:ring-white/10">
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                Precision
              </div>
              <div className="mt-2 text-lg font-semibold">{t.home.grid_2.title}</div>
              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                {t.home.grid_2.body}
              </p>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 dark:bg-zinc-950 dark:ring-white/10">
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                Portfolio
              </div>
              <div className="mt-2 text-lg font-semibold">{t.home.grid_3.title}</div>
              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                {t.home.grid_3.body}
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section>
        <Container className="py-16">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Portfolio
              </div>
              <h2 className="text-3xl font-semibold tracking-tight">
                {t.home.portfolio_title}
              </h2>
              <p className="text-zinc-700 dark:text-zinc-200">
                {t.home.portfolio_body}
              </p>
            </div>
            <Link
              href="/videos"
              className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white/60 px-5 py-3 text-sm font-semibold text-zinc-900 shadow-sm backdrop-blur transition hover:bg-white dark:border-white/15 dark:bg-zinc-950/50 dark:text-zinc-50 dark:hover:bg-zinc-950"
            >
              {t.home.portfolio_link} →
            </Link>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              t.home.card_1,
              t.home.card_2,
              t.home.card_3,
            ].map((s) => (
              <div
                key={s.title}
                className="group rounded-2xl border border-black/10 bg-white/60 p-6 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white dark:border-white/15 dark:bg-zinc-950/50 dark:hover:bg-zinc-950"
              >
                <div className="text-lg font-semibold">{s.title}</div>
                <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="pb-20">
        <Container>
          <div className="rounded-[2rem] border border-black/10 bg-gradient-to-br from-zinc-950 to-zinc-800 p-10 text-white shadow-sm dark:border-white/10">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
              <div className="space-y-3">
                <div className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
                  Ready to get started?
                </div>
                <h2 className="text-3xl font-semibold tracking-tight">
                  {t.home.bottom_title}
                </h2>
                <p className="text-white/80">
                  {t.home.bottom_body}
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
                <Link
                  href="/videos"
                  className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-zinc-900 shadow-sm transition hover:bg-zinc-100"
                >
                  {t.home.bottom_cta}
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-white/10"
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
