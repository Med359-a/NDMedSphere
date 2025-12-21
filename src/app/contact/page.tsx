import type { Metadata } from "next";
import { Container } from "@/components/container";
import { ContactForm } from "@/app/contact/contact-form";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: `Contact — ${siteConfig.clinicName}`,
  description: "Clinic contact details and appointment requests.",
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
              Appointments & inquiries
            </h1>
            <p className="max-w-2xl text-pretty text-lg leading-8 text-zinc-700 dark:text-zinc-200">
              Use the form to open a pre-filled email, or reach out directly.
              Customize the details in <code>src/lib/site-config.ts</code>.
            </p>
          </div>
        </Container>
      </section>

      <section>
        <Container className="py-16">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <div className="space-y-6">
              <div className="rounded-[2rem] border border-black/10 bg-white/60 p-8 shadow-sm backdrop-blur dark:border-white/15 dark:bg-zinc-950/50">
                <div className="text-lg font-semibold">Clinic details</div>
                <div className="mt-4 grid gap-3 text-sm text-zinc-700 dark:text-zinc-200">
                  <div className="rounded-2xl bg-zinc-900/5 p-4 dark:bg-white/10">
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">
                      Phone
                    </div>
                    <div className="mt-1 font-medium">{siteConfig.contact.phone}</div>
                  </div>
                  <div className="rounded-2xl bg-zinc-900/5 p-4 dark:bg-white/10">
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">
                      Email
                    </div>
                    <div className="mt-1 font-medium">{siteConfig.contact.email}</div>
                  </div>
                  <div className="rounded-2xl bg-zinc-900/5 p-4 dark:bg-white/10">
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">
                      Address
                    </div>
                    <div className="mt-1 font-medium">
                      {siteConfig.contact.address}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[2rem] border border-black/10 bg-white/60 p-8 shadow-sm backdrop-blur dark:border-white/15 dark:bg-zinc-950/50">
                <div className="text-lg font-semibold">Hours</div>
                <div className="mt-4 space-y-2 text-sm text-zinc-700 dark:text-zinc-200">
                  {siteConfig.contact.hours.map((h) => (
                    <div
                      key={h.days}
                      className="flex items-center justify-between gap-6 rounded-xl bg-zinc-900/5 px-4 py-3 dark:bg-white/10"
                    >
                      <span className="text-zinc-500 dark:text-zinc-400">
                        {h.days}
                      </span>
                      <span className="font-medium">{h.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-black/10 bg-white/60 p-8 shadow-sm backdrop-blur dark:border-white/15 dark:bg-zinc-950/50">
              <div className="text-lg font-semibold">Send a message</div>
              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                This opens your email app with the message pre-filled. If you’d
                prefer server-side form handling, tell me and I’ll add it.
              </p>
              <div className="mt-6">
                <ContactForm
                  toEmail={siteConfig.contact.email}
                  clinicName={siteConfig.clinicName}
                />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}


