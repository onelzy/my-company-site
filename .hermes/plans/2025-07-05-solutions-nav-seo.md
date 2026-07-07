# Solutions Page + Navigation + SEO Schema — Implementation Plan

> **For Hermes:** Execute task-by-task. Commit after each task.

**Goal:** Add a use-case-driven Solutions page, restructure navigation to match the Brief (Products / Solutions / Developers / Resources / Contact Sales), and add Product + Article SEO Schema.

**Architecture:**

- Solutions page: Keystatic-managed collection of use-case entries (Markdown), rendered as a dynamic list with multi-filter (industry × product-line × tech). Each solution links to a detail page with topology diagrams, data points, and CTA.
- Navigation: Update `navigation.ts` to 5-item structure. Contact Sales is a highlighted CTA button. Developers + Resources are placeholder pages (P1).
- SEO Schema: Add `@type: Product` JSON-LD to product detail pages, `@type: Article` to blog posts, `@type: WebSite` to Layout.

**Tech Stack:** Astro 6.4 SSR + Keystatic CMS + Tailwind v4 + existing widgets (Hero, Features, Content, CTA)

---

### Task 1: Add Solutions collection to Keystatic config

**Objective:** Register `solutions` collection in `keystatic.config.ts` so CMS can manage use-case content.

**File:** Modify: `keystatic.config.ts`

**Step 1: Add the collection definition**

```typescript
// Add after the 'about' collection (before the closing `});` on line 319)
    solutions: collection({
      label: 'Solutions',
      path: 'src/content/solutions/*',
      slugField: 'title',
      format: { contentField: 'body' },
      schema: {
        title: fields.text({ label: 'Title', validation: { isRequired: true } }),
        subtitle: fields.text({ label: 'Subtitle', multiline: true }),
        industry: fields.select({
          label: 'Industry',
          options: [
            { label: 'Smart Hotels', value: 'smart-hotels' },
            { label: 'Senior Care', value: 'senior-care' },
            { label: 'Energy Management', value: 'energy-management' },
            { label: 'Smart Building', value: 'smart-building' },
            { label: 'Industrial IoT', value: 'industrial-iot' },
          ],
          defaultValue: 'smart-hotels',
        }),
        productLines: fields.array(
          fields.select({
            label: 'Product Line',
            options: [
              { label: 'Smart Meters', value: 'smart-meters' },
              { label: 'Thermostats', value: 'thermostats' },
              { label: 'Senior Care', value: 'senior-care' },
              { label: 'Hotel Control', value: 'hotel-control' },
              { label: 'Software & Platforms', value: 'software-platforms' },
            ],
            defaultValue: 'smart-meters',
          }),
          { label: 'Related Product Lines', itemLabel: (props) => props.value || 'Product Line' }
        ),
        techSolution: fields.select({
          label: 'Technology',
          options: [
            { label: 'Tuya', value: 'tuya' },
            { label: 'MQTT', value: 'mqtt' },
            { label: 'ZigBee', value: 'zigbee' },
          ],
          defaultValue: 'zigbee',
        }),
        heroImage: fields.image({
          label: 'Hero Image',
          directory: 'public/images/solutions',
          publicPath: '/images/solutions',
        }),
        diagramImage: fields.image({
          label: 'Topology Diagram',
          directory: 'public/images/solutions',
          publicPath: '/images/solutions',
        }),
        stats: fields.array(
          fields.object({
            value: fields.text({ label: 'Value (e.g. "30%")' }),
            label: fields.text({ label: 'Label (e.g. "Energy Savings")' }),
          }),
          { label: 'Key Stats', itemLabel: (props) => props.fields.value || 'Stat' }
        ),
        body: fields.markdoc({ label: 'Body Content', extension: 'mdoc' }),
        language: fields.select({
          label: 'Language',
          options: [
            { label: 'English', value: 'en' },
          ],
          defaultValue: 'en',
        }),
      },
    }),
```

---

### Task 2: Add Solutions content schema to Astro

**Objective:** Add `solutions` collection to `src/content.config.ts` so Astro can load it.

**File:** Modify: `src/content.config.ts`

**Step 1: Add the collection definition**

Add after `productsCollection`:

