const res = await fetch("http://127.0.0.1:9222/json");
const pages = await res.json();
const p = pages.find(p => p.url.includes("8080"));
const ws = new WebSocket(p.webSocketDebuggerUrl);

ws.onopen = () => {
  ws.send(JSON.stringify({
    id: 1,
    method: "Runtime.evaluate",
    params: {
      expression: `(() => {
        const headings = Array.from(document.querySelectorAll("h2, h3")).map(h => h.innerText);
        const productLinks = Array.from(document.querySelectorAll("a[href*='/product/']")).map(a => a.href);
        const newArrivalsSection = Array.from(document.querySelectorAll("section")).find(s => s.innerText.includes("New Arrivals"));
        const rails = Array.from(document.querySelectorAll("section")).filter(s => s.innerText.includes("View All"));
        return {
          headings,
          productLinksCount: productLinks.length,
          productLinks: productLinks.slice(0, 5),
          newArrivalsText: newArrivalsSection ? newArrivalsSection.innerText.slice(0, 300) : "Not found",
          railsCount: rails.length,
        };
      })()`,
      returnByValue: true
    }
  }));
};

ws.onmessage = (e) => {
  console.log(JSON.stringify(JSON.parse(e.data).result.result.value, null, 2));
  ws.close();
  process.exit(0);
};
