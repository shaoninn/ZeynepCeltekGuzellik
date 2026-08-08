"use client";

import type { SiteSettingsMap } from "@/lib/site";
import {
  ContactForm,
  type ContactFormCopy,
} from "@/app/(site)/iletisim/ContactForm";
import { EditableText } from "@/components/editor/EditableText";

export type ContactPageData = {
  eyebrow: string;
  title: string;
  intro: string;
  formCopy: ContactFormCopy;
};

export function ContactPageView({
  data,
  settings,
}: {
  data: ContactPageData;
  settings: SiteSettingsMap;
}) {
  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <EditableText
            contentKey="contact_eyebrow"
            value={data.eyebrow}
            as="p"
            block
            className="text-orange text-xs font-semibold tracking-[0.3em] uppercase mb-2"
            help="İletişim sayfası üst etiket (küçük turuncu metin)"
          />
          <EditableText
            contentKey="contact_title"
            value={data.title}
            as="h1"
            block
            className="font-display text-3xl sm:text-4xl font-bold text-white mb-4"
            help="İletişim sayfası başlığı"
          />
          <EditableText
            contentKey="contact_intro"
            value={data.intro}
            as="p"
            block
            multiline
            className="text-muted max-w-2xl"
            help="İletişim sayfası kısa açıklama"
          />
        </div>

        <ContactForm settings={settings} copy={data.formCopy} />
      </div>
    </section>
  );
}
