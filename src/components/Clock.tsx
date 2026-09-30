"use client";

import { useEffect, useState } from "react";
import { profile } from "@/lib/content";

export default function Clock({ className }: { className?: string }) {
  const [time, setTime] = useState("--:--:--");

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: profile.timezone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const update = () => setTime(fmt.format(new Date()));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className={className} suppressHydrationWarning>
      <span className="tabular-nums">{time}</span> <span className="opacity-60">IRST</span>
    </span>
  );
}
