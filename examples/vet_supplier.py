"""Vet a Taiwan supplier in a few calls. Usage: python vet_supplier.py 22099131
Optional: set TW_API_KEY for higher limits (free key: curl -X POST https://api.easylifehub.net/tw/v1/keys)."""
import json, os, sys, urllib.request

BASE = "https://api.easylifehub.net/tw"
KEY = os.environ.get("TW_API_KEY", "")

def get(path):
    req = urllib.request.Request(BASE + path, headers={"x-api-key": KEY} if KEY else {})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)

ban = sys.argv[1] if len(sys.argv) > 1 else "22099131"
c = get(f"/v1/companies/{ban}")
print(f"{c['name']}  capital {c['capital_twd']:,} TWD  since {c['setup_date']}")
print("In tax registry:", c["registry_presence"]["tax_registry"])
for o in c["officers"][:5]:
    print(f"  {o['title_en']:<14} {o['name']}")
for s in get(f"/v1/companies/{ban}/signals").get("signals", []):
    print("Check:", s.get("text") or s)
print("Report:", f"{BASE}/v1/companies/{ban}/report?lang=en")
