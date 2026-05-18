// Vercel Node function — boots the TanStack Start SSR fetch handler
// produced by `vite build` (when VERCEL=1, the Cloudflare plugin is
// disabled in vite.config.ts and a standard SSR bundle is emitted).
//
// The build outputs dist/server/server.js whose default export is
// { fetch(request, env, ctx) } — the same Web-standard shape used by
// Cloudflare Workers.

// @ts-expect-error — resolved at deploy time after `vite build` runs
import handler from "../dist/server/server.js";

// Use Node.js runtime (not Edge) — the TanStack Start SSR bundle references
// modules like tailwind-merge, @tanstack/router-core/ssr/*, and h3-v2/srvx
// that Vercel's Edge bundler cannot resolve. Node runtime handles them fine.
export const config = {
  runtime: "nodejs",
};

export default async function vercelHandler(request: Request): Promise<Response> {
  const url = request.url.startsWith("http")
    ? request.url
    : new URL(
        request.url,
        `${request.headers.get("x-forwarded-proto") ?? "https"}://${request.headers.get("host")}`,
      ).toString();

  const normalizedRequest = new Request(url, {
    method: request.method,
    headers: request.headers,
    body: request.body,
    redirect: request.redirect,
    duplex: "half",
  } as RequestInit & { duplex: "half" });

  return handler.fetch(normalizedRequest, process.env, {});
}
