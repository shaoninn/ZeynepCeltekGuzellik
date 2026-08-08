# PostgreSQL geçişi

Yerel geliştirme varsayılanı SQLite’tır. Canlı / serverless için Postgres önerilir.

## 1. Veritabanı

```bash
docker compose up -d
```

veya yönetilen Postgres (Neon, Prisma Postgres, RDS…) bağlantı dizesi alın.

`.env`:

```env
DATABASE_URL="postgresql://dmd:dmd@localhost:5432/dmdreklam?schema=public"
```

## 2. Şema

`prisma/schema.prisma` içinde:

```prisma
datasource db {
  provider = "postgresql"
}
```

## 3. Client

`src/lib/db.ts` içinde SQLite adapter yerine:

```ts
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
return new PrismaClient({ adapter });
```

## 4. Migration

```bash
npx prisma migrate dev --name init_postgres
# veya mevcut migration’ları deploy:
npx prisma migrate deploy
npx prisma generate
```

**Production’da seed çalıştırmayın** (`db:seed` tüm tabloları siler).

## 5. Object storage

Upload’lar için `.env`:

```env
S3_BUCKET="dmd-uploads"
S3_ACCESS_KEY_ID="..."
S3_SECRET_ACCESS_KEY="..."
S3_ENDPOINT="https://xxxx.r2.cloudflarestorage.com"
S3_REGION="auto"
S3_PUBLIC_URL="https://cdn.example.com"
S3_FORCE_PATH_STYLE="true"
```

Bunlar yoksa dosyalar `public/uploads` altına yazılır (tek makine).
