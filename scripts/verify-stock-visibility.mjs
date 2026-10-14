import fs from "node:fs";

const res = await fetch("http://127.0.0.1:9222/json");
const pages = await res.json();
let targetPage = pages.find((p) => p.url.includes("8080"));

if (!targetPage) {
  console.error("No 8080 page found. Available pages:", pages.map(p => p.url));
  process.exit(1);
}

const ws = new WebSocket(targetPage.webSocketDebuggerUrl);

function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = Math.floor(Math.random() * 1000000);
    const handler = (evt) => {
      const data = JSON.parse(evt.data);
      if (data.id === id) {
        ws.removeEventListener("message", handler);
        if (data.error) reject(data.error);
        else resolve(data.result);
      }
    };
    ws.addEventListener("message", handler);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

function evaluate(expression) {
  return send("Runtime.evaluate", { expression, returnByValue: true });
}

ws.onopen = async () => {
  try {
    await send("Runtime.enable");
    await send("Page.enable");

    // 1. Check Shop Page
    console.log("Navigating to http://localhost:8080/shop...");
    await send("Page.navigate", { url: "http://localhost:8080/shop" });
    await new Promise((r) => setTimeout(r, 2000));

    const shopInspection = await evaluate(`
      (() => {
        const productLinks = Array.from(document.querySelectorAll("a[href*='/product/']"));
        const firstLink = productLinks[0]?.getAttribute("href");
        const bodyText = document.body.innerText;
        const mentionsUnits = /\\d+\\s+units/i.test(bodyText);
        const mentionsStockCount = /in stock\\s*•\\s*\\d+/i.test(bodyText);

        return {
          totalProductLinks: productLinks.length,
          firstProductHref: firstLink,
          mentionsUnits,
          mentionsStockCount,
        };
      })()
    `);
    console.log("Shop Page Inspection:", JSON.stringify(shopInspection.result.value, null, 2));

    const productHref = shopInspection.result.value.firstProductHref || "/product/0.0018uf2kv-capacitor";
    const productUrl = "http://localhost:8080" + productHref;

    // 2. Check Product Detail Page
    console.log("Navigating to " + productUrl + "...");
    await send("Page.navigate", { url: productUrl });
    await new Promise((r) => setTimeout(r, 2000));

    const productInspection = await evaluate(`
      (() => {
        const title = document.querySelector("h1")?.innerText;
        const bodyText = document.body.innerText;
        
        // Check for stock badge / text
        const stockElements = Array.from(document.querySelectorAll("div, span, p"))
          .map(el => el.innerText.trim())
          .filter(t => t.toLowerCase().includes("in stock"));

        // Check if any numbers like "45 units", "45 in stock", "Available Stock: 45" exist
        const hasNumberInStockText = /in stock\\s*•?\\s*\\d+/i.test(bodyText) || /\\d+\\s+units\\s+available/i.test(bodyText);
        const hasAvailableStockNumber = /available stock\\s*\\d+/i.test(bodyText);

        // Check specs dl
        const specsList = Array.from(document.querySelectorAll("dl div")).map(row => {
          const dt = row.querySelector("dt")?.innerText?.trim();
          const dd = row.querySelector("dd")?.innerText?.trim();
          return { [dt]: dd };
        });

        return {
          title,
          stockTexts: Array.from(new Set(stockElements)).slice(0, 3),
          hasNumberInStockText,
          hasAvailableStockNumber,
          specsSample: specsList.slice(0, 5),
        };
      })()
    `);
    console.log("Product Page Inspection:", JSON.stringify(productInspection.result.value, null, 2));

    // Capture screenshot of product page
    const screenshot = await send("Page.captureScreenshot", { format: "png" });
    const buffer = Buffer.from(screenshot.data, "base64");
    fs.writeFileSync("C:/Users/abdva/lasertronics-e-shop-1/product_stock_verified.png", buffer);
    console.log("📸 Screenshot saved to product_stock_verified.png");

    ws.close();
    process.exit(0);
  } catch (err) {
    console.error("Error during verification:", err);
    ws.close();
    process.exit(1);
  }
};
