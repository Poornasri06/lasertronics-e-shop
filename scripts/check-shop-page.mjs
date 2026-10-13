const res = await fetch("http://127.0.0.1:9222/json");
const pages = await res.json();
const p = pages.find((p) => p.url.includes("8080"));
const ws = new WebSocket(p.webSocketDebuggerUrl);

ws.onopen = async () => {
  ws.send(JSON.stringify({ id: 1, method: "Page.navigate", params: { url: "http://localhost:8080/shop" } }));
};

ws.onmessage = async (e) => {
  const d = JSON.parse(e.data);
  if (d.id === 1) {
    setTimeout(() => {
      ws.send(JSON.stringify({
        id: 2,
        method: "Runtime.evaluate",
        params: {
          expression: `(() => {
            const cards = document.querySelectorAll("a[href*='/product/']");
            const titles = Array.from(document.querySelectorAll("h3")).map(h => h.innerText);
            return {
              productCardsCount: cards.length,
              sampleTitles: titles.slice(0, 8),
            };
          })()`,
          returnByValue: true
        }
      }));
    }, 1500);
  } else if (d.id === 2) {
    console.log("Shop Page Result:", JSON.stringify(d.result.result.value, null, 2));
    ws.close();
    process.exit(0);
  }
};
