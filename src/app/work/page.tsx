import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: `Work — ${siteConfig.clinicName}`,
  description:
    "A portfolio area for case summaries, outcomes, and clinical work highlights.",
};

const cases = [
  {
    title: "Case highlight: patient education",
    tag: "Education",
    body: "Short explainer videos that improve patient understanding and adherence.",
  },
  {
    title: "Case highlight: procedure walkthrough",
    tag: "Procedure",
    body: "Documented procedure steps with safety notes and aftercare guidance.",
  },
  {
    title: "Case highlight: preventive program",
    tag: "Prevention",
    body: "A structured screening + follow-up pathway with measurable outcomes.",
  },
  {
    title: "Case highlight: chronic care plan",
    tag: "Management",
    body: "Long-term management plan with clear targets and check-ins.",
  },
  {
    title: "Case highlight: clinic workflow improvement",
    tag: "Operations",
    body: "Smoother patient intake and reduced waiting times using simple checklists.",
  },
  {
    title: "Case highlight: interdisciplinary coordination",
    tag: "Collaboration",
    body: "Clear referrals and shared care plans with specialists.",
  },
] as const;

export default function WorkPage() {
  return (
    <div>
      <section className="border-b border-black/5 bg-white/50 backdrop-blur dark:border-white/10 dark:bg-zinc-950/40">
        <Container className="py-14 sm:py-18">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-end">
            <div className="space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Work / Portfolio
              </div>
              <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
                Showcase your clinical work
              </h1>
              <p className="max-w-xl text-pretty text-lg leading-8 text-zinc-700 dark:text-zinc-200">
                Use this page for case summaries and highlights, then upload
                supporting videos on the Videos page.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <Link
                href="/videos"
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-sky-600 to-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-emerald-500/20 transition-transform hover:-translate-y-0.5 active:translate-y-0"
              >
                Go to Videos
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white/60 px-5 py-3 text-sm font-semibold text-zinc-900 shadow-sm backdrop-blur transition hover:bg-white dark:border-white/15 dark:bg-zinc-950/50 dark:text-zinc-50 dark:hover:bg-zinc-950"
              >
                Request an appointment →
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section>
        <Container className="py-16">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {cases.map((c) => (
              <div
                key={c.title}
                className="rounded-2xl border border-black/10 bg-white/60 p-6 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white dark:border-white/15 dark:bg-zinc-950/50 dark:hover:bg-zinc-950"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    {c.tag}
                  </div>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </div>
                <div className="mt-3 text-lg font-semibold">{c.title}</div>
                <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                  {c.body}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-[2rem] border border-black/10 bg-white/60 p-8 shadow-sm backdrop-blur dark:border-white/15 dark:bg-zinc-950/50">
            <div className="grid gap-6 lg:grid-cols-2 lg:items-center">
              <div className="space-y-2">
                <div className="text-lg font-semibold">Add real proof</div>
                <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                  Upload your work videos (procedures, demonstrations, or
                  educational content) and keep everything organized.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
                <Link
                  href="/videos"
                  className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 active:translate-y-px dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
                >
                  Upload a video
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white/60 px-5 py-3 text-sm font-semibold text-zinc-900 shadow-sm backdrop-blur transition hover:bg-white dark:border-white/15 dark:bg-zinc-950/50 dark:text-zinc-50 dark:hover:bg-zinc-950"
                >
                  View services →
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}


