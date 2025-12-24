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


