import { useState, useEffect, useCallback, useRef } from "react";
import AmbientBackdrop from "./AmbientBackdrop";
import Logo from "./Logo";

/* ═══════════════════════════════════════════════════════════════════════════
   StatusPage — status.newly.gg

   Polls /api/status (a serverless probe of the web app, database, auth, storage,
   realtime, and the upstream Vercel/Supabase feeds) and renders a live system
   board in the launch-menu aesthetic. Auto-refreshes every 30s.
   ═══════════════════════════════════════════════════════════════════════════ */

const REFRESH_MS = 30000;

const TONE = {
  operational: { c: "#3dd68c", label: "Operational" },
  degraded:    { c: "#f7b84f", label: "Degraded" },
  down:        { c: "#f75a5a", label: "Down" },
  maintenance: { c: "#5fb4ff", label: "Maintenance" },
  unknown:     { c: "#7c8398", label: "Unknown" },
};

const OVERALL = {
  operational: { c: "#3dd68c", head: "All systems operational" },
  degraded:    { c: "#f7b84f", head: "Degraded performance" },
  down:        { c: "#f75a5a", head: "Major service outage" },
  maintenance: { c: "#5fb4ff", head: "Under maintenance" },
};

function Dot({ color, pulse }) {
  return (
    <span style={{ position: "relative", display: "inline-flex", width: 10, height: 10, flexShrink: 0 }}>
      {pulse && <span style={{
        position: "absolute", inset: -3, borderRadius: "50%",
        background: color, opacity: 0.35, animation: "stPulse 1.8s ease-out infinite",
      }} />}
      <span style={{ width: 10, height: 10, borderRadius: "50%", background: color, boxShadow: `0 0 10px ${color}` }} />
    </span>
  );
}

function ComponentRow({ c }) {
  const tone = TONE[c.status] || TONE.unknown;
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "13px 16px", borderBottom: "1px solid rgba(255,255,255,0.05)",
    }}>
      <Dot color={tone.c} pulse={c.status === "operational"} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: "#eef1f8" }}>{c.name}</div>
        {c.detail && (
          <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.35)", marginTop: 2, fontFamily: "var(--font-mono, monospace)" }}>
            {c.detail}
          </div>
        )}
      </div>
      {typeof c.latencyMs === "number" && (
        <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 11, color: "rgba(255,255,255,0.4)", flexShrink: 0 }}>
          {c.latencyMs} ms
        </div>
      )}
      <div style={{
        fontFamily: "var(--font-mono, monospace)", fontSize: 10, fontWeight: 700,
        letterSpacing: "0.1em", textTransform: "uppercase", color: tone.c,
        border: `1px solid ${tone.c}55`, borderRadius: 5, padding: "3px 8px", flexShrink: 0, minWidth: 92, textAlign: "center",
      }}>{tone.label}</div>
    </div>
  );
}

function GroupBlock({ title, items }) {
  if (!items.length) return null;
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 10, marginBottom: 12,
        fontFamily: "var(--font-mono, monospace)", fontSize: 11, fontWeight: 600,
        letterSpacing: "0.24em", textTransform: "uppercase", color: "#5fa9ff",
      }}>
        <span style={{ opacity: 0.85 }}>◇</span>{title}
        <span style={{ flex: 1, height: 1, background: "linear-gradient(90deg, rgba(95,169,255,0.3), transparent)" }} />
      </div>
      <div style={{
        background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 12, overflow: "hidden",
      }}>
        {items.map((c) => <ComponentRow key={c.id} c={c} />)}
      </div>
    </div>
  );
}

