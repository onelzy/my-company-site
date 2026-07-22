import json, re, time

# Product URLs organized by page (from our earlier extraction)
urls_by_page = {
    # ... (use the data from product_urls.json)
}

# Load the URLs
with open("product_urls.json") as f:
    data = json.load(f)

all_urls = data["urls"]
print(f"Total URLs: {len(all_urls)}")

# For each URL, extract the product ID to map to listing page data
# We'll build a comprehensive product data file from what we know
# Product IDs are the numeric part after the last underscore before .html

# Extract model numbers from URL slugs
def extract_model(url):
    slug = url.split("/product-detail/")[-1].split("_")[0].replace(".html", "")
    # Look for model patterns like PC321, PC311, PC473, LC421, PC321-TY, etc
    models = re.findall(r'(?:OWON[- ])?([A-Z]{2,}\d+(?:-\w+)?)', slug)
    return models[0] if models else ""

# Build initial product records
products = []
for i, url in enumerate(all_urls):
    slug = url.split("/product-detail/")[-1].replace(".html", "")
    model = extract_model(url)
    # Clean the slug to get a product name
    name_parts = slug.split("_")[0].replace("-", " ")
    products.append({
        "id": i + 1,
        "url": url,
        "slug": slug,
        "model": model,
        "name_from_url": name_parts,
        "category": "Energy Management"
    })

# Save as JSONL for the raw data
with open("raw_data.jsonl", "w") as f:
    for p in products:
        f.write(json.dumps(p) + "\n")

print(f"Created {len(products)} basic product records")
print(f"\nSample models extracted:")
for p in products[:20]:
    if p["model"]:
        print(f"  {p['model']:15s} <- {p['slug'][:70]}")

# Save to progress.log
with open("progress.log", "w") as f:
    for p in products:
        f.write(p["url"] + "\n")

print(f"\nSaved raw_data.jsonl and progress.log")