```typescript
const solutionsCollection = defineCollection({
  loader: glob({ pattern: '*.mdoc', base: 'src/content/solutions' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    industry: z
      .enum(['smart-hotels', 'senior-care', 'energy-management', 'smart-building', 'industrial-iot'])
      .optional(),
    productLines: z
      .array(z.enum(['smart-meters', 'thermostats', 'senior-care', 'hotel-control', 'software-platforms']))
      .optional(),
    techSolution: z.enum(['tuya', 'mqtt', 'zigbee']).optional(),
    heroImage: z.string().optional(),
    diagramImage: z.string().optional(),
    stats: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
    language: z.enum(['en']).optional(),
  }),
});
```

**Step 2: Add to the exports**

```typescript
export const collections = {
  post: postCollection,
  products: productsCollection,
  solutions: solutionsCollection,
};
```

---

### Task 3: Create Solutions list page

**Objective:** Create `/solutions` page with industry filter chips + solution cards.

**File:** Create: `src/pages/solutions/index.astro`

```astro
---
import { getCollection } from 'astro:content';
import PageLayout from '~/layouts/PageLayout.astro';
import Image from '~/components/common/Image.astro';

export const prerender = false;

const allSolutions = await getCollection('solutions');
const solutions = allSolutions.filter((s) => s.data.language === 'en');

// Industry filter values
const industries = [
  { value: 'smart-hotels', label: 'Smart Hotels' },
  { value: 'senior-care', label: 'Senior Care' },
  { value: 'energy-management', label: 'Energy Management' },
  { value: 'smart-building', label: 'Smart Building' },
  { value: 'industrial-iot', label: 'Industrial IoT' },
];
---

<PageLayout
  metadata={{
    title: 'Solutions — OWON Technology',
    description: 'Industry-specific IoT solutions for smart hotels, senior care, energy management and more.',
  }}
>
  <section class="py-12">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold sm:text-4xl mb-2">Solutions</h1>
      <p class="text-lg text-muted mb-8 max-w-2xl">
        Industry-proven IoT solutions built on OWON's hardware and software stack. From smart hotels to industrial
        energy management — find the right solution for your project.
      </p>

      <!-- Industry filter chips -->
      <div id="solFilterRow" class="flex flex-wrap gap-3 mb-10">
        <button
          class="sol-filter-chip px-4 py-2 rounded-full text-sm font-medium bg-primary text-primary-foreground active"
          data-industry=""
        >
          All Solutions
        </button>
        {
          industries.map((ind) => (
            <button
              class="sol-filter-chip px-4 py-2 rounded-full text-sm font-medium border border-gray-300 hover:border-primary transition-colors"
              data-industry={ind.value}
            >
              {ind.label}
            </button>
          ))
        }
      </div>

      <!-- Solution cards -->
      <div id="solGrid" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {
          solutions.map((s) => {
            const solutionSlug = s.id.split('/').pop()?.replace('.mdoc', '') || '';
            const industryLabel = industries.find((i) => i.value === s.data.industry)?.label || '';
            return (
              <a
                href={`/solutions/${solutionSlug}`}
                class="group block rounded-xl bg-white dark:bg-slate-800 shadow-md hover:shadow-xl border border-gray-200 dark:border-slate-700 transition-all overflow-hidden"
              >
                <div class="h-48 bg-gray-100 dark:bg-slate-700 overflow-hidden relative">
                  {s.data.heroImage ? (
                    <Image
                      src={s.data.heroImage}
                      alt={s.data.title}
                      layout="cover"
                      class="absolute inset-0 w-full h-full"
                      width={600}
                      height={400}
                    />
                  ) : (
                    <div class="absolute inset-0 flex items-center justify-center text-5xl">🏢</div>
                  )}
                </div>
                <div class="p-5">
                  {industryLabel && (
                    <span class="text-xs font-semibold text-primary uppercase tracking-wide">{industryLabel}</span>
                  )}
                  <h3 class="text-lg font-semibold mt-1 mb-2 group-hover:text-primary transition-colors">
                    {s.data.title}
                  </h3>
                  {s.data.subtitle && <p class="text-sm text-muted line-clamp-2">{s.data.subtitle}</p>}
                </div>
              </a>
            );
          })
        }
      </div>
    </div>
  </section>
</PageLayout>

<script>
  // Client-side industry filter
  document.getElementById('solFilterRow')?.addEventListener('click', (e) => {
    const chip = (e.target as HTMLElement).closest('.sol-filter-chip');
    if (!chip) return;
    const industry = chip.dataset.industry || '';
    document
      .querySelectorAll('.sol-filter-chip')
      .forEach((c) => c.classList.remove('active', 'bg-primary', 'text-primary-foreground'));
    chip.classList.add('active', 'bg-primary', 'text-primary-foreground');
    document.querySelectorAll('#solGrid > a').forEach((card) => {
      const cardIndustry = card.querySelector('[data-industry]')?.getAttribute('data-industry');
      if (!industry || cardIndustry === industry) {
        (card as HTMLElement).style.display = '';
      } else {
        (card as HTMLElement).style.display = 'none';
      }
    });
  });
</script>
```

