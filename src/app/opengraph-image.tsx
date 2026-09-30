import { ImageResponse } from "next/og";

export const alt = "Abolfazl Abbaspour — Front-End Developer (React / Next.js)";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const dots = Array.from({ length: 90 }, (_, i) => {
    const a = i * 2.39996;
    const r = 30 + Math.sqrt(i) * 24;
    return { x: 900 + Math.cos(a) * r, y: 315 + Math.sin(a) * r, s: 2 + (i % 4), o: 0.25 + ((i * 37) % 60) / 100 };
  });
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background: "radial-gradient(circle at 75% 50%, #1b1450 0%, #05050c 55%)",
          color: "#f4f4f6",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {dots.map((d, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: d.x,
              top: d.y,
              width: d.s,
              height: d.s,
              borderRadius: 999,
              background: i % 3 === 0 ? "#7c5cff" : "#38e8ff",
              opacity: d.o,
            }}
          />
        ))}
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 22, letterSpacing: 4, color: "#9a9cab" }}>
          <div style={{ width: 12, height: 12, borderRadius: 999, background: "#3dffa8" }} />
          AVAILABLE FOR NEW PROJECTS
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 112, fontWeight: 700, letterSpacing: -5, lineHeight: 0.95 }}>Abolfazl</div>
          <div
            style={{
              fontSize: 112,
              fontWeight: 700,
              letterSpacing: -5,
              lineHeight: 0.95,
              backgroundImage: "linear-gradient(90deg, #38e8ff, #7c5cff)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Abbaspour
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#c9cad3" }}>
          <span>Front-End Developer · React / Next.js</span>
          <span style={{ color: "#38e8ff" }}>Let&apos;s build something remarkable ↗</span>
        </div>
      </div>
    ),
    size,
  );
}
