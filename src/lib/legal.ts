export const LEGAL_UPDATED = "8 Ağustos 2026";

export const COMPANY = {
  name: "Zeynep Çeltek Güzellik",
  address: "Adana — Özal & Gazi Paşa şubeleri",
  /** Public e-posta yok; iletişim telefon / WhatsApp. */
  email: "",
  phone: "0 (534) 080 98 73",
  site: "https://zeynepceltek.com",
};

/** Legal pages: phone first, optional email only if set. */
export function companyContactLine(): string {
  if (COMPANY.email.trim()) {
    return `${COMPANY.phone} · ${COMPANY.email}`;
  }
  return COMPANY.phone;
}
