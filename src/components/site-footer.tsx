import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { Container } from "@/components/container";

const links = [
  { href: "/about", label: "About" },
  { href: "/videos", label: "Videos" },
  { href: "/contact", label: "Contact" },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-black/5 bg-white/60 backdrop-blur dark:border-white/10 dark:bg-zinc-950/60">
      <Container className="grid gap-10 py-12 md:grid-cols-3">
        <div className="space-y-3">
          <div className="text-sm font-semibold">{siteConfig.name}</div>
          <p className="max-w-sm text-sm text-zinc-600 dark:text-zinc-300">
            {siteConfig.tagline}
          </p>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            © {new Date().getFullYear()} {siteConfig.name}. All rights
            reserved.
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-sm font-semibold">Contact</div>
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
          <div className="text-sm font-semibold">Quick links</div>
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

      <div className="border-t border-black/5 py-4 text-center text-xs text-zinc-500 dark:border-white/10 dark:text-zinc-400">
        This site is a portfolio template. Customize it in{" "}
        <code className="rounded bg-black/5 px-1 py-0.5 dark:bg-white/10">
          src/lib/site-config.ts
        </code>{" "}
        with your real details.
      </div>
    </footer>
  );
}


