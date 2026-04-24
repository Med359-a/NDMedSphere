"use client";

import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/container";
import { siteConfig } from "@/lib/site-config";
import heroImage from "@/image_50348545.jpg";
import logo from "../logo.png";
import { useLanguage } from "@/lib/i18n";

const pillarCards = [
  {
    eyebrow: "Clarity",
    titleKey: "grid_1" as const,
    icon: "M8 10h8M8 14h5m-7 7h12a2 2 0 002-2V7.828a2 2 0 00-.586-1.414l-3.828-3.828A2 2 0 0014.172 2H6a2 2 0 00-2 2v15a2 2 0 002 2z",
  },
  {
    eyebrow: "Standards",
    titleKey: "grid_2" as const,
    icon: "M12 3l7 4v5c0 4.387-2.88 8.194-7 9-4.12-.806-7-4.613-7-9V7l7-4zm-1 10l2 2 4-4",
  },
  {
    eyebrow: "Access",
    titleKey: "grid_3" as const,
    icon: "M5 7h14M5 12h14M5 17h8",
  },
];

export default function Home() {
  const { t } = useLanguage();

  return (
    <div>
      <section className="relative overflow-hidden pt-6">
        <Container className="py-10 sm:py-16">
          <div className="relative overflow-hidden rounded-[2.75rem] border border-[#0b5aad]/12 bg-gradient-to-br from-[#08356f] via-[#0d5db8] to-[#8bb7f0] px-6 py-8 text-white shadow-[0_30px_80px_-36px_rgba(8,53,111,0.56)] sm:px-10 sm:py-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(4,24,52,0.24),transparent_38%)]" />
            <div className="absolute left-0 top-0 h-44 w-44 -translate-x-1/3 -translate-y-1/3 rounded-full bg-white/16 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-64 w-64 translate-x-1/4 translate-y-1/4 rounded-full bg-[#041a37]/22 blur-3xl" />

            <div className="relative grid gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-3">
                  <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-white/16 bg-white/10 shadow-lg shadow-[#041a37]/20 backdrop-blur">
                    <Image
                      src={logo}
                      alt="NdMedSphere"
                      className="h-full w-full object-cover"
                      priority
                    />
                  </div>
                  <div>
                    <div className="text-base font-bold tracking-tight text-white">NdMedSphere</div>
                    <div className="text-xs text-sky-100/75">Dr. David Rekhviashvili</div>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-sky-50">
                    <span className="h-1.5 w-1.5 rounded-full bg-sky-200 animate-pulse" />
                    {t.home.tagline_badge}
                  </div>

                  <h1 className="font-display text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-5xl">
                    DR. {siteConfig.name}
                    <span className="mt-2 block text-3xl font-normal text-sky-100/78 sm:text-4xl">
                      {siteConfig.title}
                    </span>
                  </h1>

                  <p className="max-w-2xl text-pretty text-lg leading-8 text-sky-50/78">
                    {t.home.tagline_main}
                  </p>
                </div>

                <div className="flex flex-col gap-3 pt-1 sm:flex-row">
                  <Link
                    href="/videos"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#08356f] shadow-sm transition-all hover:bg-sky-50 hover:shadow-md active:translate-y-px"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {t.home.cta_videos}
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-full border border-white/18 bg-white/8 px-6 py-3 text-sm font-semibold text-white shadow-sm backdrop-blur transition-all hover:bg-white/14 active:translate-y-px"
                  >
                    {t.home.cta_contact}
                  </Link>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {t.home.focus_areas.map((label, index) => (
                    <div
                      key={label}
                      className="rounded-2xl border border-white/14 bg-white/10 px-4 py-3 shadow-sm backdrop-blur"
                    >
                      <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-100/70">
                        0{index + 1}
                      </div>
                      <div className="mt-2 text-sm font-semibold text-white">{label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative lg:pl-6">
                <div className="absolute -inset-5 -z-10 rounded-[2.5rem] bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.24),transparent_28%),radial-gradient(circle_at_30%_80%,rgba(2,17,39,0.22),transparent_36%)] blur-2xl" />
                <div className="relative overflow-hidden rounded-[2.2rem] border border-white/14 bg-white/8 shadow-[0_32px_80px_-40px_rgba(4,20,44,0.9)]">
                  <div className="absolute inset-0 bg-gradient-to-l from-[#8bb7f0]/20 via-[#0d5db8]/34 to-[#08356f]/88 mix-blend-multiply" />
                  <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#08356f] via-[#08356f]/35 to-transparent" />
                  <div className="absolute right-5 top-5 rounded-full border border-white/14 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-100/78 backdrop-blur">
                    Clinical Portfolio
                  </div>
                  <div className="relative h-[420px] w-full sm:h-[540px]">
                    <Image
                      src={heroImage}
                      alt={`${siteConfig.name} portrait`}
                      priority
                      className="h-full w-full object-cover object-top"
                      sizes="(min-width: 1024px) 520px, 100vw"
                      style={{
                        maskImage:
                          "linear-gradient(to left, rgba(0,0,0,1) 46%, rgba(0,0,0,0.9) 68%, rgba(0,0,0,0.18) 100%)",
                      }}
                    />
                  </div>
                  <div className="pointer-events-none absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-[#08356f]/78 via-[#08356f]/28 to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-y border-[#0b5aad]/8 bg-white/62 backdrop-blur-sm dark:border-white/[0.06] dark:bg-white/[0.02]">
        <Container className="py-14">
          <div className="grid gap-5 md:grid-cols-3">
            {pillarCards.map(({ eyebrow, titleKey, icon }) => {
              const item = t.home[titleKey];
              return (
                <div
                  key={eyebrow}
                  className="group rounded-[1.75rem] border border-[#0b5aad]/10 bg-white/88 p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-[#09172b]/82"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#0d5db8]/10 dark:bg-sky-400/10">
                    <svg
                      className="h-5 w-5 text-[#0d5db8] dark:text-sky-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.75}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                    </svg>
                  </div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0d5db8] dark:text-sky-300">
                    {eyebrow}
                  </div>
                  <div className="mt-2 text-base font-semibold text-zinc-900 dark:text-zinc-50">
                    {item.title}
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                    {item.body}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      <section>
        <Container className="py-16">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#0d5db8] dark:text-sky-300">
                Portfolio
              </div>
              <h2 className="font-display text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                {t.home.portfolio_title}
              </h2>
              <p className="text-zinc-600 dark:text-zinc-300">{t.home.portfolio_body}</p>
            </div>
            <Link
              href="/videos"
              className="shrink-0 inline-flex items-center gap-1.5 rounded-full border border-[#0b5aad]/12 bg-white/88 px-5 py-2.5 text-sm font-semibold text-[#08356f] shadow-sm backdrop-blur transition-all hover:bg-white hover:shadow-md dark:border-white/12 dark:bg-white/5 dark:text-zinc-100 dark:hover:bg-white/10"
            >
              {t.home.portfolio_link}
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[t.home.card_1, t.home.card_2, t.home.card_3].map((item, index) => (
              <div
                key={item.title}
                className="group rounded-[1.75rem] border border-[#0b5aad]/10 bg-white/88 p-6 shadow-sm transition-all hover:-translate-y-1 hover:bg-white hover:shadow-lg dark:border-white/10 dark:bg-[#09172b]/82 dark:hover:bg-[#0a1a31]"
              >
                <div className="mb-5 h-1 w-16 rounded-full bg-gradient-to-r from-[#0d5db8] to-sky-300" />
                <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0d5db8] dark:text-sky-300">
                  0{index + 1}
                </div>
                <div className="mt-2 text-base font-semibold text-zinc-900 dark:text-zinc-50">
                  {item.title}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="pb-20">
        <Container>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#082e60] via-[#0b4f9d] to-[#0d69d3] p-10 shadow-[0_36px_90px_-44px_rgba(8,46,96,0.72)]">
            <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 -translate-y-1/4 translate-x-1/4 rounded-full bg-white/10 blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 left-0 h-48 w-48 translate-y-1/4 -translate-x-1/4 rounded-full bg-[#021327]/30 blur-3xl" />

            <div className="relative grid gap-8 lg:grid-cols-2 lg:items-center">
              <div className="space-y-3">
                <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-sky-100/78">
                  Ready to get started?
                </div>
                <h2 className="font-display text-3xl font-bold tracking-tight text-white">
                  {t.home.bottom_title}
                </h2>
                <p className="text-sky-50/76">{t.home.bottom_body}</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
                <Link
                  href="/videos"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#08356f] shadow-sm transition-all hover:bg-sky-50 hover:shadow-md"
                >
                  {t.home.bottom_cta}
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full border border-white/18 bg-white/8 px-6 py-3 text-sm font-semibold text-white shadow-sm backdrop-blur transition-all hover:bg-white/14"
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
