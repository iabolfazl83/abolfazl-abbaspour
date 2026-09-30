import type { ReactNode } from "react";

/** Heading whose lines slide up from behind a mask when scrolled into view. */
export default function MaskHeading({
  lines,
  className = "",
  as: Tag = "h2",
}: {
  lines: ReactNode[];
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <Tag data-reveal="mask" className={className}>
      {lines.map((line, i) => (
        <span key={i} className="mask-line block overflow-hidden pb-[0.08em]">
          <span className="mask-inner block">{line}</span>
        </span>
      ))}
    </Tag>
  );
}
