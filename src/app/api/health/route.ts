import { NextRequest, NextResponse } from "next/server";
import mariadb from "mariadb";
import type { Connection } from "mariadb";
import { mysqlConnectionSummary, resolveMysqlPoolConfig } from "@/lib/db-url";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const WINDOW_MS = 60_000;
const MAX_HITS = 12;
const hitsByIp = new Map<string, number[]>();

function clientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

function rateLimited(ip: string): boolean {
  const now = Date.now();
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
 * Direct TCP probe (bypasses Prisma pool) so Hostinger hostname issues are clear.
 * Optional: ?token=HEALTH_TOKEN or Authorization: Bearer … when HEALTH_TOKEN is set.
 */
export async function GET(req: NextRequest) {
  const secret = process.env.HEALTH_TOKEN?.trim();
  if (secret) {
    const q = req.nextUrl.searchParams.get("token");
    const auth = req.headers.get("authorization");
    const bearer = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
    if (q !== secret && bearer !== secret) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  } else if (rateLimited(clientIp(req))) {
    return NextResponse.json(
      { error: "rate_limited", hint: "En fazla 12 istek / dakika. HEALTH_TOKEN ile kilitleyin." },
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

  const config = resolveMysqlPoolConfig();
  const started = Date.now();

  let conn: Connection | undefined;
  try {
    conn = await mariadb.createConnection({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.database,
      connectTimeout: 4_000,
      allowPublicKeyRetrieval: true,
    });
    await conn.query("SELECT 1 AS ok");
    return NextResponse.json({
      database: "up",
      latencyMs: Date.now() - started,
      target,
    });
  } catch (error) {
    const err = error as {
      code?: string;
      errno?: number;
      sqlState?: string;
      message?: string;
    };
    const code = err.code || "";
    const message = err.message || String(error);

    let hint =
      "hPanel → Veritabanları → Remote MySQL sayfasının üstündeki hostname’i (örn. srvXXXX.hstgr.io) MYSQL_HOST yapın. Any Host (%) izin verin. Sonra uygulamayı Restart edin.";

    if (code === "ER_ACCESS_DENIED_ERROR" || message.includes("Access denied")) {
      hint =
        "MySQL kullanıcı/şifre yanlış. hPanel → MySQL Databases → kullanıcı şifresini yenileyip MYSQL_PASSWORD’ü güncelleyin (Hostinger hesap şifresi değil).";
    } else if (code === "ER_BAD_DB_ERROR") {
      hint =
        "Veritabanı adı yanlış. MYSQL_DATABASE değerini hPanel’deki adla birebir yazın.";
    } else if (
      code === "ECONNREFUSED" ||
      code === "ENOTFOUND" ||
      code === "ETIMEDOUT" ||
      message.includes("timeout") ||
      message.includes("retrieve a connection")
    ) {
      hint =
        "TCP MySQL’e ulaşamıyor. localhost/127.0.0.1 Node Web App’te çoğu zaman çalışmaz. Remote MySQL hostname (srv….hstgr.io) kullanın + Any Host.";
    }

    return NextResponse.json(
      {
        database: "down",
        latencyMs: Date.now() - started,
        target,
        code: code || undefined,
        errno: err.errno,
        error: message.slice(0, 300),
        hint,
      },
      { status: 503 }
    );
  } finally {
    if (conn) {
      try {
        await conn.end();
      } catch {
        /* ignore */
      }
    }
  }
}
