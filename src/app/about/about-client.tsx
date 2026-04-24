"use client";

import { Container } from "@/components/container";
import { siteConfig } from "@/lib/site-config";
import { useLanguage } from "@/lib/i18n";

export function AboutClient() {
  const { t } = useLanguage();
  return (
    <div>
      {/* ── Hero ─────────────────────────────────────── */}
      <section className="border-b border-black/[0.05] bg-white/50 backdrop-blur-sm dark:border-white/[0.06] dark:bg-zinc-950/40">
        <Container className="py-16 sm:py-20">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="space-y-5 animate-fade-up">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/8 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/8 dark:text-emerald-300">
                {t.about.title}
              </div>
              <h1 className="font-display text-balance text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
                {siteConfig.name}
              </h1>
              <p className="max-w-xl text-pretty text-lg leading-8 text-zinc-600 dark:text-zinc-300">
                {t.about.intro}
              </p>
            </div>

            <div className="relative animate-fade-up stagger-2">
              <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-sky-500/12 via-emerald-500/8 to-transparent blur-2xl" />
              <div className="rounded-[2rem] border border-black/8 bg-white/80 p-8 shadow-lg backdrop-blur dark:border-white/10 dark:bg-zinc-950/60">
                <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{t.about.glance}</div>
                <div className="mt-5 grid gap-3">
                  <div className="rounded-2xl border border-black/[0.06] bg-zinc-50 p-4 dark:border-white/[0.06] dark:bg-white/5">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                      {t.about.focus}
                    </div>
                    <div className="mt-1.5 font-semibold text-zinc-800 dark:text-zinc-100">
                      {siteConfig.focusAreas.join(" · ")}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-black/[0.06] bg-zinc-50 p-4 dark:border-white/[0.06] dark:bg-white/5">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                      Platform
                    </div>
                    <div className="mt-1.5 font-semibold text-zinc-800 dark:text-zinc-100">{siteConfig.title}</div>
                  </div>
                  <div className="rounded-2xl border border-black/[0.06] bg-zinc-50 p-4 dark:border-white/[0.06] dark:bg-white/5">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                      Contact
                    </div>
                    <div className="mt-1.5 font-semibold text-zinc-800 dark:text-zinc-100">
                      {siteConfig.contact.email}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Content ───────────────────────────────────── */}
      <section className="pb-20">
        <Container className="py-16">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-1">
              <h2 className="font-display text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                {t.about.approach_title}
              </h2>
              <p className="text-sm leading-7 text-zinc-600 dark:text-zinc-300">
                {t.about.approach_body_1}
              </p>
              <p className="text-sm leading-7 text-zinc-600 dark:text-zinc-300">
                {t.about.approach_body_2}
              </p>
            </div>
            <div className="grid gap-4 lg:col-span-2 md:grid-cols-2">
              {t.about.cards.map((card, i) => (
                <div
                  key={card.title}
                  className="animate-fade-up rounded-2xl border border-black/8 bg-white/80 p-6 shadow-sm backdrop-blur transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-zinc-950/60"
                  style={{ animationDelay: `${i * 70}ms` }}
                >
                  <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 dark:bg-emerald-400/10">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 dark:bg-emerald-400" />
                  </div>
                  <div className="text-base font-semibold text-zinc-900 dark:text-zinc-50">{card.title}</div>
                  <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">{card.body}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
