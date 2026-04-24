"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import * as React from "react";
import { useAdmin } from "@/lib/use-admin";
import { cn } from "@/lib/utils";
import { Container } from "@/components/container";
import { useLanguage } from "@/lib/i18n";
import logo from "../logo.png";

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M4 6h16M4 12h16M4 18h16"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SiteHeader() {
  const pathname = usePathname() ?? "/";
  const admin = useAdmin();
  const isAdmin = admin.isAdmin;
  const { t, language, setLanguage } = useLanguage();
  const [open, setOpen] = React.useState(false);

  const navItems = [
    {
      href: "/",
      label: t.nav.home,
      description: "Portfolio overview & featured content",
    },
    {
      href: "/about",
      label: t.nav.about,
      description: "Platform mission, focus areas & approach",
    },
    {
      href: "/books",
      label: t.nav.books,
      description: "Curated medical reading list & study resources",
    },
    {
      href: "/usmle",
      label: t.nav.usmle,
      description: "USMLE preparation materials & practice content",
    },
    {
      href: "/cases",
      label: t.nav.cases,
      description: "Clinical case studies & diagnostic quizzes",
    },
    {
      href: "/videos",
      label: t.nav.videos,
      description: "Procedure demos & educational video clips",
    },
    {
      href: "/medical-news",
      label: t.nav.news,
      description: "Latest research & medical updates",
    },
    {
      href: "/doctors",
      label: t.nav.doctors,
      description: "Browse doctor profiles & biographies",
    },
    {
      href: "/contact",
      label: t.nav.contact,
      description: "Get in touch for collaborations & inquiries",
    },
  ];

  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-black/[0.06] bg-[#f9f8f6]/85 backdrop-blur-md dark:border-white/[0.07] dark:bg-[#0d0f14]/85">
      <Container className="flex h-16 items-center justify-between gap-4">

        {/* ── Brand ─────────────────────────────────── */}
        <Link href="/" className="group inline-flex items-center gap-3 shrink-0">
          <div className="relative h-10 w-10 overflow-hidden rounded-full border border-black/10 bg-white shadow-sm ring-1 ring-black/[0.06] transition-all duration-300 group-hover:ring-2 group-hover:ring-emerald-500/40 group-hover:shadow-md dark:border-white/15 dark:bg-zinc-900 dark:ring-white/10 dark:group-hover:ring-emerald-400/40">
            <Image
              src={logo}
              alt="NdMedSphere logo"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              priority
              sizes="40px"
            />
          </div>
          <div className="leading-none">
            <div className="flex items-center gap-1.5">
              <span className="text-[15px] font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                NdMedSphere
              </span>
              {isAdmin && (
                <span className="rounded-full bg-emerald-500/12 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300">
                  Admin
                </span>
              )}
            </div>
            <span className="mt-0.5 block text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
              Dr. David Rekhviashvili
            </span>
          </div>
        </Link>

        {/* ── Desktop Nav ───────────────────────────── */}
        <nav className="hidden items-center gap-0.5 md:flex" aria-label="Main navigation">
          {navItems.map((item) => {
            const active = isActivePath(pathname, item.href);
            return (
              <div key={item.href} className="group relative">
                <Link
                  href={item.href}
                  className={cn(
                    "relative rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-150",
                    active
                      ? "bg-zinc-900 text-white shadow-sm dark:bg-zinc-100 dark:text-zinc-900"
                      : "text-zinc-600 hover:bg-black/[0.05] hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-white/[0.07] dark:hover:text-white",
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </Link>

                {/* Tooltip */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute left-1/2 top-[calc(100%+10px)] z-50 -translate-x-1/2 translate-y-1.5 scale-95 opacity-0 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100"
                >
                  {/* Arrow */}
                  <div className="mx-auto mb-[-1px] h-2.5 w-2.5 rotate-45 rounded-[2px] border-l border-t border-black/[0.07] bg-white dark:border-white/[0.08] dark:bg-zinc-900" />
                  <div className="w-52 overflow-hidden rounded-xl border border-black/[0.07] bg-white shadow-lg shadow-black/8 dark:border-white/[0.08] dark:bg-zinc-900 dark:shadow-black/40">
                    <div className="px-3.5 pt-2.5 pb-3">
                      <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-100">
                        {item.label}
                      </p>
                      <p className="mt-0.5 text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                        {item.description}
                      </p>
                    </div>
                    <div className="h-0.5 bg-gradient-to-r from-emerald-500/0 via-emerald-500/60 to-emerald-500/0" />
                  </div>
                </div>
              </div>
            );
          })}

          <button
            type="button"
            onClick={() => setLanguage(language === "en" ? "ka" : "en")}
            className="ml-2 rounded-lg border border-black/8 bg-white/70 px-2.5 py-1 text-xs font-bold tracking-wider text-zinc-600 shadow-sm transition-all hover:bg-white hover:text-zinc-900 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-white"
          >
            {language === "en" ? "KA" : "EN"}
          </button>
        </nav>

        {/* ── Mobile Controls ───────────────────────── */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={() => setLanguage(language === "en" ? "ka" : "en")}
            className="inline-flex items-center justify-center rounded-lg border border-black/10 bg-white/70 px-2.5 py-1.5 text-xs font-bold tracking-wider text-zinc-900 shadow-sm backdrop-blur transition hover:bg-white dark:border-white/15 dark:bg-zinc-900/60 dark:text-zinc-50 dark:hover:bg-zinc-900"
          >
            {language === "en" ? "KA" : "EN"}
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg border border-black/10 bg-white/70 p-2 text-zinc-900 shadow-sm backdrop-blur transition hover:bg-white dark:border-white/15 dark:bg-zinc-900/60 dark:text-zinc-50 dark:hover:bg-zinc-900"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <XIcon className="h-5 w-5" />
            ) : (
              <MenuIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      </Container>

      {/* ── Mobile Menu ───────────────────────────────── */}
      {open && (
        <div className="md:hidden animate-fade-in">
          <div className="border-t border-black/[0.06] bg-[#f9f8f6]/95 backdrop-blur-md dark:border-white/[0.07] dark:bg-[#0d0f14]/95">
            <Container className="py-2 pb-4">
              <div className="grid gap-0.5">
                {navItems.map((item, i) => {
                  const active = isActivePath(pathname, item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "animate-fade-up rounded-xl px-3 py-2.5 transition-colors",
                        active
                          ? "bg-zinc-900 dark:bg-zinc-100"
                          : "hover:bg-black/[0.04] dark:hover:bg-white/[0.06]",
                      )}
                      style={{ animationDelay: `${i * 30}ms` }}
                      aria-current={active ? "page" : undefined}
                    >
                      <div
                        className={cn(
                          "text-sm font-semibold",
                          active
                            ? "text-white dark:text-zinc-900"
                            : "text-zinc-800 dark:text-zinc-100",
                        )}
                      >
                        {item.label}
                      </div>
                      <div
                        className={cn(
                          "mt-0.5 text-xs",
                          active
                            ? "text-white/70 dark:text-zinc-700"
                            : "text-zinc-500 dark:text-zinc-400",
                        )}
                      >
                        {item.description}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </Container>
          </div>
        </div>
      )}
    </header>
  );
}
