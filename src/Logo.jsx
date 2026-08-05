import { useId } from "react";

/**
 * Logo.jsx — NewlyDev / Newly.GG brand mark.
 *
 * Renders the angular hexagon "N" as an inline, gradient-filled SVG so it stays
 * razor-sharp at any size and can be tinted per context. Swapping the old PNG
 * for inline SVG means every place that already uses <Logo/> (dashboard, editor
 * chrome, auth) picks up the new mark automatically.
 *
 * Props:
 *   size   — mark size in px (default 28)
 *   name   — show the wordmark next to the mark (default false)
 *   title  — wordmark text (default "Newly.GG")
 *   sub    — small uppercase sub-label under the wordmark (optional)
 *   gap    — spacing between mark and wordmark (default 10)
 *   tone   — "brand" | "dev" | "player" | "white" (default "brand")
 *   glow   — soft neon drop-shadow behind the mark (default false)
 *   className, style — passthrough on the wrapper
 */

// The single source-of-truth path for the mark (from the brand SVG).
const MARK_PATH =
  "M 263.86 524.75 C260.02,517.91 247.97,497.00 217.02,443.50 C175.79,372.23 169.54,361.38 166.61,355.91 L 163.62 350.32 L 177.98 325.41 C214.75,261.66 236.21,224.50 256.84,188.86 C264.16,176.22 267.69,171.05 269.28,170.63 C270.50,170.30 317.26,170.03 373.19,170.03 L 474.88 170.02 L 476.81 172.76 C477.87,174.27 483.01,182.93 488.25,192.00 C493.48,201.07 503.59,218.62 510.72,231.00 C523.72,253.56 532.38,268.56 546.66,293.25 C550.88,300.54 560.04,316.45 567.02,328.60 L 579.71 350.70 L 571.99 364.10 C567.74,371.47 557.39,389.42 548.99,404.00 C531.91,433.65 525.30,445.09 495.99,495.75 L 475.60 531.00 L 371.49 531.00 L 267.37 531.00 L 263.86 524.75 ZM 475.00 489.79 C481.33,478.71 488.11,466.92 490.08,463.58 C492.06,460.23 500.79,445.12 509.49,430.00 C518.19,414.88 532.04,390.86 540.27,376.64 L 555.24 350.77 L 552.99 346.64 C551.75,344.36 549.51,340.48 548.01,338.00 C546.51,335.52 540.65,325.40 534.99,315.50 C529.32,305.60 521.67,292.33 517.98,286.00 C514.29,279.67 505.05,263.70 497.44,250.50 C467.22,198.06 463.89,192.49 462.51,192.00 C461.72,191.73 420.22,191.62 370.29,191.76 L 279.50 192.03 L 277.91 194.76 C275.59,198.75 249.73,243.56 223.53,289.00 C211.00,310.73 197.88,333.38 194.37,339.33 C190.87,345.29 188.00,350.31 188.00,350.48 C188.00,350.80 193.24,359.93 221.03,408.00 C229.45,422.58 241.39,443.27 247.54,454.00 C268.52,490.53 277.17,505.50 278.61,507.75 L 280.05 510.00 L 371.77 509.96 L 463.50 509.93 L 475.00 489.79 ZM 285.63 493.25 C284.32,491.19 276.38,477.58 268.00,463.00 C245.11,423.20 215.42,371.76 208.93,360.66 L 203.17 350.83 L 205.00 347.66 C208.90,340.90 229.73,304.71 238.48,289.50 C248.61,271.89 264.81,243.82 278.46,220.24 L 287.30 204.99 L 371.75 205.24 L 456.20 205.50 L 465.73 222.00 C470.97,231.07 479.55,245.93 484.79,255.00 C490.03,264.08 498.22,278.25 502.99,286.50 C507.76,294.75 518.04,312.56 525.84,326.09 L 540.02 350.67 L 534.85 359.59 C532.01,364.49 524.88,376.83 519.00,387.00 C513.13,397.17 501.57,417.20 493.31,431.50 C485.05,445.80 473.16,466.39 466.90,477.25 L 455.50 497.00 L 371.76 497.00 L 288.03 497.00 L 285.63 493.25 ZM 368.63 477.32 C369.97,472.02 365.79,448.21 361.04,434.00 C356.97,421.84 350.96,409.57 343.81,398.83 C333.01,382.60 311.15,362.44 294.12,353.00 C288.32,349.79 287.87,347.99 288.22,329.26 L 288.50 314.50 L 368.81 394.75 C412.99,438.89 449.26,475.00 449.43,475.00 C449.59,475.00 453.01,469.26 457.02,462.25 C461.04,455.24 473.17,434.20 483.98,415.50 C516.77,358.76 521.00,351.35 521.00,350.63 C521.00,349.93 501.76,316.23 492.84,301.32 C488.52,294.10 487.23,292.74 481.73,289.65 C460.87,277.93 444.50,253.86 442.37,231.79 C442.04,228.33 441.13,224.49 440.36,223.25 L 438.95 221.00 L 407.60 221.00 C381.12,221.00 376.05,221.23 375.01,222.48 C374.05,223.65 374.04,226.15 374.97,234.23 C377.90,259.62 386.81,284.15 400.31,303.96 C408.47,315.93 427.55,334.37 440.50,342.79 C456.56,353.23 455.00,350.36 455.00,369.50 C455.00,378.58 454.69,386.00 454.30,386.00 C453.92,386.00 417.58,350.04 373.55,306.08 L 293.50 226.16 L 277.54 253.83 C268.76,269.05 256.79,289.83 250.93,300.00 C239.91,319.14 226.58,342.22 223.47,347.56 L 221.68 350.62 L 238.15 379.06 L 254.61 407.50 L 263.02 412.50 C282.84,424.27 294.94,442.19 300.07,467.34 C301.20,472.90 302.60,478.02 303.18,478.71 C303.96,479.66 311.52,480.04 333.86,480.24 C350.16,480.38 364.52,480.33 365.76,480.13 C367.16,479.90 368.26,478.83 368.63,477.32 Z";

