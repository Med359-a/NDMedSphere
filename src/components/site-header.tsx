"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import Image from "next/image";
import { useAdmin } from "@/lib/use-admin";
import { siteConfig } from "@/lib/site-config";
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
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="2"
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
        strokeWidth="2"
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
    { href: "/", label: t.nav.home },
    { href: "/about", label: t.nav.about },
    { href: "/books", label: t.nav.books },
    { href: "/usmle", label: t.nav.usmle },
    { href: "/cases", label: t.nav.cases },
    { href: "/videos", label: t.nav.videos },
    { href: "/personal-studying", label: t.nav.news },
    { href: "/contact", label: t.nav.contact },
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
    <header className="fixed inset-x-0 top-0 z-50 border-b border-black/5 bg-white/70 backdrop-blur dark:border-white/10 dark:bg-zinc-950/70">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href="/" className="group inline-flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-xs font-bold text-white shadow-sm ring-1 ring-black/5 transition group-hover:scale-105">
            DR
          </div>
          <span className="leading-tight">
            <span className="flex items-center gap-2 text-sm font-semibold tracking-tight">
              <span>{siteConfig.name}</span>
              {isAdmin ? (
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-200">
                  Admin
                </span>
              ) : null}
            </span>
            <span className="block text-xs text-zinc-500 dark:text-zinc-400">
              {siteConfig.title}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const active = isActivePath(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-zinc-900 text-white shadow-sm dark:bg-white dark:text-zinc-900"
                    : "text-zinc-700 hover:bg-zinc-900/5 hover:text-zinc-950 dark:text-zinc-200 dark:hover:bg-white/10 dark:hover:text-white",
                )}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => setLanguage(language === "en" ? "ka" : "en")}
            className="ml-2 rounded-xl px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-900/5 dark:text-zinc-200 dark:hover:bg-white/10"
          >
            {language === "en" ? "KA" : "EN"}
          </button>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={() => setLanguage(language === "en" ? "ka" : "en")}
            className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white/60 p-2 text-sm font-semibold text-zinc-900 shadow-sm backdrop-blur transition hover:bg-white dark:border-white/15 dark:bg-zinc-950/60 dark:text-zinc-50 dark:hover:bg-zinc-950"
          >
            {language === "en" ? "KA" : "EN"}
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white/60 p-2 text-zinc-900 shadow-sm backdrop-blur transition hover:bg-white dark:border-white/15 dark:bg-zinc-950/60 dark:text-zinc-50 dark:hover:bg-zinc-950"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </Container>

      {open ? (
        <div className="md:hidden">
          <div className="border-t border-black/5 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-zinc-950/80">
            <Container className="py-4">
              <div className="grid gap-1">
                {navItems.map((item) => {
                  const active = isActivePath(pathname, item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "rounded-xl px-3 py-3 text-sm font-medium transition-colors",
                        active
                          ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                          : "text-zinc-800 hover:bg-zinc-900/5 dark:text-zinc-200 dark:hover:bg-white/10",
                      )}
                      aria-current={active ? "page" : undefined}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </Container>
          </div>
        </div>
      ) : null}
    </header>
  );
}


