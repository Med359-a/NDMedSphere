"use client";

import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { Container } from "@/components/container";
import { useLanguage } from "@/lib/i18n";

export function SiteFooter() {
  const { t } = useLanguage();

  const links = [
    { href: "/about", label: t.nav.about },
    { href: "/books", label: t.nav.books },
    { href: "/usmle", label: t.nav.usmle },
    { href: "/cases", label: t.nav.cases },
    { href: "/videos", label: t.nav.videos },
    { href: "/personal-studying", label: t.nav.news },
    { href: "/contact", label: t.nav.contact },
  ];

  return (
    <footer className="border-t border-black/5 bg-white/60 backdrop-blur dark:border-white/10 dark:bg-zinc-950/60">
      <Container className="grid gap-10 py-12 md:grid-cols-3">
        <div className="space-y-3">
          <div className="text-sm font-semibold">{siteConfig.name}</div>
          <p className="max-w-sm text-sm text-zinc-600 dark:text-zinc-300">
            {t.footer.tagline}
          </p>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            © {new Date().getFullYear()} {siteConfig.name}. {t.footer.rights}
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-sm font-semibold">{t.footer.contact}</div>
          <div className="space-y-1 text-sm text-zinc-700 dark:text-zinc-200">
            <div>
              <span className="text-zinc-500 dark:text-zinc-400">Email:</span>{" "}
              {siteConfig.contact.email}
            </div>
            {siteConfig.contact.phone ? (
              <div>
                <span className="text-zinc-500 dark:text-zinc-400">Phone:</span>{" "}
                {siteConfig.contact.phone}
              </div>
            ) : null}
            {siteConfig.contact.location ? (
              <div>
                <span className="text-zinc-500 dark:text-zinc-400">
                  Location:
                </span>{" "}
                {siteConfig.contact.location}
              </div>
            ) : null}
            <div className="mt-4 flex gap-3">
              {siteConfig.social.facebook && (
                <a
                  href={siteConfig.social.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
                  aria-label="Facebook"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
              )}
              {siteConfig.social.youtube && (
                <a
                  href={siteConfig.social.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
                  aria-label="YouTube"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-sm font-semibold">{t.footer.quick_links}</div>
          <div className="grid gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-xl px-3 py-2 text-sm text-zinc-700 transition hover:bg-zinc-900/5 hover:text-zinc-950 dark:text-zinc-200 dark:hover:bg-white/10 dark:hover:text-white"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}


