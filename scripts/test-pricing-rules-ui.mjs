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

    console.log("Navigating to http://localhost:8080/admin...");
    await send("Page.navigate", { url: "http://localhost:8080/admin" });
    await new Promise((r) => setTimeout(r, 2000));

    // Click on Pricing Rules Tab
    console.log("Clicking Pricing Rules Tab...");
    await evaluate(`
      (() => {
        const tabs = Array.from(document.querySelectorAll("button"));
        const pricingTab = tabs.find(t => t.innerText.includes("Pricing Rules"));
        if (pricingTab) pricingTab.click();
      })()
    `);
    await new Promise((r) => setTimeout(r, 1000));

    // Inspect Pricing Rules tab UI elements
    const tabDetails = await evaluate(`
      (() => {
        const title = document.querySelector("h3")?.innerText;
        const bulkBar = Array.from(document.querySelectorAll("span")).some(s => s.innerText.includes("Bulk Margin Setup"));
        const presetButtons = Array.from(document.querySelectorAll("button")).filter(b => ["10%", "15%", "20%", "25%", "30%"].includes(b.innerText.trim())).map(b => b.innerText.trim());
        const categoryRows = Array.from(document.querySelectorAll("tbody tr")).map(tr => {
          const catName = tr.querySelector("td:nth-child(1)")?.innerText?.split("\\n")[0];
          const customVal = tr.querySelector("td:nth-child(3) input")?.value;
          const calculatedPrice = tr.querySelector("td:nth-child(5)")?.innerText?.split("\\n")[0];
          return { catName, customVal, calculatedPrice };
        });

        return {
          title,
          hasBulkBar: bulkBar,
          presetButtonCount: presetButtons.length,
          categories: categoryRows.slice(0, 5)
        };
      })()
    `);
    console.log("Pricing Rules Tab Details:", JSON.stringify(tabDetails.result.value, null, 2));

    // Test clicking 20% on the first category
    console.log("Testing click 20% margin preset for first category...");
    await evaluate(`
      (() => {
        const firstRow = document.querySelector("tbody tr");
        if (firstRow) {
          const btn20 = Array.from(firstRow.querySelectorAll("button")).find(b => b.innerText.trim() === "20%");
          if (btn20) btn20.click();
        }
      })()
    `);
    await new Promise((r) => setTimeout(r, 1200));

    const updatedRow = await evaluate(`
      (() => {
        const firstRow = document.querySelector("tbody tr");
        const catName = firstRow?.querySelector("td:nth-child(1)")?.innerText?.split("\\n")[0];
        const customVal = firstRow?.querySelector("td:nth-child(3) input")?.value;
        const calculatedPrice = firstRow?.querySelector("td:nth-child(5)")?.innerText;
        return { catName, customVal, calculatedPrice };
      })()
    `);
    console.log("After clicking 20% on Category:", JSON.stringify(updatedRow.result.value, null, 2));

    // Capture screenshot
    const screenshot = await send("Page.captureScreenshot", { format: "png" });
    const buffer = Buffer.from(screenshot.data, "base64");
    fs.writeFileSync("C:/Users/abdva/lasertronics-e-shop-1/pricing_rules_verified.png", buffer);
    console.log("📸 Screenshot saved to pricing_rules_verified.png");

    ws.close();
    process.exit(0);
  } catch (err) {
    console.error("Error in verification:", err);
    ws.close();
    process.exit(1);
  }
};
