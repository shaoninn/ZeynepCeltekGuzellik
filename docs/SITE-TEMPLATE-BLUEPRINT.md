# Site Template Blueprint — Altyapı Şablonu

> **Amaç:** Yeni B2B kurumsal site kurarken sıfırdan mimari düşünmemek.  
> **Kaynak birleşimi:** `GlobalReklam` (daha olgun altyapı) + `DMDReklam` (SEO/Ads/UX dersleri).  
> **Kapsam:** Altyapı, veri, admin, editör, performans, SEO, Hostinger.  
> **Kapsam dışı:** Markaya özel frontend görünüm (renk, font, hero kompozisyonu her sitede değişir).

**Nasıl kullan:** Yeni Cursor sohbetinde `@docs/SITE-TEMPLATE-BLUEPRINT.md` ver.  
Marka farklarını yaz; bu belgedeki kuralları bozma.

```text
@docs/SITE-TEMPLATE-BLUEPRINT.md ile [YENİ MARKA] kur.
Farklılar: [sektör], [görsel dil], [domain], [MySQL env].
Altyapıyı şablondan kopyala; UI’ı markaya göre tasarla.
```

---

## 0) İki kardeşten ne alındı?

| Kaynak | Alınan (şablona giren) |
|--------|-------------------------|
| **Global (çekirdek)** | Draft editör (Kaydet/Geri al), Neon + sektör + ödeme/teklif yazdır, Sipariş Panosu/CRM, LCP/WebP/`HeroMedia`, layout drag, ISR+revalidatePath, IG bütçesi, lean middleware |
| **DMD (dersler)** | **Sayfa başına canonical** (root’ta `/` YASAK), Google Ads/AAAA DNS checklist, Search Console playbook, promo kod kalıbı, hero video/slider notları, Excel bulk netliği, rate-limit vurgusu, `CatalogAdminHint`, home section order fikri |

**Frontend:** Her site farklı tasarım. Şablon “iskelet + kurallar”; Hero/renk/font markaya özel.

---

## 1) Ürün iskeleti (her sitede)

| Katman | Zorunlu |
|--------|---------|
| Public `(site)` | Kurumsal + katalog + iletişim + yasal + sepet |
| Teklif sepeti | Redux + localStorage; **online ödeme yok**; sunucu fiyatı |
| `/admin` | Katalog, sipariş, müşteri, mesaj, medya, menü, içerik, kullanıcı, ayar, audit, 2FA |
| `/duzenle` | Canlı editör; **ürün CRUD yok** |

**Opsiyonel modüller (Global’den):** Neon tasarla, sektör sayfaları, banka/ödeme bilgisi, teklif PDF/yazdır, kanban workflow, CRM hatırlatma.

**Cookie/cart prefix:** Markaya özel tut (`gr_*`, `dmd_*`, `yeni_*`) — aynı tarayıcıda karışmasın.

---

## 2) Stack (pin)

```
Next.js 16 App Router + React 19 + TypeScript strict
Tailwind 4 (dependencies’te — Hostinger omit=dev)
Prisma 7 + @prisma/adapter-mariadb + mariadb
jose + bcryptjs + otplib/qrcode
Redux Toolkit (yalnızca sepet)
zod 4 · xlsx · Resend/SMTP opsiyonel · S3 opsiyonel
sharp → sadece build-time WebP (runtime optimizer KAPALI)
Node 20–22
```

---

## 3) Dizin iskeleti

```
src/app/
  layout.tsx          # metadataBase, fontlar — canonical YOK
  (site)/             # ISR revalidate=60; Header/Footer/FAB/StoreProvider
  duzenle/            # force-dynamic + noindex + EditorProvider
  admin/login + (panel)/
  api/
src/components/{home,shop,editor,admin,layout,ui,brand}/
src/lib/{auth,db,db-url,memory-cache,revalidate,site,catalog,orders,seo,mail,editor-href,image-optimize}/
src/store/cartSlice.ts
src/middleware.ts     # SADECE /admin + /duzenle
prisma/schema.prisma  # @db.Text uzun alanlar
scripts/{build.mjs,start.mjs,optimize-images.mjs}
docs/{HOSTINGER.md,SITE-TEMPLATE-BLUEPRINT.md}
```

