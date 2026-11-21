#!/usr/bin/env node
// Taiwan Company Data API 的 MCP 伺服器（stdio，零依賴）。
// 用法：TW_API_KEY=tw_... node mcp/server.mjs     （TW_API_BASE 預設 https://api.easylifehub.net/tw）
import { createInterface } from "node:readline";

const BASE = (process.env.TW_API_BASE ?? "https://api.easylifehub.net/tw").replace(/\/$/, "");
const KEY = process.env.TW_API_KEY ?? "";
const ban = { type: "string", pattern: "^\\d{8}$", description: "8-digit Taiwan company ID (統一編號)" };

const TOOLS = [
  { name: "tw_search_companies", description: "Search Taiwan companies by name fragment (Traditional Chinese) or 8-digit ID.", inputSchema: { type: "object", properties: { q: { type: "string" }, city: { type: "string" }, active: { type: "boolean" }, limit: { type: "integer", maximum: 50 } }, required: ["q"] }, path: (a) => `/v1/search?${qs({ q: a.q, city: a.city, active: a.active, limit: a.limit ?? 10 })}` },
  { name: "tw_get_company", description: "Full profile of a Taiwan company: registry presence, capital, address, industries, officers, managers, filings, detected changes.", inputSchema: { type: "object", properties: { ban }, required: ["ban"] }, path: (a) => `/v1/companies/${a.ban}` },
  { name: "tw_related_companies", description: "Companies related to one company via shared officer names (with confidence and reasons), legal-entity board seats, same address and branches. Same name does not prove same person.", inputSchema: { type: "object", properties: { ban, min_confidence: { type: "number" } }, required: ["ban"] }, path: (a) => `/v1/companies/${a.ban}/related?${qs({ min_confidence: a.min_confidence ?? 0.5, limit: 30 })}` },
  { name: "tw_company_graph", description: "Person/company relationship graph as nodes and edges. Solid edges are registry facts; dashed edges are same-name inferences with confidence.", inputSchema: { type: "object", properties: { ban, depth: { type: "integer", minimum: 1, maximum: 2 } }, required: ["ban"] }, path: (a) => `/v1/companies/${a.ban}/graph?${qs({ depth: a.depth ?? 1, max_nodes: 120 })}` },
  { name: "tw_company_signals", description: "Neutral checks worth a second look for a Taiwan company (no active tax record, young company, high-density address, capital decrease, frequent filings). Not conclusions.", inputSchema: { type: "object", properties: { ban }, required: ["ban"] }, path: (a) => `/v1/companies/${a.ban}/signals` },
  { name: "tw_people_roles", description: "Company roles held under an exact registered name in Taiwan, grouped into likely-same-person clusters. Many people share names; treat clusters as leads.", inputSchema: { type: "object", properties: { name: { type: "string" } }, required: ["name"] }, path: (a) => `/v1/people?${qs({ name: a.name, limit: 100 })}` },
  { name: "tw_new_companies", description: "Newly approved Taiwan companies in a date range, optionally by city and minimum capital.", inputSchema: { type: "object", properties: { from: { type: "string", format: "date" }, to: { type: "string", format: "date" }, city: { type: "string" }, min_capital: { type: "integer" } } }, path: (a) => `/v1/filings/setup?${qs({ ...a, limit: 50 })}` },
  { name: "tw_company_financials", description: "Listed/OTC Taiwan companies only: monthly and annual revenue with YoY, quarterly statements (margins, debt ratio, ROE), dividends, insider holdings and pledges.", inputSchema: { type: "object", properties: { ban }, required: ["ban"] }, path: (a) => `/v1/companies/${a.ban}/financials` },
  { name: "tw_company_group", description: "Inferred corporate group, branches with addresses, board shareholding split and overseas links for a Taiwan company.", inputSchema: { type: "object", properties: { ban }, required: ["ban"] }, path: (a) => `/v1/companies/${a.ban}/group` },
  { name: "tw_company_history", description: "Capital, representative and name history of a Taiwan company from approved filings since 2013.", inputSchema: { type: "object", properties: { ban }, required: ["ban"] }, path: (a) => `/v1/companies/${a.ban}/history` },
  { name: "tw_company_announcements", description: "Material announcements of a listed Taiwan company, newest first.", inputSchema: { type: "object", properties: { ban, limit: { type: "integer", maximum: 100 } }, required: ["ban"] }, path: (a) => `/v1/companies/${a.ban}/announcements?${qs({ limit: a.limit ?? 30 })}` },
];

function qs(o) { const p = new URLSearchParams(); for (const [k, v] of Object.entries(o)) if (v !== undefined && v !== null && v !== "") p.set(k, String(v)); return p.toString(); }

async function call(name, args) {
  const t = TOOLS.find((x) => x.name === name);
  if (!t) throw Object.assign(new Error("Unknown tool " + name), { code: -32602 });
  const r = await fetch(BASE + t.path(args ?? {}), { headers: KEY ? { "x-api-key": KEY } : {}, signal: AbortSignal.timeout(30000) });
  const text = await r.text();
  return { content: [{ type: "text", text }], isError: !r.ok };
}

const send = (m) => process.stdout.write(JSON.stringify(m) + "\n");
createInterface({ input: process.stdin }).on("line", async (line) => {
  let msg; try { msg = JSON.parse(line); } catch { return; }
  const { id, method, params } = msg;
  if (id === undefined) return; // notification
  try {
    if (method === "initialize") return send({ jsonrpc: "2.0", id, result: { protocolVersion: params?.protocolVersion ?? "2025-06-18", capabilities: { tools: {} }, serverInfo: { name: "taiwan-company-data", version: "1.1.0" } } });
    if (method === "tools/list") return send({ jsonrpc: "2.0", id, result: { tools: TOOLS.map(({ path, ...t }) => t) } });
    if (method === "tools/call") return send({ jsonrpc: "2.0", id, result: await call(params?.name, params?.arguments) });
    if (method === "ping") return send({ jsonrpc: "2.0", id, result: {} });
    send({ jsonrpc: "2.0", id, error: { code: -32601, message: "Method not found" } });
  } catch (e) { send({ jsonrpc: "2.0", id, error: { code: e.code ?? -32603, message: e.message } }); }
});
