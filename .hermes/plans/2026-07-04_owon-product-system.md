# OWON Product Filtering & Display System — Implementation Plan

**Created:** 2026-07-04
**Project:** my-company-site (AstroWind + Keystatic + Cloudflare)

## Architecture Understanding

### Dual-Dimension Product Model

The system classifies products along two independent axes, allowing cross-filtering:

1. **Dimension 1: Product Type** (`/products/[type]/[subType]/`)
   - What the product IS (e.g., smart meter, thermostat)
   - 5 main types → ~25 sub-types

2. **Dimension 2: Technical Solution** (`/solutions/[solution]/[subType]/`)
   - What technology the product USES (e.g., Tuya, MQTT, ZigBee)
   - 3 main solutions → ~22 sub-types

### Filtering Architecture

- **Single-select navigation** for both dimensions (not multi-select)
- **Multi-select tags** for technical specs (communication, ecosystem, etc.)
- **AND relationship** between dimensions and specs
- **URL parameter driven** (`?sol=tuya&comm=zigbee&comm=wifi`)
- **Client-side filtering** via JavaScript (Alpine.js or vanilla JS)

### Data Flow

```
Keystatic CMS → src/content/products/*.mdoc → Astro Content Collections → Pages
```

---

## Execution Phases

### Phase 1: Keystatic Product Collection

**Depends on:** None
**Files:** `keystatic.config.ts`

- Replace the current products collection with the full dual-dimension schema
- Add all productType, productSubType, techSolution, techSubType options
- Add communication, ecosystem, extraTags, softwareType array fields
- Add `content` markdown field, `image` field, `specs` JSON field
- Add `language` select field
- Use `fields.slug` for the slug field (changed from `fields.text` name-based slug)
- Add `featured` boolean, `sortOrder` integer

### Phase 2: Astro Content Collection

**Depends on:** Phase 1
**Files:** `src/content.config.ts`

- Add `products` collection using `glob()` loader from `src/content/products/`
- Define Zod schema matching the Keystatic schema
- Export from collections

### Phase 3: Product Type Pages (Dimension 1)

**Depends on:** Phase 2
**Files:**

- `src/pages/products/index.astro` — all products listing
- `src/pages/products/[type]/index.astro` — main category listing
- `src/pages/products/[type]/[subType]/index.astro` — sub-category listing
- `src/components/products/ProductCard.astro` — reusable product card
- `src/components/products/ProductFilter.astro` — client-side filter component

**Routes:**

```
/products/                          → all products
/products/smart-meters/             → smart meter list
/products/smart-meters/single-phase/ → single-phase meter list
/products/thermostats/              → thermostat list
/products/thermostats/24vac/        → 24V AC thermostat list
...etc for all types/subTypes
```

### Phase 4: Technical Solution Pages (Dimension 2)

**Depends on:** Phase 2
**Files:**

- `src/pages/solutions/index.astro` — all solutions overview
- `src/pages/solutions/[solution]/index.astro` — solution landing
- `src/pages/solutions/[solution]/[subType]/index.astro` — sub-type listing

**Routes:**

```
/solutions/                         → solutions overview
/solutions/tuya/                    → Tuya ecosystem
/solutions/tuya/tuya-meters/        → Tuya smart meters
/solutions/mqtt/                    → MQTT protocol
/solutions/mqtt/mqtt-meters/        → MQTT smart meters
/solutions/zigbee/                  → ZigBee standard
/solutions/zigbee/zigbee-meters/    → ZigBee smart meters
...etc
```

### Phase 5: Product Detail Page

**Depends on:** Phase 2
**Files:**

- `src/pages/products/[slug].astro` — dynamic product detail

**Route:** `/products/[slug]/`

Displays: product name, model, image, description, content (markdown), all dimension labels, spec tags, technical specs JSON.

### Phase 6: Client-Side Filtering

**Depends on:** Phase 3, 4
**Files:**

- `src/assets/scripts/product-filter.js` — vanilla JS filter logic
- Update ProductFilter.astro with interactive checkboxes
- URL parameter sync (read on load, write on change)
- Cross-dimension filtering (AND logic between dimensions)

