import type { AstroComponentFactory } from 'astro/runtime/server/index.js';
import type { HTMLAttributes, ImageMetadata } from 'astro/types';

export interface Post {
  /** Unique ID identifying the post. */
  id: string;
  /** URL-friendly slug derived from the post name. */
  slug: string;
  /** Fully resolved permalink, computed from the configured pattern. */
  permalink: string;

  publishDate: Date;
  updateDate?: Date;

  title: string;
  /** Optional summary of post content. */
  excerpt?: string;
  image?: ImageMetadata | string;

  category?: Taxonomy;
  tags?: Taxonomy[];
  author?: string;

  metadata?: MetaData;

  draft?: boolean;

  /** Rendered Astro component factory for the post body. */
  Content?: AstroComponentFactory;

  /** Estimated reading time in minutes. */
  readingTime?: number;
}

export interface Taxonomy {
  slug: string;
  title: string;
}

export interface MetaData {
  title?: string;
  ignoreTitleTemplate?: boolean;

  canonical?: string;

  robots?: MetaDataRobots;

  description?: string;

  openGraph?: MetaDataOpenGraph;
  twitter?: MetaDataTwitter;
}

export interface MetaDataRobots {
  index?: boolean;
  follow?: boolean;
}

export interface MetaDataImage {
  url: string;
  width?: number;
  height?: number;
}

export interface MetaDataOpenGraph {
  url?: string;
  siteName?: string;
  images?: Array<MetaDataImage>;
  locale?: string;
  type?: string;
}

export interface MetaDataTwitter {
  handle?: string;
  site?: string;
  cardType?: string;
}

export interface Image {
  src: string;
  alt?: string;
}

export interface Widget {
  id?: string;
  isDark?: boolean;
  bg?: string;
  classes?: Record<string, string | Record<string, string>>;
}

export interface Headline {
  title?: string;
  subtitle?: string;
  tagline?: string;
  classes?: Record<string, string>;
}

interface TeamMember {
  name?: string;
  job?: string;
  image?: Image;
  socials?: Array<Social>;
  description?: string;
  classes?: Record<string, string>;
}

interface Social {
  icon?: string;
  href?: string;
}

export interface Stat {
  amount?: number | string;
  title?: string;
  icon?: string;
}

export interface Item {
  title?: string;
  description?: string;
  icon?: string;
  classes?: Record<string, string>;
  callToAction?: CallToAction;
  image?: Image;
}

export interface Price {
  title?: string;
  subtitle?: string;
  description?: string;
  price?: number | string;
  period?: string;
  items?: Array<Item>;
  callToAction?: CallToAction;
  hasRibbon?: boolean;
  ribbonTitle?: string;
}

export interface Testimonial {
  title?: string;
  testimonial?: string;
  name?: string;
  job?: string;
  image?: string | unknown;
}

export interface Input {
  type: HTMLInputTypeAttribute;
  name: string;
  label?: string;
  autocomplete?: string;
  placeholder?: string;
}

export interface Textarea {
  label?: string;
  name?: string;
  placeholder?: string;
  rows?: number;
}

export interface Disclaimer {
  label?: string;
}

// COMPONENTS
export interface CallToAction extends Omit<HTMLAttributes<'a'>, 'slot'> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'link';
  text?: string;
  icon?: string;
  classes?: Record<string, string>;
  type?: 'button' | 'submit' | 'reset';
}

export interface Collapse {
  iconUp?: string;
  iconDown?: string;
  items?: Array<Item>;
  columns?: number;
  classes?: Record<string, string>;
}

export interface Form {
  inputs?: Array<Input>;
  textarea?: Textarea;
  disclaimer?: Disclaimer;
  button?: string;
  description?: string;
}

// WIDGETS
export interface Hero extends Omit<Headline, 'classes'>, Omit<Widget, 'isDark' | 'classes'> {
  content?: string;
  actions?: string | CallToAction[];
  image?: string | unknown;
}

export interface Team extends Omit<Headline, 'classes'>, Widget {
  team?: Array<TeamMember>;
}

export interface Stats extends Omit<Headline, 'classes'>, Widget {
  stats?: Array<Stat>;
}

