/**
 * Non-destructive insert of missing visual-editor SiteContent keys.
 * Run: npx tsx prisma/upsert-editor-content.ts
 */
import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { resolveMysqlDatabaseUrl } from "../src/lib/db-url";

const keys: { key: string; title: string; content: string }[] = [
  {
    key: "hero_image",
    title: "Hero Görsel",
    content: "/images/hero/hero-1.webp",
  },
  {
    key: "services_section_title",
    title: "Hizmetler Bölüm Başlığı",
    content: "Kariyerinizi güzelleştiren hizmetler",
  },
  {
    key: "featured_products_title",
    title: "Öne Çıkan Hizmetler",
    content: "Öne çıkan hizmet programları",
  },
  {
    key: "shipping_banner_title",
    title: "Bilgi Bandı",
    content: "Canlı manken üzerinde birebir uygulamalı hizmet",
  },
  {
    key: "why_us_title",
    title: "Neden Biz Başlık",
    content: "Neden Zeynep Çeltek Salon?",
  },
  { key: "why_us_1", title: "Neden Biz 1", content: "Uzman Kadro" },
  { key: "why_us_2", title: "Neden Biz 2", content: "Hijyen Garantisi" },
  { key: "why_us_3", title: "Neden Biz 3", content: "Şeffaf Fiyat" },
  { key: "why_us_4", title: "Neden Biz 4", content: "Kişiye Özel Bakım" },
  { key: "why_us_5", title: "Neden Biz 5", content: "Modern Cihazlar" },
  { key: "why_us_6", title: "Neden Biz 6", content: "Kolay Randevu" },
  {
    key: "feature_bar_1_title",
    title: "Özellik Çubuğu 1",
    content: "Uzman Kadro",
  },
  {
    key: "feature_bar_1_desc",
    title: "Özellik Çubuğu 1 Açıklama",
    content: "Deneyimli güzellik uzmanlarıyla kişiye özel rehberlik.",
  },
  {
    key: "feature_bar_2_title",
    title: "Özellik Çubuğu 2",
    content: "Güvenli & Hijyenik",
  },
  {
    key: "feature_bar_2_desc",
    title: "Özellik Çubuğu 2 Açıklama",
    content: "Klinik standartlarda steril uygulama ortamı.",
  },
  {
    key: "feature_bar_3_title",
    title: "Özellik Çubuğu 3",
    content: "Kişiye Özel Çözümler",
  },
  {
    key: "feature_bar_3_desc",
    title: "Özellik Çubuğu 3 Açıklama",
    content: "İhtiyaca göre planlanan bakım protokolleri.",
  },
  {
    key: "feature_bar_4_title",
    title: "Özellik Çubuğu 4",
    content: "Seans Sonrası Takip",
  },
  {
    key: "feature_bar_4_desc",
    title: "Özellik Çubuğu 4 Açıklama",
    content: "Her seans sonrası takip ve destek.",
  },
  {
    key: "feature_bar_5_title",
    title: "Özellik Çubuğu 5",
    content: "Şeffaf Fiyat",
  },
  {
    key: "feature_bar_5_desc",
    title: "Özellik Çubuğu 5 Açıklama",
    content: "Güncel fiyat listesiyle net bilgilendirme.",
  },
  {
    key: "footer_blurb",
    title: "Footer Tanıtım",
    content:
      "Güzelliği bilimle, sanata dönüştürüyoruz. Adana'da uygulamalı güzellik hizmetleri. Instagram: @zeynepceltekguzellik",
  },
  {
    key: "about_headline",
    title: "Hakkımızda Başlık",
    content: "GÜZELLİĞİ BİLİMLE,\nSANATA DÖNÜŞTÜRÜYORUZ",
  },
  {
    key: "about_intro",
    title: "Hakkımızda Giriş",
    content:
      "Zeynep Çeltek Güzellik, Adana’da Gazi Paşa (Seyhan) ve Turgut Özal (Çukurova) şubelerinde cilt bakımı, lazer epilasyon, bölgesel incelme, kirpik-kaş ve Alex lazer hizmetleri sunar.\n\nAmacımız herkese aynı uygulamayı yapmak değil; cilt tipinize, yaşam tarzınıza ve hedeflerinize uygun protokolü birlikte seçmek. Şeffaf fiyat listesi, hijyenik ortam ve deneyimli kadro ile yanınızdayız.\n\nRandevu için WhatsApp veya telefonla ulaşabilir; hizmet ve paket seçimlerinizi sitemizdeki randevu sepetinden de iletebilirsiniz.",
  },
  {
    key: "about_philosophy",
    title: "Çalışma İlkelerimiz",
    content:
      "Her seansı standart bir işlem değil, planlı bir bakım adımı olarak görürüz. Hijyen, bilgilendirme ve kişiye özel yaklaşım; randevudan önce, uygulama sırasında ve sonrasında tuttuğumuz somut kurallardır.\n\nMisafirlerimize ne yapılacağını ve neden tercih edildiğini net anlatırız.",
  },
  {
    key: "mission",
    title: "Misyon",
    content:
      "Misafirlerimizin kendilerini güvende ve özel hissettiği, hijyenik ve profesyonel bir güzellik deneyimi sunmak.\n\nAdana’daki her iki şubemizde de aynı standartlarla karşılamak; doğru analizi, doğru uygulamayı ve takip edilebilir seans planını bir araya getirmek istiyoruz.",
  },
  {
    key: "vision",
    title: "Vizyon",
    content:
      "Adana’da güvenilir güzellik bakımında referans salon olmak; kişiye özel protokollerle kalıcı memnuniyet yaratmak.\n\nTeknolojiyi ve uzmanlığı birleştirerek sürdürülebilir sonuçlara odaklanan bir marka olarak büyümeyi hedefliyoruz.",
  },
  {
    key: "about_why_us",
    title: "Neden Zeynep Çeltek",
    content:
      "İki şubeli konum avantajı, güncel cihaz parkı ve şeffaf fiyatlandırma ile randevu sürecini sade tutuyoruz. Lazer epilasyondan cilt bakımına kadar aynı çatı altında planlı bakım sunarız.",
  },
  {
    key: "about_image_1",
    title: "Hakkımızda Görsel 1",
    content: "/images/about/about-1.webp",
  },
  {
    key: "about_image_2",
    title: "Hakkımızda Görsel 2",
    content: "/images/about/about-2.webp",
  },
  {
    key: "about_image_3",
    title: "Hakkımızda Görsel 3",
    content: "/images/about/about-3.webp",
  },
  {
    key: "about_image_4",
    title: "Hakkımızda Görsel 4",
    content: "/images/about/about-4.webp",
  },
  {
    key: "facility_image_1",
    title: "Ortam Görsel 1",
    content: "/images/about/about-1.webp",
  },
  {
    key: "cta_banner_1",
    title: "CTA Banner 1",
    content: "/images/gallery/gallery-1.webp",
  },
  {
    key: "cta_banner_2",
    title: "CTA Banner 2",
    content: "/images/gallery/gallery-2.webp",
  },
  {
    key: "cta_banner_3",
    title: "CTA Banner 3",
    content: "/images/gallery/gallery-3.webp",
  },
  {
    key: "cta_banner_4",
    title: "CTA Banner 4",
    content: "/images/gallery/gallery-4.webp",
  },
  {
    key: "contact_eyebrow",
    title: "İletişim Üst Etiket",
    content: "İletişim",
  },
  {
    key: "contact_title",
    title: "İletişim Başlık",
    content: "Bize Ulaşın",
  },
  {
    key: "contact_intro",
    title: "İletişim Açıklama",
    content:
      "Randevu ve hizmetler için WhatsApp’tan yazın. Gazi Paşa: 0 (541) 457 06 54 · Turgut Özal: 0 (545) 457 06 56 / 0 (322) 232 59 52.",
  },
  {
    key: "process_section_title",
    title: "Süreç Bölüm Başlığı",
    content: "Kayıttan belgelendirmeye net adımlar",
  },
  {
    key: "process_section_desc",
    title: "Süreç Bölüm Açıklama",
    content:
      "Şeffaf adımlarla ilerleyen, uygulamalı bir hizmet yolculuğu.",
  },
  { key: "process_1_title", title: "Süreç 1 Başlık", content: "Danışmanlık" },
  {
    key: "process_1_desc",
    title: "Süreç 1 Açıklama",
    content: "Size uygun programı birlikte seçeriz.",
  },
  { key: "process_2_title", title: "Süreç 2 Başlık", content: "Kayıt" },
  {
    key: "process_2_desc",
    title: "Süreç 2 Açıklama",
    content: "Kontenjan ve takvim netleşir.",
  },
  {
    key: "process_3_title",
    title: "Süreç 3 Başlık",
    content: "Uygulamalı Hizmet",
  },
  {
    key: "process_3_desc",
    title: "Süreç 3 Açıklama",
    content: "Uzman kadro ile kişiye özel uygulama.",
  },
  {
    key: "process_4_title",
    title: "Süreç 4 Başlık",
    content: "Takip",
  },
  {
    key: "process_4_desc",
    title: "Süreç 4 Açıklama",
    content: "Seans sonrası kontrol ve bakım önerileri.",
  },
  {
    key: "faq_section_title",
    title: "SSS Başlık",
    content: "Hizmetler hakkında",
  },
  {
    key: "faq_1_q",
    title: "SSS 1 Soru",
    content: "Randevu nasıl alınır?",
  },
  {
    key: "faq_1_a",
    title: "SSS 1 Cevap",
    content:
      "WhatsApp, telefon veya sitedeki randevu sepeti üzerinden teklif / randevu talebi oluşturabilirsiniz.",
  },
  {
    key: "faq_2_q",
    title: "SSS 2 Soru",
    content: "Hangi hizmetler sunuluyor?",
  },
  {
    key: "faq_2_a",
    title: "SSS 2 Cevap",
    content:
      "Cilt bakımı, lazer epilasyon (bayan/erkek), Alex lazer, bölgesel incelme ve kirpik-kaş uygulamaları sunuyoruz.",
  },
  {
    key: "faq_3_q",
    title: "SSS 3 Soru",
    content: "Kayıt için nasıl ilerlemeliyim?",
  },
  {
    key: "faq_3_a",
    title: "SSS 3 Cevap",
    content:
      "WhatsApp veya iletişim formundan danışmanlık alın; uygun programı seçip kayıt sepetine ekleyebilirsiniz.",
  },
  {
    key: "faq_4_q",
    title: "SSS 4 Soru",
    content: "Hizmet saatleri nedir?",
  },
  {
    key: "faq_4_a",
    title: "SSS 4 Cevap",
    content:
      "Programlara göre değişmekle birlikte dersler genellikle 10:00–17:00 arasındadır. Detaylar her hizmetin sayfasında yer alır.",
  },
  {
    key: "testimonial_section_title",
    title: "Referanslar Başlık",
    content: "Müşterilerimizin deneyimi",
  },
  {
    key: "testimonial_section_desc",
    title: "Referanslar Açıklama",
    content:
      "Uygulamalı hizmet ve birebir rehberlikle kariyerine adım atan mezunlarımızdan notlar.",
  },
  {
    key: "testimonial_1_quote",
    title: "Yorum 1",
    content:
      "Protez tırnak hizmetinde ilk işlemimi canlı manken üzerinde yaptım. Eğitmen çok ilgiliydi.",
  },
  {
    key: "testimonial_1_name",
    title: "Yorum 1 İsim",
    content: "Mezun müşteri",
  },
  { key: "testimonial_1_place", title: "Yorum 1 Konum", content: "Seyhan" },
  {
    key: "testimonial_2_quote",
    title: "Yorum 2",
    content:
      "Kalıcı makyaj programı kapsamlıydı. Microblading'den dudak tekniklerine kadar adım adım ilerledik.",
  },
  {
    key: "testimonial_2_name",
    title: "Yorum 2 İsim",
    content: "Mezun müşteri",
  },
  { key: "testimonial_2_place", title: "Yorum 2 Konum", content: "Adana" },
  {
    key: "testimonial_3_quote",
    title: "Yorum 3",
    content:
      "Kirpik lifting blok dersi tek günde bitti; aynı gün sertifikamı aldım.",
  },
  {
    key: "testimonial_3_name",
    title: "Yorum 3 İsim",
    content: "Mezun müşteri",
  },
  { key: "testimonial_3_place", title: "Yorum 3 Konum", content: "Adana" },
  { key: "blog_eyebrow", title: "Blog Üst Etiket", content: "Blog" },
  {
    key: "blog_title",
    title: "Blog Başlık",
    content: "Haberler & Yazılar",
  },
  {
    key: "blog_intro",
    title: "Blog Açıklama",
    content:
      "Güzellik hizmeti, teknikler ve salon hayatından bilgilendirici içerikler.",
  },
  {
    key: "blog_empty",
    title: "Blog Boş Mesaj",
    content: "Henüz yayınlanmış yazı yok.",
  },
  { key: "projects_eyebrow", title: "Galeri Üst Etiket", content: "Galeri" },
  {
    key: "projects_title",
    title: "Galeri Başlık",
    content: "Müşteri çalışmaları & salon anları",
  },
  {
    key: "projects_intro",
    title: "Galeri Açıklama",
    content:
      "Uygulamalı hizmetlerden ve müşteri çalışmalarından seçkiler. Canlı manken uygulamaları ve atölye anları burada.",
  },
  {
    key: "projects_empty",
    title: "Galeri Boş Mesaj",
    content: "Henüz yayınlanmış galeri içeriği yok.",
  },
  {
    key: "services_page_eyebrow",
    title: "Hizmetler Üst Etiket",
    content: "Hizmetler",
  },
  {
    key: "services_page_title",
    title: "Hizmetler Sayfa Başlık",
    content: "Hizmet Programlarımız",
  },
  {
    key: "services_page_intro",
    title: "Hizmetler Sayfa Açıklama",
    content:
      "Adana’da cilt bakımı, lazer epilasyon, bölgesel incelme ve Alex lazer paketleri. Güncel fiyat listesi ve şeffaf bilgilendirme.",
  },
  {
    key: "project_detail_eyebrow",
    title: "Galeri Detay Üst Etiket",
    content: "Galeri",
  },
  {
    key: "project_gallery_hint",
    title: "Galeri İpucu",
    content:
      "Bu çalışmada {count} görsel · oklarla veya alttaki küçük resimlerle gezinin; birkaç saniyede otomatik kayar.",
  },
  {
    key: "project_quote_cta",
    title: "Galeri Danışmanlık Butonu",
    content: "Ücretsiz Danışmanlık Al",
  },
  {
    key: "project_back_link",
    title: "Galeri Geri Link",
    content: "← Tüm galeriye dön",
  },
  {
    key: "project_products_suffix",
    title: "Galeri Hizmet CTA Eki",
    content: "Hizmetleri",
  },
  {
    key: "product_price_disclaimer",
    title: "Hizmet Fiyat Uyarısı",
    content:
      "Başlangıç / örnek ücret — kesin kontenjan ve takvim danışmanlık sonrası netleşir.",
  },
  {
    key: "product_specs_heading",
    title: "Hizmet Özellikler Başlık",
    content: "Özellikler",
  },
  {
    key: "product_bullet_1",
    title: "Hizmet Madde 1",
    content: "Ücretsiz hizmet danışmanlığı",
  },
  {
    key: "product_bullet_2",
    title: "Hizmet Madde 2",
    content: "Canlı manken üzerinde uygulamalı hizmet",
  },
  {
    key: "product_bullet_3",
    title: "Hizmet Madde 3",
    content: "Seyhan / Adana",
  },
  {
    key: "product_desc_heading",
    title: "Hizmet Açıklama Başlık",
    content: "Hizmet Açıklaması",
  },
  {
    key: "contact_card_title",
    title: "İletişim Kart Başlık",
    content: "Zeynep Çeltek Güzellik",
  },
  { key: "contact_call_prefix", title: "Ara Öneki", content: "Ara:" },
  {
    key: "contact_whatsapp_link",
    title: "WhatsApp Link Metni",
    content: "WhatsApp ile yaz",
  },
  {
    key: "contact_whatsapp_cta",
    title: "WhatsApp Buton",
    content: "WhatsApp ile Yazın",
  },
  {
    key: "contact_whatsapp_prefill",
    title: "WhatsApp Prefill",
    content: "Merhaba, hizmet danışmanlığı / kayıt için yazıyorum.",
  },
  {
    key: "contact_submit_label",
    title: "Form Gönder Buton",
    content: "Mesaj Gönder",
  },
  {
    key: "contact_kvkk_suffix",
    title: "KVKK Onay Devamı",
    content:
      "okudum, kişisel verilerimin iletişim amacıyla işlenmesini kabul ediyorum.",
  },
  {
    key: "contact_map_label",
    title: "Harita Başlık",
    content: "Konum — Google Haritalar",
  },
  { key: "contact_map_open", title: "Harita Link", content: "Google'da aç" },
  {
    key: "contact_success",
    title: "Form Başarı Mesajı",
    content: "Mesajınız alındı. En kısa sürede size dönüş yapacağız.",
  },
  {
    key: "hero_body",
    title: "Hero Açıklama",
    content:
      "Adana Gazi Paşa ve Turgut Özal şubelerinde cilt bakımı, lazer epilasyon ve bölgesel incelme. Şeffaf fiyat, hijyenik ortam, kolay randevu.",
  },
  { key: "works_eyebrow", title: "Çalışmalar Üst Etiket", content: "Galeri" },
  {
    key: "works_title",
    title: "Çalışmalar Başlık",
    content: "Müşteri çalışmalarından seçkiler",
  },
];

async function main() {
  const adapter = new PrismaMariaDb(resolveMysqlDatabaseUrl());
  const prisma = new PrismaClient({ adapter });

  let created = 0;
  let skipped = 0;
  for (const row of keys) {
    const existing = await prisma.siteContent.findUnique({
      where: { key: row.key },
    });
    if (existing) {
      skipped += 1;
      continue;
    }
    await prisma.siteContent.create({ data: row });
    created += 1;
  }

  console.log(`Editor keys: created=${created}, already existed=${skipped}`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