const TONES = {
  brand:  ["#8b6cff", "#27e2fd", "#198dfb"], // violet -> cyan -> blue
  dev:    ["#198dfb", "#3aa8ff", "#27e2fd"],
  player: ["#8b6cff", "#a878ff", "#c96bff"],
  white:  ["#ffffff", "#eef1f8", "#cfd6e6"],
};

export default function Logo({
  size = 28,
  name = false,
  title = "Newly.GG",
  sub = null,
  gap = 10,
  tone = "brand",
  glow = false,
  className = "",
  style = {},
}) {
  const uid = useId().replace(/:/g, "");
  const [c0, c1, c2] = TONES[tone] || TONES.brand;

  return (
    <div
      className={className}
      style={{ display: "inline-flex", alignItems: "center", gap, ...style }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 730 718"
        role="img"
        aria-label="Newly.GG"
        style={{
          display: "block",
          flexShrink: 0,
          filter: glow ? "drop-shadow(0 0 10px rgba(39,226,253,0.4))" : "none",
        }}
      >
        <defs>
          <linearGradient
            id={`nlyLogo-${uid}`}
            x1="150" y1="150" x2="580" y2="540"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor={c0} />
            <stop offset="0.5" stopColor={c1} />
            <stop offset="1" stopColor={c2} />
          </linearGradient>
        </defs>
        <path d={MARK_PATH} fill={`url(#nlyLogo-${uid})`} />
      </svg>

      {name && (
        <div style={{ lineHeight: 1.15 }}>
          <div
            style={{
              fontSize: Math.max(12, Math.round(size * 0.46)),
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "-0.02em",
            }}
          >
            {title}
          </div>
          {sub && (
            <div
              style={{
                fontSize: Math.max(9, Math.round(size * 0.3)),
                color: "rgba(255,255,255,0.34)",
                textTransform: "uppercase",
                letterSpacing: "0.16em",
                fontFamily: "var(--font-mono, monospace)",
                marginTop: 2,
              }}
            >
              {sub}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
