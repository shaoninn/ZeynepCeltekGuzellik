import { SiteLink } from "@/components/ui/SiteLink";
import { Camera, MapPin, Mail, Phone } from "lucide-react";
import {
  SITE_NAME,
  BRANCHES,
  LEGAL_LINKS,
  PRIMARY_NAV_LINKS,
  INSTAGRAM_HANDLES,
} from "@/lib/constants";
import { Logo } from "@/components/brand/Logo";
import { FooterBlurb } from "@/components/layout/FooterBlurb";
import { WhatsAppIcon } from "@/components/brand/WhatsAppIcon";
import type { NavLinkItem, SiteSettingsMap } from "@/lib/site";

interface FooterProps {
  settings: SiteSettingsMap;
  navLinks: NavLinkItem[];
  footerBlurb?: string;
}

export function Footer({ settings, footerBlurb }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const quickLinks = PRIMARY_NAV_LINKS;

  return (
    <footer className="bg-black border-t border-border">
      <div className="h-px bg-gradient-to-r from-transparent via-orange to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          <div>
            <div className="mb-4">
              <Logo size="md" />
            </div>
            <FooterBlurb value={footerBlurb} />
            <div className="flex items-center gap-2.5 mt-4">
              {INSTAGRAM_HANDLES.map((ig) => (
                <a
                  key={ig.handle}
                  href={ig.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 flex items-center justify-center rounded-sm border border-border text-muted hover:text-orange hover:border-orange transition-colors"
                  aria-label={ig.handle}
                >
                  <Camera size={15} />
                </a>
              ))}
              <a
                href={settings.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-sm border border-border text-muted hover:text-[#25D366] hover:border-[#25D366] transition-colors"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon size={15} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-display text-xs font-bold tracking-[0.18em] text-cream uppercase mb-4">
              Hızlı Linkler
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <SiteLink
                    href={link.href}
                    className="text-muted text-sm hover:text-orange transition-colors"
                  >
                    {link.label}
                  </SiteLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-xs font-bold tracking-[0.18em] text-cream uppercase mb-4">
              Şubelerimiz
            </h3>
            <ul className="space-y-3">
              {BRANCHES.map((b) => (
                <li key={b.name} className="flex items-start gap-2.5">
                  <MapPin size={15} className="text-orange shrink-0 mt-0.5" />
                  <span className="text-muted text-sm leading-snug">
                    <span className="block text-cream/90">{b.name}</span>
                    {b.address}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-xs font-bold tracking-[0.18em] text-cream uppercase mb-4">
              İletişim
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <Phone size={15} className="text-orange shrink-0 mt-0.5" />
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
                <Mail size={15} className="text-orange shrink-0 mt-0.5" />
                <a
                  href={`mailto:${settings.email}`}
                  className="text-muted text-sm hover:text-orange transition-colors break-all"
                >
                  {settings.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin size={15} className="text-orange shrink-0 mt-0.5" />
                <span className="text-muted text-sm leading-relaxed">
                  {settings.address}
                </span>
              </li>
              {INSTAGRAM_HANDLES.map((ig) => (
                <li key={ig.handle} className="text-muted text-sm pl-6">
                  <a
                    href={ig.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-orange transition-colors"
                  >
                    {ig.handle}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-border bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col lg:flex-row items-center justify-between gap-3">
          <p className="text-muted text-xs text-center lg:text-left">
            © {currentYear} {SITE_NAME} Merkezi. Tüm hakları saklıdır.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            {LEGAL_LINKS.slice(0, 4).map((link) => (
              <SiteLink
                key={link.href}
                href={link.href}
                className="text-muted text-[11px] hover:text-orange transition-colors"
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
