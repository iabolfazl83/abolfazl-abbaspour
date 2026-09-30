/** Server-rendered character split — each glyph can be animated independently. */
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
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
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
    </span>
  );
}
