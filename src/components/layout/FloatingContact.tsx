"use client";

import { Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/brand/WhatsAppIcon";

interface FloatingContactProps {
  phone: string;
  whatsappUrl: string;
}

function telHref(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("90")) return `tel:+${digits}`;
  if (digits.startsWith("0")) return `tel:+9${digits}`;
  return `tel:+90${digits}`;
}

export function FloatingContact({ phone, whatsappUrl }: FloatingContactProps) {
  const waText = encodeURIComponent(
    "Merhaba, hizmetleriniz hakkında bilgi almak ve randevu oluşturmak istiyorum."
  );

  return (
    <div className="fixed z-40 flex flex-col gap-2 bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1.25rem,env(safe-area-inset-right))]">
      <a
        href={telHref(phone)}
        className="w-12 h-12 flex items-center justify-center rounded-full bg-card border border-border text-orange hover:border-orange transition-colors md:hidden"
        aria-label={`Ara: ${phone}`}
      >
        <Phone size={20} />
      </a>
      <a
        href={`${whatsappUrl}?text=${waText}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 flex items-center justify-center rounded-full bg-[#25D366] text-white hover:brightness-110 transition-colors shadow-lg"
        aria-label="WhatsApp ile yazın"
      >
        <WhatsAppIcon size={28} />
      </a>
    </div>
  );
}
