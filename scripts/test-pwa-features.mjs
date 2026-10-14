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
  return send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
}

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASS: ${message}`);
}

ws.onopen = async () => {
  try {
    await send("Runtime.enable");
    await send("Page.enable");
    await send("Network.enable");

    console.log("\n=======================================================");
    console.log("🚀 STARTING PROGRESSIVE WEB APP (PWA) VERIFICATION SUITE");
    console.log("=======================================================\n");

    // 1. Test Manifest & Icons HTTP status
    console.log("--- 1. Testing Manifest & PWA Icons Loading ---");
    const manifestRes = await fetch("http://localhost:8080/manifest.webmanifest");
    assert(manifestRes.status === 200, `manifest.webmanifest returns HTTP 200 (got ${manifestRes.status})`);
    
    const manifestJson = await manifestRes.json();
    assert(manifestJson.name === "Lasertronics E-Shop", `Manifest name is "Lasertronics E-Shop" (got ${manifestJson.name})`);
    assert(manifestJson.short_name === "Lasertronics", `Manifest short_name is "Lasertronics" (got ${manifestJson.short_name})`);
    assert(manifestJson.display === "standalone", `Manifest display mode is "standalone"`);
    assert(manifestJson.start_url === "/", `Manifest start_url is "/"`);
    assert(manifestJson.icons.length >= 4, `Manifest specifies at least 4 icon configurations (got ${manifestJson.icons.length})`);

    const icon192Res = await fetch("http://localhost:8080/icon-192.png");
    assert(icon192Res.status === 200, `icon-192.png returns HTTP 200`);

    const icon512Res = await fetch("http://localhost:8080/icon-512.png");
    assert(icon512Res.status === 200, `icon-512.png returns HTTP 200`);

    const appleIconRes = await fetch("http://localhost:8080/apple-touch-icon.png");
    assert(appleIconRes.status === 200, `apple-touch-icon.png returns HTTP 200`);

    const offlinePageRes = await fetch("http://localhost:8080/offline.html");
    assert(offlinePageRes.status === 200, `offline.html returns HTTP 200`);

    // 2. Test Service Worker Registration in Browser
    console.log("\n--- 2. Testing Service Worker Registration in Browser ---");
    await send("Page.navigate", { url: "http://localhost:8080/" });
    await new Promise(r => setTimeout(r, 2000));

    const swCheck = await evaluate(`
      (async () => {
        if (!("serviceWorker" in navigator)) return { supported: false };
        const regs = await navigator.serviceWorker.getRegistrations();
        return {
          supported: true,
          registeredCount: regs.length,
          activeScope: regs[0]?.scope,
          state: regs[0]?.active?.state || regs[0]?.installing?.state || "waiting"
        };
      })()
    `);
    console.log("Service Worker State:", swCheck.result.value);
    assert(swCheck.result.value.supported === true, "Browser supports Service Workers");

    // 3. Test PWA Meta Tags in DOM
    console.log("\n--- 3. Testing PWA Meta & Link Tags in Head ---");
    const metaCheck = await evaluate(`
      (() => {
        const manifestLink = document.querySelector("link[rel='manifest']")?.getAttribute("href");
        const themeColor = document.querySelector("meta[name='theme-color']")?.getAttribute("content");
        const appleMobileCapable = document.querySelector("meta[name='apple-mobile-web-app-capable']")?.getAttribute("content");
        const appleIcon = document.querySelector("link[rel='apple-touch-icon']")?.getAttribute("href");
        
        return {
          manifestLink,
          themeColor,
          appleMobileCapable,
          appleIcon,
        };
      })()
    `);
    console.log("DOM Head PWA tags:", metaCheck.result.value);
    assert(metaCheck.result.value.manifestLink === "/manifest.webmanifest", "rel=manifest points to /manifest.webmanifest");
    assert(metaCheck.result.value.themeColor === "#0A192F", "theme-color is #0A192F");
    assert(metaCheck.result.value.appleMobileCapable === "yes", "apple-mobile-web-app-capable is yes");

    // 4. Test Install Button in Header
    console.log("\n--- 4. Testing 'Install App' Header & Navigation Controls ---");
    const installBtnCheck = await evaluate(`
      (() => {
        const installBtns = Array.from(document.querySelectorAll("button")).filter(b => 
          b.innerText.toLowerCase().includes("install") || b.getAttribute("aria-label")?.includes("Install")
        );
        return {
          foundButtons: installBtns.length,
          buttonLabels: installBtns.map(b => b.innerText.trim()).filter(Boolean)
        };
      })()
    `);
    console.log("Install Buttons Found:", installBtnCheck.result.value);
    assert(installBtnCheck.result.value.foundButtons >= 1, "Install App button rendered in UI");

    // 5. Test Online / Offline Handling Simulation
    console.log("\n--- 5. Testing Offline Emulation & Status Banner ---");

    // Seed item in cart and warm up checkout route while online
    await evaluate(`
      localStorage.setItem("lasertronics-cart-v1", JSON.stringify([{ slug: "w-green-3mm-super-13069", qty: 2 }]));
    `);
    await send("Page.navigate", { url: "http://localhost:8080/checkout" });
    await new Promise(r => setTimeout(r, 1500));

    // Now emulate network offline
    await send("Network.emulateNetworkConditions", {
      offline: true,
      latency: 0,
      downloadThroughput: 0,
      uploadThroughput: 0
    });
    // Trigger offline event in browser
    await evaluate(`window.dispatchEvent(new Event("offline"));`);
    await new Promise(r => setTimeout(r, 800));

    const offlineBannerCheck = await evaluate(`
      (() => {
        const bodyText = document.body.innerText;
        const hasOfflineText = bodyText.includes("Offline Mode") || bodyText.includes("browsing cached catalog");
        return { hasOfflineText };
      })()
    `);
    console.log("Offline Banner Triggered:", offlineBannerCheck.result.value);
    assert(offlineBannerCheck.result.value.hasOfflineText === true, "PWA Offline Banner displays when disconnected");

    const checkoutOfflineCheck = await evaluate(`
      (() => {
        const submitBtn = document.querySelector("button[type='submit']");
        const heading = document.querySelector("h1, h2")?.innerText;
        return {
          currentUrl: window.location.href,
          heading,
          hasSubmitBtn: Boolean(submitBtn),
          isDisabled: submitBtn?.disabled,
          btnText: submitBtn?.innerText?.trim(),
          bodySnippet: document.body.innerText.slice(0, 200)
        };
      })()
    `);
    console.log("Checkout Offline Safety Check:", checkoutOfflineCheck.result.value);
    assert(checkoutOfflineCheck.result.value.hasSubmitBtn === true, "Submit button exists on checkout");
    assert(checkoutOfflineCheck.result.value.isDisabled === true, "Checkout submission safely disabled while offline");

    // 6. Restore Online Connection
    console.log("\n--- 6. Restoring Online Connectivity ---");
    await send("Network.emulateNetworkConditions", {
      offline: false,
      latency: 0,
      downloadThroughput: -1,
      uploadThroughput: -1
    });
    await evaluate(`window.dispatchEvent(new Event("online"));`);
    await new Promise(r => setTimeout(r, 800));

    const restoredCheck = await evaluate(`
      (() => {
        const submitBtn = document.querySelector("button[type='submit']");
        return {
          isDisabled: submitBtn?.disabled,
          btnText: submitBtn?.innerText?.trim()
        };
      })()
    `);
    console.log("Restored Checkout Button:", restoredCheck.result.value);
    assert(restoredCheck.result.value.isDisabled === false, "Checkout button re-enabled when back online");

    // 7. Verify Admin Dashboard PWA integration & Live vs Offline indicator
    console.log("\n--- 7. Testing Admin Dashboard PWA Integration ---");
    await send("Page.navigate", { url: "http://localhost:8080/admin" });
    await new Promise(r => setTimeout(r, 1500));

    const adminPwaCheck = await evaluate(`
      (() => {
        const livePill = Array.from(document.querySelectorAll("span, div")).find(el => 
          el.innerText.includes("Live Catalog Connected") || el.innerText.includes("Offline / Local Mode")
        )?.innerText;

        const hasInstallAdminBtn = Array.from(document.querySelectorAll("button")).some(b => 
          b.innerText.includes("Install")
        );

        return {
          liveStatusPill: livePill,
          hasInstallAdminBtn
        };
      })()
    `);
    console.log("Admin Dashboard PWA Check:", adminPwaCheck.result.value);
    assert(Boolean(adminPwaCheck.result.value.liveStatusPill), "Admin status indicator clearly shows connectivity");

    // 8. Capture PWA Verification Screenshot
    const screenshot = await send("Page.captureScreenshot", { format: "png" });
    const buffer = Buffer.from(screenshot.data, "base64");
    fs.writeFileSync("C:/Users/abdva/.gemini/antigravity-ide/brain/7d9c9622-9a06-45a5-b38c-6f5ac261fa35/pwa_live_verified.png", buffer);
    console.log("📸 Screenshot saved to artifacts/pwa_live_verified.png");

    console.log("\n=======================================================");
    console.log("🎉 ALL PWA CHECKS PASSED SUCCESSFULLY!");
    console.log("=======================================================\n");

    ws.close();
    process.exit(0);
  } catch (err) {
    console.error("Error in PWA test:", err);
    ws.close();
    process.exit(1);
  }
};
