import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// ===================================================================
// Shared metadata schema (reused across collections)
// ===================================================================
const metadataDefinition = () =>
  z
    .object({
      title: z.string().optional(),
      ignoreTitleTemplate: z.boolean().optional(),
      canonical: z.string().url().optional(),
      robots: z
        .object({
          index: z.boolean().optional(),
          follow: z.boolean().optional(),
        })
        .optional(),
      description: z.string().optional(),
      openGraph: z
        .object({
          url: z.string().optional(),
          siteName: z.string().optional(),
          images: z
            .array(
              z.object({
                url: z.string(),
                width: z.number().optional(),
                height: z.number().optional(),
              })
            )
            .optional(),
          locale: z.string().optional(),
          type: z.string().optional(),
        })
        .optional(),
      twitter: z
        .object({
          handle: z.string().optional(),
          site: z.string().optional(),
          cardType: z.string().optional(),
        })
        .optional(),
    })
    .optional();

// ===================================================================
// Blog posts
// ===================================================================
const postCollection = defineCollection({
  loader: glob({ pattern: ['*.md', '*.mdx'], base: 'src/data/post' }),
  schema: z.object({
    publishDate: z.date().optional(),
    updateDate: z.date().optional(),
    draft: z.boolean().optional(),
    title: z.string(),
    excerpt: z.string().optional(),
    image: z.string().optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    author: z.string().optional(),
    language: z.enum(['en', 'zh', 'es', 'ru', 'fr', 'de', 'ar', 'pt']).optional(),
    metadata: metadataDefinition(),
  }),
});

// ===================================================================
// Products — B2B product catalogue (Keystatic-managed .mdoc files)
// ===================================================================
const productsCollection = defineCollection({
  loader: glob({ pattern: '*.mdoc', base: 'src/content/products' }),
  schema: z.object({
    // Basic info
    name: z.string(),
    model: z.string().optional(),
    slug: z
      .object({
        name: z.string(),
        slug: z.string(),
      })
      .optional(),
    description: z.string().optional(),

    // Dimension 1: Product Type
    productType: z
      .enum([
        'smart-meters',
        'thermostats',
        'senior-care',
        'hotel-control',
        'software-platforms',
      ])
      .optional(),
    productSubType: z
      .enum([
        // Smart Meters
        'single-phase', 'three-phase', 'multi-circuit', 'din-rail', 'anti-backflow',
        // Thermostats
        '24vac', 'boiler-trv', 'zigbee-hvac',
        // Senior Care
        'emergency', 'safety', 'tracking', 'health', 'management',
        'aijuan-app', 'home-care-web', 'nursing-station-web',
        // Hotel Control
        'room-thermostat', 'lighting', 'door-sign', 'energy-management',
        // Software & Platforms
        'smartowon-app', 'zigbee-control-web', 'energy-monitor-web', 'partner-platform', 'iot-platform',
      ])
      .optional(),

    // Dimension 2: Technical Solution
    techSolution: z.enum(['tuya', 'mqtt', 'zigbee']).optional(),
    techSubType: z
      .enum([
        // Tuya
        'tuya-meters', 'tuya-thermostats', 'tuya-lighting', 'tuya-gateways',
        'tuya-remotes', 'tuya-senior', 'tuya-sensors',
        // MQTT
        'mqtt-meters', 'mqtt-thermostats', 'mqtt-gateways', 'mqtt-remotes', 'mqtt-software',
        // ZigBee
        'zigbee-meters', 'zigbee-thermostats', 'zigbee-lighting', 'zigbee-gateways',
        'zigbee-remotes', 'zigbee-senior', 'zigbee-sensors', 'zigbee-energy', 'zigbee-software',
      ])
      .optional(),

    // Technical Specs (multi-select arrays)
    communication: z
      .array(z.enum(['zigbee', 'wifi', '4g', 'lora', 'nb-iot', 'modbus', 'mqtt', 'tcpip', 'rj45']))
      .optional(),
    ecosystem: z
      .array(z.enum(['tuya', 'mqtt-open', 'zigbee-solution', 'home-assistant', 'local-api']))
      .optional(),
    extraTags: z.array(z.enum(['modbus-rtu', 'modbus-tcp'])).optional(),
    softwareType: z
      .array(z.enum(['app', 'web', 'admin', 'analytics', 'iot-platform']))
      .optional(),

    // Media & Specs
    image: z.string().optional(),
    specs: z
      .object({
        accuracy: z.string().optional(),
        voltage: z.string().optional(),
        current: z.string().optional(),
        frequency: z.string().optional(),
        powerSupply: z.string().optional(),
        display: z.string().optional(),
        dimensions: z.string().optional(),
        weight: z.string().optional(),
        operatingTemp: z.string().optional(),
        protocol: z.string().optional(),
        certification: z.string().optional(),
        warranty: z.string().optional(),
      })
      .optional(),

    // Language
    language: z.enum(['en', 'zh', 'es', 'ru', 'fr', 'de', 'ar', 'pt']).optional(),
  }),
});

// ===================================================================
// Solutions — Industry use-case driven solutions
// ===================================================================
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
    stats: z
      .array(z.object({ value: z.string(), label: z.string() }))
      .optional(),
    language: z.enum(['en']).optional(),
  }),
});

// ===================================================================
// Export
// ===================================================================
export const collections = {
  post: postCollection,
  products: productsCollection,
  solutions: solutionsCollection,
};
