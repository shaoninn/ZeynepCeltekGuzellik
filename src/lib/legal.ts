export const LEGAL_UPDATED = "8 Ağustos 2026";

export const COMPANY = {
  name: "Zeynep Çeltek Güzellik",
  address:
    "Gazi Paşa: CarrefourSA Expres Market Üstü, Cemal Paşa Mh. Gazipaşa Bulvarı, 63003. Sk. Tek Apt Kat 4 No 41, 01120 Seyhan/Adana · Turgut Özal: Güzelyalı, Turgut Özal Blv. No:102, 01170 Çukurova/Adana",
  /** Public e-posta yok; iletişim telefon / WhatsApp. */
  email: "",
  phone: "0 (541) 457 06 54 · 0 (545) 457 06 56 · 0 (322) 232 59 52",
  site: "https://zeynepceltek.com",
};

/** Legal pages: phone first, optional email only if set. */
export function companyContactLine(): string {
  if (COMPANY.email.trim()) {
    return `${COMPANY.phone} · ${COMPANY.email}`;
  }
  return COMPANY.phone;
}
