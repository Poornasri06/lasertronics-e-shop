import fs from "node:fs";

async function testSync() {
  console.log("Fetching live products from InTouch ERP POS...");
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
  console.log("Success:", json.success, "Total ERP items:", json.data?.length);

  const inStock = json.data.filter((p) => {
    const qty = parseFloat(p.stock_qty || "0");
    const price = parseFloat(p.selling_price || "0");
    return qty > 0 && price > 0 && p.product_name && p.product_name.trim();
  });

  console.log("In-Stock items (> 0 qty, > 0 price):", inStock.length);

  function detectCategory(name) {
    const lower = name.toLowerCase();
    if (/solder|iron|toolkit|driver|tweezer|desolder|pump|station|flux|paste|cutter|plier|magnif|mat|antistatic|pry/.test(lower)) return "repair-kits";
    if (/esp32|esp8266|arduino|nodemcu|uno|nano|mega|stm32|raspberry|pi|sensor|ultrasonic|dht|pir|relay|servo|step|motor|oled|lcd|module|iot/.test(lower)) return "iot-and-microcontrollers";
    if (/tv|remote|hdmi|av|displayport|vga|optical|splitter|switch|converter|wallmount|bracket/.test(lower)) return "tv-accessories";
    if (/cable|charger|power bank|powerbank|earbuds|headphone|holder|stand|magsafe|battery|usb|type-c|lightning/.test(lower)) return "mobile-accessories";
    return "electronics";
  }

  const categoryCounts = {};
  for (const item of inStock) {
    const cat = detectCategory(item.product_name);
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  }
  console.log("Category breakdown for in-stock POS items:", categoryCounts);
}

testSync().catch(console.error);
