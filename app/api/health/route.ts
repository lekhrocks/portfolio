import { NextResponse } from "next/server";
import { siteConfig } from "@/lib/site";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const BOOT_TIME = Date.now();

/**
 * Live health endpoint — returns service status, region, build info.
 * Useful proof-of-life for a backend engineer's portfolio.
 *
 *   curl https://lekhrajkumar.dev/api/health
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const now = Date.now();

  return NextResponse.json(
    {
      status: "ok",
      service: "portfolio-edge",
      version: process.env.NEXT_PUBLIC_BUILD_SHA ?? "dev",
      region: process.env.VERCEL_REGION ?? "local",
      runtime: "edge",
      uptime_ms: now - BOOT_TIME,
      timestamp: new Date(now).toISOString(),
      origin: url.origin,
      author: {
        name: siteConfig.name,
        github: siteConfig.social.github,
        email: siteConfig.email,
      },
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "public, max-age=0, s-maxage=10, stale-while-revalidate=30",
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
    },
  );
}

export async function HEAD() {
  return new Response(null, { status: 200 });
}
