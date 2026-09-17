import { LegalShell } from "@/components/legal/LegalShell";
import { COMPANY, companyContactLine } from "@/lib/legal";

export const metadata = {
  alternates: { canonical: "/kullanim-kosullari" },
  title: "Kullanım Koşulları",
  description: "Zeynep Çeltek Güzellik web sitesi kullanım koşulları.",
};

export default function TermsPage() {
  return (
    <LegalShell title="Kullanım Koşulları">
      <p>
        Bu web sitesini ({COMPANY.site}) kullanarak aşağıdaki koşulları kabul
        etmiş sayılırsınız. Koşulları kabul etmiyorsanız lütfen siteyi
        kullanmayın.
      </p>
      <h2>Hizmetin niteliği</h2>
      <p>
        {COMPANY.name}; güzellik salonu hizmetleri, danışmanlık ve bakım
        uygulamaları sunar. Sitede gösterilen fiyatlar örnek / bilgilendirme
        niteliklidir; kesin randevu koşulları görüşme sonrası netleşir. Güvenli
        kart ödemesi PayTR üzerinden alınabilir; randevu onayı ile ilerlenir.
      </p>
      <h2>İçerik ve fikri mülkiyet</h2>
      <p>
        Sitedeki metin, görsel, logo ve salon materyalleri {COMPANY.name}
        &apos;a veya lisans verenlere aittir. İzinsiz kopyalama, çoğaltma veya
        ticari kullanım yasaktır.
      </p>
      <h2>Kullanıcı yükümlülükleri</h2>
      <p>
        İletişim ve randevu formlarında doğru bilgi vermeyi taahhüt edersiniz.
        Siteyi hukuka aykırı, zararlı veya sistem güvenliğini bozacak şekilde
        kullanamazsınız.
      </p>
      <h2>Sorumluluk sınırı</h2>
      <p>
        Site içeriği bilgilendirme amaçlıdır. Teknik arıza, gecikme veya üçüncü
        taraf bağlantılardan doğan dolaylı zararlardan {COMPANY.name} sorumlu
        tutulamaz. Hizmet ve randevu koşulları yazılı onayda belirtilir.
      </p>
      <h2>Değişiklikler</h2>
      <p>
        Bu koşulları güncelleyebiliriz. Güncel metin bu sayfada yayınlandığı
        andan itibaren geçerlidir.
      </p>
      <h2>İletişim</h2>
      <p>
        {companyContactLine()}
        <br />
        {COMPANY.address}
      </p>
    </LegalShell>
  );
}
