import { NextRequest, NextResponse } from "next/server";
import { mysqlConnectionSummary } from "@/lib/db-url";
import { pingDatabase } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const WINDOW_MS = 60_000;
const MAX_HITS = 6;
const hitsByIp = new Map<string, number[]>();
let lastPrune = 0;

function clientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

function pruneHits(now: number) {
  if (now - lastPrune < 60_000) return;
  lastPrune = now;
  for (const [ip, times] of hitsByIp) {
    const recent = times.filter((t) => now - t < WINDOW_MS);
    if (recent.length === 0) hitsByIp.delete(ip);
    else hitsByIp.set(ip, recent);
  }
}

function rateLimited(ip: string): boolean {
  const now = Date.now();
  pruneHits(now);
  const prev = hitsByIp.get(ip) ?? [];
  const recent = prev.filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_HITS) {
    hitsByIp.set(ip, recent);
    return true;
  }
  recent.push(now);
  hitsByIp.set(ip, recent);
  return false;
}

/**
 * Cheap DB probe via shared Prisma pool (no extra TCP connection per hit).
 * Optional: ?token=HEALTH_TOKEN or Authorization: Bearer … when HEALTH_TOKEN is set.
 */
export async function GET(req: NextRequest) {
  const secret = process.env.HEALTH_TOKEN?.trim();
  const requireToken =
    Boolean(secret) || process.env.HEALTH_REQUIRE_TOKEN === "1";

  if (requireToken) {
    if (!secret) {
      return NextResponse.json(
        {
          error: "misconfigured",
          hint: "HEALTH_REQUIRE_TOKEN=1 için HEALTH_TOKEN tanımlayın.",
        },
        { status: 503 }
      );
    }
    const q = req.nextUrl.searchParams.get("token");
    const auth = req.headers.get("authorization");
    const bearer = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
    if (q !== secret && bearer !== secret) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  } else if (rateLimited(clientIp(req))) {
    return NextResponse.json(
      {
        error: "rate_limited",
        hint: "En fazla 6 istek / dakika. HEALTH_TOKEN + HEALTH_REQUIRE_TOKEN=1 önerilir.",
      },
      { status: 429 }
    );
  }

  let target = "unresolved";
  try {
    target = mysqlConnectionSummary();
  } catch (error) {
    return NextResponse.json(
      {
        database: "down",
        error: error instanceof Error ? error.message : String(error),
        hint: "MYSQL_USER / MYSQL_PASSWORD / MYSQL_DATABASE eksik olabilir.",
      },
      { status: 503 }
    );
  }

  const result = await pingDatabase();
  if (result.ok) {
    return NextResponse.json({
      database: "up",
      latencyMs: result.ms,
      target,
    });
  }

  const message = result.error || "unknown";
  let hint =
    "hPanel → Veritabanları → Remote MySQL hostname (srv….hstgr.io) + Any Host (%). Redeploy.";

  if (message.includes("Access denied")) {
    hint =
      "MySQL kullanıcı/şifre yanlış. MYSQL_PASSWORD’ü yenileyin (Hostinger hesap şifresi değil).";
  } else if (
    message.includes("timeout") ||
    message.includes("ECONNREFUSED") ||
    message.includes("ENOTFOUND") ||
    message.includes("retrieve a connection")
  ) {
    hint =
      "TCP MySQL’e ulaşamıyor. MYSQL_HOST=srv….hstgr.io kullanın; localhost Node Web App’te çalışmaz.";
  }

  return NextResponse.json(
    {
      database: "down",
      latencyMs: result.ms,
      target,
      error: message.slice(0, 300),
      hint,
    },
    { status: 503 }
  );
}
