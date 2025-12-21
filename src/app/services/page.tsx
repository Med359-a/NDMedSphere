import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: `Services — ${siteConfig.clinicName}`,
  description: "Clinic services and treatment areas.",
};

const services = [
  {
    title: "General consultations",
    body: "New and follow‑up visits, diagnosis support, and personalized care plans.",
  },
  {
    title: "Preventive care & screening",
    body: "Health checks, vaccinations, and screening recommendations based on your risk factors.",
  },
  {
    title: "Chronic condition management",
    body: "Ongoing support for long‑term conditions with practical, measurable next steps.",
  },
  {
    title: "Minor procedures",
    body: "Office-based procedures with clear prep, aftercare, and safety-first protocols.",
  },
  {
    title: "Lifestyle & wellness",
    body: "Evidence‑based nutrition, sleep, and activity guidance tailored to your goals.",
  },
  {
    title: "Second opinions",
    body: "Review of prior assessments and planning with a calm, thorough approach.",
  },
] as const;

export default function ServicesPage() {
  return (
    <div>
      <section className="border-b border-black/5 bg-white/50 backdrop-blur dark:border-white/10 dark:bg-zinc-950/40">
        <Container className="py-14 sm:py-18">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Services
              </div>
              <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
                Care tailored to you
              </h1>
              <p className="text-zinc-700 dark:text-zinc-200">
                Swap these items for your real clinical services and specialties.
                Keep each one short and outcome‑oriented.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 active:translate-y-px dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
            >
              Book an appointment
            </Link>
          </div>
        </Container>
      </section>

      <section>
        <Container className="py-16">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <div
                key={s.title}
                className="group rounded-2xl border border-black/10 bg-white/60 p-6 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white dark:border-white/15 dark:bg-zinc-950/50 dark:hover:bg-zinc-950"
              >
                <div className="text-lg font-semibold">{s.title}</div>
                <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                  {s.body}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-[2rem] border border-black/10 bg-white/60 p-8 shadow-sm backdrop-blur dark:border-white/15 dark:bg-zinc-950/50">
            <div className="grid gap-6 lg:grid-cols-2 lg:items-center">
              <div className="space-y-2">
                <div className="text-lg font-semibold">Need something specific?</div>
                <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                  If your request isn’t listed, reach out — we’ll guide you to
                  the right next step or referral.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-sky-600 to-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-emerald-500/20 transition-transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  Contact the clinic
                </Link>
                <Link
                  href="/videos"
                  className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white/60 px-5 py-3 text-sm font-semibold text-zinc-900 shadow-sm backdrop-blur transition hover:bg-white dark:border-white/15 dark:bg-zinc-950/50 dark:text-zinc-50 dark:hover:bg-zinc-950"
                >
                  View / upload videos →
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="pb-20">
        <Container>
          <div className="grid gap-6 rounded-[2rem] border border-black/10 bg-white/60 p-10 shadow-sm backdrop-blur dark:border-white/15 dark:bg-zinc-950/50 lg:grid-cols-3">
            <div className="space-y-2 lg:col-span-1">
              <div className="text-sm font-semibold">Hours</div>
              <div className="text-sm text-zinc-700 dark:text-zinc-200">
                {siteConfig.contact.hours.map((h) => (
                  <div key={h.days} className="flex justify-between gap-6">
                    <span className="text-zinc-500 dark:text-zinc-400">
                      {h.days}
                    </span>
                    <span className="font-medium">{h.time}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2 lg:col-span-2">
              <div className="text-sm font-semibold">What to bring</div>
              <ul className="mt-2 grid gap-2 text-sm text-zinc-700 dark:text-zinc-200 sm:grid-cols-2">
                {[
                  "Photo ID / insurance details",
                  "Medication list",
                  "Prior test results (if any)",
                  "Your key questions / symptoms",
                ].map((item) => (
                  <li
                    key={item}
                    className="rounded-xl bg-zinc-900/5 px-4 py-3 dark:bg-white/10"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}


