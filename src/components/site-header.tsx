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

type NavSection = {
  title: string;
  items: string[];
};

type NavItem = {
  href: string;
  label: string;
  eyebrow: string;
  sections: NavSection[];
};

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
  const [hoveredHref, setHoveredHref] = React.useState<string | null>(null);

  const navItems: NavItem[] = [
    {
      href: "/",
      label: t.nav.home,
      eyebrow: "Overview",
      sections: [
        {
          title: "What lives here",
          items: ["Hero introduction", "Focus areas", "Portfolio preview"],
        },
        {
          title: "Quick access",
          items: ["Featured videos", "Contact actions", "Primary navigation"],
        },
      ],
    },
    {
      href: "/about",
      label: t.nav.about,
      eyebrow: "Platform Story",
      sections: [
        {
          title: "Page objects",
          items: ["Mission statement", "Focus areas", "Content philosophy"],
        },
        {
          title: "Readers will find",
          items: ["Audience overview", "Evidence-based positioning", "Platform values"],
        },
      ],
    },
    {
      href: "/books",
      label: t.nav.books,
      eyebrow: "Library",
      sections: [
        {
          title: "Page objects",
          items: ["Reading list cards", "Author metadata", "Study notes"],
        },
        {
          title: "Useful actions",
          items: ["Open links", "Download PDFs", "Browse the collection"],
        },
      ],
    },
    {
      href: "/usmle",
      label: t.nav.usmle,
      eyebrow: "Exam Prep",
      sections: [
        {
          title: "Page objects",
          items: ["Resource grid", "Reference cards", "Detail modal"],
        },
        {
          title: "Useful actions",
          items: ["Open links", "Download PDFs", "Review descriptions"],
        },
      ],
    },
    {
      href: "/cases",
      label: t.nav.cases,
      eyebrow: "Clinical Cases",
      sections: [
        {
          title: "Page objects",
          items: ["Topic cards", "Quiz sets", "Answer explanations"],
        },
        {
          title: "Useful actions",
          items: ["Open a topic", "Work through answers", "Review explanations"],
        },
      ],
    },
    {
      href: "/videos",
      label: t.nav.videos,
      eyebrow: "Media Library",
      sections: [
        {
          title: "Page objects",
          items: ["Video gallery", "Search field", "Description panels"],
        },
        {
          title: "Useful actions",
          items: ["Play videos", "Search content", "Open embedded media"],
        },
      ],
    },
    {
      href: "/medical-news",
      label: t.nav.news,
      eyebrow: "Updates",
      sections: [
        {
          title: "Page objects",
          items: ["News cards", "Images", "Reading modal"],
        },
        {
          title: "Useful actions",
          items: ["Open notes", "Review sources", "Browse updates"],
        },
      ],
    },
    {
      href: "/doctors",
      label: t.nav.doctors,
      eyebrow: "Profiles",
      sections: [
        {
          title: "Page objects",
          items: ["Profile cards", "Doctor photos", "Biography sections"],
        },
        {
          title: "Useful actions",
          items: ["Browse doctors", "Read biographies", "Review team details"],
        },
      ],
    },
    {
      href: "/contact",
      label: t.nav.contact,
      eyebrow: "Contact",
      sections: [
        {
          title: "Page objects",
          items: ["Contact form", "Direct email", "Social links"],
        },
        {
          title: "Useful actions",
          items: ["Send a message", "Open social profiles", "Reach out directly"],
        },
      ],
    },
  ];

  const hoveredItem = navItems.find((item) => item.href === hoveredHref) ?? null;

  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  React.useEffect(() => {
    setOpen(false);
    setHoveredHref(null);
  }, [pathname]);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 border-b border-[#0b5aad]/12 bg-[#f2f7fc]/80 backdrop-blur-xl dark:border-white/[0.08] dark:bg-[#071120]/82"
      onMouseLeave={() => setHoveredHref(null)}
    >
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href="/" className="group inline-flex shrink-0 items-center gap-3">
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
          {navItems.map((item) => {
            const active = isActivePath(pathname, item.href);
            const previewOpen = hoveredHref === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onMouseEnter={() => setHoveredHref(item.href)}
                onFocus={() => setHoveredHref(item.href)}
                className={cn(
                  "relative rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-150",
                  active
                    ? "bg-[#0b5aad] text-white shadow-sm dark:bg-sky-300 dark:text-[#081a31]"
                    : "text-[#39516c] hover:bg-[#0b5aad]/8 hover:text-[#0b3f83] dark:text-slate-300 dark:hover:bg-white/[0.08] dark:hover:text-white",
                  previewOpen && !active
                    ? "bg-[#0b5aad]/8 text-[#0b3f83] dark:bg-white/[0.08] dark:text-white"
                    : "",
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

      {hoveredItem ? (
        <div className="absolute inset-x-0 top-full hidden border-t border-white/10 bg-[linear-gradient(135deg,rgba(8,45,98,0.98),rgba(12,84,173,0.96))] text-white shadow-[0_32px_80px_-36px_rgba(8,45,98,0.72)] backdrop-blur-2xl md:block">
          <Container className="grid gap-6 py-7 lg:grid-cols-[1.1fr_1.9fr] lg:items-start">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/14 bg-white/8 p-7">
              <div className="absolute right-0 top-0 h-36 w-36 translate-x-1/3 -translate-y-1/3 rounded-full bg-white/10 blur-3xl" />
              <div className="relative space-y-5">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-sky-200">
                    {hoveredItem.eyebrow}
                  </div>
                  <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                    {hoveredItem.label}
                  </h2>
                </div>
                <Link
                  href={hoveredItem.href}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/16"
                >
                  Open {hoveredItem.label}
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {hoveredItem.sections.map((section) => (
                <div
                  key={`${hoveredItem.href}-${section.title}`}
                  className="rounded-[1.5rem] border border-white/14 bg-white/7 p-5"
                >
                  <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-200/90">
                    {section.title}
                  </div>
                  <div className="mt-4 grid gap-3">
                    {section.items.map((entry, index) => (
                      <div
                        key={entry}
                        className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/6 px-4 py-3"
                      >
                        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/12 text-xs font-semibold text-sky-100">
                          {index + 1}
                        </span>
                        <div className="text-sm leading-6 text-sky-50/88">{entry}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </div>
      ) : null}

      {open ? (
        <div className="md:hidden">
          <div className="border-t border-[#0b5aad]/12 bg-[#f2f7fc]/96 backdrop-blur-xl dark:border-white/[0.08] dark:bg-[#071120]/96">
            <Container className="py-2 pb-4">
              <div className="grid gap-0.5">
                {navItems.map((item, index) => {
                  const active = isActivePath(pathname, item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "animate-fade-up rounded-xl px-3 py-2.5 transition-colors",
                        active
                          ? "bg-[#0b5aad] dark:bg-sky-300"
                          : "hover:bg-[#0b5aad]/6 dark:hover:bg-white/[0.07]",
                      )}
                      style={{ animationDelay: `${index * 30}ms` }}
                      aria-current={active ? "page" : undefined}
                    >
                      <div
                        className={cn(
                          "text-sm font-semibold",
                          active
                            ? "text-white dark:text-[#081a31]"
                            : "text-[#081a31] dark:text-zinc-100",
                        )}
                      >
                        {item.label}
                      </div>
                      <div
                        className={cn(
                          "mt-0.5 text-xs",
                          active
                            ? "text-white/75 dark:text-[#21456d]"
                            : "text-[#56708d] dark:text-slate-400",
                        )}
                      >
                        {item.sections
                          .flatMap((section) => section.items)
                          .slice(0, 2)
                          .join(" • ")}
                      </div>
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
