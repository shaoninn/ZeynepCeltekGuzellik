import { LegalShell } from "@/components/legal/LegalShell";
import { COMPANY } from "@/lib/legal";

export const metadata = {
  alternates: { canonical: "/mesafeli-satis" },
  title: "Mesafeli Satış Sözleşmesi",
  description:
    "Zeynep Çeltek Güzellik mesafeli satış ve randevu süreci bilgilendirmesi.",
};

export default function DistanceSalesPage() {
  return (
    <LegalShell title="Mesafeli Satış Sözleşmesi">
      <p>
        6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli
        Sözleşmeler Yönetmeliği kapsamında bilgilendirme metnidir.{" "}
        {COMPANY.name} öncelikle randevu / hizmet teklifi ile çalışır; site
        üzerinden anlık kart ödemesi alınmayabilir.
      </p>
      <h2>Satıcı / hizmet sağlayıcı</h2>
      <p>
        {COMPANY.name}
        <br />
        {COMPANY.address}
        <br />
        {COMPANY.email} · {COMPANY.phone}
      </p>
      <h2>Sözleşmenin konusu</h2>
      <p>
        Güzellik salonu hizmetleri, bakım uygulamaları, danışmanlık ve ilgili
        ürün / paketlerdir. Hizmet özellikleri randevu formunda ve onaylanan
        teklifte belirtilir.
      </p>
      <h2>Sipariş ve ödeme</h2>
      <p>
        Misafir randevu sepeti veya iletişim formu ile talep iletir.{" "}
        {COMPANY.name} görüşme sonrası yazılı hizmet ve ödeme bilgisi sunar.
        Ödeme yöntemleri (havale, kapora vb.) teklifte yer alır; web sitesi kart
        ödemesi almayabilir.
      </p>
      <h2>Randevu süreci</h2>
      <p>
        Hizmet, onaylanan randevu tarihine göre teklifte yazılan süre içinde
        yürütülür. Detaylar Randevu Süreci sayfasındadır.
      </p>
      <h2>Cayma hakkı</h2>
      <p>
        Kişiye özel planlanan veya başlamış güzellik hizmetlerinde cayma hakkı
        sınırlı olabilir. Standart randevularda yasal süreler teklif ve fatura
        koşullarına göre uygulanır. Ayrıntı için İade Politikası sayfasına
        bakın.
      </p>
      <h2>Uyuşmazlık</h2>
      <p>
        Tüketici uyuşmazlıklarında Tüketici Hakem Heyetleri ve Tüketici
        Mahkemeleri yetkilidir.
      </p>
    </LegalShell>
  );
}
