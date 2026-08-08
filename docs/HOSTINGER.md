# Hostinger’da yayınlama (Zeynep Çeltek Güzellik)

## Build hatası: `@tailwindcss/postcss`

Hostinger production install’da `devDependencies` kurulmaz. Tailwind/PostCSS/`prisma`/`typescript` artık **`dependencies`** içinde. Bu değişiklikleri **GitHub’a push** etmeden yeniden deploy etme.

## Doğru ürün

hPanel → **Websites → Add website → Node.js Web App**

## Ayarlar

| Ayar | Değer |
|------|--------|
| Framework | Next.js |
| Branch | `main` |
| Root | `./` |
| Node | 20 veya 22 |
| Build | `npm run build` |
| Start | `npm run start` |
| Output | `.next` |

## Ortam değişkenleri (Hostinger paneli)

**Önemli:** `DATABASE_URL` satırını Hostinger’dan **sil**. Şifredeki `?` URL’yi böler ve P1000 verir.

Şunları ekle (şifreyi olduğu gibi yapıştır):

| Anahtar | Değer |
|---------|--------|
| `NODE_ENV` | **`production`** (tam küçük harf; `development` yazma) |
| `JWT_SECRET` | `K8mP2qR9vX5nL7wY3tB6cH1jF4sA0dE8gR` (≥32; istersen değiştir) |
| `NEXT_PUBLIC_SITE_URL` | `https://globalreklamtabela.com` |
| `MYSQL_USER` | `u840487910_globalreklamad` |
| `MYSQL_PASSWORD` | `SMglobal2026` |
| `MYSQL_HOST` | `srv1805.hstgr.io` (hPanel → Uzak MySQL hostname; `localhost` değil) |
| `MYSQL_PORT` | `3306` |
| `MYSQL_DATABASE` | `u840487910_globalreklam` |
| `MYSQL_POOL_SIZE` | `3` |

**Not:** Remote MySQL’de kullanıcı için `%` (Any Host) izni açık olmalı. `DATABASE_URL` satırı ekleme.

### `NODE_ENV` uyarısı

Logda *non-standard NODE_ENV* görürsen Hostinger env’de `NODE_ENV` yanlış (çoğu zaman `development`). Değeri `production` yapıp redeploy et. `npm run build` ayrıca `scripts/build.mjs` ile build sırasında `production` zorlar.

Hâlâ P1000 ise hPanel → MySQL → kullanıcı şifresini **yenile** (özel karakter az kullan, örn. `DmdReklam2026Safe`) ve `MYSQL_PASSWORD`’ü güncelle.

Build artık DB’ye bağlanmaz. İlk kurulumda bir kez şema senkronu:

```bash
RUN_DB_PUSH=1 npm run start
# veya Hostinger terminal:
npx prisma db push
```

Normal start **her boot’ta db push çalıştırmaz** (bağlantı havuzunu kilitlemesin diye).

## DB bağlantı testi

Deploy sonrası: `https://globalreklamtabela.com/api/health`

### `database: down` + timeout (şimdiki durum)

Node Web App ile MySQL **aynı localhost’ta değil**. Şunu yap:

1. hPanel → **Veritabanları** → **Remote MySQL**
2. Sayfanın **üstündeki MySQL hostname**’i kopyala (ör. `srv1234.hstgr.io` — `localhost` değil)
3. **Any Host** (`%`) ile veritabanına izin ver (veya Create)
4. Ortam değişkeni: `MYSQL_HOST` = o hostname
5. `MYSQL_PASSWORD` = MySQL kullanıcı şifresi (Hostinger hesap şifresi değil)
6. Uygulamayı **Restart**
7. `/api/health` tekrar aç → `"database":"up"` olmalı

Hostname’i phpMyAdmin giriş ekranında / MySQL Databases listesinde de görebilirsin.

### `database: up` sonrası

```bash
npx prisma db push
ALLOW_PROD_SEED=true ADMIN_PASSWORD='GucluSifre123!' npm run db:seed
```

## Performans (önemli)

Asıl darboğaz Hostinger CPU/RAM değil: **uzak MySQL ilk TCP/TLS bağlantısı** (sıkça 5–15s) + her navigasyonda `force-dynamic` SSR.

| Önlem | Ne yapar |
|-------|----------|
| `MYSQL_POOL_SIZE=3` | Layout + sayfa sorguları paralel |
| Process memory cache (60s) | Aynı worker’da layout/katalog tekrar DB’ye gitmez |
| `connectTimeout` ~20s | 3s timeout ilk handshake’i kesip retry fırtınası yapmasın |
| Boot warm (`instrumentation` + `/api/health`) | Deploy sonrası ilk ziyaretçi soğuk bağlantı ödemesin |
| `SiteLink` `prefetch={false}` | Hover’da onlarca `_rsc` + MySQL isteği olmasın |
| `(site)/loading.tsx` | Yavaş RSC sırasında boş ekran yerine spinner |

Hostinger’da `MYSQL_HOST=srv1805.hstgr.io` ve `MYSQL_POOL_SIZE=3` olduğundan emin ol, sonra Redeploy.

## Prefetch

Site linkleri `SiteLink` / `prefetch={false}` — Next.js’in hover’da onlarca `_rsc` isteği atması Hostinger MySQL’i kilitlemesin diye.

Tablolar boş kalırsa SSH veya Hostinger terminal:

```bash
ALLOW_PROD_SEED=true ADMIN_PASSWORD='GucluSifre123!' npm run db:seed
```

Production’da seed’i yalnızca bir kez kullan; sonra kapat.

## Kontrol listesi

1. Bu repo değişiklikleri `main`’e push edildi mi?
2. Env’ler eklendi mi?
3. Redeploy / yeniden derle
4. Site + `/admin` açılıyor mu?
