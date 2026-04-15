import { NextRequest, NextResponse } from "next/server";

const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 30; // per window per IP

const hits = new Map<string, { count: number; resetAt: number }>();

// Clean up expired entries periodically
function cleanup() {
  const now = Date.now();
  for (const [key, val] of hits) {
    if (now > val.resetAt) hits.delete(key);
  }
}

let lastCleanup = 0;

export function middleware(req: NextRequest) {
  // Only rate-limit API routes
  if (!req.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const now = Date.now();
  if (now - lastCleanup > WINDOW_MS) {
    cleanup();
    lastCleanup = now;
  }

  const ip = req.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ??
             req.headers.get("cf-connecting-ip") ??
             req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
             req.headers.get("x-real-ip") ??
             "unknown";

  const entry = hits.get(ip);
  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return NextResponse.next();
  }

  entry.count++;
  if (entry.count > MAX_REQUESTS) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
