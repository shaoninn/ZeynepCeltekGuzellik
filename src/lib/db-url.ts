/**
 * MySQL connection helpers for Prisma MariaDB adapter + Hostinger.
 */

export type MysqlPoolConfig = {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  connectionLimit: number;
  connectTimeout: number;
  acquireTimeout: number;
  idleTimeout: number;
  minimumIdle: number;
  allowPublicKeyRetrieval: boolean;
  /** When true, prisma proxy serializes queries (only for pool=1). */
  serializeQueries: boolean;
};

export function resolveMysqlPoolConfig(): MysqlPoolConfig {
  const user = process.env.MYSQL_USER?.trim();
  const database = process.env.MYSQL_DATABASE?.trim();
  const password = process.env.MYSQL_PASSWORD;
  const hasMysqlParts = Boolean(user && database && password !== undefined);

  // Remote Hostinger MySQL: 3–5 connections allow parallel layout+page queries.
  const poolSize = Math.max(1, Number(process.env.MYSQL_POOL_SIZE || 3) || 3);
  const serializeQueries =
    process.env.MYSQL_SERIALIZE === "1" || poolSize <= 1;

  // Fail-faster under Hostinger entry-process pressure; cold TLS still needs >3s.
  const base = {
    connectionLimit: poolSize,
    connectTimeout: Number(process.env.MYSQL_CONNECT_TIMEOUT_MS || 12_000) || 12_000,
    acquireTimeout: Number(process.env.MYSQL_ACQUIRE_TIMEOUT_MS || 15_000) || 15_000,
    idleTimeout: Number(process.env.MYSQL_IDLE_TIMEOUT_MS || 120_000) || 120_000,
    minimumIdle: Math.min(1, poolSize),
    allowPublicKeyRetrieval: true,
    serializeQueries,
  };

  if (hasMysqlParts) {
    return {
      host: process.env.MYSQL_HOST?.trim() || "127.0.0.1",
      port: Number(process.env.MYSQL_PORT || 3306) || 3306,
      user: user!,
      password: password!,
      database: database!,
      ...base,
    };
  }

  const direct = process.env.DATABASE_URL?.trim();
  if (direct?.startsWith("file:")) {
    throw new Error(
      "SQLite kaldırıldı. MYSQL_USER + MYSQL_PASSWORD + MYSQL_DATABASE kullanın."
    );
  }
  if (direct) {
    if (/mysql:\/\/[^:]+:[^@]*\?[^@]*@/i.test(direct)) {
      throw new Error(
        "DATABASE_URL şifresindeki ? URL'yi bozuyor. DATABASE_URL'i silip MYSQL_PASSWORD kullanın."
      );
    }
    const normalized = direct.replace(/^mysql:\/\//, "http://");
    const u = new URL(normalized);
    return {
      host: u.hostname || "127.0.0.1",
      port: Number(u.port || 3306) || 3306,
      user: decodeURIComponent(u.username),
      password: decodeURIComponent(u.password),
      database: u.pathname.replace(/^\//, "").split("?")[0],
      ...base,
    };
  }

  // Domain / MySQL sonradan eklenecek: prisma generate ve yerel tooling için placeholder.
  // Gerçek sorgu için MYSQL_* doldurulmalı.
  if (process.env.NODE_ENV !== "production") {
    console.warn(
      "[db-url] MYSQL_* eksik — geçici placeholder kullanılıyor (sonradan Hostinger MySQL ekleyin)."
    );
    return {
      host: "127.0.0.1",
      port: 3306,
      user: "zc_pending",
      password: "pending",
      database: "zc_pending",
      ...base,
    };
  }

  throw new Error(
    "MySQL ayarı yok. Hostinger env: MYSQL_USER, MYSQL_PASSWORD, MYSQL_HOST, MYSQL_PORT, MYSQL_DATABASE"
  );
}

/** @deprecated Prefer resolveMysqlPoolConfig for Hostinger. */
export function resolveMysqlDatabaseUrl(): string {
  const c = resolveMysqlPoolConfig();
  return `mysql://${encodeURIComponent(c.user)}:${encodeURIComponent(c.password)}@${c.host}:${c.port}/${c.database}`;
}

export function mysqlConnectionSummary(): string {
  try {
    const c = resolveMysqlPoolConfig();
    return `mysql://${c.user}@${c.host}:${c.port}/${c.database} (pool=${c.connectionLimit}, serialize=${c.serializeQueries})`;
  } catch {
    return "no mysql config";
  }
}
