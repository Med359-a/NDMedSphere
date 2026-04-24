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
    { href: "/cases", label: t.nav.cases },
    { href: "/usmle", label: t.nav.usmle },
    { href: "/videos", label: t.nav.medications },
    { href: "/medical-news", label: t.nav.news },
    { href: "/doctors", label: t.nav.doctors },
    { href: "/contact", label: t.nav.contact },
  ];

  return (
    <footer className="border-t border-[#dbe8f5] bg-[#f4f8fd] dark:border-white/[0.07] dark:bg-[#0d1b30]">
      <Container className="py-12">
        <div className="grid gap-10 md:grid-cols-[1fr_auto_auto]">

          {/* Brand column */}
          <div className="max-w-xs space-y-5">
            <div className="flex items-center gap-3">
              <Image src={logo} alt="NdMedSphere" className="h-12 w-12 object-contain" />
              <div>
                <div className="text-sm font-bold tracking-tight text-[#0c2d6b] dark:text-white">
                  NdMedSphere
                </div>
                <div className="text-[11px] text-[#7a90ab] dark:text-slate-400">
                  Dr. David Rekhviashvili
                </div>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-[#4a6180] dark:text-slate-300">
              {t.footer.tagline}
            </p>

            {/* Social links */}
            <div className="flex items-center gap-2">
              {siteConfig.social.facebook && (
                <a
                  href={siteConfig.social.facebook}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#dbe8f5] bg-white text-[#7a90ab] shadow-sm transition-all hover:border-[#1666d1]/30 hover:bg-[#eff6ff] hover:text-[#1666d1] dark:border-white/10 dark:bg-white/5 dark:hover:bg-sky-400/10 dark:hover:text-sky-300"
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
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#dbe8f5] bg-white text-[#7a90ab] shadow-sm transition-all hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 dark:border-white/10 dark:bg-white/5 dark:hover:bg-rose-400/10 dark:hover:text-rose-300"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Contact column */}
          <div className="space-y-4">
            <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#7a90ab] dark:text-slate-500">
              {t.footer.contact}
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2.5 text-[#374c66] dark:text-slate-300">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#eff6ff] dark:bg-sky-400/10">
                  <svg className="h-3.5 w-3.5 text-[#1666d1] dark:text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <a href={`mailto:${siteConfig.contact.email}`} className="transition-colors hover:text-[#1666d1] dark:hover:text-sky-300">
                  {siteConfig.contact.email}
                </a>
              </div>
              {siteConfig.contact.phone && (
                <div className="flex items-center gap-2.5 text-[#374c66] dark:text-slate-300">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#eff6ff] dark:bg-sky-400/10">
                    <svg className="h-3.5 w-3.5 text-[#1666d1] dark:text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <span>{siteConfig.contact.phone}</span>
                </div>
              )}
              {siteConfig.contact.location && (
                <div className="flex items-center gap-2.5 text-[#374c66] dark:text-slate-300">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#eff6ff] dark:bg-sky-400/10">
                    <svg className="h-3.5 w-3.5 text-[#1666d1] dark:text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <span>{siteConfig.contact.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Links column */}
          <div className="space-y-4">
            <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#7a90ab] dark:text-slate-500">
              {t.footer.quick_links}
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-sm text-[#4a6180] transition-colors hover:text-[#1666d1] dark:text-slate-300 dark:hover:text-sky-300"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-[#dbe8f5] pt-6 sm:flex-row dark:border-white/[0.06]">
          <div className="text-xs text-[#7a90ab] dark:text-slate-500">
            © {new Date().getFullYear()} NdMedSphere. {t.footer.rights}
          </div>
          <div className="flex items-center gap-1 text-xs text-[#7a90ab] dark:text-slate-500">
            <span>Powered by</span>
            <span className="font-semibold text-[#1666d1] dark:text-sky-400">NdMedSphere</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