**Kural:** Public tree `Editable*` kullanır; `enabled=false` iken düz render. `/duzenle` aynı tree + `enabled`.

---

## 4) Veri modeli

Uzun metin → **`@db.Text`** (yoksa VARCHAR(191) keser).

| Model | Rol |
|-------|-----|
| AdminUser | email, hash, role, TOTP |
| Category / Product | katalog; fiyat admin’de |
| Project / BlogPost | portföy / blog |
| SiteContent | key → pazarlama metni / medya URL |
| SiteSetting | phone, WA, fiyat formülü, banka, layout JSON… |
| NavItem | menü |
| ContactMessage | form |
| Customer | CRM phone unique |
| Order + OrderItem | teklif pipeline |
| MediaAsset / AuditLog | medya / audit |

**Seed:** Prod’da `ALLOW_PROD_SEED` kapısı. Editör key’leri: `db:seed:editor` (upsert).

---

## 5) Auth & güvenlik

- JWT httpOnly cookie, ≥32 `JWT_SECRET`
- Middleware: admin (login hariç) + duzenle
- Login rate-limit + opsiyonel TOTP
- API: `getSession` / `requireAdmin`
- Upload: magic-byte; fiyat client’tan **asla** gelmez (`POST /api/orders` → `Product.price`)
- CSP: gtag/GA/Ads domain’leri izinli

---

## 6) Canlı editör (Global standardı)

### Draft modeli (zorunlu)
1. Editable → bellek taslağı  
2. **Kaydet** → API commit + `revalidatePath`  
3. **Geri al** / sayfa çıkış uyarısı  

Otomatik her-tık publish **yapma**.

### Bileşen seti
`EditableText` (+ `linkHref`), `EditableImage`, `EditableSetting`, `EditableLayoutBox`, `EditableSectionShift`, `EditableIconBox`, `EditableCategoryField`, `CatalogAdminHint`, paneller lazy.

### Editörde EVET / HAYIR
- EVET: metin, görsel, menü, telefon/adres, kategori adı-açıklama, layout  
- HAYIR: ürün fiyat/CRUD, blog/proje gövde CRUD, sipariş

---

## 7) Performans (Global + Hostinger)

| Kural | Detay |
|-------|--------|
| ISR 60 | Public; admin/editör dynamic |
| Mutate bust | memory + `revalidatePath` / tag |
| Memory cache | settings/nav/catalog 60–120s |
| SiteLink | `prefetch={false}` |
| images | `unoptimized: true` |
| WebP | `optimize-images.mjs` prebuild |
| LCP | Opacity animasyonu mediada yasak; srcSet tek indirme; doğru preload |
| Font | Body preload; display `preload: false` |
| 3. parti | IG vb. HTML’i bloke etme (timeout bütçesi) |
| Below-fold | `dynamic()` |
| Editor chrome | Public bundle’dan ayır |
| browserslist | Modern |
| Middleware | Public HTML’de çalıştırma |
| Pool | `MYSQL_POOL_SIZE=3` |
| Start | `0.0.0.0` + `/api/health` warm |
| Build | `build.mjs` → `NODE_ENV=production` zorla |

**Hero notu (DMD):** Video kullanırsan poster WebP = LCP; mobilde video defer, masaüstünde autoplay. Mobil layout PC’ye sızmasın (`matchMedia`).

---

## 8) SEO (DMD kritik dersleri)

