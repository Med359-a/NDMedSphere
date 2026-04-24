"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { Container } from "@/components/container";
import { useLanguage } from "@/lib/i18n";
import logo from "../logo.png";

export function SiteFooter() {
  const { t } = useLanguage();

  const links = [
    { href: "/about", label: t.nav.about },
    { href: "/books", label: t.nav.books },
    { href: "/usmle", label: t.nav.usmle },
    { href: "/cases", label: t.nav.cases },
    { href: "/videos", label: t.nav.videos },
    { href: "/medical-news", label: t.nav.news },
    { href: "/doctors", label: t.nav.doctors },
    { href: "/contact", label: t.nav.contact },
  ];

  return (
    <footer className="border-t border-black/[0.06] bg-white/50 backdrop-blur-sm dark:border-white/[0.07] dark:bg-zinc-950/50">
      <Container className="py-12">
        <div className="grid gap-10 md:grid-cols-3">

          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 overflow-hidden rounded-full border border-black/10 bg-white shadow-sm dark:border-white/15 dark:bg-zinc-900">
                <Image
                  src={logo}
                  alt="NdMedSphere"
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <div className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                  NdMedSphere
                </div>
                <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Dr. David Rekhviashvili
                </div>
              </div>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
              {t.footer.tagline}
            </p>
            <div className="flex items-center gap-3 pt-1">
              {siteConfig.social.facebook && (
                <a
                  href={siteConfig.social.facebook}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/8 bg-white/80 text-zinc-500 shadow-sm transition-all hover:scale-105 hover:border-black/15 hover:bg-white hover:text-zinc-900 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 dark:hover:text-white"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
              )}
              {siteConfig.social.youtube && (
                <a
                  href={siteConfig.social.youtube}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="YouTube"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/8 bg-white/80 text-zinc-500 shadow-sm transition-all hover:scale-105 hover:border-black/15 hover:bg-white hover:text-rose-600 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 dark:hover:text-rose-400"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              )}
            </div>
            <div className="text-xs text-zinc-400 dark:text-zinc-500">
              © {new Date().getFullYear()} NdMedSphere. {t.footer.rights}
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <div className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
              {t.footer.contact}
            </div>
            <div className="space-y-2 text-sm text-zinc-700 dark:text-zinc-200">
              <div className="flex items-center gap-2">
                <svg className="h-3.5 w-3.5 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  {siteConfig.contact.email}
                </a>
              </div>
              {siteConfig.contact.phone && (
                <div className="flex items-center gap-2">
                  <svg className="h-3.5 w-3.5 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>{siteConfig.contact.phone}</span>
                </div>
              )}
              {siteConfig.contact.location && (
                <div className="flex items-center gap-2">
                  <svg className="h-3.5 w-3.5 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{siteConfig.contact.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <div className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
              {t.footer.quick_links}
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="rounded-md py-1 text-sm text-zinc-600 transition-colors hover:text-emerald-600 dark:text-zinc-300 dark:hover:text-emerald-400"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-black/[0.05] pt-6 dark:border-white/[0.06]">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
        </div>
      </Container>
    </footer>
  );
}
