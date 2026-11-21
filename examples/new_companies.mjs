// Newly approved Taiwan companies in Taipei with capital >= 10M TWD. Usage: node new_companies.mjs
const BASE = "https://api.easylifehub.net/tw";
const headers = process.env.TW_API_KEY ? { "x-api-key": process.env.TW_API_KEY } : {};
const from = new Date(Date.now() - 30 * 864e5).toISOString().slice(0, 10);
const r = await fetch(`${BASE}/v1/filings/setup?from=${from}&city=臺北市&min_capital=10000000&limit=20`, { headers });
const data = await r.json();
for (const f of data.items ?? data.results ?? []) console.log(f.date ?? f.approved_date, f.ban, f.name, f.capital_twd);
