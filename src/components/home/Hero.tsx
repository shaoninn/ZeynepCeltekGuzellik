"use client";

import dynamic from "next/dynamic";
import { useEditor } from "@/components/editor/EditorProvider";
import {
  DEFAULT_HERO_IMAGE,
  HeroPublic,
  type HeroViewProps,
} from "@/components/home/HeroPublic";

export { DEFAULT_HERO_IMAGE };

const HeroEditable = dynamic(
  () =>
    import("@/components/home/HeroEditable").then((m) => m.HeroEditable),
  { ssr: false }
);

export function Hero(props: HeroViewProps) {
  const { enabled } = useEditor();
  if (enabled) return <HeroEditable {...props} />;
  return <HeroPublic {...props} />;
}
