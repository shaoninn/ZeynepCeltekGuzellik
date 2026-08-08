export const metadata = {
  alternates: { canonical: "/gizlilik-politikasi" },
  title: "Gizlilik Politikası | Zeynep Çeltek Güzellik",
};

export default function PrivacyPage() {
  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 prose-dark">
        <h1 className="font-display text-3xl font-bold text-white mb-8">
          Gizlilik Politikası
        </h1>
        <p>
          Zeynep Çeltek Güzellik olarak kişisel verilerinizin güvenliğine önem veriyoruz.
          Bu politika, web sitemizi ziyaret ettiğinizde veya hizmetlerimizden
          yararlandığınızda toplanan bilgilerin nasıl kullanıldığını açıklar.
        </p>
        <h2>Toplanan Bilgiler</h2>
        <p>
          İletişim formu aracılığıyla ad, telefon, e-posta ve mesaj içeriği
          toplanabilir. Bu bilgiler yalnızca talebinizi yanıtlamak için
          kullanılır.
        </p>
        <h2>Çerezler</h2>
        <p>
          Web sitemiz, kullanıcı deneyimini iyileştirmek için çerezler
          kullanabilir. Sepet bilgileriniz tarayıcınızda yerel olarak saklanır.
        </p>
        <h2>İletişim</h2>
        <p>
          Gizlilik ile ilgili sorularınız için info@zeynepceltekguzellik.local adresinden
          bize ulaşabilirsiniz.
        </p>
      </div>
    </section>
  );
}
