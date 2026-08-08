"use client";

import { Camera, MessageCircle } from "lucide-react";
import { WHATSAPP_URL, INSTAGRAM } from "@/lib/constants";
import { WhatsAppIcon } from "@/components/brand/WhatsAppIcon";

/** Vertical social rail — matches design right edge */
export function SocialRail() {
  const items = [
    {
      href: INSTAGRAM,
      label: "Instagram",
      icon: <Camera size={16} />,
    },
    {
      href: WHATSAPP_URL,
      label: "WhatsApp",
      icon: <WhatsAppIcon size={16} />,
    },
    {
      href: "/iletisim",
      label: "İletişim",
      icon: <MessageCircle size={16} />,
    },
  ];

  return (
    <aside
      className="animate-social hidden xl:flex fixed right-4 top-1/2 -translate-y-1/2 z-40 flex-col gap-2"
      aria-label="Sosyal medya"
    >
      {items.map((item) => (
        <a
          key={item.label}
          href={item.href}
          target={item.href.startsWith("http") ? "_blank" : undefined}
          rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
          className="w-11 h-11 rounded-full border border-orange/40 bg-black/60 backdrop-blur-sm text-orange flex items-center justify-center hover:bg-orange hover:text-black transition-colors"
          aria-label={item.label}
        >
          {item.icon}
        </a>
      ))}
    </aside>
  );
}
