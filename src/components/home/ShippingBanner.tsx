"use client";

import { Truck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EditableText } from "@/components/editor/EditableText";

interface ShippingBannerProps {
  title?: string;
}

export function ShippingBanner({ title }: ShippingBannerProps) {
  return (
    <section className="py-10 lg:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border-2 border-orange/80 bg-card px-5 sm:px-8 py-6 sm:py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange text-black flex items-center justify-center shrink-0">
              <Truck size={24} />
            </div>
            <EditableText
              contentKey="shipping_banner_title"
              value={
                title ||
                "Türkiye'nin Her Yerine Hızlı ve Güvenli Kargo"
              }
              as="p"
              block
              className="font-display text-lg sm:text-xl font-bold text-white leading-snug"
              help="Kargo / teslimat bandı metni"
            />
          </div>
          <Button href="/hizmetler" size="md" className="justify-center shrink-0">
            Ürünleri İncele
            <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </section>
  );
}
