import { navLinks, profile } from "@/lib/content";
import Clock from "./Clock";

export default function Footer() {
  return (
    <footer
      data-scene
      data-scene-morph="6"
      data-scene-alpha="0.5"
      data-scene-x="0"
      data-scene-y="-1.2"
      data-scene-scale="1.35"
      className="relative z-10 overflow-hidden border-t border-white/10 px-5 pb-8 pt-16 md:px-10"
    >
      <div className="mx-auto max-w-[1600px]">
        <div className="grid gap-10 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--muted)] md:grid-cols-4">
          <div>
            <div className="mb-4 text-[var(--fg)]">Menu</div>
            <ul className="space-y-2">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="hover:text-[var(--fg)]">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="mb-4 text-[var(--fg)]">Socials</div>
            <ul className="space-y-2">
              <li><a href={profile.linkedin} target="_blank" rel="noreferrer" className="hover:text-[var(--fg)]">LinkedIn ↗</a></li>
              <li><a href={profile.github} target="_blank" rel="noreferrer" className="hover:text-[var(--fg)]">GitHub ↗</a></li>
              <li><a href={profile.telegram} target="_blank" rel="noreferrer" className="hover:text-[var(--fg)]">Telegram ↗</a></li>
              <li><a href={profile.resume} target="_blank" rel="noreferrer" className="hover:text-[var(--fg)]">Resume ↗</a></li>
            </ul>
          </div>
          <div>
            <div className="mb-4 text-[var(--fg)]">Contact</div>
            <a href={`mailto:${profile.email}`} className="break-all normal-case tracking-normal hover:text-[var(--fg)]">
              {profile.email}
            </a>
          </div>
          <div>
            <div className="mb-4 text-[var(--fg)]">Local time</div>
            <Clock />
          </div>
        </div>

        <div aria-hidden="true" className="footer-word mt-16 select-none font-display font-semibold leading-[0.8] tracking-[-0.06em] md:mt-24">
          ABBASPOUR
        </div>

        <div className="mt-8 flex flex-col gap-4 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--muted)] md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} {profile.name}</span>
          <span>Designed &amp; built with Next.js · Three.js · GSAP</span>
          <a href="#top" className="hover:text-[var(--fg)]">
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
