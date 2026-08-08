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

/** Static contact FAB — server component (no client JS). */
export function FloatingContact({ phone, whatsappUrl }: FloatingContactProps) {
  const waText = encodeURIComponent(
    "Merhaba, hizmetleriniz hakkında bilgi almak ve randevu oluşturmak istiyorum."
  );

  return (
    <div className="fixed z-40 flex flex-col items-end gap-2.5 bottom-[max(0.75rem,env(safe-area-inset-bottom))] right-[max(0.75rem,env(safe-area-inset-right))] pointer-events-none">
      <a
        href={telHref(phone)}
        className="pointer-events-auto w-12 h-12 flex items-center justify-center rounded-full bg-card border border-border text-orange hover:border-orange transition-colors md:hidden shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
        aria-label={`Ara: ${phone}`}
      >
        <Phone size={18} />
      </a>
      <a
        href={`${whatsappUrl}?text=${waText}`}
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-auto inline-flex items-center justify-center gap-2 rounded-full bg-orange text-ink w-12 h-12 sm:w-auto sm:h-auto sm:rounded-sm sm:pl-3.5 sm:pr-4 sm:py-3 text-xs font-bold tracking-wide uppercase shadow-[0_12px_40px_rgba(0,0,0,0.45)] hover:bg-orange-dark transition-colors"
        aria-label="WhatsApp ile iletişime geç"
      >
        <WhatsAppIcon size={18} />
        <span className="hidden sm:inline">WhatsApp ile İletişime Geç</span>
      </a>
    </div>
  );
}
