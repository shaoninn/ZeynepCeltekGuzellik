import { NextResponse } from "next/server";
import mariadb from "mariadb";
import type { Connection } from "mariadb";
import { mysqlConnectionSummary, resolveMysqlPoolConfig } from "@/lib/db-url";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Direct TCP probe (bypasses Prisma pool) so Hostinger hostname issues are clear.
 * Open: https://example.com/api/health
 */
export async function GET() {
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
