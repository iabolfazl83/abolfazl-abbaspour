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

export default function ContactForm() {
  const [type, setType] = useState(projectTypes[0]);
  const [budget, setBudget] = useState(budgets[4]);
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();
    const subject = `New project inquiry — ${type} — ${name}`;
    const body = [
      `Hi Abolfazl,`,
      ``,
      message,
      ``,
      `— — —`,
      `Name: ${name}`,
      `Email: ${email}`,
      `Project type: ${type}`,
      `Budget: ${budget}`,
    ].join("\n");
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <form onSubmit={onSubmit} className="glass relative rounded-[2rem] p-6 md:p-10">
      <div className="grid gap-6 md:grid-cols-2">
        <label className="field">
          <span>Your name</span>
          <input name="name" required autoComplete="name" placeholder="Jane Doe" />
        </label>
        <label className="field">
          <span>Email</span>
          <input name="email" type="email" required autoComplete="email" placeholder="jane@company.com" />
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
        <textarea name="message" required rows={4} placeholder="Goals, timeline, links to anything that inspires you…" />
      </label>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[var(--muted)]" aria-live="polite">
          {sent ? (
            <>
              Your email app should open now. Nothing happened? Write to{" "}
              <a className="text-[var(--fg)] underline" href={`mailto:${profile.email}`}>
                {profile.email}
              </a>
            </>
          ) : (
            "Free consultation · No commitment"
          )}
        </p>
        <button type="submit" className="btn-primary btn-lg justify-center">
          Send inquiry <span aria-hidden="true" className="btn-arrow">↗</span>
        </button>
      </div>
    </form>
  );
}
