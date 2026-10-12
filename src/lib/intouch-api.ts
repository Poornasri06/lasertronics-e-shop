import { imageCatalog, type Product } from "@/data/products";
import { productOverrides } from "@/data/product-overrides";

export interface InTouchProduct {
  product_id: string;
  product_name: string;
  sku: string;
  type: string;
  enable_stock: string;
  variation_id?: string;
  variation_name?: string;
  sub_sku?: string;
  selling_price: string;
  purchase_price?: string;
  unit?: string;
  stock_qty?: string;
  brand_id?: string | null;
  category_id?: string | null;
  sub_category_id?: string | null;
}

export interface InTouchResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface InTouchCredentials {
  baseUrl: string;
  webipan: string;
  clientid: string;
  clientsecret: string;
}

export function getInTouchConfig(): InTouchCredentials {
  const env =
    typeof import.meta !== "undefined"
      ? (import.meta.env as Record<string, string | undefined>)
      : undefined;
  const procEnv =
    typeof process !== "undefined"
      ? (process.env as Record<string, string | undefined>)
      : undefined;

  const baseUrl =
    env?.["VITE_INTOUCH_API_BASE_URL"] ||
    procEnv?.["INTOUCH_API_BASE_URL"] ||
    "https://shsx9584.intouchconnects.com/index.php";

  const webipan =
    env?.["VITE_INTOUCH_WEBIPAN"] ||
    procEnv?.["INTOUCH_WEBIPAN"] ||
    "1234";

  const clientid =
    env?.["VITE_INTOUCH_CLIENT_ID"] ||
    procEnv?.["INTOUCH_CLIENT_ID"] ||
    "client_001";

  const clientsecret =
    env?.["VITE_INTOUCH_CLIENT_SECRET"] ||
    procEnv?.["INTOUCH_CLIENT_SECRET"] ||
    "secret_key";

  return { baseUrl, webipan, clientid, clientsecret };
}

/**
 * Fetch all active products and variations from InTouch ERP
 * Endpoint: POST {baseUrl}/GatAllProducts
 */
export async function fetchInTouchAllProducts(
  customConfig?: Partial<InTouchCredentials>,
): Promise<InTouchProduct[]> {
  const config = { ...getInTouchConfig(), ...customConfig };
  const endpoint = `${config.baseUrl.replace(/\/+$/, "")}/GatAllProducts`;

  const formParams = new URLSearchParams({
    webipan: config.webipan,
    clientid: config.clientid,
    clientsecret: config.clientsecret,
  });

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: formParams.toString(),
  });

  if (!response.ok) {
    throw new Error(`InTouch ERP API request failed with status: ${response.status} ${response.statusText}`);
  }

  const result = (await response.json()) as InTouchResponse<InTouchProduct[]>;

  if (!result.success) {
    throw new Error(result.message || "Failed to fetch products from InTouch ERP");
  }

  return Array.isArray(result.data) ? result.data : [];
}

/**
 * Fetch a single product by SKU or Variation SKU from InTouch ERP
 * Endpoint: POST {baseUrl}/GatProduct
 */
export async function fetchInTouchProductBySku(
  prodSku: string,
  customConfig?: Partial<InTouchCredentials>,
): Promise<InTouchProduct | null> {
  const config = { ...getInTouchConfig(), ...customConfig };
  const endpoint = `${config.baseUrl.replace(/\/+$/, "")}/GatProduct`;

  const formParams = new URLSearchParams({
    webipan: config.webipan,
    clientid: config.clientid,
    clientsecret: config.clientsecret,
    prod_sku: prodSku,
  });

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: formParams.toString(),
  });

  if (!response.ok) {
    throw new Error(`InTouch ERP API request failed with status: ${response.status} ${response.statusText}`);
  }

  const result = (await response.json()) as InTouchResponse<InTouchProduct>;

  if (!result.success || !result.data) {
    return null;
  }

  return result.data;
}

function detectCategory(name: string): string {
  const lower = name.toLowerCase();
  if (/solder|iron|toolkit|driver|tweezer|desolder|pump|station|flux|paste|cutter|plier|magnif|mat|antistatic|pry/.test(lower)) {
    return "repair-kits";
  }
  if (/esp32|esp8266|arduino|nodemcu|uno|nano|mega|stm32|raspberry|pi|sensor|ultrasonic|dht|pir|relay|servo|step|motor|oled|lcd|module|iot/.test(lower)) {
    return "iot-and-microcontrollers";
  }
  if (/tv|remote|hdmi|av|displayport|vga|optical|splitter|switch|converter|wallmount|bracket/.test(lower)) {
    return "tv-accessories";
  }
  if (/cable|charger|power bank|powerbank|earbuds|headphone|holder|stand|magsafe|battery|usb|type-c|lightning/.test(lower)) {
    return "mobile-accessories";
  }
  return "electronics";
}

