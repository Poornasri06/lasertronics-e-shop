const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf-8');
const lines = env.split(/\r?\n/);
const vars = {};
lines.forEach(l => {
  const parts = l.split('=');
  const k = parts[0]?.trim();
  const v = parts.slice(1).join('=').trim().replace(/^["']|["']$/g, '');
  if (k) vars[k] = v;
});

async function run() {
  const endpoint = vars.INTOUCH_API_BASE_URL.replace(/\/+$/, '') + '/GatAllProducts';
  console.log('Testing endpoint:', endpoint);
  const form = new URLSearchParams({
    webipan: vars.INTOUCH_WEBIPAN,
    clientid: vars.INTOUCH_CLIENT_ID,
    clientsecret: vars.INTOUCH_CLIENT_SECRET
  });
  
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json' },
    body: form.toString()
  });

  console.log('Status code:', res.status);
  const json = await res.json();
  console.log('Response success:', json.success, 'Items count:', Array.isArray(json.data) ? json.data.length : 'not array');
  if (Array.isArray(json.data) && json.data.length > 0) {
    console.log('First 5 real items from Lasertronics InTouch ERP:');
    console.log(JSON.stringify(json.data.slice(0, 5), null, 2));
  }
}

run().catch(console.error);
