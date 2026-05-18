# Deploying to Vercel

This project targets Cloudflare Workers by default (used by Lovable's built-in
publish). A parallel Vercel setup is also configured.

## How it works

- `vite.config.ts` detects `process.env.VERCEL` and disables the Cloudflare
  Vite plugin, so `vite build` emits a standard SSR bundle:
  - `dist/client/` — static client assets
  - `dist/server/server.js` — Web-standard `{ fetch(request, env, ctx) }` SSR handler
- `api/index.ts` is a **Vercel Edge function** that imports that SSR handler
  and forwards every dynamic request to it.
- `vercel.json` rewrites every non-asset path to `/api`, so SSR runs for all
  routes while static files in `dist/client/` are served directly.

## Steps

1. Push the repo to GitHub (use **GitHub → Connect to GitHub** in Lovable).
2. In Vercel, click **Add New → Project** and import the repo.
3. Framework preset: **Other**. The build command (`vite build`) and output
   directory (`dist/client`) come from `vercel.json`; do not override them.
4. No environment variables are required for the base app. Add any project
   secrets (e.g. third-party API keys) under **Project Settings → Environment
   Variables** before the first deploy.
5. Click **Deploy**.

## Notes

- Vercel Edge runtime is Web-standard (Request/Response, `fetch`), the same
  contract as Cloudflare Workers — no code in `src/server.ts` had to change.
- Local `vite dev` and Lovable preview are unaffected: the Cloudflare plugin
  only runs during `vite build`, and only when `VERCEL` is not set.
- `api/index.ts` runs on the **Node.js runtime** (not Edge). The TanStack
  Start SSR bundle references modules (tailwind-merge, h3, router-core SSR
  helpers) that Vercel's Edge bundler can't resolve, so Node runtime is the
  correct target. To switch to Edge later you would need to pre-bundle the
  SSR output with all deps inlined.
