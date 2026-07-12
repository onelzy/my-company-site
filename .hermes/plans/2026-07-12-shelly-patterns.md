# Shelly.com Design Patterns — OWON Site Upgrade

> **For Hermes:** Execute via OpenCode with hyper-specific prompts per task.

**Goal:** Apply Shelly.com's best B2B design patterns to OWON's product, solution, and homepage — lightweight, SEO-optimized, lead-generating.

**Patterns from Shelly:**

1. Benefit-driven headlines, not feature-driven
2. "Best for:" use-case tags on each product
3. Key value-prop icon cards (4-up)
4. "What you can achieve" scenario sections
5. FAQ + FAQ Schema (structured data)
6. "Which is right for you?" comparison cards
7. Certification/warranty trust badges
8. Room/space-based recommendations → Industry-based recommendations

---

## Task 1: Product Detail Page — Add Scenarios + FAQ + Schema

**File:** `src/pages/products/[slug].astro`

### 1a. Add "Best for" (use cases) section right after specs

```html
<section class="mt-12">
  <h2 class="text-2xl font-bold mb-6 pb-2 border-b">Ideal For</h2>
  <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <!-- Dynamically generated from product data or fallback -->
    <div
      class="p-5 rounded-xl border bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800 flex gap-3 items-start"
    >
      <span class="text-2xl shrink-0">⚡</span>
      <div>
        <h4 class="font-semibold text-sm">Energy Monitoring</h4>
        <p class="text-xs text-muted mt-1">Real-time power consumption tracking for commercial & industrial setups.</p>
      </div>
    </div>
    <!-- 2-3 more cards based on productType -->
  </div>
</section>
```

### 1b. Add FAQ section (from product data or fallback)

### 1c. Add FAQPage Schema structured data for SEO

## Task 2: Solution Detail Page — Add Value Props + Scenarios

**File:** `src/pages/solutions/[slug].astro`

### 2a. Add 4 key value-prop cards between hero and body

### 2b. Add "What you can achieve" with icon cards

### 2c. Add certifications badge row

## Task 3: Homepage — Improve Trust + Add Industry Selector

**File:** `src/pages/index.astro`

### 3a. Replace "Product Categories" title with benefit-driven: "Find the Right Solution for Your Industry"

### 3b. Improve CTA copy to be more benefit-driven

## Task 4: Create Shared FAQ Component

**New file:** `src/components/common/FAQItem.astro`
