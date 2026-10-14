import fs from "node:fs";
import path from "node:path";

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

ws.onopen = async () => {
  try {
    await send("Runtime.enable");

    // Read the logo image file as base64
    const logoBuffer = fs.readFileSync("c:/Users/abdva/lasertronics-e-shop-1/src/assets/logo.jpg");
    const logoBase64 = "data:image/jpeg;base64," + logoBuffer.toString("base64");

    const generateIcon = async (size, isMaskable = false) => {
      const expr = `
        (async () => {
          const img = new Image();
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = "${logoBase64}";
          });

          const canvas = document.createElement("canvas");
          canvas.width = ${size};
          canvas.height = ${size};
          const ctx = canvas.getContext("2d");

          // Background
          ctx.fillStyle = "#0A192F"; // Lasertronics Navy Brand
          ctx.fillRect(0, 0, ${size}, ${size});

          // Gradient circle
          const grad = ctx.createLinearGradient(0, 0, ${size}, ${size});
          grad.addColorStop(0, "#0878D1");
          grad.addColorStop(1, "#0055B5");
          ctx.fillStyle = grad;
          
          const padding = ${isMaskable} ? ${size} * 0.15 : ${size} * 0.08;
          const iconSize = ${size} - (padding * 2);

          // Draw circle backing
          ctx.beginPath();
          ctx.arc(${size} / 2, ${size} / 2, iconSize / 2, 0, Math.PI * 2);
          ctx.fill();

          // Draw circular clipped logo
          ctx.save();
          ctx.beginPath();
          ctx.arc(${size} / 2, ${size} / 2, (iconSize / 2) - 4, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(img, padding + 4, padding + 4, iconSize - 8, iconSize - 8);
          ctx.restore();

          return canvas.toDataURL("image/png");
        })()
      `;

      const result = await evaluate(expr);
      const dataUrl = result.result.value;
      const base64Data = dataUrl.replace(/^data:image\/png;base64,/, "");
      return Buffer.from(base64Data, "base64");
    };

    console.log("Generating PWA icons...");
    const publicDir = "c:/Users/abdva/lasertronics-e-shop-1/public";

    // 192x192 standard
    const icon192 = await generateIcon(192, false);
    fs.writeFileSync(path.join(publicDir, "icon-192.png"), icon192);
    console.log("✅ Created public/icon-192.png");

    // 512x512 standard
    const icon512 = await generateIcon(512, false);
    fs.writeFileSync(path.join(publicDir, "icon-512.png"), icon512);
    console.log("✅ Created public/icon-512.png");

    // 192x192 maskable
    const iconMaskable192 = await generateIcon(192, true);
    fs.writeFileSync(path.join(publicDir, "icon-maskable-192.png"), iconMaskable192);
    console.log("✅ Created public/icon-maskable-192.png");

    // 512x512 maskable
    const iconMaskable512 = await generateIcon(512, true);
    fs.writeFileSync(path.join(publicDir, "icon-maskable-512.png"), iconMaskable512);
    console.log("✅ Created public/icon-maskable-512.png");

    // Apple touch icon 180x180
    const appleTouchIcon = await generateIcon(180, false);
    fs.writeFileSync(path.join(publicDir, "apple-touch-icon.png"), appleTouchIcon);
    console.log("✅ Created public/apple-touch-icon.png");

    ws.close();
    process.exit(0);
  } catch (err) {
    console.error("Error generating icons:", err);
    ws.close();
    process.exit(1);
  }
};
