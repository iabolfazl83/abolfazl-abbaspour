"use client";

import { useState } from "react";
import { profile } from "@/lib/content";

export default function CopyEmail() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };
  return (
    <button type="button" onClick={copy} className="btn-ghost" aria-live="polite">
      {copied ? "Copied ✓" : "Copy email"}
    </button>
  );
}
