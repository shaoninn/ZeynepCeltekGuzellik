import "dotenv/config";
import { defineConfig } from "prisma/config";
import { resolveMysqlDatabaseUrl } from "./src/lib/db-url";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: resolveMysqlDatabaseUrl(),
  },
});
