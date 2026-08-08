export interface CartItem {
  /** Unique line key: product + ölçü/renk */
  lineId: string;
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string | null;
  quantity: number;
  categoryName: string;
  widthCm?: number | null;
  heightCm?: number | null;
  color?: string | null;
  optionsNote?: string | null;
}

export function cartLineId(input: {
  productId: string;
  widthCm?: number | null;
  heightCm?: number | null;
  color?: string | null;
  optionsNote?: string | null;
}): string {
  const w = input.widthCm ?? "";
  const h = input.heightCm ?? "";
  const c = (input.color || "").trim().toLowerCase();
  const o = (input.optionsNote || "").trim().slice(0, 80);
  return `${input.productId}|${w}|${h}|${c}|${o}`;
}

export interface ProductSpecs {
  malzeme?: string;
  garanti?: string;
  montaj?: string;
  teslimat?: string;
  [key: string]: string | undefined;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  image: string | null;
  sortOrder: number;
  isActive: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  shortDesc: string | null;
  price: number;
  salePrice?: number | null;
  image: string | null;
  nightImage?: string | null;
  images: string;
  specs: string;
  sortOrder: number;
  isActive: boolean;
  inStock: boolean;
  isFeatured?: boolean;
  badgeNew?: boolean;
  badgeBestseller?: boolean;
  badgeSale?: boolean;
  shippingLabel?: string | null;
  campaignEndsAt?: string | Date | null;
  categoryId: string;
  category?: Category;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  image: string | null;
  imageBefore?: string | null;
  images: string;
  location: string | null;
  sortOrder: number;
  isActive: boolean;
  isFeatured: boolean;
  categoryId: string | null;
  category?: Category | null;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  image: string | null;
  isPublished: boolean;
  publishedAt: Date | null;
  createdAt: Date;
}

export interface SiteContent {
  id: string;
  key: string;
  title: string | null;
  content: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
