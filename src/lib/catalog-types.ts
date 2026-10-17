/**
 * Catalog Types, Pricing Formulas, and Currency Formatters
 * Safe for both Client and Server environments (pure JS/TS, zero Node.js dependencies).
 */

export interface CategoryRecord {
  id: string; // unique slug e.g. "mobile-accessories"
  name: string;
  tagline: string;
  description: string;
  markupPercentage: number; // e.g. 20 for 20% markup
  createdAt: string;
  updatedAt: string;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface ProductRecord {
  sku: string; // unique identifier e.g. "13069"
  slug: string;
  name: string;
  categoryId: string;
  basePrice: number; // LKR base cost/purchase price
  markupPercentage?: number | undefined; // snapshot or product-specific markup %
  isPriceOverridden: boolean; // if true, overridePrice is used instead of category rule
  overridePrice: number | null; // manual selling price override
  sellingPrice: number; // final calculated or overridden selling price
  image: string | null; // image URL or relative path (null if no image)
  stock: number;
  blurb: string;
  badge?: string | undefined;
  specs: ProductSpec[];
  createdAt: string;
  updatedAt: string;
}

export interface MediaRecord {
  id: string;
  filename: string;
  url: string;
  sizeBytes: number;
  mimeType: string;
  categoryId?: string | undefined;
  productSku?: string | undefined;
  uploadedAt: string;
}

export interface CatalogData {
  categories: CategoryRecord[];
  products: ProductRecord[];
  media: MediaRecord[];
  version: number;
  lastUpdated: string;
}

/**
 * Pricing Calculation Formula:
 * Selling Price = Base Price + (Base Price * Category Markup Percentage / 100)
 */
export function calculateSellingPrice(basePrice: number, markupPercentage: number): number {
  if (isNaN(basePrice) || basePrice < 0) return 0;
  const pct = isNaN(markupPercentage) ? 0 : markupPercentage;
  const markupAmount = (basePrice * pct) / 100;
  const total = basePrice + markupAmount;
  // Round to 2 decimal places
  return Math.round(total * 100) / 100;
}

export function computeProductPricing(
  product: Pick<ProductRecord, "basePrice" | "isPriceOverridden" | "overridePrice">,
  categoryMarkup: number
) {
  const base = Math.max(0, Number(product.basePrice) || 0);
  const markupPct = Number(categoryMarkup) || 0;
  const markupAmount = Math.round(((base * markupPct) / 100) * 100) / 100;
  const calculatedPrice = Math.round((base + markupAmount) * 100) / 100;
  const isOverridden = Boolean(product.isPriceOverridden && product.overridePrice != null && product.overridePrice > 0);
  const finalPrice = isOverridden ? Math.round(Number(product.overridePrice) * 100) / 100 : calculatedPrice;

  return {
    basePrice: base,
    markupPercentage: markupPct,
    markupAmount,
    calculatedPrice,
    isOverridden,
    overridePrice: product.overridePrice ?? null,
    finalPrice,
  };
}

/**
 * Format currency in Sri Lankan Rupees (LKR)
 */
export function formatLKR(value: number): string {
  if (isNaN(value)) return "LKR 0.00";
  return `LKR ${value.toLocaleString("en-LK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Alias for backwards compatibility
 */
export const formatINR = formatLKR;
