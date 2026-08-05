/**
 * api/status.js — live health probe for status.newly.gg
 *
 * A Vercel Serverless Function that pings each dependency from Vercel's network
 * (more authoritative than checking from the visitor's browser) and returns a
 * single JSON snapshot the status page renders. It also folds in Vercel's and
 * Supabase's own public status feeds so upstream incidents show up here too.
 *
 * Classification: a network error / timeout / 5xx means "down"; a slow-but-ok
 * response is "degraded"; anything else (including auth-limited 4xx, which still
 * proves the service is answering) is "operational".
 */

const SUPABASE_URL = process.env.SUPABASE_URL || "https://ukgzwhbrgnoltbbeqzcf.supabase.co";
// anon key is public by design (it ships in the client bundle); env can override.
const SUPABASE_ANON = process.env.SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVrZ3p3aGJyZ25vbHRiYmVxemNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzOTY0NjksImV4cCI6MjA5NTk3MjQ2OX0.AhhTdsiVHMWkeuorNoLrQcfpQuY9MPuMh3fGr3IRT5k";

const SB_HEADERS = { apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}` };
const SLOW_MS = 1200;       // above this a 200 is "degraded"
const TIMEOUT_MS = 6000;

const RANK = { operational: 0, unknown: 0, maintenance: 1, degraded: 2, down: 3 };

async function ping(url, opts = {}) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  const t0 = Date.now();
  try {
    const res = await fetch(url, { redirect: "manual", ...opts, signal: ctrl.signal });
    const latencyMs = Date.now() - t0;
    let status = "operational";
    if (res.status >= 500) status = "down";
    else if (latencyMs > SLOW_MS) status = "degraded";
    return { status, latencyMs, detail: `HTTP ${res.status}` };
  } catch (e) {
    return { status: "down", latencyMs: Date.now() - t0, detail: e.name === "AbortError" ? "Timed out" : "Unreachable" };
  } finally {
    clearTimeout(timer);
  }
}

// Read an Atlassian Statuspage v2 feed (Vercel & Supabase both use this).
async function statuspage(url) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  const t0 = Date.now();
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    const json = await res.json();
    const indicator = json?.status?.indicator || "none";
    const map = { none: "operational", minor: "degraded", major: "down", critical: "down", maintenance: "maintenance" };
    return { status: map[indicator] || "operational", latencyMs: Date.now() - t0, detail: json?.status?.description || "Operational" };
  } catch {
    // Their feed being unreachable shouldn't make OUR system look down.
    return { status: "unknown", latencyMs: Date.now() - t0, detail: "Status feed unavailable" };
  } finally {
    clearTimeout(timer);
  }
}

const CHECKS = [
  { id: "web",      name: "Web App",              group: "Newly",    run: () => ping("https://newly.gg", { method: "GET" }) },
  { id: "database", name: "Database",             group: "Newly",    run: () => ping(`${SUPABASE_URL}/rest/v1/`, { headers: SB_HEADERS }) },
  { id: "auth",     name: "Authentication",       group: "Newly",    run: () => ping(`${SUPABASE_URL}/auth/v1/health`, { headers: SB_HEADERS }) },
  { id: "storage",  name: "Asset Storage",        group: "Newly",    run: () => ping(`${SUPABASE_URL}/storage/v1/bucket`, { headers: SB_HEADERS }) },
  { id: "realtime", name: "Realtime · Team Create", group: "Newly",  run: () => ping(`${SUPABASE_URL}/realtime/v1/`, { headers: SB_HEADERS }) },
  { id: "vercel",   name: "Vercel (hosting)",     group: "Upstream", run: () => statuspage("https://www.vercel-status.com/api/v2/status.json") },
  { id: "supabase", name: "Supabase (backend)",   group: "Upstream", run: () => statuspage("https://status.supabase.com/api/v2/status.json") },
];

module.exports = async (req, res) => {
  const results = await Promise.all(CHECKS.map(async (c) => {
    const r = await c.run();
    return { id: c.id, name: c.name, group: c.group, ...r };
  }));

  const worst = results.reduce((acc, c) => Math.max(acc, RANK[c.status] ?? 0), 0);
  const overall = worst >= 3 ? "down" : worst === 2 ? "degraded" : worst === 1 ? "maintenance" : "operational";

  res.setHeader("Cache-Control", "public, s-maxage=15, stale-while-revalidate=45");
  res.setHeader("Content-Type", "application/json");
  res.status(200).json({ updatedAt: new Date().toISOString(), overall, components: results });
};
