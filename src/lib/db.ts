import { PrismaClient } from "@/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { mysqlConnectionSummary, resolveMysqlPoolConfig } from "@/lib/db-url";

/** Bump when Prisma schema / pool config changes so HMR doesn’t keep a stale client. */
const PRISMA_CLIENT_VERSION = 10;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  prismaClientVersion: number | undefined;
  prismaQueue: Promise<unknown> | undefined;
  prismaLogged: boolean | undefined;
  prismaSerialize: boolean | undefined;
  prismaWarmStarted: boolean | undefined;
};

function enqueueDb<T>(fn: () => Promise<T>): Promise<T> {
  const prev = globalForPrisma.prismaQueue ?? Promise.resolve();
  const next = prev.then(fn, fn);
  globalForPrisma.prismaQueue = next.then(
    () => undefined,
    () => undefined
  );
  return next;
}

function maybeEnqueue<T>(fn: () => Promise<T>): Promise<T> {
  if (globalForPrisma.prismaSerialize) return enqueueDb(fn);
  return fn();
}

function createPrismaClient(): PrismaClient {
  const config = resolveMysqlPoolConfig();
  globalForPrisma.prismaSerialize = config.serializeQueries;

  if (!globalForPrisma.prismaLogged) {
    console.info("[db]", mysqlConnectionSummary());
    globalForPrisma.prismaLogged = true;
  }

  const adapter = new PrismaMariaDb({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.database,
    connectionLimit: config.connectionLimit,
    connectTimeout: config.connectTimeout,
    acquireTimeout: config.acquireTimeout,
    idleTimeout: config.idleTimeout,
    minimumIdle: config.minimumIdle,
    allowPublicKeyRetrieval: config.allowPublicKeyRetrieval,
  });

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

function warmPool(client: PrismaClient): void {
  if (globalForPrisma.prismaWarmStarted) return;
  globalForPrisma.prismaWarmStarted = true;
  const started = Date.now();
  void client.$queryRaw`SELECT 1`.then(
    () => console.info(`[db] pool warmed in ${Date.now() - started}ms`),
    (error) =>
      console.warn(
        "[db] pool warm failed:",
        error instanceof Error ? error.message : error
      )
  );
}

function getClient(): PrismaClient {
  if (
    !globalForPrisma.prisma ||
    globalForPrisma.prismaClientVersion !== PRISMA_CLIENT_VERSION
  ) {
    globalForPrisma.prisma = createPrismaClient();
    globalForPrisma.prismaClientVersion = PRISMA_CLIENT_VERSION;
    warmPool(globalForPrisma.prisma);
  }
  return globalForPrisma.prisma;
}

function wrapModelDelegate(delegate: object): object {
  return new Proxy(delegate, {
    get(target, prop, receiver) {
      const value = Reflect.get(target, prop, receiver);
      if (typeof value !== "function") return value;
      return (...args: unknown[]) =>
        maybeEnqueue(() =>
          (value as (...a: unknown[]) => Promise<unknown>).apply(target, args)
        );
    },
  });
}

/**
 * Process-wide Prisma client.
 * With MYSQL_POOL_SIZE>1 queries run in parallel; with pool=1 they stay serialized.
 */
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    const client = getClient();
    const value = Reflect.get(client, prop, receiver);

    if (typeof value === "function") {
      if (typeof prop === "string" && prop.startsWith("$")) {
        return (...args: unknown[]) =>
          maybeEnqueue(() =>
            (value as (...a: unknown[]) => Promise<unknown>).apply(client, args)
          );
      }
      return value.bind(client);
    }

    if (
      value &&
      typeof value === "object" &&
      typeof prop === "string" &&
      !prop.startsWith("$") &&
      !prop.startsWith("_")
    ) {
      return wrapModelDelegate(value);
    }

    return value;
  },
});

export async function pingDatabase(): Promise<{
  ok: boolean;
  ms: number;
  error?: string;
}> {
  const started = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { ok: true, ms: Date.now() - started };
  } catch (error) {
    return {
      ok: false,
      ms: Date.now() - started,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
