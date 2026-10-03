"use client";

import { useState, type FormEvent } from "react";
import { budgets, profile, projectTypes } from "@/lib/content";

function Chips({
  name,
  options,
  value,
  onChange,
}: {
  name: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={name}>
      {options.map((o) => (
        <button
          key={o}
          type="button"
          role="radio"
          aria-checked={value === o}
          onClick={() => onChange(o)}
          className={`chip-option ${value === o ? "is-selected" : ""}`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactForm() {
  const [type, setType] = useState(projectTypes[0]);
  const [budget, setBudget] = useState(budgets.includes("Not sure yet") ? "Not sure yet" : budgets[budgets.length - 1]);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
          botcheck: data.get("botcheck") === "on",
          type,
          budget,
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) throw new Error(json.error || "Something went wrong.");
      setStatus("sent");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  if (status === "sent") {
    return (
      <div className="glass relative flex min-h-[420px] flex-col items-start justify-center rounded-[2rem] p-8 md:p-12" aria-live="polite">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-[var(--cyan)] to-[var(--violet)] text-2xl text-black">
          ✓
        </span>
        <h3 className="mt-8 font-display text-4xl font-semibold tracking-[-0.04em]">Message received.</h3>
        <p className="mt-4 max-w-md text-lg text-[var(--muted)]">
          Thanks for reaching out — I&apos;ll read your project details and get back to you by email soon.
        </p>
        <button type="button" onClick={() => setStatus("idle")} className="btn-ghost mt-8">
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="glass relative rounded-[2rem] p-6 md:p-10">
      {/* Honeypot for bots: a hidden checkbox (browser autofill never ticks checkboxes). */}
      <input type="checkbox" name="botcheck" tabIndex={-1} aria-hidden="true" className="hidden" />

      <div className="grid gap-6 md:grid-cols-2">
        <label className="field">
          <span>Your name</span>
          <input name="name" required maxLength={120} autoComplete="name" placeholder="Jane Doe" />
        </label>
        <label className="field">
          <span>Email</span>
          <input name="email" type="email" required maxLength={200} autoComplete="email" placeholder="jane@company.com" />
        </label>
      </div>

      <fieldset className="mt-8">
        <legend className="field-label">What do you need?</legend>
        <Chips name="Project type" options={projectTypes} value={type} onChange={setType} />
      </fieldset>

      <fieldset className="mt-8">
        <legend className="field-label">Budget</legend>
        <Chips name="Budget" options={budgets} value={budget} onChange={setBudget} />
      </fieldset>

      <label className="field mt-8">
        <span>Tell me about your project</span>
        <textarea name="message" required minLength={5} maxLength={5000} rows={4} placeholder="Goals, timeline, links to anything that inspires you…" />
      </label>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[var(--muted)]" aria-live="polite">
          {status === "error" ? (
            <span className="text-rose-300">
              {error} You can also email{" "}
              <a className="underline" href={`mailto:${profile.email}`}>
                {profile.email}
              </a>
            </span>
          ) : (
            <>
              Free consultation · No commitment ·{" "}
              <a href="/privacy" className="underline decoration-white/30 underline-offset-2 hover:text-[var(--fg)]">
                Privacy
              </a>
            </>
          )}
        </p>
        <button type="submit" disabled={status === "sending"} className="btn-primary btn-lg justify-center disabled:opacity-60">
          {status === "sending" ? "Sending…" : "Send inquiry"} <span aria-hidden="true" className="btn-arrow">↗</span>
        </button>
      </div>
    </form>
  );
}