function selectProductImage(name: string, category: string): string {
  const n = name.toLowerCase();
  if (n.includes("capacitor")) return imageCatalog.capacitorKit;
  if (n.includes("resistor")) return imageCatalog.resistorKit;
  if (n.includes("led") || n.includes("green") || n.includes("red") || n.includes("blue") || n.includes("white")) return imageCatalog.ledKit;
  if (n.includes("relay")) return imageCatalog.relay;
  if (n.includes("motor")) return imageCatalog.dcmotor;
  if (n.includes("servo")) return imageCatalog.servo;
  if (n.includes("remote")) return imageCatalog.remote;
  if (n.includes("hdmi")) return imageCatalog.hdmiCable;
  if (n.includes("switch")) return imageCatalog.hdmiSwitch;
  if (n.includes("charger")) return imageCatalog.ganCharger;
  if (n.includes("power") || n.includes("bank")) return imageCatalog.powerbank;
  if (n.includes("earbud") || n.includes("neckband") || n.includes("audio")) return imageCatalog.earbuds;
  if (n.includes("solder")) return imageCatalog.solderingStation;
  if (n.includes("meter")) return imageCatalog.multimeter;
  if (n.includes("tweezer")) return imageCatalog.tweezers;
  if (n.includes("heat") || n.includes("gun")) return imageCatalog.heatGun;
  if (n.includes("screwdriver") || n.includes("driver")) return imageCatalog.screwdriverSet;
  if (n.includes("pry")) return imageCatalog.pryTools;
  if (n.includes("tool")) return imageCatalog.repairToolkit;
  if (n.includes("esp32") || n.includes("esp8266")) return imageCatalog.esp32;
  if (n.includes("nodemcu")) return imageCatalog.nodemcu;
  if (n.includes("uno")) return imageCatalog.uno;
  if (n.includes("nano")) return imageCatalog.nano;
  if (n.includes("pi")) return imageCatalog.piAdapter;
  if (n.includes("breadboard")) return imageCatalog.breadboard;
  if (n.includes("sensor") || n.includes("pir")) return imageCatalog.pir;
  if (n.includes("ultrasonic")) return imageCatalog.ultrasonic;
  if (n.includes("cable") || n.includes("wire")) return imageCatalog.solderWire;

  switch (category) {
    case "mobile-accessories": return imageCatalog.usbcCable;
    case "tv-accessories": return imageCatalog.hdmiCable;
    case "iot-and-microcontrollers": return imageCatalog.esp32;
    case "repair-kits": return imageCatalog.repairToolkit;
    default: return imageCatalog.psuModule;
  }
}

/**
 * Helper to convert an InTouch ERP product into the store's Product format
 */
export function mapInTouchProductToStoreProduct(
  item: InTouchProduct,
  defaultCategory?: string,
): Product {
  const rawPrice = parseFloat(item.selling_price) || 0;
  const stockQty = parseFloat(item.stock_qty || "0");
  const computedStock = !isNaN(stockQty)
    ? Math.max(0, Math.floor(stockQty))
    : item.enable_stock === "1"
      ? 10
      : 0;

  const override =
    productOverrides[item.sku] ||
    (item.sub_sku ? productOverrides[item.sub_sku] : undefined) ||
    productOverrides[item.product_id];

  const displayName = override?.name || item.product_name;
  const displayPrice = override?.price !== undefined ? override.price : rawPrice;
  const category = override?.category || defaultCategory || detectCategory(displayName);
  const image = override?.image || selectProductImage(displayName, category);

  const cleanName = displayName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const skuPart = (item.sub_sku || item.sku || item.product_id).toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const slug = cleanName ? `${cleanName}-${skuPart}` : `prod-${skuPart}`;

  return {
    slug,
    name: displayName,
    category,
    price: displayPrice,
    image,
    ...(override?.badge ? { badge: override.badge } : {}),
    blurb:
      override?.blurb ||
      `${displayName} (${item.unit || "unit"}). Genuine InTouch ERP SKU: ${item.sub_sku || item.sku}`,
    specs: [
      { label: "SKU", value: item.sku },
      ...(item.sub_sku && item.sub_sku !== item.sku ? [{ label: "Variation SKU", value: item.sub_sku }] : []),
      ...(item.variation_name ? [{ label: "Variation", value: item.variation_name }] : []),
      { label: "Unit", value: item.unit || "Pc(s)" },
      { label: "Type", value: item.type },
      { label: "Available Stock", value: `${computedStock} ${item.unit || "Pc(s)"}` },
      { label: "Stock Enabled", value: item.enable_stock === "1" ? "Yes" : "No" },
    ],
    rating: 4.8,
    reviews: 0,
    stock: computedStock,
  };
}
