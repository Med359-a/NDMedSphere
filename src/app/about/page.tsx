import type { Metadata } from "next";
import { Container } from "@/components/container";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: `About — ${siteConfig.name}`,
  description: `Background, focus areas, and approach for ${siteConfig.name}.`,
};

export default function AboutPage() {
  return (
    <div>
      <section className="border-b border-black/5 bg-white/50 backdrop-blur dark:border-white/10 dark:bg-zinc-950/40">
        <Container className="py-14 sm:py-18">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div className="space-y-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                About
              </div>
              <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
                {siteConfig.name}
              </h1>
              <p className="max-w-xl text-pretty text-lg leading-8 text-zinc-700 dark:text-zinc-200">
                Replace this with your bio: credentials, experience, research,
                and the kind of work you want to showcase.
              </p>
            </div>

            <div className="relative">
              <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-sky-500/15 via-emerald-500/10 to-transparent blur-2xl" />
              <div className="rounded-[2rem] border border-black/10 bg-white/60 p-8 shadow-sm backdrop-blur dark:border-white/15 dark:bg-zinc-950/50">
                <div className="text-sm font-semibold">At a glance</div>
                <div className="mt-4 grid gap-3 text-sm text-zinc-700 dark:text-zinc-200">
                  <div className="rounded-2xl bg-zinc-900/5 p-4 dark:bg-white/10">
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">
                      Focus areas
                    </div>
                    <div className="mt-1 font-medium">
                      {siteConfig.focusAreas.join(" • ")}
                    </div>
                  </div>
                  <div className="rounded-2xl bg-zinc-900/5 p-4 dark:bg-white/10">
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">
                      Title
                    </div>
                    <div className="mt-1 font-medium">{siteConfig.title}</div>
                  </div>
                  <div className="rounded-2xl bg-zinc-900/5 p-4 dark:bg-white/10">
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">
                      Contact
                    </div>
                    <div className="mt-1 font-medium">{siteConfig.contact.email}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section>
        <Container className="py-16">
          <div className="grid gap-10 lg:grid-cols-3">
            <div className="space-y-3 lg:col-span-1">
              <h2 className="text-2xl font-semibold tracking-tight">
                Approach
              </h2>
              <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                Describe how you work and what viewers can expect from your
                content: clarity, technique, and practical outcomes.
              </p>
            </div>
            <div className="grid gap-4 lg:col-span-2 md:grid-cols-2">
              {[
                {
                  title: "Evidence‑based",
                  body: "Grounded in best practices, explained simply.",
                },
                {
                  title: "Clear structure",
                  body: "Short formats that get to the point quickly.",
                },
                {
                  title: "Practical demos",
                  body: "Walkthroughs focused on technique and safety.",
                },
                {
                  title: "Professional standards",
                  body: "Clean presentation and careful documentation.",
                },
              ].map((i) => (
                <div
                  key={i.title}
                  className="rounded-2xl border border-black/10 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-white/15 dark:bg-zinc-950/50"
                >
                  <div className="text-lg font-semibold">{i.title}</div>
                  <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                    {i.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}


