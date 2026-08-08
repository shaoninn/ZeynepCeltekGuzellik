import { SiteLink } from "@/components/ui/SiteLink";
import { Camera, MapPin, Mail, Phone } from "lucide-react";
import { SITE_NAME, CATEGORIES, LEGAL_LINKS } from "@/lib/constants";
import { Logo } from "@/components/brand/Logo";
import { FooterBlurb } from "@/components/layout/FooterBlurb";
import { WhatsAppIcon } from "@/components/brand/WhatsAppIcon";
import type { NavLinkItem, SiteSettingsMap } from "@/lib/site";

interface FooterProps {
  settings: SiteSettingsMap;
  navLinks: NavLinkItem[];
  footerBlurb?: string;
}

export function Footer({ settings, navLinks, footerBlurb }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface border-t border-border">
      <div className="h-1 bg-gradient-to-r from-transparent via-orange to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          <div>
            <div className="mb-4">
              <Logo size="lg" />
            </div>
            <FooterBlurb value={footerBlurb} />
            <div className="flex items-center gap-2.5">
              <a
                href={settings.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-lg border border-border text-muted hover:text-orange hover:border-orange transition-colors"
                aria-label="Instagram"
              >
                <Camera size={16} />
              </a>
              <a
                href={settings.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-lg border border-border text-muted hover:text-[#25D366] hover:border-[#25D366] transition-colors"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon size={16} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-display text-sm font-bold tracking-widest text-white uppercase mb-4">
              Kurumsal
            </h3>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <SiteLink
                    href={link.href}
                    className="text-muted text-sm hover:text-orange transition-colors"
                  >
                    {link.label.charAt(0) + link.label.slice(1).toLowerCase()}
                  </SiteLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-bold tracking-widest text-white uppercase mb-4">
              Hizmetler
            </h3>
            <ul className="space-y-2.5">
              {CATEGORIES.slice(0, 8).map((cat) => (
                <li key={cat.slug}>
                  <SiteLink
                    href={`/hizmetler/${cat.slug}`}
                    className="text-muted text-sm hover:text-orange transition-colors"
                  >
                    {cat.name}
                  </SiteLink>
                </li>
              ))}
              <li>
                <SiteLink
                  href="/hizmetler"
                  className="text-orange text-sm font-semibold hover:text-orange-dark transition-colors"
                >
                  Tüm hizmetler →
                </SiteLink>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-bold tracking-widest text-white uppercase mb-4">
              Şubeler
            </h3>
            <ul className="space-y-2.5 mb-6">
              <li className="text-muted text-sm">Özal Şube — Adana</li>
              <li className="text-muted text-sm">Gazi Paşa Şube — Adana</li>
            </ul>
            <h3 className="font-display text-sm font-bold tracking-widest text-white uppercase mb-4">
              İletişim
            </h3>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-2.5">
                <Phone size={16} className="text-orange shrink-0 mt-0.5" />
                <a
                  href={settings.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange text-sm font-semibold hover:underline"
                >
                  {settings.phone}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail size={16} className="text-orange shrink-0 mt-0.5" />
                <a
                  href={`mailto:${settings.email}`}
                  className="text-muted text-sm hover:text-orange transition-colors break-all"
                >
                  {settings.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin size={16} className="text-orange shrink-0 mt-0.5" />
                <span className="text-muted text-sm leading-relaxed">
                  {settings.address}
                </span>
              </li>
              <li>
                <SiteLink
                  href="/hizmet-bolgeleri"
                  className="text-muted text-sm hover:text-orange transition-colors"
                >
                  Hizmet bölgeleri
                </SiteLink>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-border bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col lg:flex-row items-center justify-between gap-4">
          <p className="text-muted text-xs shrink-0">
            © {currentYear} {SITE_NAME}. Tüm hakları saklıdır.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            {LEGAL_LINKS.map((link) => (
              <SiteLink
                key={link.href}
                href={link.href}
                className="text-muted text-xs hover:text-orange transition-colors"
              >
                {link.label}
              </SiteLink>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
