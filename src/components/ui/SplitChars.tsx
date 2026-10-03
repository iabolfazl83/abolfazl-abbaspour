/**
 * Server-rendered character split — each glyph can be animated independently.
 * Letters stay in the DOM as one unbroken word (no hidden duplicate), so search engines
 * read the real text; give the parent heading an aria-label for screen readers.
 */
export default function SplitChars({
  text,
  className,
  charClassName = "char",
}: {
  text: string;
  className?: string;
  charClassName?: string;
}) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((word, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap">
          {Array.from(word).map((c, ci) => (
            <span key={ci} className={`inline-block ${charClassName}`}>
              {c}
            </span>
          ))}
          {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </span>
  );
}
