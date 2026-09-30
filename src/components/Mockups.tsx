/* Stylized, code-drawn previews of each project (no screenshots needed). */

function Chrome({ url, dark = true }: { url: string; dark?: boolean }) {
  return (
    <div
      className={`flex items-center gap-2 border-b px-4 py-3 ${
        dark ? "border-white/5 bg-[#15181e]" : "border-black/5 bg-[#ebeae4]"
      }`}
    >
      <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
      <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
      <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
      <span
        className={`ml-3 flex-1 truncate rounded-md px-3 py-1 font-mono text-[10px] ${
          dark ? "bg-white/5 text-white/40" : "bg-black/5 text-black/40"
        }`}
      >
        {url}
      </span>
    </div>
  );
}

function Callout({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`callout absolute z-20 ${className}`}>{children}</div>;
}

export function DevJobsMock() {
  const jobs = [
    ["Senior Frontend Engineer", "Lumen Labs", true],
    ["React Developer", "Northwind", false],
    ["Full-Stack Engineer (Next.js)", "Polaris AI", true],
    ["UI Engineer", "Vertex Studio", false],
    ["JavaScript Developer", "Brightline", false],
  ] as const;
  return (
    <div className="relative">
      <div className="mock-window overflow-hidden rounded-2xl border border-white/10 bg-[#0F1115] text-[#E4E6EB] shadow-2xl">
        <Chrome url="devjobs.app/jobs" />
        <div className="flex items-center justify-between border-b border-[#2A2E37] px-5 py-3 text-xs">
          <span className="font-semibold tracking-tight">
            Dev<span className="text-[#5B9DF0]">Jobs</span>
          </span>
          <span className="flex gap-4 text-[#8B92A3]">
            <span className="text-[#E4E6EB]">Jobs</span>
            <span>Saved</span>
            <span>About</span>
          </span>
        </div>
        <div className="space-y-3 p-5">
          <div className="flex items-center gap-2 rounded-lg border border-[#2A2E37] bg-[#1A1D23] px-3 py-2 text-[11px] text-[#8B92A3]">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
            Search jobs…
            <span className="mock-caret ml-0.5 h-3 w-px bg-[#5B9DF0]" />
          </div>
          <ul className="space-y-2">
            {jobs.map(([title, company, saved], i) => (
              <li
                key={title}
                className="mock-row flex items-center justify-between gap-3 rounded-lg border border-[#2A2E37] bg-[#1A1D23] px-3 py-2.5 text-[11px]"
                style={{ animationDelay: `${i * 0.12}s` }}
              >
                <span className="min-w-0 truncate">
                  <span className="font-medium">{title}</span>
                  <span className="text-[#8B92A3]"> · {company}</span>
                </span>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] ${
                    saved ? "bg-[#5B9DF0] font-medium text-[#0F1115]" : "border border-[#2A2E37] text-[#8B92A3]"
                  }`}
                >
                  {saved ? "Saved" : "Save"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Callout className="-left-3 top-24 md:-left-8">
        <span className="text-[var(--cyan)]">ISR</span> · revalidate 300s
      </Callout>
      <Callout className="-right-2 bottom-10 md:-right-6">
        <span className="status-dot" /> React Query cache synced
      </Callout>
    </div>
  );
}

function HabitCard({ dark }: { dark: boolean }) {
  const habits = [
    ["Morning run", true],
    ["Read 20 pages", true],
    ["Drink 2L of water", false],
    ["Meditate 10 min", false],
  ] as const;
  const c = dark
    ? { bg: "#262624", input: "#30302E", border: "#3A3937", text: "#FFFFFF", title: "#c3c2b7", mute: "#97958C" }
    : { bg: "#F5F4EF", input: "#FFFFFF", border: "#E5E4DF", text: "#0b0b0b", title: "#0b0b0b", mute: "#97958C" };
  return (
    <div
      className="mock-window overflow-hidden rounded-[28px] border shadow-2xl"
      style={{ background: c.bg, borderColor: c.border, color: c.text }}
    >
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-lg font-bold" style={{ color: c.title }}>
              Habits
            </div>
            <div className="text-[11px]" style={{ color: c.mute }}>
              Track what matters, every day.
            </div>
          </div>
          <div className="grid h-7 w-7 place-items-center rounded-full border text-[11px]" style={{ borderColor: c.border }}>
            {dark ? "☾" : "☀"}
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <div
            className="flex-1 rounded-xl border px-3 py-2 text-[11px]"
            style={{ background: c.input, borderColor: c.border, color: c.mute }}
          >
            Add a new habit…
          </div>
          <div className="rounded-xl px-3 py-2 text-[11px] font-medium" style={{ background: c.text, color: c.bg }}>
            Add
          </div>
        </div>
        <ul className="mt-3 space-y-2">
          {habits.map(([name, done]) => (
            <li
              key={name}
              className="flex items-center gap-3 rounded-2xl border px-4 py-3 text-[12px]"
              style={{ background: c.input, borderColor: c.border, opacity: done ? 0.5 : 1 }}
            >
              <span
                className="grid h-4 w-4 place-items-center rounded-full border text-[9px]"
                style={{ borderColor: done ? "#d97757" : c.border, background: done ? "#d97757" : "transparent", color: "#fff" }}
              >
                {done ? "✓" : ""}
              </span>
              <span style={{ textDecoration: done ? "line-through" : "none" }}>{name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function HabitsMock() {
  return (
    <div className="relative mx-auto grid max-w-[560px] grid-cols-2 items-start gap-4">
      <div className="mt-10">
        <HabitCard dark={false} />
      </div>
      <div>
        <HabitCard dark />
      </div>
      <div aria-hidden="true" className="confetti">
        {Array.from({ length: 14 }).map((_, i) => (
          <span key={i} style={{ ["--i" as string]: i }} />
        ))}
      </div>
      <Callout className="-left-2 bottom-4 md:-left-6">
        <span className="status-dot" /> Auto-saved locally
      </Callout>
      <Callout className="-right-2 top-2 md:-right-4">Light / Dark ◐</Callout>
    </div>
  );
}

export function EnterpriseMock() {
  const bars = [42, 58, 50, 72, 64, 88, 76];
  return (
    <div className="relative">
      <div className="mock-window overflow-hidden rounded-2xl border border-white/10 bg-[#0d0f16] text-white shadow-2xl">
        <Chrome url="app.hrbox / payroll" />
        <div className="grid grid-cols-[88px_1fr]">
          <aside className="space-y-2 border-r border-white/5 p-3 text-[10px] text-white/40">
            {["Dashboard", "Payroll", "Contracts", "Letters", "Chat"].map((l, i) => (
              <div key={l} className={`rounded-md px-2 py-1.5 ${i === 1 ? "bg-white/10 text-white" : ""}`}>
                {l}
              </div>
            ))}
          </aside>
          <div className="space-y-3 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-white/40">Payroll</div>
                <div className="text-sm font-semibold">Monthly overview</div>
              </div>
              <div className="rounded-md bg-gradient-to-r from-[var(--cyan)] to-[var(--violet)] px-2.5 py-1 text-[10px] font-semibold text-black">
                Export PDF
              </div>
            </div>
            <div className="flex h-24 items-end gap-2 rounded-xl border border-white/5 bg-white/[0.02] p-3">
              {bars.map((h, i) => (
                <div key={i} className="mock-bar flex-1 rounded-sm bg-gradient-to-t from-[var(--violet)] to-[var(--cyan)]" style={{ height: `${h}%`, animationDelay: `${i * 0.08}s` }} />
              ))}
            </div>
            <div className="space-y-1.5 text-[10px]">
              {[
                ["Employee", "Status", "Net"],
                ["#1024", "Approved", "●●●●"],
                ["#1025", "Pending", "●●●●"],
                ["#1026", "Approved", "●●●●"],
              ].map((row, i) => (
                <div key={i} className={`grid grid-cols-3 rounded-md px-2 py-1.5 ${i === 0 ? "text-white/40" : "bg-white/[0.03]"}`}>
                  {row.map((c, j) => (
                    <span key={j} className={j === 1 && c === "Pending" ? "text-amber-300" : j === 1 && i > 0 ? "text-emerald-300" : ""}>
                      {c}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mock-float absolute -bottom-8 -left-4 w-44 rotate-[-4deg] rounded-xl border border-white/10 bg-[#12141c]/95 p-3 shadow-2xl backdrop-blur md:-left-10 md:w-52">
        <div className="mb-2 text-[9px] uppercase tracking-widest text-white/40">Contract builder</div>
        <div className="space-y-1.5">
          <div className="h-2 w-3/4 rounded bg-white/20" />
          <div className="h-2 w-full rounded bg-white/10" />
          <div className="h-2 w-5/6 rounded bg-white/10" />
          <div className="mt-2 rounded border border-dashed border-[var(--cyan)]/50 p-1.5 text-[9px] text-[var(--cyan)]">
            + Drop clause block
          </div>
        </div>
      </div>

      <div className="mock-float absolute -right-3 -top-6 w-44 rotate-[3deg] space-y-1.5 rounded-xl border border-white/10 bg-[#12141c]/95 p-3 shadow-2xl backdrop-blur [animation-delay:1.2s] md:-right-8 md:w-52">
        <div className="text-[9px] uppercase tracking-widest text-white/40">Internal chat</div>
        <div className="w-fit rounded-lg rounded-bl-none bg-white/10 px-2 py-1 text-[10px]">Letter #218 is ready?</div>
        <div className="ml-auto w-fit rounded-lg rounded-br-none bg-[var(--violet)] px-2 py-1 text-[10px]">Generated ✓ PDF sent</div>
      </div>
    </div>
  );
}