### Canonical — #1 tuzak
```ts
// root layout.tsx — YASAK
alternates: { canonical: "/" }

// DOĞRU: her page.tsx / generateMetadata kendi path'ini yazar
alternates: { canonical: "/hizmetler" }
alternates: { canonical: `/urun/${slug}` }
```
Root’ta `/` → Google tüm sayfaları anasayfa sanır; indeks çöker.

### Checklist
- [ ] `sitemap.ts` + `robots.ts` (disallow `/admin`, `/api/`, `/sepet`)  
- [ ] Sayfa başına canonical  
- [ ] JSON-LD: LocalBusiness, WebSite, SiteNavigation, Product  
- [ ] `/duzenle` + `/sepet` + `/odeme` → noindex  
- [ ] Liste `?sort=` varsa canonical temiz URL  
- [ ] `NEXT_PUBLIC_SITE_URL` = apex HTTPS  

### Search Console (beklenen)
| Durum | Aksiyon |
|-------|---------|
| Az indeks (yeni) | Bekle + ana URL’lere “dizine ekle” |
| Keşfedildi, taranmadı | Sitemap + zaman |
| Tarandı, eklenmedi | Canonical temiz; panik yok |
| Alternatif www | Apex doğruysa OK |

---

## 9) Analytics & Google Ads (DMD)

- `Analytics.tsx`: GA4 (`NEXT_PUBLIC_GA_ID`) + Ads (`NEXT_PUBLIC_AW_ID`), tek gtag, **lazyOnload** (LCP)  
- Tag, “çalışmayan hedef / DNS” hatasını **çözmez**

### DNS / Ads checklist (her yeni domain)
1. **Bozuk AAAA:** AAAA var ama IPv6 timeout → Ads “DNS hatası”. IPv4 site açılır; bot IPv6 dener.  
   → AAAA’yı düzelt veya kaldır.  
2. Trafik engeli “ülke listesi boş” → botları keser.  
3. www↔apex tek hop (CDN).  
4. Registrar ≠ hosting (Natro DNS + Hostinger) normal.

```powershell
nslookup -type=AAAA domain.com 8.8.8.8
curl -4 -I https://domain.com/
curl -6 -I --max-time 10 https://domain.com/
```

---

## 10) Sepet / sipariş

```
AddToCart → Redux ({marka}-cart) → /sepet (ölçü/renk/KVKK)
  → POST /api/orders (rate-limit, sunucu fiyat)
  → WhatsApp + opsiyonel mail
  → opsiyonel /odeme, /teklif/.../yazdır
```

**Opsiyonel promo (DMD):** UI indirimi + sipariş notu; sunucu yine `Product.price`.  
**Workflow (Global):** INTAKE → MEASURE → PRODUCTION → SHIP → DONE + kanban.

---

## 11) Admin checklist

Dashboard · Ürünler (bulk + Excel) · Kategoriler · Projeler · Blog · Siparişler (+ kanban) · CRM · Müşteriler · Mesajlar · İçerikler · Menüler · Medya · Kullanıcılar · Audit · Ayarlar · **Siteyi Düzenle → /duzenle**

Excel sütunları: `id,name,slug,categorySlug,price,shortDesc,description,image,sortOrder,isActive,inStock`.

---

## 12) Env (prod)

```
JWT_SECRET (≥32)
NEXT_PUBLIC_SITE_URL=https://apex.com
MYSQL_HOST / PORT / USER / PASSWORD / DATABASE
MYSQL_POOL_SIZE=3
# opsiyonel:
NEXT_PUBLIC_GA_ID · NEXT_PUBLIC_AW_ID
ADMIN_* · BOOTSTRAP_SECRET · ALLOW_PROD_SEED
RESEND_API_KEY | SMTP_URL · MAIL_*
S3_* · INSTAGRAM_* · RUN_DB_PUSH
```

Şifrede `?` → `DATABASE_URL` kullanma; `MYSQL_*` split.

---

## 13) Kurulum sırası (Cursor’a ver)