export interface Pricing extends Omit<Headline, 'classes'>, Widget {
  prices?: Array<Price>;
}

export interface Testimonials extends Omit<Headline, 'classes'>, Widget {
  testimonials?: Array<Testimonial>;
  callToAction?: CallToAction;
}

export interface Brands extends Omit<Headline, 'classes'>, Widget {
  icons?: Array<string>;
  images?: Array<Image>;
}

export interface Features extends Omit<Headline, 'classes'>, Widget {
  image?: string | unknown;
  items?: Array<Item>;
  columns?: number;
  defaultIcon?: string;
  isBeforeContent?: boolean;
  isAfterContent?: boolean;
}

export interface Faqs extends Omit<Headline, 'classes'>, Widget {
  items?: Array<Item>;
  columns?: number;
}

export interface Steps extends Omit<Headline, 'classes'>, Widget {
  items?: Array<Item>;
  callToAction?: string | CallToAction;
  image?: string | Image;
  isReversed?: boolean;
}

export interface Content extends Omit<Headline, 'classes'>, Widget {
  content?: string;
  image?: string | unknown;
  items?: Array<Item>;
  columns?: number;
  isReversed?: boolean;
  isAfterContent?: boolean;
  callToAction?: CallToAction;
}

export interface Contact extends Omit<Headline, 'classes'>, Form, Widget {}

// ===================================================================
// Products — B2B product catalogue types
// ===================================================================

/** Supported locales for product content (matches content.config.ts schema). */
export type ProductLocale = 'en' | 'zh' | 'es' | 'ru' | 'fr' | 'de' | 'ar' | 'pt';

/** Product content collection data schema fields. */
export interface ProductData {
  name: string;
  model?: string;
  /** Keystatic auto-generated slug from fields.slug { name, slug }. */
  slug?: {
    name: string;
    slug: string;
  };
  description?: string;

  // Dimension 1: Product Type
  productType?: 'smart-meters' | 'thermostats' | 'senior-care' | 'hotel-control' | 'software-platforms';
  productSubType?:
    | 'single-phase'
    | 'three-phase'
    | 'multi-circuit'
    | 'din-rail'
    | 'anti-backflow'
    | '24vac'
    | 'boiler-trv'
    | 'zigbee-hvac'
    | 'emergency'
    | 'safety'
    | 'tracking'
    | 'health'
    | 'management'
    | 'aijuan-app'
    | 'home-care-web'
    | 'nursing-station-web'
    | 'room-thermostat'
    | 'lighting'
    | 'door-sign'
    | 'smartowon-app'
    | 'zigbee-control-web'
    | 'energy-monitor-web'
    | 'partner-platform'
    | 'iot-platform';

  // Dimension 2: Technical Solution
  techSolution?: 'tuya' | 'mqtt' | 'zigbee';
  techSubType?:
    | 'tuya-meters'
    | 'tuya-thermostats'
    | 'tuya-lighting'
    | 'tuya-gateways'
    | 'tuya-remotes'
    | 'tuya-senior'
    | 'tuya-sensors'
    | 'mqtt-meters'
    | 'mqtt-thermostats'
    | 'mqtt-gateways'
    | 'mqtt-remotes'
    | 'mqtt-software'
    | 'zigbee-meters'
    | 'zigbee-thermostats'
    | 'zigbee-lighting'
    | 'zigbee-gateways'
    | 'zigbee-remotes'
    | 'zigbee-senior'
    | 'zigbee-sensors'
    | 'zigbee-energy'
    | 'zigbee-software';

  // Multi-select technical spec arrays
  communication?: Array<'zigbee' | 'wifi' | '4g' | 'lora' | 'nb-iot' | 'modbus' | 'mqtt' | 'tcpip' | 'rj45'>;
  ecosystem?: Array<'tuya' | 'mqtt-open' | 'zigbee-solution' | 'home-assistant' | 'local-api'>;
  extraTags?: Array<'modbus-rtu' | 'modbus-tcp'>;
  softwareType?: Array<'app' | 'web' | 'admin' | 'analytics' | 'iot-platform'>;

  // Media & Specs
  image?: string;
  specs?: {
    accuracy?: string;
    voltage?: string;
    current?: string;
    frequency?: string;
    powerSupply?: string;
    display?: string;
    dimensions?: string;
    weight?: string;
    operatingTemp?: string;
    protocol?: string;
    certification?: string;
    warranty?: string;
  };

