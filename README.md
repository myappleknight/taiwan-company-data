# Taiwan Company Data API

Look up any of about 2 million Taiwan businesses by name or 8-digit ID (統一編號) and get clean, English-keyed JSON:

- Registry facts: status, capital, address, industries, setup date, headquarters and branches
- Directors, supervisors and managers, with shareholdings and history since 2013
- Setup and change filings (about 3 million since 2013) plus month-over-month changes
- A relationship graph linking people and companies, where every same-name link carries a confidence score and reasons
- Listed and OTC companies: monthly and annual revenue, quarterly statements, dividends, insider holdings, material announcements
- Inferred corporate group, branch footprint, overseas links, verified official website
- A printable due-diligence report in English or Traditional Chinese
- Watch lists with HTTPS webhooks

Built from Taiwan government open data (Open Government Data License v1.0). Registry data refreshes monthly, listed-company data daily.

## Try it (no key needed)

```bash
curl "https://api.easylifehub.net/tw/v1/search?q=台灣積體電路"
curl "https://api.easylifehub.net/tw/v1/companies/22099131"
```

Open a full report in your browser: <https://api.easylifehub.net/tw/v1/companies/22099131/report?lang=en>

| Access | Limit | Price |
|---|---|---|
| No key | 50 requests per day | free |
| Free key (`curl -X POST https://api.easylifehub.net/tw/v1/keys`) | 1,000 per month | free |
| [RapidAPI plans](https://rapidapi.com/chiachunchang/api/taiwan-company-data1/pricing) | 20,000 to 2,000,000 per month | from US$9 |

## For AI agents

- MCP server: [`mcp/`](mcp/) (`npx -y twdata-mcp`)
- Agent guide: <https://api.easylifehub.net/tw/skill.md>
- OpenAPI: <https://api.easylifehub.net/tw/openapi.json>
- llms.txt: <https://api.easylifehub.net/tw/llms.txt>
- Docs: <https://api.easylifehub.net/tw/> (中文: <https://api.easylifehub.net/tw/zh>)

## Examples

- [`examples/vet_supplier.py`](examples/vet_supplier.py): profile, officers and checks for one company
- [`examples/new_companies.mjs`](examples/new_companies.mjs): newly founded companies by city and capital

## Honest about people

The registry lists officers by name only, with no personal IDs. A common name can appear on hundreds of boards, so the API never merges people on name alone. Registry facts are solid edges; inferred links are marked as inferences with a confidence score and the reasons behind it. Treat them as leads, not conclusions.

The API does not include court records, personal addresses or ID numbers.

## License

Code in this repository: MIT. Data: Taiwan Open Government Data License v1.0.
