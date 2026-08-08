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

Şunları ekle (değerleri kendi Hostinger MySQL / domain bilgilerinle doldur):

| Anahtar | Değer |
|---------|--------|
| `NODE_ENV` | **`production`** (tam küçük harf; `development` yazma) |
| `JWT_SECRET` | ≥32 karakter rastgele secret |
| `NEXT_PUBLIC_SITE_URL` | `https://SENIN-DOMAININ.com` |
| `MYSQL_USER` | Hostinger MySQL kullanıcı adı |
| `MYSQL_PASSWORD` | Hostinger MySQL şifresi |
| `MYSQL_HOST` | hPanel → Uzak MySQL hostname (`srv….hstgr.io`; `localhost` değil) |
| `MYSQL_PORT` | `3306` |
| `MYSQL_DATABASE` | Hostinger veritabanı adı |
| `MYSQL_POOL_SIZE` | Normal: `3` · Limit baskısı: `1` |
| `MYSQL_SERIALIZE` | Limit baskısında: `1` (pool=1 ile birlikte) |

**Not:** Remote MySQL’de kullanıcı için `%` (Any Host) izni açık olmalı. `DATABASE_URL` satırı ekleme.

### `NODE_ENV` uyarısı

Logda *non-standard NODE_ENV* görürsen Hostinger env’de `NODE_ENV` yanlış (çoğu zaman `development`). Değeri `production` yapıp redeploy et. `npm run build` ayrıca `scripts/build.mjs` ile build sırasında `production` zorlar.

Hâlâ P1000 ise hPanel → MySQL → kullanıcı şifresini **yenile** (özel karakter az kullan) ve `MYSQL_PASSWORD`’ü güncelle.

Build artık DB’ye bağlanmaz. İlk kurulumda bir kez şema senkronu:

```bash
RUN_DB_PUSH=1 npm run start
# veya Hostinger terminal:
npx prisma db push
```

Normal start **her boot’ta db push çalıştırmaz** (bağlantı havuzunu kilitlemesin diye).

## Maksimum işlem (Entry processes) — kırmızı grafik

hPanel grafikte **Kullanım ≈ Sınır (ör. 120)** ve kırmızı zonlar = hesap limiti doluyor. Sonuç: yavaş sayfa, 508, kırık asset / “amatör” görünüm.

Bu limit **hesap genelidir** (aynı Hostinger hesabındaki tüm PHP + Node siteleri birlikte sayılır).

### Hemen yap

1. Env: `NODE_ENV=production` (kesin)
2. Env: `MYSQL_POOL_SIZE=1` ve `MYSQL_SERIALIZE=1` → Restart / Redeploy
3. Aynı hesapta kaç site var? (Global, Akademi, bu salon…) — hepsi aynı 120’ye ortak
4. Sürekli ping / cron / uptime bot varsa aralığı artır veya kapat (`/api/health` her saniye = süreç birikir)
5. Eski Node deploy’lar / çift start bırakma; tek temiz Redeploy
6. Trafik bot ise hPanel güvenlik / Cloudflare bot koruması

### Neden şişer?

Yavaş uzak MySQL (ilk TLS 5–15s) sırasında her bekleyen istek bir **entry process** tutar. Limit dolunca yeni istekler kuyrukta / 508 olur → daha fazla retry → kısır döngü.

| Önlem | Ne yapar |
|-------|----------|
| `MYSQL_POOL_SIZE=1` + `MYSQL_SERIALIZE=1` | Bağlantı / paralel sorgu baskısını keser |
| `MYSQL_POOL_SIZE=3` | Limit rahatladıktan sonra tekrar dene (layout+sayfa paralel) |
| ISR `revalidate=60` + process cache | Her hit’te SSR+MySQL olmasın |
| `SiteLink` `prefetch={false}` | Hover’da `_rsc` fırtınası olmasın |
| `images.unoptimized` + önceden WebP | `/_next/image` CPU spike’ı olmasın |
| Boot warm (`instrumentation`) | İlk ziyaretçi soğuk TLS ödemesin |

Grafik düştükten sonra pool’u `3`’e çıkarabilirsin; limit yine kırmızıysa pool `1`’de kal.

## DB bağlantı testi

Deploy sonrası: `https://SENIN-DOMAININ.com/api/health`

### `database: down` + timeout

Node Web App ile MySQL **aynı localhost’ta değil**. Şunu yap:

1. hPanel → **Veritabanları** → **Remote MySQL**
2. Sayfanın **üstündeki MySQL hostname**’i kopyala (ör. `srv1234.hstgr.io` — `localhost` değil)
3. **Any Host** (`%`) ile veritabanına izin ver
4. Ortam değişkeni: `MYSQL_HOST` = o hostname
5. `MYSQL_PASSWORD` = MySQL kullanıcı şifresi (Hostinger hesap şifresi değil)
6. Uygulamayı **Restart**
7. `/api/health` → `"database":"up"` olmalı

### `database: up` sonrası

```bash
npx prisma db push
ALLOW_PROD_SEED=true ADMIN_PASSWORD='GucluSifre123!' npm run db:seed
```

## Prefetch

Site linkleri `SiteLink` / `prefetch={false}` — hover’da onlarca `_rsc` + MySQL kilidi olmasın diye.

Production’da seed’i yalnızca bir kez kullan; sonra kapat.

## Kontrol listesi

1. Bu repo değişiklikleri `main`’e push edildi mi?
2. Env’ler eklendi mi? (`NODE_ENV=production`, MySQL, gerekirse pool=1)
3. Redeploy / yeniden derle
4. Site + `/admin` açılıyor mu?
5. Maksimum işlem grafiği sınırın altında mı?
