import type { Metadata } from "next";
import { Container } from "@/components/container";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: `About — ${siteConfig.clinicName}`,
  description: `Meet ${siteConfig.doctorName} and learn about the clinic approach.`,
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
                {siteConfig.doctorName}
              </h1>
              <p className="max-w-xl text-pretty text-lg leading-8 text-zinc-700 dark:text-zinc-200">
                Replace this content with your bio, credentials, and what makes
                your clinic unique. Keep it warm, concise, and patient-focused.
              </p>
            </div>

            <div className="relative">
              <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-sky-500/15 via-emerald-500/10 to-transparent blur-2xl" />
              <div className="rounded-[2rem] border border-black/10 bg-white/60 p-8 shadow-sm backdrop-blur dark:border-white/15 dark:bg-zinc-950/50">
                <div className="text-sm font-semibold">At a glance</div>
                <div className="mt-4 grid gap-3 text-sm text-zinc-700 dark:text-zinc-200">
                  <div className="rounded-2xl bg-zinc-900/5 p-4 dark:bg-white/10">
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">
                      Specialties
                    </div>
                    <div className="mt-1 font-medium">
                      {siteConfig.specialties.join(" • ")}
                    </div>
                  </div>
                  <div className="rounded-2xl bg-zinc-900/5 p-4 dark:bg-white/10">
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">
                      Clinic
                    </div>
                    <div className="mt-1 font-medium">{siteConfig.clinicName}</div>
                  </div>
                  <div className="rounded-2xl bg-zinc-900/5 p-4 dark:bg-white/10">
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">
                      Location
                    </div>
                    <div className="mt-1 font-medium">
                      {siteConfig.contact.address}
                    </div>
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
                Clinical approach
              </h2>
              <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                Write a short, clear description of how you practice: evidence,
                empathy, outcomes, and continuity of care.
              </p>
            </div>
            <div className="grid gap-4 lg:col-span-2 md:grid-cols-2">
              {[
                {
                  title: "Evidence-based care",
                  body: "Modern guidelines with individualized decisions.",
                },
                {
                  title: "Clear next steps",
                  body: "Simple plans you can follow after every visit.",
                },
                {
                  title: "Time & attention",
                  body: "Respectful consultations with room for questions.",
                },
                {
                  title: "Continuity",
                  body: "Follow-ups and long-term health planning.",
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


