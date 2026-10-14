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

async function setViewport(width, height) {
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 2,
    mobile: width < 768,
  });
  await new Promise(r => setTimeout(r, 300));
}

async function checkOverflow(urlName) {
  const result = await evaluate(`
    (() => {
      const docWidth = document.documentElement.scrollWidth;
      const winWidth = window.innerWidth;
      const hasHorizontalScroll = docWidth > winWidth + 1; // 1px tolerance
      
      const overflowingElements = [];
      document.querySelectorAll("*").forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.right > winWidth + 2 && rect.width > 0) {
          overflowingElements.push({
            tag: el.tagName.toLowerCase(),
            className: el.className ? String(el.className).slice(0, 50) : "",
            rectRight: Math.round(rect.right),
            winWidth: winWidth
          });
        }
      });

      return {
        url: window.location.pathname,
        docWidth,
        winWidth,
        hasHorizontalScroll,
        overflowCount: overflowingElements.length,
        sampleOverflows: overflowingElements.slice(0, 3)
      };
    })()
  `);
  return result.result.value;
}

ws.onopen = async () => {
  try {
    await send("Runtime.enable");
    await send("Page.enable");

    console.log("=========================================");
    console.log("RESPONSIVE WEB DESIGN (RWD) AUDIT");
    console.log("=========================================");

    const viewports = [
      { name: "Mobile (iPhone SE)", width: 375, height: 667 },
      { name: "Mobile (iPhone 14 Pro)", width: 393, height: 852 },
      { name: "Tablet (iPad Portrait)", width: 768, height: 1024 },
      { name: "Desktop (Laptop)", width: 1280, height: 800 }
    ];

    const routes = [
      { path: "/", name: "Homepage" },
      { path: "/shop", name: "Shop / Catalog" },
      { path: "/category/mobile-accessories", name: "Category Page" },
      { path: "/cart", name: "Cart" },
      { path: "/checkout", name: "Checkout" },
      { path: "/admin", name: "Admin Dashboard (PWA)" }
    ];

    const auditResults = [];

    for (const vp of viewports) {
      console.log("\n--- Testing Viewport: " + vp.name + " (" + vp.width + "x" + vp.height + ") ---");
      await setViewport(vp.width, vp.height);

      for (const route of routes) {
        await send("Page.navigate", { url: "http://localhost:8080" + route.path });
        await new Promise(r => setTimeout(r, 1200));

        const res = await checkOverflow(route.name);
        const pass = !res.hasHorizontalScroll;
        console.log("  " + (pass ? "PASS" : "FAIL") + ": " + route.name + " [" + route.path + "] - ScrollWidth: " + res.docWidth + "px / Viewport: " + res.winWidth + "px");
        if (!pass) {
          console.log("    Overflow details:", JSON.stringify(res.sampleOverflows));
        }

        auditResults.push({
          viewport: vp.name,
          width: vp.width,
          route: route.name,
          path: route.path,
          pass,
          docWidth: res.docWidth,
          winWidth: res.winWidth,
          overflows: res.sampleOverflows
        });
      }
    }

    // Reset back to desktop standard
    await setViewport(1280, 800);

    const failures = auditResults.filter(r => !r.pass);
    console.log("\n=========================================");
    console.log("AUDIT SUMMARY: " + (auditResults.length - failures.length) + "/" + auditResults.length + " checks PASSED");
    console.log("=========================================");

    if (failures.length > 0) {
      console.log("Failed checks:", JSON.stringify(failures, null, 2));
    }

    ws.close();
    process.exit(failures.length > 0 ? 1 : 0);
  } catch (err) {
    console.error("Error during RWD audit:", err);
    ws.close();
    process.exit(1);
  }
};
