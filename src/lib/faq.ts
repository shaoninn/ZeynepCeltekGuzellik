export const SALON_FAQS = [
  {
    q: "Hizmetler kimler için uygun?",
    a: "Her yaş ve cilt tipine uygun profesyonel uygulamalar sunuyoruz. Size en uygun hizmet için iletişime geçebilirsiniz.",
  },
  {
    q: "Randevu sepeti ne anlama geliyor?",
    a: "Sitedeki sepet online ödeme değildir. Randevu / teklif listenizdir; talebiniz bize düşer, WhatsApp veya telefonla süreci netleştiririz.",
  },
  {
    q: "Randevu nasıl alınır?",
    a: "Hizmetleri sepete ekleyip formu gönderin veya WhatsApp / telefon ile doğrudan randevu oluşturun.",
  },
  {
    q: "Salon nerede?",
    a: "Adana’da Gazi Paşa (Seyhan) ve Turgut Özal (Çukurova) şubelerimiz var. Detaylı adres ve randevu için iletişim sayfasından veya WhatsApp’tan yazabilirsiniz.",
  },
] as const;

export function faqPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: SALON_FAQS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}
