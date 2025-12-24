"use client";

import { Container } from "@/components/container";
import { siteConfig } from "@/lib/site-config";
import { useLanguage } from "@/lib/i18n";

export function ContactClient() {
  const { t } = useLanguage();
  return (
    <div>
      <section className="border-b border-black/5 bg-white/50 backdrop-blur dark:border-white/10 dark:bg-zinc-950/40">
        <Container className="py-14 sm:py-18">
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              {t.contact.title}
            </div>
            <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              {t.contact.title}
            </h1>
            <p className="max-w-2xl text-pretty text-lg leading-8 text-zinc-700 dark:text-zinc-200">
              {t.contact.intro}
            </p>
          </div>
        </Container>
      </section>

      <section>
        <Container className="py-16">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <div className="space-y-6">
              <div className="rounded-[2rem] border border-black/10 bg-white/60 p-8 shadow-sm backdrop-blur dark:border-white/15 dark:bg-zinc-950/50">
                <div className="text-lg font-semibold">{t.contact.details}</div>
                <div className="mt-4 grid gap-3 text-sm text-zinc-700 dark:text-zinc-200">
                  <div className="rounded-2xl bg-zinc-900/5 p-4 dark:bg-white/10">
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">
                      Email
                    </div>
                    <div className="mt-1 font-medium">{siteConfig.contact.email}</div>
                  </div>
                  {siteConfig.contact.phone ? (
                    <div className="rounded-2xl bg-zinc-900/5 p-4 dark:bg-white/10">
                      <div className="text-xs text-zinc-500 dark:text-zinc-400">
                        Phone
                      </div>
                      <div className="mt-1 font-medium">{siteConfig.contact.phone}</div>
                    </div>
                  ) : null}
                  {siteConfig.contact.location ? (
                    <div className="rounded-2xl bg-zinc-900/5 p-4 dark:bg-white/10">
                      <div className="text-xs text-zinc-500 dark:text-zinc-400">
                        Location
                      </div>
                      <div className="mt-1 font-medium">
                        {siteConfig.contact.location}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="rounded-[2rem] border border-black/10 bg-white/60 p-8 shadow-sm backdrop-blur dark:border-white/15 dark:bg-zinc-950/50">
                <div className="text-lg font-semibold">{t.contact.social}</div>
                <div className="mt-4 grid gap-2">
                  {siteConfig.social.facebook ? (
                    <a
                      href={siteConfig.social.facebook}
                      className="rounded-xl bg-zinc-900/5 px-4 py-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-900/10 dark:bg-white/10 dark:text-zinc-50 dark:hover:bg-white/15"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Facebook
                    </a>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-black/10 bg-white/60 p-8 shadow-sm backdrop-blur dark:border-white/15 dark:bg-zinc-950/50">
              <div className="text-lg font-semibold">{t.contact.personal_studying}</div>
              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                {t.contact.personal_studying_body}
              </p>
              <div className="mt-6">
                <a
                  href={`mailto:${siteConfig.contact.email}?subject=Personal%20Studying%20Inquiry`}
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-zinc-900 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
                >
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