export default function StatusPage() {
  const [data, setData]   = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tick, setTick]   = useState(0);          // drives "updated Xs ago"
  const lastFetched = useRef(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/status", { cache: "no-store" });
      if (!res.ok) throw new Error(`Probe returned ${res.status}`);
      const json = await res.json();
      setData(json);
      setError(null);
      lastFetched.current = Date.now();
    } catch (e) {
      setError(e?.message || "Couldn't reach the status probe.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = "Newly · System Status";
    load();
    const iv = setInterval(load, REFRESH_MS);
    const t = setInterval(() => setTick((x) => x + 1), 1000);
    return () => { clearInterval(iv); clearInterval(t); };
  }, [load]);

  const overall = OVERALL[data?.overall] || OVERALL.operational;
  const secsAgo = lastFetched.current ? Math.floor((Date.now() - lastFetched.current) / 1000) : null;

  const newly = (data?.components || []).filter((c) => c.group === "Newly");
  const upstream = (data?.components || []).filter((c) => c.group === "Upstream");

  return (
    <div style={{
      position: "relative", minHeight: "100vh", width: "100%",
      background: "#07080c", color: "#eef1f8",
      fontFamily: "var(--font-ui, -apple-system, system-ui, sans-serif)",
      overflowX: "hidden",
    }}>
      <style>{`
        @keyframes stPulse { 0% { transform: scale(1); opacity: .35 } 70% { transform: scale(2.4); opacity: 0 } 100% { opacity: 0 } }
        @keyframes stSpin { to { transform: rotate(360deg) } }
        :root { color-scheme: dark; }
        a { color: inherit; }
      `}</style>
      <AmbientBackdrop tone="create" />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 720, margin: "0 auto", padding: "clamp(24px,5vw,56px) 20px 64px" }}>
        {/* Brand */}
        <a href="https://newly.gg" style={{ display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none", marginBottom: 28 }}>
          <Logo size={28} tone="dev" glow />
          <span style={{ fontWeight: 800, letterSpacing: "-0.02em", fontSize: 16 }}>
            NEWLY<b style={{ background: "linear-gradient(90deg,#27e2fd,#198dfb)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>.GG</b>
          </span>
          <span style={{
            marginLeft: 4, fontFamily: "var(--font-mono, monospace)", fontSize: 10, letterSpacing: "0.18em",
            textTransform: "uppercase", color: "#9aa0b4", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 5, padding: "3px 7px",
          }}>Status</span>
        </a>

        {/* Overall banner */}
        <div style={{
          position: "relative", borderRadius: 14, padding: "22px 22px",
          background: `linear-gradient(180deg, ${overall.c}1f, rgba(255,255,255,0.02))`,
          border: `1px solid ${overall.c}55`, marginBottom: 30,
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 16px 100%, 0 calc(100% - 16px))",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Dot color={overall.c} pulse />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff" }}>
                {loading && !data ? "Checking systems…" : error ? "Status unavailable" : overall.head}
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 4, fontFamily: "var(--font-mono, monospace)" }}>
                {error
                  ? error
                  : secsAgo != null
                    ? `Live · updated ${secsAgo === 0 ? "just now" : `${secsAgo}s ago`} · re-checks every 30s`
                    : "Live monitoring"}
              </div>
            </div>
            <button onClick={load} title="Refresh now" style={{
              flexShrink: 0, width: 36, height: 36, borderRadius: 9, cursor: "pointer",
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.14)",
              color: "#eef1f8", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ display: "inline-block", animation: loading ? "stSpin .7s linear infinite" : "none" }}>↻</span>
            </button>
          </div>
        </div>

        {error && !data ? (
          <div style={{ padding: "40px 0", textAlign: "center", color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-mono, monospace)", fontSize: 13 }}>
            Couldn't load component health. Retrying automatically…
          </div>
        ) : (
          <>
            <GroupBlock title="Newly Services" items={newly} />
            <GroupBlock title="Upstream Providers" items={upstream} />
          </>
        )}

        <div style={{ marginTop: 30, fontSize: 11, color: "rgba(255,255,255,0.3)", lineHeight: 1.7, fontFamily: "var(--font-mono, monospace)" }}>
          Probed live from Vercel's network. Upstream rows mirror Vercel's and Supabase's own status feeds.
        </div>
      </div>
    </div>
  );
}