---

### Task 4: Update navigation structure

**Objective:** Add Solutions, Developers, Resources, and Contact Sales to the header.

**File:** Modify: `src/navigation.ts`

Replace the `headerData` links array:

```typescript
export const headerData = {
  links: [
    {
      text: 'Products',
      href: getPermalink('/products'),
    },
    {
      text: 'Solutions',
      href: getPermalink('/solutions'),
    },
    {
      text: 'Developers',
      href: getPermalink('/developers'),
    },
    {
      text: 'Resources',
      links: [
        {
          text: 'Blog',
          href: getBlogPermalink(),
        },
        {
          text: 'About Us',
          href: getPermalink('/about'),
        },
      ],
    },
  ],
  actions: [{ text: 'Contact Sales', href: getPermalink('/contact') }],
};
```

Update footer links to match:

```typescript
export const footerData = {
  links: [
    {
      title: 'Products',
      links: [
        { text: 'All Products', href: getPermalink('/products') },
        { text: 'Smart Meters', href: getPermalink('/products?type=smart-meters') },
        { text: 'Thermostats', href: getPermalink('/products?type=thermostats') },
        { text: 'Senior Care', href: getPermalink('/products?type=senior-care') },
        { text: 'Hotel Control', href: getPermalink('/products?type=hotel-control') },
        { text: 'Software & Platforms', href: getPermalink('/products?type=software-platforms') },
      ],
    },
    {
      title: 'Solutions',
      links: [
        { text: 'Smart Hotels', href: getPermalink('/solutions?industry=smart-hotels') },
        { text: 'Senior Care', href: getPermalink('/solutions?industry=senior-care') },
        { text: 'Energy Management', href: getPermalink('/solutions?industry=energy-management') },
        { text: 'Smart Building', href: getPermalink('/solutions?industry=smart-building') },
        { text: 'Industrial IoT', href: getPermalink('/solutions?industry=industrial-iot') },
      ],
    },
    {
      title: 'Company',
      links: [
        { text: 'About', href: getPermalink('/about') },
        { text: 'Contact', href: getPermalink('/contact') },
        { text: 'Blog', href: getBlogPermalink() },
      ],
    },
    {
      title: 'Support',
      links: [
        { text: 'Terms', href: getPermalink('/terms') },
        { text: 'Privacy Policy', href: getPermalink('/privacy') },
      ],
    },
  ],
  // ... rest stays the same
};
```

---

### Task 5: Create placeholders for Developers and Resources pages

**Objective:** Create minimal pages so navigation links work.

**Files:**

- Create: `src/pages/developers/index.astro`
- The `/solutions` redirect page at `src/pages/solutions/[...path].astro` is now superseded by the list page — keep it as a fallback redirect.

**Developers page** (`src/pages/developers/index.astro`):

```astro
---
import PageLayout from '~/layouts/PageLayout.astro';
---

<PageLayout
  metadata={{
    title: 'Developers — OWON Technology',
    description: 'API documentation, SDKs, and integration guides for OWON IoT devices.',
  }}
>
  <section class="py-20">
    <div class="mx-auto max-w-3xl px-4 text-center">
      <h1 class="text-3xl font-bold sm:text-4xl mb-4">Developer Center</h1>
      <p class="text-lg text-muted mb-8">API documentation, SDKs, and integration guides are coming soon.</p>
      <p class="text-sm text-muted">
        For immediate technical support, <a href="/contact" class="text-primary hover:underline"
          >contact our engineering team</a
        >.
      </p>
    </div>
  </section>
</PageLayout>
```

