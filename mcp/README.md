# twdata-mcp

MCP server for the [Taiwan Company Data API](https://api.easylifehub.net/tw/): about 2 million Taiwan businesses, their directors and managers, filings, monthly change history, and a relationship graph that marks same-name links as inferences with confidence.

## Use with Claude Desktop, Claude Code, Cursor or any MCP client

```json
{
  "mcpServers": {
    "twdata": {
      "command": "npx",
      "args": ["-y", "twdata-mcp"],
      "env": { "TW_API_KEY": "tw_..." }
    }
  }
}
```

`TW_API_KEY` is optional (50 requests per day without it). Get a free key:

```bash
curl -X POST https://api.easylifehub.net/tw/v1/keys
```

## Tools

| Tool | What it does |
|---|---|
| `tw_search_companies` | Search by name fragment or 8-digit ID (統一編號) |
| `tw_get_company` | Profile, officers, managers, filings, detected changes |
| `tw_related_companies` | Linked companies with confidence and reasons |
| `tw_company_graph` | Nodes and edges (solid = registry fact, dashed = inference) |
| `tw_company_signals` | Neutral checks worth a second look |
| `tw_people_roles` | Roles under an exact registered name, clustered |
| `tw_new_companies` | Newly approved companies by date, city, capital |
| `tw_company_financials` | Listed companies: revenue, quarterly statements, dividends, insiders |
| `tw_company_group` | Inferred group, branches, board shareholding, overseas links |
| `tw_company_history` | Capital, representative and name history since 2013 |
| `tw_company_announcements` | Material announcements of listed companies |

Data: Taiwan government open data (Open Government Data License v1.0), refreshed monthly. Same name does not mean same person.
