// Vercel Node function — boots the TanStack Start SSR fetch handler
// produced by `vite build` (when VERCEL=1, the Cloudflare plugin is
// disabled in vite.config.ts and a standard SSR bundle is emitted).
//
// The build outputs dist/server/server.js whose default export is
// { fetch(request, env, ctx) } — the same Web-standard shape used by
// Cloudflare Workers.

import type { IncomingMessage, ServerResponse } from "node:http";
// @ts-expect-error — resolved at deploy time after `vite build` runs
import handler from "../dist/server/server.js";

// Vercel Node.js runtime — receives Node (req, res), not Web Request/Response.
export const config = {
  runtime: "nodejs",
};

export default async function vercelHandler(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  try {
    const proto =
      (req.headers["x-forwarded-proto"] as string | undefined) ?? "https";
    const host =
      (req.headers["x-forwarded-host"] as string | undefined) ??
      (req.headers.host as string | undefined) ??
      "localhost";
    const url = `${proto}://${host}${req.url ?? "/"}`;

    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (value === undefined) continue;
      if (Array.isArray(value)) {
        for (const v of value) headers.append(key, v);
      } else {
        headers.set(key, value as string);
      }
    }

    const method = (req.method ?? "GET").toUpperCase();
    const hasBody = method !== "GET" && method !== "HEAD";
    let body: ArrayBuffer | undefined;
    if (hasBody) {
      const chunks: Buffer[] = [];
      for await (const chunk of req) {
        chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
      }
      body = Buffer.concat(chunks).buffer.slice(0) as ArrayBuffer;
    }

    const webRequest = new Request(url, { method, headers, body });
    const response: Response = await handler.fetch(webRequest, process.env, {});

    res.statusCode = response.status;
    response.headers.forEach((value, key) => res.setHeader(key, value));

    if (response.body) {
      const reader = response.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(Buffer.from(value));
      }
    }
    res.end();
  } catch (err) {
    console.error("[vercelHandler] error:", err);
    res.statusCode = 500;
    res.setHeader("content-type", "text/plain");
    res.end("Internal Server Error");
  }
}
