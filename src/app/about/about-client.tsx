"use client";

import { Container } from "@/components/container";
import { siteConfig } from "@/lib/site-config";
import { useLanguage } from "@/lib/i18n";

export function AboutClient() {
  const { t } = useLanguage();
  return (
    <div>
      {/* ── Hero ─────────────────────────────────────── */}
      <section className="border-b border-[#dbe8f5] bg-white dark:border-white/[0.06] dark:bg-[#070f1f]">
        <Container className="py-16 sm:py-20">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="space-y-5 animate-fade-up">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#1666d1]/20 bg-[#eff6ff] px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#1666d1] dark:border-sky-400/20 dark:bg-sky-400/10 dark:text-sky-300">
                {t.about.title}
              </div>
              <h1 className="font-display text-balance text-4xl font-bold tracking-tight text-[#0c2d6b] dark:text-white sm:text-5xl">
                {siteConfig.name}
              </h1>
              <p className="max-w-xl text-pretty text-lg leading-8 text-[#4a6180] dark:text-slate-300">
                {t.about.intro}
              </p>
            </div>

            <div className="relative animate-fade-up stagger-2">
              <div className="rounded-2xl border border-[#dbe8f5] bg-[#f4f8fd] p-6 shadow-sm dark:border-white/10 dark:bg-[#0d1b30]">
                <div className="mb-5 text-sm font-bold text-[#0c2d6b] dark:text-white">{t.about.glance}</div>
                <div className="grid gap-3">
                  <div className="rounded-xl border border-[#dbe8f5] bg-white p-4 dark:border-white/[0.08] dark:bg-[#0f2040]">
                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7a90ab] dark:text-slate-500">
                      {t.about.focus}
                    </div>
                    <div className="mt-2 font-semibold text-[#0c2d6b] dark:text-white">
                      {siteConfig.focusAreas.join(" · ")}
                    </div>
                  </div>
                  <div className="rounded-xl border border-[#dbe8f5] bg-white p-4 dark:border-white/[0.08] dark:bg-[#0f2040]">
                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7a90ab] dark:text-slate-500">
                      Platform
                    </div>
                    <div className="mt-2 font-semibold text-[#0c2d6b] dark:text-white">{siteConfig.title}</div>
                  </div>
                  <div className="rounded-xl border border-[#dbe8f5] bg-white p-4 dark:border-white/[0.08] dark:bg-[#0f2040]">
                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7a90ab] dark:text-slate-500">
                      Contact
                    </div>
                    <div className="mt-2 font-semibold text-[#0c2d6b] dark:text-white">
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
      <section className="bg-[#f4f8fd] dark:bg-[#0d1b30]">
        <Container className="py-16">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="space-y-5 lg:col-span-1 animate-fade-up">
              <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#1666d1] dark:text-sky-400">
                Approach
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-[#0c2d6b] dark:text-white">
                {t.about.approach_title}
              </h2>
              <p className="text-sm leading-7 text-[#4a6180] dark:text-slate-300">
                {t.about.approach_body_1}
              </p>
              <p className="text-sm leading-7 text-[#4a6180] dark:text-slate-300">
                {t.about.approach_body_2}
              </p>
            </div>

            <div className="grid gap-4 lg:col-span-2 md:grid-cols-2">
              {t.about.cards.map((card, i) => (
                <div
                  key={card.title}
                  className="animate-fade-up group rounded-2xl border border-[#dbe8f5] bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#1666d1]/25 hover:shadow-[0_8px_28px_-8px_rgba(22,102,209,0.14)] dark:border-white/10 dark:bg-[#0f2040]"
                  style={{ animationDelay: `${i * 70}ms` }}
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#eff6ff] text-[#1666d1] transition-colors group-hover:bg-[#1666d1] group-hover:text-white dark:bg-sky-400/10 dark:text-sky-400">
                    <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="text-base font-semibold text-[#0c2d6b] dark:text-white">{card.title}</div>
                  <p className="mt-2 text-sm leading-6 text-[#4a6180] dark:text-slate-300">{card.body}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── CTA ─────────────────────────────────────── */}
      <section className="border-t border-[#dbe8f5] bg-white pb-20 dark:border-white/[0.06] dark:bg-[#070f1f]">
        <Container className="py-16">
          <div className="rounded-2xl bg-gradient-to-br from-[#0c2d6b] via-[#1255b8] to-[#1666d1] p-10 shadow-[0_16px_48px_-16px_rgba(12,45,107,0.40)]">
            <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
            <div className="max-w-xl space-y-4">
              <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-sky-200/80">
                Get in touch
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Ready to learn more?
              </h2>
              <p className="text-sky-50/80 leading-7">
                Reach out to discuss clinical learning, USMLE preparation, or any of the services offered through NdMedSphere.
              </p>
              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-[#0c2d6b] shadow-sm transition hover:bg-sky-50 hover:shadow-md"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Send an Email
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