```text
1. Next 16 + Tailwind 4 + Prisma 7 MySQL iskeleti
2. Schema @db.Text + seed kilidi + auth + middleware (sadece admin/duzenle)
3. Layout + memory-cache + SiteLink prefetch=false
4. Katalog + ürün detay + quote cart + /api/orders (sunucu fiyat, rate-limit)
5. Admin CRUD + Excel bulk + sipariş filtre/sil
6. SiteContent + /duzenle draft EditorProvider + CatalogAdminHint
7. ISR 60 + revalidatePath; WebP optimize-images; Hero LCP kuralları
8. SEO: sayfa başına canonical + sitemap/robots/JSON-LD (root canonical YASAK)
9. Analytics GA/AW lazyOnload + Hostinger build/start + health warm
10. DNS A/AAAA doğrula (Ads öncesi)
11. Marka UI: font, renk, hero — mimariyi bozma
12. Opsiyonel: neon, sektör, kanban, promo, hero video slider
```

---

## 14) “Var mı?” checklist

**Çekirdek**
- [ ] middleware admin+editor only  
- [ ] memory-cache + revalidate helpers  
- [ ] SiteLink prefetch off + editor href map  
- [ ] Draft Kaydet/Geri al editör  
- [ ] EditableText/Image/Setting + CatalogAdminHint  
- [ ] Cart + sunucu fiyatlı orders + rate-limit  
- [ ] Products bulk + Excel  
- [ ] `@db.Text`  
- [ ] Public `revalidate=60`  
- [ ] images.unoptimized + optimize-images.mjs  
- [ ] scripts/build.mjs + start.mjs 0.0.0.0  

**SEO / Ads (DMD)**
- [ ] Root layout’ta global canonical YOK  
- [ ] Her public sayfada kendi canonical  
- [ ] sepet/odeme/duzenle noindex  
- [ ] sitemap + robots + JSON-LD  
- [ ] Domain AAAA / Ads checklist  

**Performans (Global)**
- [ ] LCP mediada opacity animasyonu yok  
- [ ] Hero WebP srcSet + doğru preload  
- [ ] Below-fold dynamic()  
- [ ] 3. parti non-blocking  

---

## 15) Bilinçli kararlar

| Karar | Neden |
|-------|--------|
| Teklif, online ödeme değil | B2B keşif |
| Editör ≠ ürün CRUD | Güvenlik / net rol |
| Runtime image optimize kapalı | Hostinger sharp |
| Prefetch kapalı | MySQL RTT |
| Draft publish | Yanlış kayıt önleme |
| Canonical sayfa sayfa | İndeks sağlığı |
| Ads ≠ kod | Çoğu Ads hatası DNS/AAAA |

---

## 16) Agent çekirdek dosya listesi

```
package.json, next.config.mjs, prisma/schema.prisma, prisma.config.ts
prisma/seed.ts, upsert-editor-content.ts
scripts/{build,start,optimize-images}.mjs
src/middleware.ts
src/lib/{auth,db,db-url,memory-cache,revalidate,site,catalog,seo,orders,editor-href,image-optimize}.ts
src/components/editor/*, ui/SiteLink.tsx, Analytics.tsx, home/HeroMedia.tsx
src/store/cartSlice.ts
src/app/(site)/layout.tsx  (+ her page canonical)
src/app/duzenle/layout.tsx
src/app/sitemap.ts, robots.ts
docs/HOSTINGER.md
docs/SITE-TEMPLATE-BLUEPRINT.md
```

---

## 17) Referans repolar

| Repo | Rol |
|------|-----|
| `C:\GitHub\GlobalReklam` | En güncel performans + editör + sipariş workflow |
| `C:\GitHub\DMDReklam` | Canonical/Ads/DNS dersleri + hero slider/promo örnekleri |

Yeni site: şablonu buradan kur; görsel tasarımı sıfırdan markaya göre yap.

---

*Birleşik şablon · 2026-08-08 · Global + DMD*
