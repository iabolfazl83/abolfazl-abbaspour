import Scramble from "./Scramble";

export default function SectionLabel({ index, label }: { index: string; label: string }) {
  return (
    <div className="mb-10 flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--muted)] md:mb-14">
      <span className="text-[var(--cyan)]">({index})</span>
      <span className="h-px w-10 bg-white/20" />
      <Scramble text={label} trigger="both" />
    </div>
  );
}
