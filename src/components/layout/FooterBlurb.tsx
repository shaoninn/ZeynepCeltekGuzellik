"use client";

import { EditableText } from "@/components/editor/EditableText";

export function FooterBlurb({ value }: { value?: string }) {
  return (
    <EditableText
      contentKey="footer_blurb"
      value={
        value ||
        "Adana’da profesyonel güzellik hizmetleri."
      }
      as="p"
      block
      multiline
      className="text-muted text-sm mb-6 leading-relaxed"
      help="Footer’daki kısa tanıtım metni"
    />
  );
}