---

### Task 6: Add SEO Schema to product detail page

**Objective:** Add JSON-LD Product schema to `/products/[slug]` pages for Google rich results.

**File:** Modify: `src/pages/products/[slug].astro`

Add in the frontmatter section (before `---` closing):

```typescript
// === SEO Schema ===
const productSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: name,
  description: description?.trim() || `OWON ${name}`,
  sku: model || product.slug,
  brand: { '@type': 'Brand', name: 'OWON Technology' },
  ...(hasImage && { image: `${Astro.url.origin}${imageSrc}` }),
  offers: {
    '@type': 'Offer',
    availability: 'https://schema.org/InStock',
    // No price — B2B quote-only
  },
};
```

And in the template, add inside `<PageLayout>`:

```astro
<script type="application/ld+json" set:html={JSON.stringify(productSchema)} />
```

---

### Task 7: Add SEO Schema to blog posts + site-wide

**Objective:** Add Article schema to blog, Organization schema to layout.

**File:** Modify blog post template: `src/components/blog/SinglePost.astro`
**File:** Modify: `src/layouts/Layout.astro`

**Blog Article Schema** (in SinglePost.astro frontmatter):

```typescript
const articleSchema = post
  ? {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      datePublished: post.publishDate?.toISOString(),
      dateModified: post.updateDate?.toISOString(),
      author: { '@type': 'Organization', name: 'OWON Technology' },
      publisher: { '@type': 'Organization', name: 'OWON Technology' },
    }
  : null;
```

Template:

```astro
{articleSchema && <script type="application/ld+json" set:html={JSON.stringify(articleSchema)} />}
```

**Organization Schema** (in Layout.astro, in `<head>`):

```astro
<script
  type="application/ld+json"
  set:html={JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'OWON Technology',
    url: 'https://my-company-site.onelzy.workers.dev',
    description: 'Professional smart IoT device manufacturer — smart meters, thermostats, hotel control, senior care.',
  })}
/>
```

---

### Task 8: Add solution detail page

**Objective:** Create `/solutions/[slug]` detail page with topology, stats, CTA.

**File:** Create: `src/pages/solutions/[slug].astro`

