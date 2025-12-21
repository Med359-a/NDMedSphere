import Link from "next/link";
import { Container } from "@/components/container";
import { siteConfig } from "@/lib/site-config";

export default function Home() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <Container className="py-16 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-3 py-1 text-xs font-medium text-zinc-700 shadow-sm backdrop-blur dark:border-white/15 dark:bg-zinc-950/50 dark:text-zinc-200">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Now accepting appointments
              </div>

              <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
                {siteConfig.doctorName}
                <span className="text-zinc-500 dark:text-zinc-300">
                  {" "}
                  — clinic care & professional portfolio
                </span>
              </h1>

              <p className="max-w-xl text-pretty text-lg leading-8 text-zinc-700 dark:text-zinc-200">
                {siteConfig.tagline} Explore services, patient information, and a
                dedicated page to upload and showcase your work videos.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 active:translate-y-px dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
                >
                  Book an appointment
                </Link>
                <Link
                  href="/videos"
                  className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white/60 px-5 py-3 text-sm font-semibold text-zinc-900 shadow-sm backdrop-blur transition hover:bg-white active:translate-y-px dark:border-white/15 dark:bg-zinc-950/50 dark:text-zinc-50 dark:hover:bg-zinc-950"
                >
                  Upload work videos
                </Link>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {siteConfig.specialties.map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-zinc-900/5 px-3 py-1 text-xs font-medium text-zinc-700 dark:bg-white/10 dark:text-zinc-200"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-sky-500/20 via-emerald-500/10 to-transparent blur-2xl" />
              <div className="grid gap-4 rounded-[2rem] border border-black/10 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-white/15 dark:bg-zinc-950/50">
                <div className="grid gap-2">
                  <div className="text-sm font-semibold">Clinic snapshot</div>
                  <div className="text-sm text-zinc-600 dark:text-zinc-300">
                    {siteConfig.clinicName} • {siteConfig.contact.address}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl bg-zinc-900/5 p-4 dark:bg-white/10">
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">
                      Typical visit
                    </div>
                    <div className="mt-1 text-lg font-semibold">15–30 min</div>
                  </div>
                  <div className="rounded-2xl bg-zinc-900/5 p-4 dark:bg-white/10">
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">
                      Response time
                    </div>
                    <div className="mt-1 text-lg font-semibold">Same day</div>
                  </div>
                  <div className="rounded-2xl bg-zinc-900/5 p-4 dark:bg-white/10">
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">
                      Approach
                    </div>
                    <div className="mt-1 text-lg font-semibold">Evidence‑based</div>
                  </div>
                </div>

                <div className="rounded-2xl border border-black/10 bg-white p-4 text-sm text-zinc-700 dark:border-white/15 dark:bg-zinc-950 dark:text-zinc-200">
                  <div className="font-semibold">Featured work</div>
                  <div className="mt-1 text-zinc-600 dark:text-zinc-300">
                    Upload procedure demos, case explainers, or before/after
                    walkthroughs on the Videos page.
                  </div>
                  <div className="mt-3">
                    <Link
                      href="/videos"
                      className="inline-flex items-center rounded-xl bg-gradient-to-r from-sky-600 to-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-emerald-500/20 transition-transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                      Go to Videos →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-y border-black/5 bg-white/50 backdrop-blur dark:border-white/10 dark:bg-zinc-950/40">
        <Container className="py-14">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 dark:bg-zinc-950 dark:ring-white/10">
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                Patient-first
              </div>
              <div className="mt-2 text-lg font-semibold">Clear communication</div>
              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                Simple explanations, shared decisions, and follow-ups you can
                count on.
              </p>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 dark:bg-zinc-950 dark:ring-white/10">
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                Modern clinic
              </div>
              <div className="mt-2 text-lg font-semibold">Smooth experience</div>
              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                Streamlined scheduling, organized care plans, and transparent
                expectations.
              </p>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 dark:bg-zinc-950 dark:ring-white/10">
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                Portfolio
              </div>
              <div className="mt-2 text-lg font-semibold">Show your work</div>
              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                Upload videos of procedures, educational clips, or case
                walkthroughs in one place.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section>
        <Container className="py-16">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Services
              </div>
              <h2 className="text-3xl font-semibold tracking-tight">
                Care that fits your needs
              </h2>
              <p className="text-zinc-700 dark:text-zinc-200">
                Customize these services to match your specialty and clinic
                offerings.
              </p>
            </div>
            <Link
              href="/services"
              className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white/60 px-5 py-3 text-sm font-semibold text-zinc-900 shadow-sm backdrop-blur transition hover:bg-white dark:border-white/15 dark:bg-zinc-950/50 dark:text-zinc-50 dark:hover:bg-zinc-950"
            >
              View all services →
            </Link>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Consultations",
                body: "In-person or virtual consultations with clear next steps.",
              },
              {
                title: "Preventive care",
                body: "Screenings, wellness plans, and lifestyle support.",
              },
              {
                title: "Minor procedures",
                body: "Office-based procedures with safety and comfort in mind.",
              },
            ].map((s) => (
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
        </Container>
      </section>

      <section className="pb-20">
        <Container>
          <div className="rounded-[2rem] border border-black/10 bg-gradient-to-br from-zinc-950 to-zinc-800 p-10 text-white shadow-sm dark:border-white/10">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
              <div className="space-y-3">
                <div className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
                  Ready to get started?
                </div>
                <h2 className="text-3xl font-semibold tracking-tight">
                  A modern clinic website — with a videos portfolio built in
                </h2>
                <p className="text-white/80">
                  Use this site for your clinic presence, then keep your work
                  organized on the Videos page by uploading files directly.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
                <Link
                  href="/videos"
                  className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-zinc-900 shadow-sm transition hover:bg-zinc-100"
                >
                  Upload videos
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-white/10"
                >
                  Contact / bookings
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
