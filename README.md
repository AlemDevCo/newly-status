# Newly — Status Page

Standalone live status board for **status.newly.gg**. Deliberately its own project
so it stays up even if the main app's deployment breaks (the whole point of a
status page).

## What it does

- `api/status.js` — a Vercel Serverless Function that probes each dependency from
  Vercel's network (web app, database, auth, storage, realtime) and folds in
  Vercel's and Supabase's own public status feeds. Returns one JSON snapshot.
- `src/StatusPage.jsx` — polls `/api/status` every 30s and renders a live board
  in the Newly launch-menu aesthetic.

## Run locally

```bash
npm install
npm run dev
```

The board expects `/api/status` to exist. Locally that route only runs on Vercel,
so use `vercel dev` if you want the live probe while developing:

```bash
npm i -g vercel
vercel dev
```

## Deploy on Vercel

1. Push this folder to a new GitHub repo.
2. In Vercel: **New Project → import the repo.** Framework preset auto-detects
   **Vite**; the `api/` folder is picked up as a Serverless Function
   automatically. No extra config needed.
3. Move the domain: in your **main** project remove `status.newly.gg`, then in
   **this** project → Settings → Domains → add `status.newly.gg`.

Because `index.html` is served at the domain root, there are no host rewrites to
fight — the board loads directly at `/`, and the probe at `/api/status`.

## Config

`api/status.js` falls back to the public Supabase URL + anon key (both already
public in the client bundle). To override, set project env vars:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

## Extending

Add or edit rows in the `CHECKS` array in `api/status.js`. Each check either
`ping()`s a URL (network error / 5xx = down, slow = degraded, else operational)
or reads an Atlassian Statuspage v2 feed via `statuspage()`.
