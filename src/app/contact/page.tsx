import type { Metadata } from "next";
import { Container } from "@/components/container";
import { ContactForm } from "@/app/contact/contact-form";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: `Contact — ${siteConfig.name}`,
  description: `Get in touch with ${siteConfig.name}.`,
};

export default function ContactPage() {
  return (
    <div>
      <section className="border-b border-black/5 bg-white/50 backdrop-blur dark:border-white/10 dark:bg-zinc-950/40">
        <Container className="py-14 sm:py-18">
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Contact
            </div>
            <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              Let’s connect
            </h1>
            <p className="max-w-2xl text-pretty text-lg leading-8 text-zinc-700 dark:text-zinc-200">
              Use the form to open a pre-filled email, or reach out directly.
              Customize details in <code>src/lib/site-config.ts</code>.
            </p>
          </div>
        </Container>
      </section>

      <section>
        <Container className="py-16">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <div className="space-y-6">
              <div className="rounded-[2rem] border border-black/10 bg-white/60 p-8 shadow-sm backdrop-blur dark:border-white/15 dark:bg-zinc-950/50">
                <div className="text-lg font-semibold">Contact details</div>
                <div className="mt-4 grid gap-3 text-sm text-zinc-700 dark:text-zinc-200">
                  <div className="rounded-2xl bg-zinc-900/5 p-4 dark:bg-white/10">
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">
                      Email
                    </div>
                    <div className="mt-1 font-medium">{siteConfig.contact.email}</div>
                  </div>
                  {siteConfig.contact.phone ? (
                    <div className="rounded-2xl bg-zinc-900/5 p-4 dark:bg-white/10">
                      <div className="text-xs text-zinc-500 dark:text-zinc-400">
                        Phone
                      </div>
                      <div className="mt-1 font-medium">{siteConfig.contact.phone}</div>
                    </div>
                  ) : null}
                  {siteConfig.contact.location ? (
                    <div className="rounded-2xl bg-zinc-900/5 p-4 dark:bg-white/10">
                      <div className="text-xs text-zinc-500 dark:text-zinc-400">
                        Location
                      </div>
                      <div className="mt-1 font-medium">
                        {siteConfig.contact.location}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="rounded-[2rem] border border-black/10 bg-white/60 p-8 shadow-sm backdrop-blur dark:border-white/15 dark:bg-zinc-950/50">
                <div className="text-lg font-semibold">Social</div>
                <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                  Add your links in <code>src/lib/site-config.ts</code>.
                </p>

                <div className="mt-4 grid gap-2">
                  {(
                    [
                      ["LinkedIn", siteConfig.social.linkedin],
                      ["YouTube", siteConfig.social.youtube],
                      ["Instagram", siteConfig.social.instagram],
                    ] as const
                  ).map(([label, url]) => {
                    const className = `rounded-xl px-4 py-3 text-sm font-medium transition ${
                      url
                        ? "bg-zinc-900/5 text-zinc-900 hover:bg-zinc-900/10 dark:bg-white/10 dark:text-zinc-50 dark:hover:bg-white/15"
                        : "cursor-not-allowed bg-zinc-900/5 text-zinc-500 dark:bg-white/10 dark:text-zinc-400"
                    }`;

                    if (!url) {
                      return (
                        <div key={label} aria-disabled className={className}>
                          {label}
                        </div>
                      );
                    }

                    return (
                      <a
                        key={label}
                        href={url}
                        className={className}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {label}
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-black/10 bg-white/60 p-8 shadow-sm backdrop-blur dark:border-white/15 dark:bg-zinc-950/50">
              <div className="text-lg font-semibold">Send a message</div>
              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                This opens your email app with the message pre-filled.
              </p>
              <div className="mt-6">
                <ContactForm
                  toEmail={siteConfig.contact.email}
                  subjectPrefix={siteConfig.name}
                />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}


