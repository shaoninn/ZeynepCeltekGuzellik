"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { useEditor } from "@/components/editor/EditorProvider";

const EditableSectionShiftActive = dynamic(
  () =>
    import("@/components/editor/EditableSectionShiftActive").then(
      (m) => m.EditableSectionShiftActive
    ),
  { ssr: false }
);

export type EditableSectionShiftProps = {
  settingKey: string;
  value?: string;
  children: ReactNode;
  className?: string;
  label?: string;
  min?: number;
  max?: number;
};

/** Public: plain offset wrapper. Editor: lazy drag chrome. */
export function EditableSectionShift({
  value = "0",
  children,
  className = "",
  ...rest
}: EditableSectionShiftProps) {
  const { enabled } = useEditor();
  const offset = Number(value) || 0;

  if (!enabled) {
    return (
      <div
        className={`relative ${className}`}
        style={{ marginTop: offset ? offset : undefined }}
      >
        {children}
      </div>
    );
  }

  return (
    <EditableSectionShiftActive
      value={value}
      className={className}
      {...rest}
    >
      {children}
    </EditableSectionShiftActive>
  );
}
