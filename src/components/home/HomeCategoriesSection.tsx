"use client";

import { CategoriesGrid } from "@/components/home/CategoriesGrid";
import { EditableSectionShift } from "@/components/editor/EditableSectionShift";
import type { CategoryListItem } from "@/lib/catalog";

export function HomeCategoriesSection({
  categories,
  title,
  offset = "0",
  titleStyle,
}: {
  categories: CategoryListItem[];
  title?: string;
  offset?: string;
  titleStyle?: string;
}) {
  return (
    <EditableSectionShift
      settingKey="section_categories_offset"
      value={offset}
      label="Kategoriler kaydır"
    >
      <CategoriesGrid
        categories={categories}
        title={title}
        titleStyle={titleStyle}
      />
    </EditableSectionShift>
  );
}
