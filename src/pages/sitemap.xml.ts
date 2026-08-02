/**
 * Dynamic sitemap endpoint — the single authoritative sitemap for the site.
 *
 * English-only site: only real, resolvable routes are listed. No locale
 * variants, no category/type landing URLs that don't exist (the product
 * catalogue filters via query params, not path-based type pages).
 *
 * Product/solution detail pages use trailing-slash URLs to match the actual
 * served URLs (the adapter 307-redirects the non-slash form).
 */
import { SITE } from 'astrowind:config';
import { getCollection } from 'astro:content';
import { products } from '~/data/products';

export const prerender = false;

/** Derive the canonical Keystatic slug for a product entry. */
function productSlug(p: { data?: { slug?: { slug?: string }; name?: string }; slug: string }): string {
  const d = (p.data ?? {}) as { slug?: { slug?: string }; name?: string };
  return d.slug?.slug || p.slug || d.name?.toLowerCase().replace(/\s+/g, '-') || '';
}

// ---------------------------------------------------------------------------
// URL entry
// ---------------------------------------------------------------------------
interface UrlEntry {
  loc: string;
  changefreq: string;
  priority: string;
}

// ---------------------------------------------------------------------------
// GET handler
// ---------------------------------------------------------------------------
export const GET = async () => {
  const baseUrl = SITE.site.replace(/\/+$/, '');

  const urls: UrlEntry[] = [];

  // 1. Static pages (all real routes — English only)
  const staticRoutes: Array<[string, string, string]> = [
    ['', 'weekly', '1.0'],
    ['/about', 'monthly', '0.5'],
    ['/contact', 'monthly', '0.5'],
    ['/contact-sales', 'monthly', '0.6'],
    ['/products', 'weekly', '0.9'],
    ['/solutions', 'weekly', '0.9'],
    ['/resources', 'monthly', '0.6'],
    ['/resources/documentation', 'weekly', '0.7'],
    ['/resources/faq', 'weekly', '0.6'],
    ['/resources/videos', 'monthly', '0.6'],
    ['/resources/app', 'monthly', '0.6'],
    ['/resources/case-studies', 'weekly', '0.7'],
    ['/developers', 'monthly', '0.8'],
    ['/developers/api', 'monthly', '0.8'],
    ['/developers/sdks', 'monthly', '0.7'],
    ['/developers/examples', 'monthly', '0.7'],
    ['/developers/changelog', 'monthly', '0.7'],
    ['/developers/mqtt', 'monthly', '0.7'],
    ['/developers/zigbee', 'monthly', '0.7'],
    ['/developers/ha', 'monthly', '0.7'],
    ['/blog/', 'weekly', '0.8'],
  ];
  for (const [path, changefreq, priority] of staticRoutes) {
    urls.push({ loc: `${baseUrl}${path}`, changefreq, priority });
  }

  // 2. Solution detail pages (3 real solutions)
  const solutionSlugs = ['smart-hotel-energy-management', 'senior-care-monitoring', 'industrial-energy-submetering'];
  for (const s of solutionSlugs) {
    urls.push({ loc: `${baseUrl}/solutions/${s}/`, changefreq: 'weekly', priority: '0.8' });
  }

  // 3. Product detail pages — canonical slugs only (no legacy aliases), trailing slash
  const seen = new Set<string>();
  for (const p of products) {
    const slug = productSlug(p);
    if (!slug || seen.has(slug)) continue;
    seen.add(slug);
    urls.push({ loc: `${baseUrl}/products/${slug}/`, changefreq: 'weekly', priority: '0.8' });
  }

  // 4. Blog post detail pages (real posts only)
  const posts = await getCollection('post');
  for (const post of posts) {
    const id = post.id.replace(/\.(md|mdx)$/, '');
    if (post.data.draft) continue;
    urls.push({ loc: `${baseUrl}/blog/${id}/`, changefreq: 'monthly', priority: '0.6' });
  }

  // ---------------------------------------------------------------------------
  // Render XML
  // ---------------------------------------------------------------------------
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset',
    '  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '>',
    ...urls.map((entry) => {
      const lines = ['  <url>', `    <loc>${escapeXml(entry.loc)}</loc>`];
      lines.push(`    <changefreq>${entry.changefreq}</changefreq>`);
      lines.push(`    <priority>${entry.priority}</priority>`);
      lines.push('  </url>');
      return lines.join('\n');
    }),
    '</urlset>',
  ].join('\n');

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Escape special XML characters. */
function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
