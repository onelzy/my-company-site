/**
 * Dynamic sitemap endpoint — covers all product/solution pages across 8 locales,
 * with hreflang alternates on product detail entries.
 *
 * The @astrojs/sitemap integration handles blog posts via its own generated
 * sitemaps; this endpoint covers the dynamic product catalogue and static pages.
 */
import { getCollection } from 'astro:content';
import { SITE } from 'astrowind:config';
import {
  getAllProductTypes,
  getProductSubTypes,
  getAllTechSolutions,
  getTechSubTypes,
} from '~/utils/products';

export const prerender = false;

/** Locale → URL prefix mapping (prefixDefaultLocale: false → en has no prefix). */
const LOCALES = ['en', 'zh', 'es', 'ru', 'fr', 'de', 'ar', 'pt'] as const;

function localePrefix(locale: string): string {
  return locale === 'en' ? '' : `/${locale}`;
}

/** Derive the canonical Keystatic slug for a product entry. */
function productSlug(p: {
  data: { slug?: { slug?: string }; name?: string };
  id: string;
}): string {
  return (
    p.data.slug?.slug ||
    p.id.split('/').pop()?.replace('.mdoc', '') ||
    p.data.name?.toLowerCase().replace(/\s+/g, '-') ||
    ''
  );
}

// ---------------------------------------------------------------------------
// URL entry
// ---------------------------------------------------------------------------
interface UrlEntry {
  loc: string;
  changefreq: string;
  priority: string;
  alternates?: { hreflang: string; href: string }[];
}

// ---------------------------------------------------------------------------
// GET handler
// ---------------------------------------------------------------------------
export const GET = async () => {
  const baseUrl = SITE.site.replace(/\/+$/, '');
  const products = await getCollection('products');

  const urls: UrlEntry[] = [];

  // -------------------------------------------------------------------
  // 1. Static pages (home, about, contact) × 8 locales
  // -------------------------------------------------------------------
  for (const locale of LOCALES) {
    const prefix = localePrefix(locale);

    urls.push({
      loc: `${baseUrl}${prefix}`,
      changefreq: 'weekly',
      priority: '1.0',
    });

    urls.push({
      loc: `${baseUrl}${prefix}/about`,
      changefreq: 'monthly',
      priority: '0.5',
    });

    urls.push({
      loc: `${baseUrl}${prefix}/contact`,
      changefreq: 'monthly',
      priority: '0.5',
    });
  }

  // -------------------------------------------------------------------
  // 2. Product type pages × 8 locales
  // -------------------------------------------------------------------
  const productTypes = getAllProductTypes();

  for (const locale of LOCALES) {
    const prefix = localePrefix(locale);

    // Product index
    urls.push({
      loc: `${baseUrl}${prefix}/products`,
      changefreq: 'weekly',
      priority: '0.9',
    });

    for (const type of productTypes) {
      // Type landing (e.g. /products/smart-meters)
      urls.push({
        loc: `${baseUrl}${prefix}/products/${type}`,
        changefreq: 'weekly',
        priority: '0.9',
      });

      // Sub-type pages (e.g. /products/smart-meters/single-phase)
      const subTypes = getProductSubTypes(type);
      for (const subType of subTypes) {
        urls.push({
          loc: `${baseUrl}${prefix}/products/${type}/${subType}`,
          changefreq: 'weekly',
          priority: '0.9',
        });
      }
    }
  }

  // -------------------------------------------------------------------
  // 3. Solution pages × 8 locales
  // -------------------------------------------------------------------
  const techSolutions = getAllTechSolutions();

  for (const locale of LOCALES) {
    const prefix = localePrefix(locale);

    // Solutions index
    urls.push({
      loc: `${baseUrl}${prefix}/solutions`,
      changefreq: 'weekly',
      priority: '0.9',
    });

    for (const solution of techSolutions) {
      // Solution landing (e.g. /solutions/tuya)
      urls.push({
        loc: `${baseUrl}${prefix}/solutions/${solution}`,
        changefreq: 'weekly',
        priority: '0.9',
      });

      // Solution sub-type pages (e.g. /solutions/tuya/tuya-meters)
      const subTypes = getTechSubTypes(solution);
      for (const subType of subTypes) {
        urls.push({
          loc: `${baseUrl}${prefix}/solutions/${solution}/${subType}`,
          changefreq: 'weekly',
          priority: '0.9',
        });
      }
    }
  }

  // -------------------------------------------------------------------
  // 4. Product detail pages with hreflang alternates
  //    Group products by Keystatic slug so we can link locale variants.
  // -------------------------------------------------------------------
  const productGroups = new Map<
    string,
    { locale: string; slug: string }[]
  >();

  for (const p of products) {
    const keySlug = productSlug(p);
    const lang = p.data.language || 'en';
    if (!keySlug) continue;

    if (!productGroups.has(keySlug)) {
      productGroups.set(keySlug, []);
    }
    productGroups.get(keySlug)!.push({ locale: lang, slug: keySlug });
  }

  for (const [, versions] of productGroups) {
    // Build alternates once
    const alternates = versions.map((v) => ({
      hreflang: v.locale,
      href: `${baseUrl}${localePrefix(v.locale)}/products/${v.slug}`,
    }));

    // x-default → en
    const enVersion = versions.find((v) => v.locale === 'en');
    if (enVersion) {
      alternates.push({
        hreflang: 'x-default',
        href: `${baseUrl}/products/${enVersion.slug}`,
      });
    }

    for (const v of versions) {
      urls.push({
        loc: `${baseUrl}${localePrefix(v.locale)}/products/${v.slug}`,
        changefreq: 'weekly',
        priority: '0.8',
        alternates,
      });
    }
  }

  // -------------------------------------------------------------------
  // Render XML
  // -------------------------------------------------------------------
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset',
    '  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '  xmlns:xhtml="http://www.w3.org/1999/xhtml"',
    '>',
    ...urls.map((entry) => {
      const lines = ['  <url>', `    <loc>${escapeXml(entry.loc)}</loc>`];

      if (entry.alternates && entry.alternates.length > 0) {
        for (const alt of entry.alternates) {
          lines.push(
            `    <xhtml:link rel="alternate" hreflang="${escapeXml(alt.hreflang)}" href="${escapeXml(alt.href)}" />`,
          );
        }
      }

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
