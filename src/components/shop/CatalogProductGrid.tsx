"use client";

import { useMemo, useState, useEffect } from "react";
import { Search } from "lucide-react";
import { ProductCard } from "@/components/shop/ProductCard";
import { parseProductSpecs } from "@/lib/catalog-meta";
import type { Product } from "@/types";

type StockFilter = "all" | "inStock";
type BadgeFilter = "all" | "new" | "sale" | "bestseller";
type SortOption = "default" | "price-asc" | "price-desc" | "name" | "popular";
type LightFilter = "all" | "lit" | "unlit";
type PlaceFilter = "all" | "ic" | "dis";

export type CatalogProduct = Product & {
  category?: { name: string; slug: string };
  badgeNew?: boolean;
  badgeBestseller?: boolean;
  badgeSale?: boolean;
  salePrice?: number | null;
  nightImage?: string | null;
  campaignEndsAt?: string | Date | null;
};

interface CatalogProductGridProps {
  products: CatalogProduct[];
}

export function CatalogProductGrid({ products }: CatalogProductGridProps) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [stock, setStock] = useState<StockFilter>("all");
  const [badge, setBadge] = useState<BadgeFilter>("all");
  const [sort, setSort] = useState<SortOption>("default");
  const [light, setLight] = useState<LightFilter>("all");
  const [place, setPlace] = useState<PlaceFilter>("all");
  const [material, setMaterial] = useState("all");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim().toLowerCase()), 200);
    return () => clearTimeout(t);
  }, [search]);

  const materials = useMemo(() => {
    const set = new Set<string>();
    for (const p of products) {
      const m = parseProductSpecs(p.specs).malzeme;
      if (m) set.add(m);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b, "tr"));
  }, [products]);

  const filtered = useMemo(() => {
    let list = [...products];

    if (debouncedSearch) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(debouncedSearch) ||
          p.shortDesc?.toLowerCase().includes(debouncedSearch) ||
          p.category?.name.toLowerCase().includes(debouncedSearch)
      );
    }

    if (stock === "inStock") list = list.filter((p) => p.inStock);

    if (badge === "new") list = list.filter((p) => p.badgeNew);
    else if (badge === "sale") list = list.filter((p) => p.badgeSale);
    else if (badge === "bestseller") list = list.filter((p) => p.badgeBestseller);

    if (light !== "all" || place !== "all" || material !== "all") {
      list = list.filter((p) => {
        const s = parseProductSpecs(p.specs);
        if (light === "lit" && s.isikli === false) return false;
        if (light === "unlit" && s.isikli === true) return false;
        if (place !== "all" && s.mekan != null && s.mekan !== place) return false;
        if (material !== "all" && s.malzeme !== material) return false;
        return true;
      });
    }

    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "name":
        list.sort((a, b) => a.name.localeCompare(b.name, "tr"));
        break;
      case "popular":
        list.sort((a, b) => {
          const score = (p: CatalogProduct) =>
            (p.badgeBestseller ? 4 : 0) +
            (p.isFeatured ? 2 : 0) +
            (p.badgeNew ? 1 : 0);
          return score(b) - score(a) || a.sortOrder - b.sortOrder;
        });
        break;
      default:
        list.sort((a, b) => a.sortOrder - b.sortOrder);
    }

    return list;
  }, [products, debouncedSearch, stock, badge, sort, light, place, material]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="search"
            placeholder="Ürün ara…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-input pl-9 text-sm"
          />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          <select
            value={stock}
            onChange={(e) => setStock(e.target.value as StockFilter)}
            className="admin-input text-sm"
            aria-label="Stok filtresi"
          >
            <option value="all">Tümü</option>
            <option value="inStock">Stokta</option>
          </select>
          <select
            value={badge}
            onChange={(e) => setBadge(e.target.value as BadgeFilter)}
            className="admin-input text-sm"
            aria-label="Rozet filtresi"
          >
            <option value="all">Tüm rozetler</option>
            <option value="new">Yeni</option>
            <option value="sale">İndirim</option>
            <option value="bestseller">Çok satan</option>
          </select>
          <select
            value={light}
            onChange={(e) => setLight(e.target.value as LightFilter)}
            className="admin-input text-sm"
            aria-label="Işık filtresi"
          >
            <option value="all">Işıklı / ışıksız</option>
            <option value="lit">Işıklı</option>
            <option value="unlit">Işıksız</option>
          </select>
          <select
            value={place}
            onChange={(e) => setPlace(e.target.value as PlaceFilter)}
            className="admin-input text-sm"
            aria-label="Mekân filtresi"
          >
            <option value="all">İç / dış</option>
            <option value="ic">İç mekân</option>
            <option value="dis">Dış mekân</option>
          </select>
          <select
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            className="admin-input text-sm"
            aria-label="Malzeme filtresi"
          >
            <option value="all">Malzeme</option>
            {materials.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="admin-input text-sm"
            aria-label="Sıralama"
          >
            <option value="default">Varsayılan</option>
            <option value="popular">Popüler</option>
            <option value="price-asc">Fiyat ↑</option>
            <option value="price-desc">Fiyat ↓</option>
            <option value="name">İsim</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-muted py-8 text-center">
          Aramanıza uygun ürün bulunamadı.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
