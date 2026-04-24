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

  const groupMeta: Record<
    GroupKey,
    {
      label: string;
      href?: string;
      countLabel: string;
    }
  > = {
    resources: {
      label: t.nav.resources,
      countLabel: `${RESOURCE_LINKS.length} pages`,
    },
    products: {
      label: t.nav.products,
      countLabel: `${PRODUCT_PAGES.length} pages`,
    },
    services: {
      label: t.nav.services,
      countLabel: `${SERVICE_PAGES.length} pages`,
    },
    doctors: {
      label: t.nav.doctors,
      href: "/doctors",
      countLabel: `${DOCTOR_NICHES.length} niches`,
    },
  };

  const topLinks = [
    { href: "/", label: t.nav.home, active: matchesPath(pathname, "/") },
    {
      href: "/videos",
      label: t.nav.medications,
      active: matchesPath(pathname, "/videos"),
    },
    {
      href: "/doctors",
      label: t.nav.doctors,
      active: matchesPath(pathname, "/doctors"),
      group: "doctors" as const,
    },
    { href: "/about", label: t.nav.about, active: matchesPath(pathname, "/about") },
    { href: "/contact", label: t.nav.contact, active: matchesPath(pathname, "/contact") },
  ];

  const groupActive = {
    resources: groupedLinks.resources.some((item) => matchesPath(pathname, item.href)),
    products: groupedLinks.products.some((item) => matchesPath(pathname, item.href)),
    services: groupedLinks.services.some((item) => matchesPath(pathname, item.href)),
    doctors: matchesPath(pathname, "/doctors"),
  };

  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  React.useEffect(() => {
    setOpen(false);
    setHoveredGroup(null);
  }, [pathname]);

  const hoveredLinks =
    hoveredGroup === "resources"
      ? groupedLinks.resources
      : hoveredGroup === "products"
        ? groupedLinks.products
        : hoveredGroup === "services"
          ? groupedLinks.services
          : [];

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 border-b border-[#0b5aad]/12 bg-[#f2f7fc]/80 backdrop-blur-xl dark:border-white/[0.08] dark:bg-[#071120]/82"
      onMouseLeave={() => setHoveredGroup(null)}
    >
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href="/" className="group inline-flex shrink-0 items-center gap-3" onMouseEnter={() => setHoveredGroup(null)}>
          <div className="relative h-10 w-10 overflow-hidden rounded-full border border-[#0b5aad]/12 bg-white/90 shadow-sm ring-1 ring-[#0b5aad]/10 transition-all duration-300 group-hover:ring-2 group-hover:ring-[#0d5db8]/35 group-hover:shadow-md dark:border-white/15 dark:bg-[#0a1930] dark:ring-white/10 dark:group-hover:ring-sky-400/35">
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
              <span className="text-[15px] font-bold tracking-tight text-[#081a31] dark:text-zinc-50">
                NdMedSphere
              </span>
              {isAdmin ? (
                <span className="rounded-full bg-[#0d5db8]/12 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#0d5db8] dark:bg-sky-400/15 dark:text-sky-300">
                  Admin
                </span>
              ) : null}
            </div>
            <span className="mt-0.5 block text-[11px] font-medium text-[#56708d] dark:text-slate-400">
              Dr. David Rekhviashvili
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-0.5 md:flex" aria-label="Main navigation">
          <Link
            href="/"
            onMouseEnter={() => setHoveredGroup(null)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-150",
              matchesPath(pathname, "/")
                ? "bg-[#0b5aad] text-white shadow-sm dark:bg-sky-300 dark:text-[#081a31]"
                : "text-[#39516c] hover:bg-[#0b5aad]/8 hover:text-[#0b3f83] dark:text-slate-300 dark:hover:bg-white/[0.08] dark:hover:text-white",
            )}
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
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-150",
                groupActive[group]
                  ? "bg-[#0b5aad] text-white shadow-sm dark:bg-sky-300 dark:text-[#081a31]"
                  : hoveredGroup === group
                    ? "bg-[#0b5aad]/8 text-[#0b3f83] dark:bg-white/[0.08] dark:text-white"
                    : "text-[#39516c] hover:bg-[#0b5aad]/8 hover:text-[#0b3f83] dark:text-slate-300 dark:hover:bg-white/[0.08] dark:hover:text-white",
              )}
            >
              <span>{groupMeta[group].label}</span>
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          ))}

          <Link
            href="/videos"
            onMouseEnter={() => setHoveredGroup(null)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-150",
              matchesPath(pathname, "/videos")
                ? "bg-[#0b5aad] text-white shadow-sm dark:bg-sky-300 dark:text-[#081a31]"
                : "text-[#39516c] hover:bg-[#0b5aad]/8 hover:text-[#0b3f83] dark:text-slate-300 dark:hover:bg-white/[0.08] dark:hover:text-white",
            )}
            aria-current={matchesPath(pathname, "/videos") ? "page" : undefined}
          >
            {t.nav.medications}
          </Link>

          <Link
            href="/doctors"
            onMouseEnter={() => setHoveredGroup("doctors")}
            onFocus={() => setHoveredGroup("doctors")}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-150",
              groupActive.doctors
                ? "bg-[#0b5aad] text-white shadow-sm dark:bg-sky-300 dark:text-[#081a31]"
                : hoveredGroup === "doctors"
                  ? "bg-[#0b5aad]/8 text-[#0b3f83] dark:bg-white/[0.08] dark:text-white"
                  : "text-[#39516c] hover:bg-[#0b5aad]/8 hover:text-[#0b3f83] dark:text-slate-300 dark:hover:bg-white/[0.08] dark:hover:text-white",
            )}
            aria-current={groupActive.doctors ? "page" : undefined}
          >
            {t.nav.doctors}
          </Link>

          <Link
            href="/about"
            onMouseEnter={() => setHoveredGroup(null)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-150",
              matchesPath(pathname, "/about")
                ? "bg-[#0b5aad] text-white shadow-sm dark:bg-sky-300 dark:text-[#081a31]"
                : "text-[#39516c] hover:bg-[#0b5aad]/8 hover:text-[#0b3f83] dark:text-slate-300 dark:hover:bg-white/[0.08] dark:hover:text-white",
            )}
            aria-current={matchesPath(pathname, "/about") ? "page" : undefined}
          >
            {t.nav.about}
          </Link>

          <Link
            href="/contact"
            onMouseEnter={() => setHoveredGroup(null)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-150",
              matchesPath(pathname, "/contact")
                ? "bg-[#0b5aad] text-white shadow-sm dark:bg-sky-300 dark:text-[#081a31]"
                : "text-[#39516c] hover:bg-[#0b5aad]/8 hover:text-[#0b3f83] dark:text-slate-300 dark:hover:bg-white/[0.08] dark:hover:text-white",
            )}
            aria-current={matchesPath(pathname, "/contact") ? "page" : undefined}
          >
            {t.nav.contact}
          </Link>

          <button
            type="button"
            onClick={() => setLanguage(language === "en" ? "ka" : "en")}
            className="ml-2 rounded-lg border border-[#0b5aad]/10 bg-white/80 px-2.5 py-1 text-xs font-bold tracking-wider text-[#39516c] shadow-sm transition-all hover:bg-white hover:text-[#0b3f83] dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
          >
            {language === "en" ? "KA" : "EN"}
          </button>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={() => setLanguage(language === "en" ? "ka" : "en")}
            className="inline-flex items-center justify-center rounded-lg border border-[#0b5aad]/12 bg-white/80 px-2.5 py-1.5 text-xs font-bold tracking-wider text-[#081a31] shadow-sm backdrop-blur transition hover:bg-white dark:border-white/15 dark:bg-[#0a1930]/70 dark:text-zinc-50 dark:hover:bg-[#0a1930]"
          >
            {language === "en" ? "KA" : "EN"}
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg border border-[#0b5aad]/12 bg-white/80 p-2 text-[#081a31] shadow-sm backdrop-blur transition hover:bg-white dark:border-white/15 dark:bg-[#0a1930]/70 dark:text-zinc-50 dark:hover:bg-[#0a1930]"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </Container>

      {hoveredGroup ? (
        <div className="absolute inset-x-0 top-full hidden border-t border-white/10 bg-[linear-gradient(135deg,rgba(8,45,98,0.98),rgba(12,84,173,0.96))] text-white shadow-[0_32px_80px_-36px_rgba(8,45,98,0.72)] backdrop-blur-2xl md:block">
          <Container className="grid gap-6 py-7 lg:grid-cols-[1fr_2fr] lg:items-start">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/14 bg-white/8 p-7">
              <div className="absolute right-0 top-0 h-36 w-36 translate-x-1/3 -translate-y-1/3 rounded-full bg-white/10 blur-3xl" />
              <div className="relative space-y-5">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-sky-200">
                    {groupMeta[hoveredGroup].countLabel}
                  </div>
                  <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                    {groupMeta[hoveredGroup].label}
                  </h2>
                </div>
                {groupMeta[hoveredGroup].href ? (
                  <Link
                    href={groupMeta[hoveredGroup].href!}
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/16"
                  >
                    Open {groupMeta[hoveredGroup].label}
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                ) : (
                  <div className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm leading-6 text-sky-50/90">
                    Select one of the pages on the right.
                  </div>
                )}
              </div>
            </div>

            {hoveredGroup === "doctors" ? (
              <div className="rounded-[1.75rem] border border-white/14 bg-white/7 p-5">
                <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-200/90">
                  Doctor Niches
                </div>
                <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                  {DOCTOR_NICHES.map((item) => (
                    <Link
                      key={item}
                      href={`/doctors?niche=${encodeURIComponent(item)}`}
                      className="rounded-xl border border-white/10 bg-white/6 px-4 py-3 text-sm leading-6 text-sky-50/90 transition hover:bg-white/12"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {hoveredLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group rounded-[1.5rem] border border-white/14 bg-white/7 p-5 transition hover:bg-white/10"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-lg font-semibold text-white">{item.title}</div>
                        <div className="mt-2 text-sm text-sky-100/80">Open page</div>
                      </div>
                      <div className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-sky-100 transition group-hover:translate-x-0.5">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </Container>
        </div>
      ) : null}

      {open ? (
        <div className="md:hidden">
          <div className="border-t border-[#0b5aad]/12 bg-[#f2f7fc]/96 backdrop-blur-xl dark:border-white/[0.08] dark:bg-[#071120]/96">
            <Container className="space-y-4 py-3 pb-5">
              <div className="grid gap-2">
                {topLinks.map((item, index) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "animate-fade-up rounded-xl px-3 py-3 transition-colors",
                      item.active
                        ? "bg-[#0b5aad] dark:bg-sky-300"
                        : "bg-white/80 hover:bg-white dark:bg-white/[0.04] dark:hover:bg-white/[0.07]",
                    )}
                    style={{ animationDelay: `${index * 30}ms` }}
                    aria-current={item.active ? "page" : undefined}
                  >
                    <div
                      className={cn(
                        "text-sm font-semibold",
                        item.active ? "text-white dark:text-[#081a31]" : "text-[#081a31] dark:text-zinc-100",
                      )}
                    >
                      {item.label}
                    </div>
                    {item.group === "doctors" ? (
                      <div
                        className={cn(
                          "mt-1 text-xs",
                          item.active ? "text-white/75 dark:text-[#21456d]" : "text-[#56708d] dark:text-slate-400",
                        )}
                      >
                        {DOCTOR_NICHES.slice(0, 3).join(" • ")} • +{DOCTOR_NICHES.length - 3}
                      </div>
                    ) : null}
                  </Link>
                ))}
              </div>

              {(["resources", "products", "services"] as const).map((group) => (
                <div
                  key={group}
                  className="rounded-[1.5rem] border border-[#0b5aad]/10 bg-white/80 p-4 dark:border-white/10 dark:bg-white/[0.04]"
                >
                  <div className="mb-3 flex items-center justify-between gap-4">
                    <div className="text-sm font-semibold text-[#081a31] dark:text-zinc-100">
                      {groupMeta[group].label}
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#56708d] dark:text-slate-400">
                      {groupMeta[group].countLabel}
                    </div>
                  </div>
                  <div className="grid gap-2">
                    {(group === "resources"
                      ? groupedLinks.resources
                      : group === "products"
                        ? groupedLinks.products
                        : groupedLinks.services
                    ).map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "rounded-xl border px-3 py-2.5 text-sm font-medium transition",
                          matchesPath(pathname, item.href)
                            ? "border-[#0b5aad] bg-[#0b5aad] text-white dark:border-sky-300 dark:bg-sky-300 dark:text-[#081a31]"
                            : "border-[#0b5aad]/10 bg-[#f6faff] text-[#314962] hover:border-[#0b5aad]/25 hover:text-[#0b3f83] dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-200 dark:hover:bg-white/[0.06]",
                        )}
                      >
                        {item.title}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </Container>
          </div>
        </div>
      ) : null}
    </header>
  );
}
