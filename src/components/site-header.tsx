"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { Container } from "@/components/container";
import { useLanguage } from "@/lib/i18n";
import {
  DOCTOR_NICHES,
  PRODUCT_PAGES,
  RESOURCE_LINKS,
  SERVICE_PAGES,
} from "@/lib/site-sections";
import { useAdmin } from "@/lib/use-admin";
import { cn } from "@/lib/utils";
import logo from "../logo.png";

type GroupKey = "resources" | "products" | "services" | "doctors";

function matchesPath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function ChevronDown(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M19 9l-7 7-7-7" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M13 7l5 5m0 0l-5 5m5-5H6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SiteHeader() {
  const pathname = usePathname() ?? "/";
  const admin = useAdmin();
  const isAdmin = admin.isAdmin;
  const { t, language, setLanguage } = useLanguage();
  const [open, setOpen] = React.useState(false);
  const [hoveredGroup, setHoveredGroup] = React.useState<GroupKey | null>(null);

  const groupedLinks = React.useMemo(
    () => ({
      resources: RESOURCE_LINKS.map((item) => ({ title: item.title, href: item.href })),
      products: PRODUCT_PAGES.map((item) => ({ title: item.title, href: item.href })),
      services: SERVICE_PAGES.map((item) => ({ title: item.title, href: item.href })),
    }),
    [],
  );

  const groupMeta: Record<GroupKey, { label: string; href?: string; countLabel: string }> = {
    resources: { label: t.nav.resources, countLabel: `${RESOURCE_LINKS.length} pages` },
    products:  { label: t.nav.products,  countLabel: `${PRODUCT_PAGES.length} topics` },
    services:  { label: t.nav.services,  countLabel: `${SERVICE_PAGES.length} services` },
    doctors:   { label: t.nav.doctors,   href: "/doctors", countLabel: `${DOCTOR_NICHES.length} specialties` },
  };

  const groupActive = {
    resources: groupedLinks.resources.some((item) => matchesPath(pathname, item.href)),
    products:  groupedLinks.products.some((item) => matchesPath(pathname, item.href)),
    services:  groupedLinks.services.some((item) => matchesPath(pathname, item.href)),
    doctors:   matchesPath(pathname, "/doctors"),
  };

  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  React.useEffect(() => {
    setOpen(false);
    setHoveredGroup(null);
  }, [pathname]);

  const hoveredLinks =
    hoveredGroup === "resources" ? groupedLinks.resources :
    hoveredGroup === "products"  ? groupedLinks.products :
    hoveredGroup === "services"  ? groupedLinks.services : [];

  const navLinkClass = (active: boolean, hovered?: boolean) =>
    cn(
      "inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-150",
      active
        ? "text-[#1666d1] bg-[#eff6ff]"
        : hovered
          ? "text-[#1666d1] bg-[#f4f8fd]"
          : "text-[#374c66] hover:text-[#1666d1] hover:bg-[#f4f8fd] dark:text-slate-300 dark:hover:text-sky-300 dark:hover:bg-white/[0.06]",
    );

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 border-b border-[#dbe8f5] bg-white/95 backdrop-blur-md dark:border-white/[0.08] dark:bg-[#070f1f]/95"
      onMouseLeave={() => setHoveredGroup(null)}
    >
      <Container className="flex h-[68px] items-center justify-between gap-4">
        {/* Logo */}
        <Link
          href="/"
          className="group inline-flex shrink-0 items-center gap-3"
          onMouseEnter={() => setHoveredGroup(null)}
        >
          <Image
            src={logo}
            alt="NdMedSphere logo"
            className="h-11 w-11 object-contain transition-transform duration-300 group-hover:scale-105"
            priority
            sizes="44px"
          />
          <div className="leading-none">
            <div className="flex items-center gap-1.5">
              <span className="text-[15px] font-bold tracking-tight text-[#0c2d6b] dark:text-white">
                NdMedSphere
              </span>
              {isAdmin && (
                <span className="rounded-full bg-[#1666d1]/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#1666d1] dark:bg-sky-400/15 dark:text-sky-300">
                  Admin
                </span>
              )}
            </div>
            <span className="mt-0.5 block text-[11px] font-medium text-[#7a90ab] dark:text-slate-400">
              Dr. David Rekhviashvili
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-0.5 md:flex" aria-label="Main navigation">
          <Link
            href="/"
            onMouseEnter={() => setHoveredGroup(null)}
            className={navLinkClass(matchesPath(pathname, "/"))}
            aria-current={matchesPath(pathname, "/") ? "page" : undefined}
          >
            {t.nav.home}
          </Link>

          {(["resources", "products", "services"] as const).map((group) => (
            <button
              key={group}
              type="button"
              onMouseEnter={() => setHoveredGroup(group)}
              onFocus={() => setHoveredGroup(group)}
              className={navLinkClass(groupActive[group], hoveredGroup === group)}
            >
              {groupMeta[group].label}
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 transition-transform duration-200",
                  hoveredGroup === group ? "rotate-180" : "",
                )}
              />
            </button>
          ))}

          <Link
            href="/videos"
            onMouseEnter={() => setHoveredGroup(null)}
            className={navLinkClass(matchesPath(pathname, "/videos"))}
            aria-current={matchesPath(pathname, "/videos") ? "page" : undefined}
          >
            {t.nav.medications}
          </Link>

          <Link
            href="/doctors"
            onMouseEnter={() => setHoveredGroup("doctors")}
            onFocus={() => setHoveredGroup("doctors")}
            className={navLinkClass(groupActive.doctors, hoveredGroup === "doctors")}
            aria-current={groupActive.doctors ? "page" : undefined}
          >
            {t.nav.doctors}
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 transition-transform duration-200",
                hoveredGroup === "doctors" ? "rotate-180" : "",
              )}
            />
          </Link>

          <Link
            href="/about"
            onMouseEnter={() => setHoveredGroup(null)}
            className={navLinkClass(matchesPath(pathname, "/about"))}
            aria-current={matchesPath(pathname, "/about") ? "page" : undefined}
          >
            {t.nav.about}
          </Link>

          <Link
            href="/contact"
            onMouseEnter={() => setHoveredGroup(null)}
            className={navLinkClass(matchesPath(pathname, "/contact"))}
            aria-current={matchesPath(pathname, "/contact") ? "page" : undefined}
          >
            {t.nav.contact}
          </Link>
        </nav>

        {/* Language toggle */}
        <div className="hidden items-center gap-2 md:flex">
          <button
            type="button"
            onClick={() => setLanguage(language === "en" ? "ka" : "en")}
            className="rounded-md border border-[#dbe8f5] bg-white px-2.5 py-1 text-xs font-bold tracking-wider text-[#4a6180] shadow-sm transition-all hover:border-[#1666d1]/30 hover:text-[#1666d1] dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:text-white"
          >
            {language === "en" ? "KA" : "EN"}
          </button>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={() => setLanguage(language === "en" ? "ka" : "en")}
            className="inline-flex items-center justify-center rounded-md border border-[#dbe8f5] bg-white px-2.5 py-1.5 text-xs font-bold tracking-wider text-[#0c2d6b] shadow-sm transition hover:bg-[#f4f8fd] dark:border-white/15 dark:bg-[#0d1b30] dark:text-white"
          >
            {language === "en" ? "KA" : "EN"}
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-[#dbe8f5] bg-white p-2 text-[#374c66] shadow-sm transition hover:bg-[#f4f8fd] hover:text-[#1666d1] dark:border-white/15 dark:bg-[#0d1b30] dark:text-slate-300"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </Container>

      {/* ── Desktop Dropdown ─────────────────────────── */}
      {hoveredGroup && (
        <div className="absolute inset-x-0 top-full hidden border-t border-[#dbe8f5] bg-white shadow-[0_12px_40px_-8px_rgba(12,45,107,0.12)] dark:border-white/[0.08] dark:bg-[#0d1b30] md:block">
          <Container className="py-6">
            <div className={cn(
              "grid gap-8",
              hoveredGroup === "doctors" ? "lg:grid-cols-[240px_minmax(0,1fr)]" : "lg:grid-cols-[200px_minmax(0,1fr)]",
            )}>
              {/* Left: group label */}
              <div className="space-y-1 border-r border-[#dbe8f5] pr-8 dark:border-white/[0.07]">
                <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#7a90ab] dark:text-slate-500">
                  {groupMeta[hoveredGroup].countLabel}
                </div>
                <h2 className="text-lg font-bold text-[#0c2d6b] dark:text-white">
                  {groupMeta[hoveredGroup].label}
                </h2>
                {groupMeta[hoveredGroup].href && (
                  <Link
                    href={groupMeta[hoveredGroup].href!}
                    className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[#1666d1] hover:underline dark:text-sky-400"
                  >
                    View all
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>

              {/* Right: list */}
              {hoveredGroup === "doctors" ? (
                <div className="columns-2 gap-1 sm:columns-3 xl:columns-4">
                  {DOCTOR_NICHES.map((item) => (
                    <Link
                      key={item}
                      href={`/doctors?niche=${encodeURIComponent(item)}`}
                      className="group flex items-center justify-between rounded-md px-3 py-2 text-sm text-[#374c66] transition-colors hover:bg-[#f4f8fd] hover:text-[#1666d1] dark:text-slate-300 dark:hover:bg-white/[0.05] dark:hover:text-sky-300"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              ) : (
                <div className={cn(
                  "grid gap-0.5",
                  hoveredLinks.length > 4 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2",
                )}>
                  {hoveredLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "group flex items-center justify-between rounded-md px-3 py-2.5 text-sm transition-colors",
                        matchesPath(pathname, item.href)
                          ? "bg-[#eff6ff] font-semibold text-[#1666d1] dark:bg-sky-400/10 dark:text-sky-300"
                          : "text-[#374c66] hover:bg-[#f4f8fd] hover:text-[#1666d1] dark:text-slate-300 dark:hover:bg-white/[0.05] dark:hover:text-sky-300",
                      )}
                    >
                      <span className="font-medium">{item.title}</span>
                      <ArrowRight className="h-3.5 w-3.5 shrink-0 opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </Container>
        </div>
      )}

      {/* ── Mobile Menu ───────────────────────────────── */}
      {open && (
        <div className="md:hidden">
          <div className="border-t border-[#dbe8f5] bg-white dark:border-white/[0.08] dark:bg-[#070f1f]">
            <Container className="space-y-1 py-3 pb-5">
              {/* Direct links */}
              {[
                { href: "/", label: t.nav.home },
                { href: "/videos", label: t.nav.medications },
                { href: "/doctors", label: t.nav.doctors },
                { href: "/about", label: t.nav.about },
                { href: "/contact", label: t.nav.contact },
              ].map((item, index) => {
                const active = matchesPath(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "animate-fade-up flex items-center rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors",
                      active
                        ? "bg-[#eff6ff] font-semibold text-[#1666d1] dark:bg-sky-400/10 dark:text-sky-300"
                        : "text-[#374c66] hover:bg-[#f4f8fd] hover:text-[#1666d1] dark:text-slate-300 dark:hover:bg-white/[0.05]",
                    )}
                    style={{ animationDelay: `${index * 25}ms` }}
                    aria-current={active ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                );
              })}

              {/* Grouped sections */}
              {(["resources", "products", "services"] as const).map((group) => (
                <div key={group} className="pt-3">
                  <div className="px-3.5 pb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#7a90ab] dark:text-slate-500">
                    {groupMeta[group].label}
                  </div>
                  {(group === "resources" ? groupedLinks.resources :
                    group === "products"  ? groupedLinks.products :
                    groupedLinks.services
                  ).map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center rounded-lg px-3.5 py-2 text-sm transition-colors",
                        matchesPath(pathname, item.href)
                          ? "font-semibold text-[#1666d1] dark:text-sky-300"
                          : "text-[#374c66] hover:bg-[#f4f8fd] hover:text-[#1666d1] dark:text-slate-300 dark:hover:bg-white/[0.05]",
                      )}
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              ))}
            </Container>
          </div>
        </div>
      )}
    </header>
  );
}
