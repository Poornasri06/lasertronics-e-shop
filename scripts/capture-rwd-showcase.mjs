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

async function setViewport(width, height) {
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 2,
    mobile: width < 768,
  });
  await new Promise(r => setTimeout(r, 400));
}

async function capture(url, filename, width, height) {
  await setViewport(width, height);
  await send("Page.navigate", { url });
  await new Promise(r => setTimeout(r, 1500));
  const screenshot = await send("Page.captureScreenshot", { format: "png" });
  const buffer = Buffer.from(screenshot.data, "base64");
  const destPath = "C:/Users/abdva/.gemini/antigravity-ide/brain/7d9c9622-9a06-45a5-b38c-6f5ac261fa35/" + filename;
  fs.writeFileSync(destPath, buffer);
  console.log("📸 Saved " + filename + " (" + width + "x" + height + ")");
}

ws.onopen = async () => {
  try {
    await send("Runtime.enable");
    await send("Page.enable");

    // 1. Mobile (iPhone 390x844) - Home
    await capture("http://localhost:8080/", "rwd_mobile_home.png", 390, 844);

    // 2. Mobile (iPhone 390x844) - Shop
    await capture("http://localhost:8080/shop", "rwd_mobile_shop.png", 390, 844);

    // 3. Tablet (iPad 768x1024) - Shop
    await capture("http://localhost:8080/shop", "rwd_tablet_shop.png", 768, 1024);

    // 4. Desktop (1280x800) - Shop
    await capture("http://localhost:8080/shop", "rwd_desktop_shop.png", 1280, 800);

    // Reset back to standard desktop
    await setViewport(1280, 800);

    ws.close();
    process.exit(0);
  } catch (err) {
    console.error("Error in capturing RWD showcase:", err);
    ws.close();
    process.exit(1);
  }
};
