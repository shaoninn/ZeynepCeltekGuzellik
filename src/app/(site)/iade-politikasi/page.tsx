import { LegalShell } from "@/components/legal/LegalShell";
import { COMPANY } from "@/lib/legal";

export const metadata = {
  alternates: { canonical: "/iade-politikasi" },
  title: "İade Politikası",
  description: "Zeynep Çeltek Güzellik iade, iptal ve değişiklik koşulları.",
};

export default function ReturnPolicyPage() {
  return (
    <LegalShell title="İade Politikası">
      <p>
        {COMPANY.name} hizmetleri çoğunlukla kişiye özel planlanan güzellik
        uygulamalarıdır. Bu nedenle iade ve iptal kuralları standart
        e-ticaretten farklıdır.
      </p>
      <h2>Randevu</h2>
      <p>
        Onaylanan randevu ve uygulamada; hizmet başladıktan sonra iade kabul
        edilmez. Randevu öncesi iptalde yapılan kapora / avans kesintisi
        teklifte belirtilen oranda uygulanabilir.
      </p>
      <h2>Salon kaynaklı aksaklık</h2>
      <p>
        Firmamızdan kaynaklanan randevu iptali veya ciddi aksaklıklarda ücret
        iadesi veya alternatif tarih sunulur. Misafir kaynaklı gecikme /
        gelmeme durumlarında ek düzenleme teklif edilebilir.
      </p>
      <h2>Standart ürün / paketler</h2>
      <p>
        Stoktan verilen (varsa) standart ürün veya hizmet paketlerinde,
        kullanılmamış hallerde iade talepleri yazılı olarak {COMPANY.email}{" "}
        adresine iletilmelidir. İnceleme sonrası süreç netleştirilir.
      </p>
      <h2>Başvuru</h2>
      <p>
        İade / iptal taleplerinizi randevu veya teklif referansınızla birlikte{" "}
        {COMPANY.email} veya {COMPANY.phone} üzerinden iletin.
      </p>
    </LegalShell>
  );
}
