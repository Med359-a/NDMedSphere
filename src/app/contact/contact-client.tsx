"use client";

import { Container } from "@/components/container";
import { siteConfig } from "@/lib/site-config";
import { useLanguage } from "@/lib/i18n";

export function ContactClient() {
  const { t } = useLanguage();
  return (
    <div>
      {/* ── Hero ─────────────────────────────────────── */}
      <section className="border-b border-[#dbe8f5] bg-white dark:border-white/[0.06] dark:bg-[#070f1f]">
        <Container className="py-16 sm:py-20">
          <div className="max-w-2xl space-y-4 animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#1666d1]/20 bg-[#eff6ff] px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#1666d1] dark:border-sky-400/20 dark:bg-sky-400/10 dark:text-sky-300">
              {t.contact.title}
            </div>
            <h1 className="font-display text-balance text-4xl font-bold tracking-tight text-[#0c2d6b] dark:text-white sm:text-5xl">
              {t.contact.title}
            </h1>
            <p className="text-pretty text-lg leading-8 text-[#4a6180] dark:text-slate-300">
              {t.contact.intro}
            </p>
          </div>
        </Container>
      </section>

      {/* ── Content ───────────────────────────────────── */}
      <section className="bg-[#f4f8fd] pb-20 dark:bg-[#0d1b30]">
        <Container className="py-16">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-start">

            {/* Left column */}
            <div className="space-y-5">
              {/* Contact Details */}
              <div className="animate-fade-up rounded-2xl border border-[#dbe8f5] bg-white p-7 shadow-sm dark:border-white/10 dark:bg-[#0f2040]">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eff6ff] text-[#1666d1] dark:bg-sky-400/10 dark:text-sky-400">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h2 className="text-base font-bold text-[#0c2d6b] dark:text-white">{t.contact.details}</h2>
                </div>

                <div className="grid gap-3">
                  <div className="rounded-xl border border-[#dbe8f5] bg-[#f4f8fd] p-4 dark:border-white/[0.08] dark:bg-[#0d1b30]">
                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7a90ab] dark:text-slate-500">Email</div>
                    <a
                      href={`mailto:${siteConfig.contact.email}`}
                      className="mt-1.5 block font-semibold text-[#0c2d6b] transition-colors hover:text-[#1666d1] dark:text-white dark:hover:text-sky-300"
                    >
                      {siteConfig.contact.email}
                    </a>
                  </div>
                  {siteConfig.contact.phone && (
                    <div className="rounded-xl border border-[#dbe8f5] bg-[#f4f8fd] p-4 dark:border-white/[0.08] dark:bg-[#0d1b30]">
                      <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7a90ab] dark:text-slate-500">Phone</div>
                      <div className="mt-1.5 font-semibold text-[#0c2d6b] dark:text-white">{siteConfig.contact.phone}</div>
                    </div>
                  )}
                  {siteConfig.contact.location && (
                    <div className="rounded-xl border border-[#dbe8f5] bg-[#f4f8fd] p-4 dark:border-white/[0.08] dark:bg-[#0d1b30]">
                      <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7a90ab] dark:text-slate-500">Location</div>
                      <div className="mt-1.5 font-semibold text-[#0c2d6b] dark:text-white">{siteConfig.contact.location}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Social */}
              <div className="animate-fade-up stagger-1 rounded-2xl border border-[#dbe8f5] bg-white p-7 shadow-sm dark:border-white/10 dark:bg-[#0f2040]">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eff6ff] text-[#0891b2] dark:bg-sky-400/10 dark:text-sky-400">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  <h2 className="text-base font-bold text-[#0c2d6b] dark:text-white">{t.contact.social}</h2>
                </div>

                <div className="grid gap-2">
                  {siteConfig.social.facebook && (
                    <a
                      href={siteConfig.social.facebook}
                      className="flex items-center gap-3 rounded-xl border border-[#dbe8f5] bg-[#f4f8fd] px-4 py-3 text-sm font-medium text-[#374c66] transition-all hover:border-[#1666d1]/30 hover:bg-[#eff6ff] hover:text-[#1666d1] dark:border-white/[0.08] dark:bg-[#0d1b30] dark:text-slate-200 dark:hover:bg-sky-400/10 dark:hover:text-sky-300"
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
                      className="flex items-center gap-3 rounded-xl border border-[#dbe8f5] bg-[#f4f8fd] px-4 py-3 text-sm font-medium text-[#374c66] transition-all hover:border-rose-500/30 hover:bg-rose-50 hover:text-rose-700 dark:border-white/[0.08] dark:bg-[#0d1b30] dark:text-slate-200 dark:hover:bg-rose-500/10 dark:hover:text-rose-300"
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

            {/* Right column: Personal Studying */}
            <div className="animate-fade-up stagger-2 rounded-2xl border border-[#dbe8f5] bg-white p-7 shadow-sm dark:border-white/10 dark:bg-[#0f2040]">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eff6ff] text-[#7c3aed] dark:bg-violet-400/10 dark:text-violet-400">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h2 className="text-base font-bold text-[#0c2d6b] dark:text-white">
                  {t.contact.personal_studying}
                </h2>
              </div>

              <p className="text-sm leading-7 text-[#4a6180] dark:text-slate-300">
                {t.contact.personal_studying_body}
              </p>

              <div className="mt-8 space-y-5">
                {/* What to expect */}
                <div className="rounded-xl border border-[#dbe8f5] bg-[#f4f8fd] p-5 dark:border-white/[0.08] dark:bg-[#0d1b30]">
                  <div className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#7a90ab] dark:text-slate-500">
                    What to expect
                  </div>
                  <ul className="space-y-2">
                    {[
                      "Personalized guidance",
                      "Clinical reasoning coaching",
                      "USMLE & exam prep",
                      "Case-based mentorship",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2.5 text-sm text-[#374c66] dark:text-slate-200">
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#eff6ff] dark:bg-sky-400/10">
                          <svg className="h-3 w-3 text-[#1666d1] dark:text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href={`mailto:${siteConfig.contact.email}?subject=Personal%20Studying%20Inquiry`}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1666d1] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_2px_8px_rgba(22,102,209,0.3)] transition-all hover:bg-[#1255b8] hover:shadow-[0_4px_16px_rgba(22,102,209,0.35)]"
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
