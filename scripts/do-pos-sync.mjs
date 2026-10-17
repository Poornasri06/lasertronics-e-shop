import fs from "node:fs";
import path from "node:path";

async function run() {
  console.log("Connecting to InTouch POS ERP...");
  const endpoint = "https://shsx9584.intouchconnects.com/index.php/GatAllProducts";
  const params = new URLSearchParams({
    webipan: "dsfgdsg446fads2414dfs14521#((*&GHBADHS",
    clientid: "9edba68d-2fa4-4ade-b926-54a59fdbcd80",
    clientsecret: "e218b1a9-be1c-406a-abb6-d0abcadf375d",
  });

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: params.toString(),
  });

  const json = await response.json();
  if (!json.success || !Array.isArray(json.data)) {
    throw new Error("Failed to fetch from InTouch ERP");
  }

  const rawProducts = json.data;
  console.log("Total POS items fetched:", rawProducts.length);

  // Filter for items with stock > 0 and price > 0
  const inStock = rawProducts.filter((p) => {
    const qty = parseFloat(p.stock_qty || "0");
    const price = parseFloat(p.selling_price || "0");
    return qty > 0 && price > 0 && p.product_name && p.product_name.trim();
  });
  console.log("In-stock items with valid price:", inStock.length);

  // Load existing catalog-db.json
  const dbPath = path.resolve(process.cwd(), "src/data/catalog-db.json");
  let db = { categories: [], products: [], media: [], version: 1, lastUpdated: "" };
  if (fs.existsSync(dbPath)) {
    try {
      db = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
    } catch (e) {
      console.warn("Could not parse existing catalog-db.json, reinitializing");
    }
  }

  const existingMap = new Map();
  for (const p of db.products) {
    if (p.sku) existingMap.set(p.sku.toLowerCase(), p);
    if (p.slug) existingMap.set(p.slug.toLowerCase(), p);
  }

  const categoryMarkupMap = {
    "mobile-accessories": 20,
    "electronics": 15,
    "tv-accessories": 10,
    "iot-and-microcontrollers": 25,
    "repair-kits": 18,
  };
  for (const cat of db.categories) {
    categoryMarkupMap[cat.id] = cat.markupPercentage;
  }

  function detectCategory(name) {
    const lower = name.toLowerCase();
    if (/solder|iron|toolkit|driver|tweezer|desolder|pump|station|flux|paste|cutter|plier|magnif|mat|antistatic|pry/.test(lower)) return "repair-kits";
    if (/esp32|esp8266|arduino|nodemcu|uno|nano|mega|stm32|raspberry|pi|sensor|ultrasonic|dht|pir|relay|servo|step|motor|oled|lcd|module|iot/.test(lower)) return "iot-and-microcontrollers";
    if (/tv|remote|hdmi|av|displayport|vga|optical|splitter|switch|converter|wallmount|bracket/.test(lower)) return "tv-accessories";
    if (/cable|charger|power bank|powerbank|earbuds|headphone|holder|stand|magsafe|battery|usb|type-c|lightning/.test(lower)) return "mobile-accessories";
    return "electronics";
  }

  const categoryPools = {
    "mobile-accessories": ["/assets/p/usbc-cable.jpg", "/assets/p/powerbank.jpg", "/assets/p/gan-charger.jpg", "/assets/p/magsafe-powerbank.jpg"],
    "electronics": ["/assets/p/psu-module.jpg", "/assets/p/capacitor-kit.jpg", "/assets/p/resistor-kit.jpg", "/assets/p/led-kit.jpg", "/assets/p/relay.jpg"],
    "tv-accessories": ["/assets/p/hdmi-cable.jpg", "/assets/p/remote.jpg", "/assets/p/wallmount.jpg", "/assets/p/tv-keyboard.jpg"],
    "iot-and-microcontrollers": ["/assets/p/esp32.jpg", "/assets/p/nodemcu.jpg", "/assets/p/uno.jpg", "/assets/p/nano.jpg", "/assets/p/ultrasonic.jpg"],
    "repair-kits": ["/assets/p/soldering-station.jpg", "/assets/p/screwdriver-set.jpg", "/assets/p/multimeter.jpg", "/assets/p/desolder-pump.jpg"],
  };

  function selectImage(name, cat, key) {
    const pool = categoryPools[cat] || categoryPools["electronics"];
    let hash = 0;
    const str = key || name;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    const idx = Math.abs(hash) % pool.length;
    return pool[idx];
  }

  let added = 0;
  let updated = 0;
  const now = new Date().toISOString();
  const syncedProducts = [];

  for (const item of inStock) {
    const sku = item.sub_sku || item.sku || item.product_id;
    const existing = existingMap.get(sku.toLowerCase());

    const purchasePrice = parseFloat(item.purchase_price || "0");
    const rawSellingPrice = parseFloat(item.selling_price || "0");
    const basePrice = purchasePrice > 0 ? purchasePrice : rawSellingPrice;
    const stock = Math.max(0, Math.floor(parseFloat(item.stock_qty || "0")));

    const categoryId = existing?.categoryId || detectCategory(item.product_name);
    const markupPct = categoryMarkupMap[categoryId] || 15;

    let isPriceOverridden = existing?.isPriceOverridden || false;
    let overridePrice = existing?.overridePrice ?? null;
    let sellingPrice = 0;

    if (isPriceOverridden && overridePrice != null && overridePrice > 0) {
      sellingPrice = overridePrice;
    } else {
      const markupAmount = Math.round(((basePrice * markupPct) / 100) * 100) / 100;
      sellingPrice = Math.round((basePrice + markupAmount) * 100) / 100;
    }

    const cleanName = item.product_name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const skuPart = sku.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const slug = cleanName ? `${cleanName}-${skuPart}` : `prod-${skuPart}`;

    const image = existing?.image || selectImage(item.product_name, categoryId, sku);

    const record = {
      sku,
      slug,
      name: item.product_name,
      categoryId,
      basePrice,
      markupPercentage: markupPct,
      isPriceOverridden,
      overridePrice,
      sellingPrice,
      image,
      stock,
      blurb: `${item.product_name} (${item.unit || "unit"}). Genuine InTouch POS inventory. SKU: ${sku}`,
      specs: [
        { label: "SKU", value: sku },
        { label: "Unit", value: item.unit || "Pc(s)" },
        { label: "Availability", value: "In Stock" },
        ...(item.sub_sku && item.sub_sku !== item.sku ? [{ label: "Variation SKU", value: item.sub_sku }] : []),
        ...(item.variation_name ? [{ label: "Variation", value: item.variation_name }] : []),
      ],
      createdAt: existing?.createdAt || now,
      updatedAt: now,
    };

    if (existing) {
      updated++;
    } else {
      added++;
    }

    syncedProducts.push(record);
  }

  console.log(`Sync completed: ${added} added, ${updated} updated, total synced: ${syncedProducts.length}`);

  // Save to database
  db.products = syncedProducts;
  db.lastUpdated = now;
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), "utf-8");
  console.log("Successfully written synced products to src/data/catalog-db.json!");
  console.log("File size:", (fs.statSync(dbPath).size / (1024 * 1024)).toFixed(2), "MB");
}

run().catch(console.error);
