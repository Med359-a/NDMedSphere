"use client";

import * as React from "react";

type FormState =
  | { status: "idle" }
  | { status: "sending" }
  | { status: "sent" }
  | { status: "error"; message: string };

function encodeMailto(value: string) {
  return encodeURIComponent(value).replaceAll("%20", "+");
}

export function ContactForm({
  toEmail,
  clinicName,
}: {
  toEmail: string;
  clinicName: string;
}) {
  const [state, setState] = React.useState<FormState>({ status: "idle" });
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      setState({ status: "error", message: "Please fill out all fields." });
      return;
    }

    // Simple, dependency-free approach: open a pre-filled email.
    // If you want server-side message handling later, we can add an API route.
    setState({ status: "sending" });
    try {
      const subject = `[${clinicName}] Appointment / Inquiry`;
      const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
      const href = `mailto:${toEmail}?subject=${encodeMailto(
        subject,
      )}&body=${encodeMailto(body)}`;
      window.location.href = href;
      setState({ status: "sent" });
    } catch {
      setState({
        status: "error",
        message: "Could not open your email client. Please try again.",
      });
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid gap-2">
        <label className="text-sm font-medium" htmlFor="name">
          Name
        </label>
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-11 rounded-xl border border-black/10 bg-white/70 px-3 text-sm shadow-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 dark:border-white/15 dark:bg-zinc-950/40"
          placeholder="Your name"
          autoComplete="name"
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-11 rounded-xl border border-black/10 bg-white/70 px-3 text-sm shadow-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 dark:border-white/15 dark:bg-zinc-950/40"
          placeholder="you@example.com"
          autoComplete="email"
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium" htmlFor="message">
          Message
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="min-h-32 rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-sm shadow-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 dark:border-white/15 dark:bg-zinc-950/40"
          placeholder="Tell us what you need help with…"
        />
      </div>

      {state.status === "error" ? (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-700 dark:text-rose-200">
          {state.message}
        </div>
      ) : null}

      {state.status === "sent" ? (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-800 dark:text-emerald-200">
          Your email client should open now. If it didn’t, you can email us
          directly.
        </div>
      ) : null}

      <button
        type="submit"
        disabled={state.status === "sending"}
        className="inline-flex h-11 items-center justify-center rounded-xl bg-zinc-900 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
      >
        {state.status === "sending" ? "Opening email…" : "Send message"}
      </button>
    </form>
  );
}


