"use client";

import type { CSSProperties, ElementType, ReactNode } from "react";
import dynamic from "next/dynamic";
import { useEditor } from "@/components/editor/EditorProvider";
import { SiteLink } from "@/components/ui/SiteLink";
import { parseTextStyle, textStyleToCss } from "@/lib/text-style";

const EditableTextActive = dynamic(
  () =>
    import("@/components/editor/EditableTextActive").then(
      (m) => m.EditableTextActive
    ),
  { ssr: false }
);

export type EditableTextProps = {
  contentKey: string;
  value: string;
  as?: ElementType;
  className?: string;
  help?: string;
  multiline?: boolean;
  block?: boolean;
  children?: ReactNode;
  editField?: "content" | "title";
  pairedContent?: string;
  /** JSON style from `${contentKey}__style` content row. */
  textStyle?: string;
  style?: CSSProperties;
  /** Wrap text in a site link; editor mode keeps navigation, edit via pencil button. */
  linkHref?: string;
  linkClassName?: string;
};

/** Public path: zero editor chrome. Editor path: lazy-load interactive shell. */
export function EditableText(props: EditableTextProps) {
  const { enabled } = useEditor();

  if (!enabled) {
    const {
      value,
      as: Tag = "span",
      className,
      children,
      textStyle: textStyleRaw = "",
      style: styleProp,
      linkHref,
      linkClassName,
    } = props;
    const mergedStyle: CSSProperties = {
      ...textStyleToCss(parseTextStyle(textStyleRaw)),
      ...styleProp,
    };
    const textContent = children ?? value;
    if (linkHref) {
      return (
        <SiteLink href={linkHref} className={linkClassName}>
          <Tag className={className} style={mergedStyle}>
            {textContent}
          </Tag>
        </SiteLink>
      );
    }
    return (
      <Tag className={className} style={mergedStyle}>
        {textContent}
      </Tag>
    );
  }

  return <EditableTextActive {...props} />;
}
