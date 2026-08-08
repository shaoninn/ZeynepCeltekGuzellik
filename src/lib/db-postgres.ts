/**
 * Postgres adapter bootstrap — use after switching schema provider to postgresql.
 * See docs/POSTGRES.md
 *
 * Example wiring in db.ts when DATABASE_URL is postgres:
 *   import { PrismaPg } from "@prisma/adapter-pg";
 *   import { Pool } from "pg";
 *   const pool = new Pool({ connectionString: process.env.DATABASE_URL });
 *   const adapter = new PrismaPg(pool);
 *   return new PrismaClient({ adapter });
 */
export {};
