import type { Metadata } from "next";
import { profile } from "@/lib/content";

export const metadata: Metadata = {
  title: "Privacy",
  description: `How ${profile.name}'s portfolio handles your data: no tracking cookies, privacy-friendly analytics and contact-form messages used only to reply to you.`,
  alternates: { canonical: "/privacy" },
};

const updated = "October 3, 2026";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-white/10 py-8">
      <h2 className="font-display text-2xl font-semibold tracking-[-0.03em]">{title}</h2>
      <div className="mt-4 space-y-3 leading-relaxed text-[var(--muted)]">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <main className="mx-auto min-h-screen max-w-3xl px-5 py-16 md:py-24">
      <a href="/" className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--muted)] hover:text-[var(--fg)]">
        ← Back to site
      </a>
      <h1 className="mt-10 font-display text-5xl font-semibold tracking-[-0.05em]">Privacy</h1>
      <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">Last updated {updated}</p>

      <div className="mt-10">
        <Section title="The short version">
          <p>
            This site does not use tracking or advertising cookies, does not show a cookie banner because it doesn&apos;t
            need one, and never sells or shares your data.
          </p>
        </Section>

        <Section title="Analytics">
          <p>
            Anonymous, aggregated visit statistics and performance metrics are collected with Vercel Web Analytics and
            Speed Insights. They work without cookies and do not identify you personally or follow you across other
            websites.
          </p>
        </Section>

        <Section title="Contact form">
          <p>
            When you send an inquiry, your name, email address, project type, budget range and message are stored
            securely so I can read and reply to them. An email notification of your message is also sent to my inbox via
            FormSubmit. Your details are used only to respond to you and are deleted when no longer needed.
          </p>
          <p>
            You can ask me to delete your message at any time by writing to{" "}
            <a className="text-[var(--fg)] underline" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
            .
          </p>
        </Section>

        <Section title="Cookies">
          <p>
            Visitors receive no cookies. The only cookie this site ever sets is a strictly necessary login cookie for the
            site owner&apos;s private message inbox.
          </p>
        </Section>

        <Section title="Hosting">
          <p>The site is hosted on Vercel, which processes standard server logs (such as IP addresses) to deliver and secure it.</p>
        </Section>
      </div>
    </main>
  );
}
