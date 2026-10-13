import { loadCatalogStore } from "../src/lib/catalog-store";
import { getLiveStoreProducts } from "../src/lib/server-products";

try {
  const store = loadCatalogStore();
  console.log("Categories in store:", store.categories.length);
  console.log("Products in store:", store.products.length);
  if (store.products.length > 0) {
    console.log("First product in store:", store.products[0].sku, store.products[0].name);
  }

  const live = await getLiveStoreProducts();
  console.log("Live store products returned:", live.length);
  if (live.length > 0) {
    console.log("First live product:", live[0].slug, live[0].name, live[0].category);
  }
} catch (err) {
  console.error("Error in test:", err);
}
