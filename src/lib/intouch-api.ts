import type { Product } from "@/data/products";

const imageCatalog: Record<string, string> = {
  usbcCable: "/assets/p/usbc-cable.jpg",
  lightningCable: "/assets/p/lightning-cable.jpg",
  powerbank: "/assets/p/powerbank.jpg",
  magsafePowerbank: "/assets/p/magsafe-powerbank.jpg",
  ganCharger: "/assets/p/gan-charger.jpg",
  usbcCharger: "/assets/p/usbc-charger.jpg",
  earbuds: "/assets/p/earbuds.jpg",
  neckband: "/assets/p/neckband.jpg",
  carHolder: "/assets/p/car-holder.jpg",
  tripod: "/assets/p/tripod.jpg",
  psuModule: "/assets/p/psu-module.jpg",
  capacitorKit: "/assets/p/capacitor-kit.jpg",
  resistorKit: "/assets/p/resistor-kit.jpg",
  ledKit: "/assets/p/led-kit.jpg",
  relay: "/assets/p/relay.jpg",
  dcmotor: "/assets/p/dcmotor.jpg",
  servo: "/assets/p/servo.jpg",
  breadboard: "/assets/p/breadboard.jpg",
  roboticsKit: "/assets/p/robotics-kit.jpg",
  bluetoothModule: "/assets/p/bluetooth-module.jpg",
  hdmiCable: "/assets/p/hdmi-cable.jpg",
  hdmiSplitter: "/assets/p/hdmi-splitter.jpg",
  hdmiSwitch: "/assets/p/hdmi-switch.jpg",
  opticalCable: "/assets/p/optical-cable.jpg",
  avConverter: "/assets/p/av-converter.jpg",
  displayport: "/assets/p/displayport.jpg",
  remote: "/assets/p/remote.jpg",
  wallmount: "/assets/p/wallmount.jpg",
  tvKeyboard: "/assets/p/tv-keyboard.jpg",
  streamingAdapter: "/assets/p/streaming-adapter.jpg",
  esp32: "/assets/p/esp32.jpg",
  nodemcu: "/assets/p/nodemcu.jpg",
  uno: "/assets/p/uno.jpg",
  nano: "/assets/p/nano.jpg",
  piCase: "/assets/p/pi-case.jpg",
  piAdapter: "/assets/p/pi-adapter.jpg",
  iotKit: "/assets/p/iot-kit.jpg",
  wifiSensor: "/assets/p/wifi-sensor.jpg",
  pir: "/assets/p/pir.jpg",
  ultrasonic: "/assets/p/ultrasonic.jpg",
  solderingStation: "/assets/p/soldering-station.jpg",
  screwdriverSet: "/assets/p/screwdriver-set.jpg",
  multimeter: "/assets/p/multimeter.jpg",
  repairToolkit: "/assets/p/repair-toolkit.jpg",
  desolderPump: "/assets/p/desolder-pump.jpg",
  antistatic: "/assets/p/antistatic.jpg",
  solderWire: "/assets/p/solder-wire.jpg",
  tweezers: "/assets/p/tweezers.jpg",
  heatGun: "/assets/p/heat-gun.jpg",
  pryTools: "/assets/p/pry-tools.jpg",
};

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
    "dsfgdsg446fads2414dfs14521#((*&GHBADHS";

  const clientid =
    env?.["VITE_INTOUCH_CLIENT_ID"] ||
    procEnv?.["INTOUCH_CLIENT_ID"] ||
    "9edba68d-2fa4-4ade-b926-54a59fdbcd80";

  const clientsecret =
    env?.["VITE_INTOUCH_CLIENT_SECRET"] ||
    procEnv?.["INTOUCH_CLIENT_SECRET"] ||
    "e218b1a9-be1c-406a-abb6-d0abcadf375d";

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
    signal: AbortSignal.timeout(45000),
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

