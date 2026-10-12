export interface ProductOverride {
  name?: string;
  image?: string;
  price?: number;
  badge?: string;
  blurb?: string;
  category?: string;
}

/**
 * Configure custom product details by SKU or variation SKU.
 * Add any product SKU here to customize its name, image, price, or badge.
 */
export const productOverrides: Record<string, ProductOverride> = {
  // Example override for SKU 13069:
  "13069": {
    name: "3mm Super Bright Green LED",
    badge: "Popular Component",
  },
};
