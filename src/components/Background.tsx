/** Static, GPU-cheap layers that sit under the particle field. */
export default function Background() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="bg-glow bg-glow--a" />
      <div className="bg-glow bg-glow--b" />
      <div className="bg-grid" />
      <div className="bg-vignette" />
    </div>
  );
}

export function Grain() {
  return <div aria-hidden="true" className="grain pointer-events-none fixed z-[60]" />;
}
