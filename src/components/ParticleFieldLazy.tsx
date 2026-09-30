"use client";

import dynamic from "next/dynamic";

// three.js is only needed in the browser — keep it out of the initial bundle.
const ParticleField = dynamic(() => import("./ParticleField"), { ssr: false });

export default function ParticleFieldLazy() {
  return <ParticleField />;
}
