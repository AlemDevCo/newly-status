/**
 * AmbientBackdrop — the launch-menu atmosphere (hex field, colored glows, a soft
 * vignette) as a drop-in layer, so pages beyond the landing/Discover screens can
 * share the same look. Absolutely positioned, non-interactive, sits at z-index 0;
 * give the content above it a stacking context (position + zIndex).
 *
 * tone: "create" (blue/cyan — the studio/dev side) or "player" (violet).
 */
const HEX = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='56' height='96' viewBox='0 0 56 96'><g fill='none' stroke='%23ffffff' stroke-opacity='0.028' stroke-width='1'><path d='M28 0 L56 16 L56 48 L28 64 L0 48 L0 16 Z'/><path d='M28 48 L56 64 L56 96 L28 112 L0 96 L0 64 Z'/></g></svg>";

export default function AmbientBackdrop({ tone = "create" }) {
  const glow = tone === "player"
    ? { l: "rgba(139,108,255,.40)", r: "rgba(25,141,251,.32)", t: "rgba(39,226,253,.20)" }
    : { l: "rgba(25,141,251,.38)",  r: "rgba(39,226,253,.30)", t: "rgba(139,108,255,.16)" };

  const mask = "radial-gradient(120% 90% at 50% 0%, #000 55%, transparent 100%)";

  return (
    <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
      <div style={{
        position: "absolute", inset: -2, opacity: 0.5,
        backgroundImage: `url("${HEX}")`, backgroundSize: "56px 96px",
        WebkitMaskImage: mask, maskImage: mask,
      }} />
      <div style={{ position: "absolute", width: "60vw", height: "60vw", left: "-24vw", top: "-22vw", borderRadius: "50%", filter: "blur(90px)", opacity: 0.5, background: `radial-gradient(circle, ${glow.l}, transparent 62%)` }} />
      <div style={{ position: "absolute", width: "54vw", height: "54vw", right: "-22vw", top: "-18vw", borderRadius: "50%", filter: "blur(90px)", opacity: 0.4, background: `radial-gradient(circle, ${glow.r}, transparent 62%)` }} />
      <div style={{ position: "absolute", width: "80vw", height: "36vw", left: "10vw", top: "-22vw", borderRadius: "50%", filter: "blur(90px)", opacity: 0.28, background: `radial-gradient(circle, ${glow.t}, transparent 60%)` }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(130% 120% at 50% 20%, transparent 55%, rgba(0,0,0,.6) 100%)" }} />
    </div>
  );
}