```astro
---
import { getCollection } from 'astro:content';
import PageLayout from '~/layouts/PageLayout.astro';
import Image from '~/components/common/Image.astro';

export const prerender = false;

const { slug } = Astro.params;
const allSolutions = await getCollection('solutions');
const entry = allSolutions.find((s) => {
  const sSlug = s.id.split('/').pop()?.replace('.mdoc', '') || '';
  return sSlug === slug && s.data.language === 'en';
});

if (!entry) return new Response(null, { status: 404 });

const { title, subtitle, heroImage, diagramImage, stats, productLines, techSolution, industry } = entry.data;
const bodyHtml = entry.rendered?.html || entry.body || '';

const industryLabel =
  {
    'smart-hotels': 'Smart Hotels',
    'senior-care': 'Senior Care',
    'energy-management': 'Energy Management',
    'smart-building': 'Smart Building',
    'industrial-iot': 'Industrial IoT',
  }[industry || ''] || '';

const techLabel = { tuya: 'Tuya', mqtt: 'MQTT', zigbee: 'ZigBee' }[techSolution || ''] || '';
---

<PageLayout metadata={{ title: `${title} — OWON Solutions`, description: subtitle || title }}>
  <section class="py-12 lg:py-16">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- Breadcrumb -->
      <nav class="mb-8 text-sm text-muted">
        <a href="/" class="hover:text-primary">Home</a>
        <span class="mx-2">/</span>
        <a href="/solutions" class="hover:text-primary">Solutions</a>
        <span class="mx-2">/</span>
        <span class="text-default font-medium">{title}</span>
      </nav>

      <!-- Hero -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
        <div
          class="relative aspect-video rounded-xl bg-gray-100 dark:bg-slate-800 overflow-hidden border border-gray-200 dark:border-slate-700"
        >
          {
            heroImage ? (
              <Image
                src={heroImage}
                alt={title}
                layout="cover"
                class="absolute inset-0 w-full h-full"
                width={800}
                height={450}
              />
            ) : (
              <div class="absolute inset-0 flex items-center justify-center text-6xl">🏢</div>
            )
          }
        </div>
        <div class="flex flex-col justify-center">
          {
            industryLabel && (
              <span class="text-xs font-bold text-primary uppercase tracking-wider mb-2">{industryLabel}</span>
            )
          }
          <h1 class="text-3xl font-bold sm:text-4xl mb-4">{title}</h1>
          {subtitle && <p class="text-lg text-muted mb-6">{subtitle}</p>}
          <div class="flex flex-wrap gap-2 mb-6">
            {
              productLines?.map((pl) => (
                <span class="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                  {pl}
                </span>
              ))
            }
            {
              techLabel && (
                <span class="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">{techLabel}</span>
              )
            }
          </div>
          <a
            href="/contact"
            class="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity w-fit"
          >
            Request a Demo
          </a>
        </div>
      </div>

      <!-- Key Stats -->
      {
        stats && stats.length > 0 && (
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 p-8 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-200 dark:border-slate-700">
            {stats.map((s) => (
              <div class="text-center">
                <div class="text-3xl font-bold text-primary mb-1">{s.value}</div>
                <div class="text-sm text-muted">{s.label}</div>
              </div>
            ))}
          </div>
        )
      }

      <!-- Topology Diagram -->
      {
        diagramImage && (
          <div class="mb-16">
            <h2 class="text-2xl font-bold mb-6">System Architecture</h2>
            <div class="rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-800 p-4">
              <Image src={diagramImage} alt="System topology" width={1200} height={600} class="w-full h-auto" />
            </div>
          </div>
        )
      }

      <!-- Body Content -->
      {bodyHtml && <div class="prose prose-lg dark:prose-invert max-w-none" set:html={bodyHtml} />}

      <!-- CTA -->
      <div class="mt-16 text-center p-12 bg-primary/5 rounded-2xl border border-primary/10">
        <h2 class="text-2xl font-bold mb-3">Ready to get started?</h2>
        <p class="text-muted mb-6">Contact our solutions team for a personalized demo and quote.</p>
        <a
          href="/contact"
          class="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90"
        >
          Contact Sales →
        </a>
      </div>
    </div>
  </section>
</PageLayout>
```

---

### Task 9: Add sample solution content via Keystatic

**Objective:** Create 2-3 sample solution entries so the pages render.

**After deployment, go to `/keystatic` and create these entries:**

1. **Smart Hotel Energy Management**
   - Industry: Smart Hotels
   - Product Lines: Smart Meters, Hotel Control, Software & Platforms
   - Tech: ZigBee
   - Stats: "30% Energy Savings", "500+ Rooms Managed", "24/7 Monitoring"
   - Body: Describe the solution — smart meters for submetering, room thermostats, energy dashboard.

2. **Senior Care Monitoring System**
   - Industry: Senior Care
   - Product Lines: Senior Care, Software & Platforms
   - Tech: ZigBee
   - Stats: "10,000+ Seniors Monitored", "90% Alert Accuracy", "3min Avg Response"
   - Body: Describe sleep monitors, emergency call, AiJuan app integration.

3. **Industrial Energy Submetering**
   - Industry: Energy Management
   - Product Lines: Smart Meters, Software & Platforms
   - Tech: MQTT
   - Stats: "15% Cost Reduction", "99.9% Uptime", "1M+ Data Points/Day"
   - Body: Multi-circuit monitoring, Modbus integration, EdgeEco platform.

---

### Task 10: Simplify product detail page locale references

**Objective:** Clean up remaining Chinese locale references from `[slug].astro` for consistency.

**File:** Modify: `src/pages/products/[slug].astro`

Replace:

- Line 29-31: Remove locale detection from URL path — hardcode `'en'`
- Line 104-116: Simplify `specFieldLabels` — remove Chinese translations
- Line 157-179: Simplify heading labels — remove Chinese
- All `getLocalizedLabel(... , locale)` → hardcode `'en'`

---

### Verification

After each task, verify via:

```bash
cd /home/admin/my-company-site && git add -A && git commit -m "..."
git push
```

After all tasks, test:

- `/solutions` — list page with industry filter
- `/solutions/smart-hotel-energy-management` — detail page
- Navigation bar shows: Products | Solutions | Developers | Resources ▾ | [Contact Sales]
- Product pages have JSON-LD schema in page source
