const res = await fetch("http://127.0.0.1:9222/json");
const pages = await res.json();
const adminPage = pages.find((p) => p.url.includes("/admin"));

if (!adminPage) {
  console.log("No admin page found. Open pages:", pages);
  process.exit(1);
}

console.log("Connecting to page:", adminPage.id, adminPage.url);
const ws = new WebSocket(adminPage.webSocketDebuggerUrl);

ws.onopen = () => {
  ws.send(JSON.stringify({ id: 1, method: "Runtime.enable" }));
  ws.send(JSON.stringify({ id: 2, method: "Log.enable" }));
  ws.send(JSON.stringify({ id: 3, method: "Page.enable" }));
  
  // Reload the page to catch all initialization logs and hydration errors
  setTimeout(() => {
    console.log("Reloading admin page to capture console errors during hydration...");
    ws.send(JSON.stringify({ id: 4, method: "Page.reload" }));
  }, 500);
};

ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  if (msg.method === "Runtime.consoleAPICalled") {
    console.log(`[CONSOLE ${msg.params.type}]:`, msg.params.args?.map((a) => a.value || a.description).join(" "));
  } else if (msg.method === "Runtime.exceptionThrown") {
    console.log("[RUNTIME EXCEPTION]:", JSON.stringify(msg.params.exceptionDetails, null, 2));
  } else if (msg.method === "Log.entryAdded") {
    console.log("[LOG ENTRY]:", msg.params.entry);
  }
};

setTimeout(() => {
  console.log("Done listening.");
  ws.close();
  process.exit(0);
}, 6000);
