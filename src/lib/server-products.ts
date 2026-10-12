import { createServerFn } from "@tanstack/react-start";
import {
  fetchInTouchAllProducts,
  fetchInTouchProductBySku,
  mapInTouchProductToStoreProduct,
} from "./intouch-api";
import { products as fallbackProducts, type Product } from "@/data/products";

// In-memory cache on the server so we don't query 16k items repeatedly
let cachedProducts: Product[] | null = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes cache

export async function getLiveStoreProducts(): Promise<Product[]> {
  const now = Date.now();
  if (cachedProducts && cachedProducts.length > 0 && now - lastFetchTime < CACHE_TTL_MS) {
    return cachedProducts;
  }

  try {
    const rawItems = await fetchInTouchAllProducts();
    if (rawItems && rawItems.length > 0) {
      cachedProducts = rawItems.map((item) => mapInTouchProductToStoreProduct(item));
      lastFetchTime = now;
      return cachedProducts;
    }
  } catch (err) {
    console.error("Failed to load products from InTouch ERP:", err);
    if (cachedProducts && cachedProducts.length > 0) return cachedProducts;
  }

  // Graceful fallback to static catalogue if ERP network is down
  return fallbackProducts;
}

export type CatalogQueryParams = {
  category?: string;
  query?: string;
  sort?: "featured" | "price-asc" | "price-desc" | "rating";
  page?: number;
  limit?: number;
};

export type CatalogResponse = {
  items: Product[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
};

/**
 * Server function to fetch paginated/filtered catalog directly from live InTouch ERP
 */
export const fetchProductsCatalogFn = createServerFn({ method: "GET" })
  .validator((params: CatalogQueryParams) => params)
  .handler(async ({ data: params }): Promise<CatalogResponse> => {
    const all = await getLiveStoreProducts();
    let list = all;

    if (params.category && params.category !== "all") {
      list = list.filter((p) => p.category === params.category);
    }

    if (params.query && params.query.trim()) {
      const q = params.query.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q) ||
          p.specs.some((s) => s.value.toLowerCase().includes(q)),
      );
    }

    if (params.sort === "price-asc") {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (params.sort === "price-desc") {
      list = [...list].sort((a, b) => b.price - a.price);
    } else if (params.sort === "rating") {
      list = [...list].sort((a, b) => b.rating - a.rating);
    }

    const page = Math.max(1, params.page || 1);
    const limit = Math.max(1, params.limit || 36);
    const total = list.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const start = (page - 1) * limit;
    const items = list.slice(start, start + limit);

    return {
      items,
      total,
      page,
      totalPages,
      hasMore: page < totalPages,
    };
  });

/**
 * Server function to fetch all live products
 */
export const fetchAllProductsFn = createServerFn({ method: "GET" }).handler(async () => {
  return await getLiveStoreProducts();
});

/**
 * Server function to fetch single product by slug or SKU
 */
export const fetchProductBySlugOrSkuFn = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }): Promise<Product | null> => {
    const all = await getLiveStoreProducts();

    // 1. Exact match on slug
    const bySlug = all.find(
      (p) => p.slug === slug || p.slug.toLowerCase() === slug.toLowerCase(),
    );
    if (bySlug) return bySlug;

    // 2. Match on SKU in specs
    const bySku = all.find((p) =>
      p.specs.some(
        (s) => s.label === "SKU" && (s.value === slug || s.value.toLowerCase() === slug.toLowerCase()),
      ),
    );
    if (bySku) return bySku;

    // 3. Fallback direct query to InTouch ERP
    try {
      const raw = await fetchInTouchProductBySku(slug);
      if (raw) return mapInTouchProductToStoreProduct(raw);
    } catch (err) {
      console.error(`Failed to fetch product SKU ${slug} directly from ERP:`, err);
    }

    return null;
  });