**Behavior:**

- Read URL params on page load → apply filters
- On filter change → update URL params → re-filter
- Filter logic: product matches if it passes ALL active filters (AND)
- Within multi-select groups: OR logic (any matching tag)

### Phase 7: SEO & Sitemap

**Depends on:** Phase 3, 4, 5
**Files:**

- Update `src/config.yaml` with OWON site info
- Add SEO metadata to all product/solution pages
- Generate sitemap entries for product pages
- i18n alternate links for all product pages

### Phase 8: Integration Testing

**Depends on:** Phase 6, 7

- Verify all 8 languages render correctly
- Test product filtering across dimensions
- Verify URL parameter persistence
- Test responsive layout (mobile/tablet/desktop)
- Verify Cloudflare Pages build succeeds
- Test Keystatic admin UI at `/keystatic`

---

## Key Design Decisions

1. **Product data as Keystatic collection** (not Astro content collection from markdown files directly) — Keystatic manages the data, Astro reads it via Content Layer
2. **Client-side filtering** — No server-side search, all products loaded into the page and filtered client-side for instant response
3. **URL params for shareable filters** — `?type=smart-meters&comm=zigbee` can be bookmarked
4. **i18n integration** — Products have a `language` field; each locale loads only its own products
5. **Component reuse** — ProductCard, ProductFilter, ProductGrid shared across all listing pages

## Files Changed Summary

| File                                                   | Phase | Action                      |
| ------------------------------------------------------ | ----- | --------------------------- |
| `keystatic.config.ts`                                  | 1     | Rewrite products collection |
| `src/content.config.ts`                                | 2     | Add products collection     |
| `src/config.yaml`                                      | 7     | Update OWON metadata        |
| `src/navigation.ts`                                    | 3     | Add products/solutions nav  |
| `src/pages/products/index.astro`                       | 3     | Create                      |
| `src/pages/products/[type]/index.astro`                | 3     | Create                      |
| `src/pages/products/[type]/[subType]/index.astro`      | 3     | Create                      |
| `src/pages/products/[slug].astro`                      | 5     | Create                      |
| `src/pages/solutions/index.astro`                      | 4     | Create                      |
| `src/pages/solutions/[solution]/index.astro`           | 4     | Create                      |
| `src/pages/solutions/[solution]/[subType]/index.astro` | 4     | Create                      |
| `src/components/products/ProductCard.astro`            | 3     | Create                      |
| `src/components/products/ProductGrid.astro`            | 3     | Create                      |
| `src/components/products/ProductFilter.astro`          | 3     | Create                      |
| `src/assets/scripts/product-filter.js`                 | 6     | Create                      |
| `src/utils/products.ts`                                | 3     | Create (data helpers)       |
| `src/types.ts`                                         | 3     | Update (product types)      |

---

## Risks & Mitigations

| Risk                                                                | Mitigation                                                                                  |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Keystatic `fields.slug` incompatibility with Astro v6 Content Layer | Use `fields.text` as slug fallback if slug field causes issues                              |
| Large product catalogue causing slow client-side filtering          | Implement virtual scrolling or pagination if >100 products                                  |
| i18n routing conflict with product dynamic routes                   | Test all locale prefixes early; use `getStaticPaths` with `prerender: false` for SSR routes |
| Cloudflare build time for many static pages                         | Keep product detail as SSR route; only prerender category index pages                       |
| Keystatic `fields.json` for specs might not exist in v0.5.x         | Fall back to `fields.text` with JSON validation, or use `fields.object` with dynamic keys   |

---

## Verification Criteria

After all phases complete:

1. ✅ `npm run build` succeeds on Cloudflare Pages
2. ✅ Keystatic admin at `/keystatic` loads and allows product CRUD
3. ✅ Products appear on listing pages filtered by type/subType/solution
4. ✅ Technical spec tags filter products correctly
5. ✅ URL parameters persist through page navigation
6. ✅ All 8 languages render with correct translations
7. ✅ Product detail page shows all dimension and spec information
8. ✅ Mobile responsive across all breakpoints
