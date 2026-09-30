import { profile } from "@/lib/content";
import { SHAPES } from "@/lib/scene";
import SectionLabel from "./ui/SectionLabel";
import MaskHeading from "./ui/MaskHeading";
import Magnetic from "./ui/Magnetic";
import ContactForm from "./ContactForm";
import CopyEmail from "./CopyEmail";

export default function Contact() {
  return (
    <section
      id="contact"
      data-scene
      data-scene-morph={SHAPES.globe}
      data-scene-alpha="0.85"
      data-scene-x="2.8"
      data-scene-y="0.5"
      data-scene-scale="1.1"
      className="relative z-10 px-5 py-28 md:px-10 md:py-40"
    >
      <div className="mx-auto max-w-[1600px]">
        <SectionLabel index="07" label="Contact" />
        <MaskHeading
          className="font-display text-[13vw] font-semibold leading-[0.9] tracking-[-0.06em] md:text-[9vw]"
          lines={[
            "Let's build",
            "something",
            <em key="r" className="font-serif font-normal italic tracking-[-0.03em] text-gradient">
              remarkable.
            </em>,
          ]}
        />

        <div className="mt-16 grid gap-10 md:mt-24 lg:grid-cols-12">
          <div data-reveal="up" className="lg:col-span-7">
            <ContactForm />
          </div>

          <div className="space-y-10 lg:col-span-4 lg:col-start-9">
            <div data-reveal="up">
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--muted)]">Email me directly</div>
              <a
                href={`mailto:${profile.email}`}
                className="mt-3 block break-all font-display text-3xl font-semibold tracking-[-0.03em] transition-colors hover:text-[var(--cyan)] md:text-4xl"
                data-cursor="Write"
              >
                {profile.email}
              </a>
              <div className="mt-5 flex flex-wrap gap-3">
                <Magnetic strength={0.2}>
                  <CopyEmail />
                </Magnetic>
                <Magnetic strength={0.2}>
                  <a href={profile.resume} target="_blank" rel="noreferrer" className="btn-ghost">
                    Résumé <span aria-hidden="true">↓</span>
                  </a>
                </Magnetic>
              </div>
            </div>

            <div data-reveal="up" className="border-t border-white/10 pt-8">
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--muted)]">Elsewhere</div>
              <ul className="mt-4">
                {[
                  ["LinkedIn", profile.linkedin],
                  ["GitHub", profile.github],
                ].map(([label, href]) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="social-link group flex items-center justify-between border-b border-white/10 py-4 font-display text-2xl font-semibold tracking-[-0.03em]"
                    >
                      {label}
                      <span aria-hidden="true" className="transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1">
                        ↗
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div data-reveal="up" className="glass rounded-3xl p-6">
              <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em]">
                <span className="status-dot" /> Available for new projects
              </div>
              <p className="mt-3 text-[15px] leading-relaxed text-[var(--muted)]">
                Freelance projects, long-term collaborations or a full-time role — if you&apos;re building something
                ambitious for the web, I&apos;d love to hear about it.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
