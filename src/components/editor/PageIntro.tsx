"use client";

import { EditableText } from "@/components/editor/EditableText";

export function PageIntro({
  eyebrowKey,
  titleKey,
  introKey,
  eyebrow,
  title,
  intro,
}: {
  eyebrowKey: string;
  titleKey: string;
  introKey: string;
  eyebrow: string;
  title: string;
  intro: string;
}) {
  return (
    <div className="mb-12">
      <EditableText
        contentKey={eyebrowKey}
        value={eyebrow}
        as="p"
        block
        className="text-orange text-xs font-semibold tracking-[0.3em] uppercase mb-2"
        help="Sayfa üst etiketi (küçük turuncu metin)"
      />
      <EditableText
        contentKey={titleKey}
        value={title}
        as="h1"
        block
        className="font-display text-3xl sm:text-4xl font-bold text-white mb-4"
        help="Sayfa ana başlığı"
      />
      <EditableText
        contentKey={introKey}
        value={intro}
        as="p"
        block
        multiline
        className="text-muted max-w-2xl"
        help="Sayfa kısa açıklama metni"
      />
    </div>
  );
}