  language?: ProductLocale;
}

/**
 * Full product entry — flat interface combining content collection data
 * with Astro's CollectionEntry render fields. All ProductData fields are
 * available at the top level for convenient component access.
 */
export interface Product extends Omit<ProductData, 'slug'> {
  /** Unique Astro-generated ID (e.g. "src/content/products/pc321-ty.mdoc"). */
  id: string;
  /** URL-friendly slug computed by Astro from the file path. */
  slug: string;
  /** Collection name, always "products". */
  collection: 'products';
  /** The product's content collection data (also spread at top level). */
  data: ProductData;
  /** Rendered HTML body (from .mdoc content). */
  body?: string;
  /** Rendered output metadata (Astro v6 render fields). */
  rendered?: {
    html?: string;
    metadata?: Record<string, unknown>;
  };
}

/**
 * Filter state for the product catalogue page.
 * Single-value filters use AND logic between groups.
 * Array filters use OR logic within each group (product must match at least one).
 */
export interface ProductFilterState {
  productType?: ProductData['productType'];
  productSubType?: ProductData['productSubType'];
  techSolution?: ProductData['techSolution'];
  techSubType?: ProductData['techSubType'];
  communication?: ProductData['communication'];
  ecosystem?: ProductData['ecosystem'];
  extraTags?: ProductData['extraTags'];
  softwareType?: ProductData['softwareType'];
}

// Convenience type aliases for product catalogue values (reusable across components)

export type ProductType = 'smart-meters' | 'thermostats' | 'senior-care' | 'hotel-control' | 'software-platforms';

export type ProductSubType =
  // Smart Meters
  | 'single-phase'
  | 'three-phase'
  | 'multi-circuit'
  | 'din-rail'
  | 'anti-backflow'
  // Thermostats
  | '24vac'
  | 'boiler-trv'
  | 'zigbee-hvac'
  // Senior Care
  | 'emergency'
  | 'safety'
  | 'tracking'
  | 'health'
  | 'management'
  | 'aijuan-app'
  | 'home-care-web'
  | 'nursing-station-web'
  // Hotel Control
  | 'room-thermostat'
  | 'lighting'
  | 'door-sign'
  | 'energy-management'
  // Software & Platforms
  | 'smartowon-app'
  | 'zigbee-control-web'
  | 'energy-monitor-web'
  | 'partner-platform'
  | 'iot-platform';

export type TechSolution = 'tuya' | 'mqtt' | 'zigbee';

export type TechSubType =
  // Tuya
  | 'tuya-meters'
  | 'tuya-thermostats'
  | 'tuya-lighting'
  | 'tuya-gateways'
  | 'tuya-remotes'
  | 'tuya-senior'
  | 'tuya-sensors'
  // MQTT
  | 'mqtt-meters'
  | 'mqtt-thermostats'
  | 'mqtt-gateways'
  | 'mqtt-remotes'
  | 'mqtt-software'
  // ZigBee
  | 'zigbee-meters'
  | 'zigbee-thermostats'
  | 'zigbee-lighting'
  | 'zigbee-gateways'
  | 'zigbee-remotes'
  | 'zigbee-senior'
  | 'zigbee-sensors'
  | 'zigbee-energy'
  | 'zigbee-software';

export type CommunicationMethod = 'zigbee' | 'wifi' | '4g' | 'lora' | 'nb-iot' | 'modbus' | 'mqtt' | 'tcpip' | 'rj45';

export type EcosystemType = 'tuya' | 'mqtt-open' | 'zigbee-solution' | 'home-assistant' | 'local-api';

export type ExtraTag = 'modbus-rtu' | 'modbus-tcp';

export type SoftwareType = 'app' | 'web' | 'admin' | 'analytics' | 'iot-platform';

export interface ProductSpecs {
  accuracy?: string;
  voltage?: string;
  current?: string;
  frequency?: string;
  powerSupply?: string;
  display?: string;
  dimensions?: string;
  weight?: string;
  operatingTemp?: string;
  protocol?: string;
  certification?: string;
  warranty?: string;
}
