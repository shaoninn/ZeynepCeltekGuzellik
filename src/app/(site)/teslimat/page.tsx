import { LegalShell } from "@/components/legal/LegalShell";
import { companyContactLine } from "@/lib/legal";
import { COMPANY } from "@/lib/legal";

export const metadata = {
  alternates: { canonical: "/teslimat" },
  title: "Randevu Süreci",
  description:
    "Zeynep Çeltek Güzellik randevu süreci, hizmet ve salona ilişkin bilgilendirme.",
};

export default function DeliveryPage() {
  return (
    <LegalShell title="Randevu Süreci ve Hizmet">
      <p>
        {COMPANY.name} Adana’da yüz yüze güzellik hizmetleri sunar. Hizmet
        süreleri, fiyatlar ve randevu saatleri her uygulama için ayrıca
        netleştirilir.
      </p>
      <h2>Hizmet bölgesi</h2>
      <p>
        Salon merkezi: Adana. Seyhan, Çukurova, Yüreğir, Sarıçam ve çevre
        ilçelerden müşterilerimize hizmet veriyoruz. Şehir dışından gelen
        misafirler için randevu bilgisi ayrıca paylaşılır.
      </p>
      <h2>Süreç</h2>
      <ol>
        <li>Ön görüşme / ihtiyaç analizi</li>
        <li>Hizmet ve randevu onayı</li>
        <li>Randevu ve ödeme planı</li>
        <li>Uygulama ve bakım önerileri</li>
      </ol>
      <h2>Süreler</h2>
      <p>
        Hizmet süreleri uygulamaya göre değişir. Kesin süre randevu sırasında
        belirtilir.
      </p>
      <h2>Katılım koşulları</h2>
      <p>
        Misafir, randevu saatine zamanında katılım, gerekli hijyen kuralları ve
        salon yönergelerine uymayı kabul eder. İptal ve erteleme koşulları İade
        Politikası sayfasındadır.
      </p>
      <h2>İletişim</h2>
      <p>
        {companyContactLine()}
      </p>
    </LegalShell>
  );
}