export function detectCategory(name: string): string {
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

const categoryImagePools: Record<string, string[]> = {
  "mobile-accessories": [
    imageCatalog.usbcCable,
    imageCatalog.carHolder,
    imageCatalog.powerbank,
    imageCatalog.magsafePowerbank,
    imageCatalog.ganCharger,
    imageCatalog.usbcCharger,
    imageCatalog.earbuds,
    imageCatalog.neckband,
    imageCatalog.lightningCable,
    imageCatalog.tripod,
  ],
  "electronics": [
    imageCatalog.psuModule,
    imageCatalog.capacitorKit,
    imageCatalog.resistorKit,
    imageCatalog.ledKit,
    imageCatalog.relay,
    imageCatalog.dcmotor,
    imageCatalog.servo,
    imageCatalog.breadboard,
    imageCatalog.roboticsKit,
    imageCatalog.bluetoothModule,
  ],
  "tv-accessories": [
    imageCatalog.hdmiCable,
    imageCatalog.remote,
    imageCatalog.hdmiSplitter,
    imageCatalog.hdmiSwitch,
    imageCatalog.opticalCable,
    imageCatalog.avConverter,
    imageCatalog.displayport,
    imageCatalog.wallmount,
    imageCatalog.tvKeyboard,
    imageCatalog.streamingAdapter,
  ],
  "iot-and-microcontrollers": [
    imageCatalog.esp32,
    imageCatalog.nodemcu,
    imageCatalog.uno,
    imageCatalog.nano,
    imageCatalog.piCase,
    imageCatalog.piAdapter,
    imageCatalog.iotKit,
    imageCatalog.wifiSensor,
    imageCatalog.pir,
    imageCatalog.ultrasonic,
  ],
  "repair-kits": [
    imageCatalog.solderingStation,
    imageCatalog.screwdriverSet,
    imageCatalog.multimeter,
    imageCatalog.repairToolkit,
    imageCatalog.desolderPump,
    imageCatalog.antistatic,
    imageCatalog.solderWire,
    imageCatalog.tweezers,
    imageCatalog.heatGun,
    imageCatalog.pryTools,
  ],
};

function selectProductImage(name: string, category: string, uniqueKey: string = ""): string {
  const n = name.toLowerCase();

  // 1. Mobile, Power & Audio
  if (n.includes("stand") || n.includes("holder")) return imageCatalog.carHolder;
  if (n.includes("tripod") || n.includes("monopod") || n.includes("selfie")) return imageCatalog.tripod;
  if (n.includes("magsafe") || n.includes("magnetic power") || n.includes("wireless")) return imageCatalog.magsafePowerbank;
  if (n.includes("battery") || n.includes("rechargeable") || n.includes("18650") || n.includes("cell") || n.includes("power bank") || n.includes("powerbank")) return imageCatalog.powerbank;
  if (n.includes("charger") || n.includes("gan") || n.includes("adapter")) return imageCatalog.ganCharger;
  if (n.includes("earbud") || n.includes("airpod") || n.includes("tws")) return imageCatalog.earbuds;
  if (n.includes("neckband") || n.includes("headphone") || n.includes("audio")) return imageCatalog.neckband;
  if (n.includes("lightning") || n.includes("apple cable")) return imageCatalog.lightningCable;
  if (n.includes("type-c") || n.includes("usbc")) return imageCatalog.usbcCable;

  // 2. Electronics Components
  if (n.includes("capacitor") || n.includes("uf") || n.includes("pf") || n.includes("cap ")) return imageCatalog.capacitorKit;
  if (n.includes("resistor") || n.includes("ohm")) return imageCatalog.resistorKit;
  if (n.includes("led") || n.includes("3mm") || n.includes("5mm") || n.includes("diode")) return imageCatalog.ledKit;
  if (n.includes("relay")) return imageCatalog.relay;
  if (n.includes("motor")) return imageCatalog.dcmotor;
  if (n.includes("servo")) return imageCatalog.servo;
  if (n.includes("breadboard")) return imageCatalog.breadboard;
  if (n.includes("ic") || n.includes("7805") || n.includes("4440") || n.includes("chip") || n.includes("regulator")) return imageCatalog.psuModule;
  if (n.includes("bluetooth")) return imageCatalog.bluetoothModule;

  // 3. TV Accessories
  if (n.includes("remote")) return imageCatalog.remote;
  if (n.includes("hdmi")) return imageCatalog.hdmiCable;
  if (n.includes("splitter")) return imageCatalog.hdmiSplitter;
  if (n.includes("switch")) return imageCatalog.hdmiSwitch;
  if (n.includes("optical") || n.includes("toslink")) return imageCatalog.opticalCable;
  if (n.includes("converter") || n.includes("av ")) return imageCatalog.avConverter;
  if (n.includes("displayport") || n.includes("dp ")) return imageCatalog.displayport;
  if (n.includes("wallmount") || n.includes("bracket")) return imageCatalog.wallmount;
  if (n.includes("keyboard")) return imageCatalog.tvKeyboard;
  if (n.includes("streaming") || n.includes("dongle")) return imageCatalog.streamingAdapter;

  // 4. IoT & Microcontrollers
  if (n.includes("esp32") || n.includes("esp8266")) return imageCatalog.esp32;
  if (n.includes("nodemcu")) return imageCatalog.nodemcu;
  if (n.includes("uno")) return imageCatalog.uno;
  if (n.includes("nano")) return imageCatalog.nano;
  if (n.includes("pi") || n.includes("raspberry")) return imageCatalog.piAdapter;
  if (n.includes("ultrasonic")) return imageCatalog.ultrasonic;
  if (n.includes("sensor") || n.includes("pir")) return imageCatalog.pir;

  // 5. Repair Kits
  if (n.includes("solder") || n.includes("iron") || n.includes("station")) return imageCatalog.solderingStation;
  if (n.includes("meter") || n.includes("tester")) return imageCatalog.multimeter;
  if (n.includes("desolder") || n.includes("pump") || n.includes("sucker")) return imageCatalog.desolderPump;
  if (n.includes("tweezer")) return imageCatalog.tweezers;
  if (n.includes("heat") || n.includes("gun")) return imageCatalog.heatGun;
  if (n.includes("screwdriver") || n.includes("driver")) return imageCatalog.screwdriverSet;
  if (n.includes("pry")) return imageCatalog.pryTools;
  if (n.includes("wire")) return imageCatalog.solderWire;
  if (n.includes("mat") || n.includes("antistatic") || n.includes("esd")) return imageCatalog.antistatic;
  if (n.includes("tool")) return imageCatalog.repairToolkit;

  // Fallback: Pick deterministically from pool using uniqueKey or name hash
  const defaultPool = [
    imageCatalog.psuModule,
    imageCatalog.capacitorKit,
    imageCatalog.resistorKit,
    imageCatalog.ledKit,
    imageCatalog.relay,
    imageCatalog.dcmotor,
    imageCatalog.usbcCable,
    imageCatalog.powerbank,
  ];
  const pool = categoryImagePools[category] ?? defaultPool;
  let hash = 0;
  const str = uniqueKey || name;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % pool.length;
  return pool[index] ?? imageCatalog.psuModule;
}

/**
 * Helper to convert an InTouch ERP product into the store's Product format
 */
export function mapInTouchProductToStoreProduct(
  item: InTouchProduct,
  defaultCategory?: string,
  categoryMarkupMap?: Record<string, number>,
  productOverridesMap?: Record<
    string,
    {
      overridePrice?: number | null;
      isOverridden?: boolean;
      image?: string | null;
      categoryId?: string;
      name?: string;
      stock?: number;
    }
  >,
): Product {
  const purchasePrice = parseFloat(item.purchase_price || "0");
  const rawSellingPrice = parseFloat(item.selling_price || "0");
  const basePrice = purchasePrice > 0 ? purchasePrice : rawSellingPrice;

  const stockQty = parseFloat(item.stock_qty || "0");
  const computedStock = !isNaN(stockQty)
    ? Math.max(0, Math.floor(stockQty))
    : item.enable_stock === "1"
      ? 10
      : 0;

  // Check manual override from admin catalog store
  const catalogOverride =
    productOverridesMap?.[item.sku] ||
    (item.sub_sku ? productOverridesMap?.[item.sub_sku] : undefined) ||
    productOverridesMap?.[item.product_id];

  const displayName = catalogOverride?.name || item.product_name;
  const category = catalogOverride?.categoryId || defaultCategory || detectCategory(displayName);

  // Apply Category-Based Margin Percentage (e.g. 20%)
  const markupPercentage = categoryMarkupMap?.[category] ?? (categoryMarkupMap?.["default"] || 20);
  const markupAmount = Math.round(((basePrice * markupPercentage) / 100) * 100) / 100;
  const ruleCalculatedPrice = Math.round((basePrice + markupAmount) * 100) / 100;

  let displayPrice = ruleCalculatedPrice;

  if (catalogOverride?.isOverridden && catalogOverride.overridePrice != null && catalogOverride.overridePrice > 0) {
    displayPrice = catalogOverride.overridePrice;
  }

  const image =
    (catalogOverride?.image && catalogOverride.image.trim() !== "" ? catalogOverride.image : null) ||
    selectProductImage(displayName, category, item.sub_sku || item.sku || item.product_id);

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
    blurb: `${displayName} (${item.unit || "unit"}). Genuine SKU: ${item.sub_sku || item.sku}`,
    specs: [
      { label: "SKU", value: item.sku },
      { label: "Availability", value: "In Stock" },
      ...(item.sub_sku && item.sub_sku !== item.sku ? [{ label: "Variation SKU", value: item.sub_sku }] : []),
      ...(item.variation_name ? [{ label: "Variation", value: item.variation_name }] : []),
      { label: "Unit", value: item.unit || "Pc(s)" },
      { label: "Type", value: item.type },
    ],
    rating: 4.8,
    reviews: 0,
    stock: catalogOverride?.stock ?? computedStock,
  };
}
