"use client";

import { Container } from "@/components/container";
import { siteConfig } from "@/lib/site-config";
import { useLanguage } from "@/lib/i18n";

export function ContactClient() {
  const { t } = useLanguage();
  return (
    <div>
      {/* ── Hero ─────────────────────────────────────── */}
      <section className="border-b border-black/[0.05] bg-white/50 backdrop-blur-sm dark:border-white/[0.06] dark:bg-zinc-950/40">
        <Container className="py-16 sm:py-20">
          <div className="max-w-2xl space-y-4 animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/8 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-blue-700 dark:border-blue-400/20 dark:bg-blue-400/8 dark:text-blue-300">
              {t.contact.title}
            </div>
            <h1 className="font-display text-balance text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
              {t.contact.title}
            </h1>
            <p className="text-pretty text-lg leading-8 text-zinc-600 dark:text-zinc-300">
              {t.contact.intro}
            </p>
          </div>
        </Container>
      </section>

      {/* ── Content ───────────────────────────────────── */}
      <section className="pb-20">
        <Container className="py-16">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
            <div className="space-y-5">
              {/* Contact Details */}
              <div className="animate-fade-up rounded-[2rem] border border-black/8 bg-white/80 p-8 shadow-sm backdrop-blur dark:border-white/10 dark:bg-zinc-950/60">
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 dark:bg-blue-400/10">
                    <svg className="h-4.5 w-4.5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">{t.contact.details}</h2>
                </div>
                <div className="grid gap-3">
                  <div className="rounded-2xl border border-black/[0.06] bg-zinc-50 p-4 dark:border-white/[0.06] dark:bg-white/5">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Email</div>
                    <a
                      href={`mailto:${siteConfig.contact.email}`}
                      className="mt-1.5 block font-semibold text-zinc-800 transition-colors hover:text-blue-600 dark:text-zinc-100 dark:hover:text-blue-400"
                    >
                      {siteConfig.contact.email}
                    </a>
                  </div>
                  {siteConfig.contact.phone && (
                    <div className="rounded-2xl border border-black/[0.06] bg-zinc-50 p-4 dark:border-white/[0.06] dark:bg-white/5">
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Phone</div>
                      <div className="mt-1.5 font-semibold text-zinc-800 dark:text-zinc-100">{siteConfig.contact.phone}</div>
                    </div>
                  )}
                  {siteConfig.contact.location && (
                    <div className="rounded-2xl border border-black/[0.06] bg-zinc-50 p-4 dark:border-white/[0.06] dark:bg-white/5">
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Location</div>
                      <div className="mt-1.5 font-semibold text-zinc-800 dark:text-zinc-100">{siteConfig.contact.location}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Social */}
              <div className="animate-fade-up stagger-1 rounded-[2rem] border border-black/8 bg-white/80 p-8 shadow-sm backdrop-blur dark:border-white/10 dark:bg-zinc-950/60">
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10 dark:bg-sky-400/10">
                    <svg className="h-4.5 w-4.5 text-sky-600 dark:text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">{t.contact.social}</h2>
                </div>
                <div className="grid gap-2">
                  {siteConfig.social.facebook && (
                    <a
                      href={siteConfig.social.facebook}
                      className="flex items-center gap-3 rounded-xl border border-black/[0.06] bg-zinc-50 px-4 py-3 text-sm font-medium text-zinc-700 transition-all hover:border-blue-500/30 hover:bg-blue-50/50 hover:text-blue-700 dark:border-white/[0.06] dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-blue-500/10 dark:hover:text-blue-300"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <svg className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                      </svg>
                      Facebook
                      <svg className="ml-auto h-3.5 w-3.5 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                  {siteConfig.social.youtube && (
                    <a
                      href={siteConfig.social.youtube}
                      className="flex items-center gap-3 rounded-xl border border-black/[0.06] bg-zinc-50 px-4 py-3 text-sm font-medium text-zinc-700 transition-all hover:border-rose-500/30 hover:bg-rose-50/50 hover:text-rose-700 dark:border-white/[0.06] dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-rose-500/10 dark:hover:text-rose-300"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <svg className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                      YouTube
                      <svg className="ml-auto h-3.5 w-3.5 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Personal Studying CTA */}
            <div className="animate-fade-up stagger-2 rounded-[2rem] border border-black/8 bg-white/80 p-8 shadow-sm backdrop-blur dark:border-white/10 dark:bg-zinc-950/60">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10 dark:bg-violet-400/10">
                  <svg className="h-4.5 w-4.5 text-violet-600 dark:text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                  {t.contact.personal_studying}
                </h2>
              </div>
              <p className="text-sm leading-7 text-zinc-600 dark:text-zinc-300">
                {t.contact.personal_studying_body}
              </p>
              <div className="mt-8 space-y-4">
                <div className="rounded-2xl border border-black/[0.06] bg-zinc-50/80 p-5 dark:border-white/[0.06] dark:bg-white/5">
                  <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">What to expect</div>
                  <ul className="mt-3 space-y-2">
                    {["Personalized guidance", "Clinical reasoning coaching", "USMLE & exam prep", "Case-based mentorship"].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-200">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <a
                  href={`mailto:${siteConfig.contact.email}?subject=Personal%20Studying%20Inquiry`}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-zinc-800 hover:shadow-md dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {t.contact.send_email}
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
