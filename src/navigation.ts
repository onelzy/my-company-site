import { getPermalink, getAsset, getBlogPermalink } from './utils/permalinks';
import { SITE } from 'astrowind:config';
import { solutions } from '~/data/solutions';
import { getAllProductTypes, PRODUCT_TYPE_LABELS, getLocalizedLabel } from './utils/products';

const whatsappNumber = SITE.contact?.whatsapp || '8618650139895';
const contactEmail = SITE.contact?.email || 'info@owon-iot.com';

// ---------------------------------------------------------------------------
// Mega menu types
// ---------------------------------------------------------------------------
export interface MegaLink {
  text: string;
  href: string;
  /** One-line description shown under the link text (SEO/AI-friendly). */
  desc?: string;
  /** True when the target page doesn't exist yet — renders an italic placeholder. */
  placeholder?: boolean;
}

export interface MegaGroup {
  label: string;
  chips: MegaLink[];
}

export interface MegaDevGroup {
  label: string;
  items: MegaLink[];
}

export interface MegaPanel {
  /** Chip-group layout (Products). */
  groups?: MegaGroup[];
  /** Description-item layout (Solutions, Resources). */
  items?: MegaLink[];
  /** Optional label above the items grid. */
  label?: string;
  /** 2×2 grouped layout (Developers). */
  devGroups?: MegaDevGroup[];
  /** Bottom-right "All … →" link. */
  footer?: MegaLink;
  /** Panel width in px. */
  width: number;
  /** Align under the trigger (right-align prevents viewport overflow at lg). */
  align?: 'left' | 'right';
}

export interface MenuLink {
  text: string;
  href?: string;
  links?: MenuLink[];
  mega?: MegaPanel;
}

// ---------------------------------------------------------------------------
// Real solution subtitles from the solution mdocs, keyed by industry —
// the mega menu shows real copy and auto-updates when solution pages land.
// ---------------------------------------------------------------------------
const solutionSubtitle: Record<string, string> = {};
for (const s of solutions) {
  const industry = s.data.industry as string | undefined;
  const subtitle = s.data.subtitle as string | undefined;
  if (industry && subtitle) solutionSubtitle[industry] = subtitle;
}

const industryItem = (industry: string, label: string): MegaLink => {
  const href = getPermalink(`/solutions?industry=${industry}`);
  const desc = solutionSubtitle[industry];
  return desc ? { text: label, href, desc } : { text: label, href, placeholder: true };
};

// Product Type chips derive from the real catalog (no dead-end chips).
const productTypeChips: MegaLink[] = getAllProductTypes().map((t) => ({
  text: getLocalizedLabel(PRODUCT_TYPE_LABELS, t, 'en'),
  href: getPermalink(`/products?dim=type&type=${t}`),
}));

// Tech Solution chips mirror the products page filter (getAllTechSolutions).
const TECH_SOLUTION_LABELS: Record<string, string> = { tuya: 'Tuya', mqtt: 'API', zigbee: 'ZigBee 3.0' };
const techSolutionChips: MegaLink[] = Object.entries(TECH_SOLUTION_LABELS).map(([value, label]) => ({
  text: label,
  href: getPermalink(`/products?dim=solution&sol=${value}`),
}));

// Connection chips mirror the products page filter panel exactly.
const connectionChips: MegaLink[] = [
  { text: 'ZigBee', href: getPermalink('/products?dim=comm&comm=zigbee') },
  { text: 'WiFi', href: getPermalink('/products?dim=comm&comm=wifi') },
  { text: 'Bluetooth', href: getPermalink('/products?dim=comm&comm=ble') },
  { text: '4G', href: getPermalink('/products?dim=comm&comm=4g') },
  { text: 'RJ45', href: getPermalink('/products?dim=comm&comm=rj45') },
  { text: 'RF', href: getPermalink('/products?dim=comm&comm=rf') },
  { text: 'RS-485', href: getPermalink('/products?dim=comm&comm=rs485') },
];

export const headerData = {
  links: [
    {
      text: 'Products',
      links: [
        ...productTypeChips.map(({ text, href }) => ({ text, href })),
        { text: 'All Products →', href: getPermalink('/products') },
      ],
      mega: {
        width: 560,
        groups: [
          { label: 'By Product Type', chips: productTypeChips },
          { label: 'By Tech Solution', chips: techSolutionChips },
          { label: 'By Connection', chips: connectionChips },
        ],
        footer: { text: 'All Products →', href: getPermalink('/products') },
      },
    },
    {
      text: 'Solutions',
      links: [
        { text: 'Smart Hotels', href: getPermalink('/solutions?industry=smart-hotels') },
        { text: 'Senior Care', href: getPermalink('/solutions?industry=senior-care') },
        { text: 'Energy Management', href: getPermalink('/solutions?industry=energy-management') },
        { text: 'Smart Building', href: getPermalink('/solutions?industry=smart-building') },
        { text: 'Industrial IoT', href: getPermalink('/solutions?industry=industrial-iot') },
        { text: 'All Solutions →', href: getPermalink('/solutions') },
      ],
      mega: {
        width: 640,
        label: 'By Industry',
        items: [
          industryItem('smart-hotels', 'Smart Hotels'),
          industryItem('senior-care', 'Senior Care'),
          industryItem('energy-management', 'Energy Management'),
          industryItem('smart-building', 'Smart Building'),
          industryItem('industrial-iot', 'Industrial IoT'),
        ],
        footer: { text: 'All Solutions →', href: getPermalink('/solutions') },
      },
    },
    {
      text: 'Resources',
      links: [
        { text: 'Documentation', href: getPermalink('/resources/documentation') },
        { text: 'Videos', href: getPermalink('/resources/videos') },
        { text: 'App Downloads', href: getPermalink('/resources/app') },
        { text: 'FAQ', href: getPermalink('/resources/faq') },
        { text: 'Case Studies', href: getPermalink('/case-studies') },
        { text: 'Blog', href: getBlogPermalink() },
      ],
      mega: {
        width: 540,
        items: [
          {
            text: 'Documentation',
            href: getPermalink('/resources/documentation'),
            desc: 'Datasheets, manuals & quick start guides',
          },
          { text: 'Videos', href: getPermalink('/resources/videos'), desc: 'Product demos & installation guides' },
          {
            text: 'App Downloads',
            href: getPermalink('/resources/app'),
            desc: 'MQTT Debugger, Energy Dashboard & tools',
          },
          { text: 'FAQ', href: getPermalink('/resources/faq'), desc: 'Meters, thermostats, IoT & API questions' },
          { text: 'Case Studies', href: getPermalink('/case-studies'), desc: 'Real deployments across industries' },
          { text: 'Blog', href: getBlogPermalink(), desc: 'Product news & industry insights' },
        ],
      },
    },
    {
      text: 'Developers',
      href: getPermalink('/developers'),
      links: [
        { text: 'Integration Overview', href: getPermalink('/developers') },
        { text: 'Method A · Server API', href: getPermalink('/developers/api') },
        { text: 'Method B · MQTT / TCP', href: getPermalink('/developers/mqtt') },
        { text: 'Method D · ZigBee', href: getPermalink('/developers/zigbee') },
        { text: 'Home Assistant', href: getPermalink('/developers/ha') },
        { text: 'Samples', href: getPermalink('/developers/examples') },
      ],
      mega: {
        width: 620,
        align: 'right',
        devGroups: [
          {
            label: 'Getting Started',
            items: [
              {
                text: 'Integration Overview',
                href: getPermalink('/developers'),
                desc: 'Four proven ways to connect OWON devices',
              },
              {
                text: 'Samples',
                href: getPermalink('/developers/examples'),
                desc: 'Real command, telemetry & heartbeat flows',
              },
            ],
          },
          {
            label: 'Methods',
            items: [
              {
                text: 'Method A · Server API',
                href: getPermalink('/developers/api'),
                desc: 'Cloud-to-cloud HTTP/JSON with OWON 6000',
              },
              {
                text: 'Method B · MQTT / TCP',
                href: getPermalink('/developers/mqtt'),
                desc: 'Gateway straight to your own server',
              },
              {
                text: 'Method D · ZigBee',
                href: getPermalink('/developers/zigbee'),
                desc: 'OWON devices on your coordinator',
              },
            ],
          },
          {
            label: 'Platforms',
            items: [
              {
                text: 'Home Assistant & Z2M',
                href: getPermalink('/developers/ha'),
                desc: 'Pairing, entities & per-model support',
              },
            ],
          },
        ],
      },
    },
    {
      text: 'About',
      href: getPermalink('/about'),
    },
  ],
  actions: [{ text: 'Contact Us', href: getPermalink('/contact'), icon: 'tabler:message' }],
};

export const footerData = {
  links: [
    {
      title: 'Products',
      links: [
        { text: 'Smart Energy Meters', href: getPermalink('/products?dim=type&type=smart-meters') },
        { text: 'Smart Thermostats', href: getPermalink('/products?dim=type&type=thermostats') },
        { text: 'Hotel Control', href: getPermalink('/products?dim=type&type=hotel-control') },
        { text: 'Senior Care', href: getPermalink('/products?dim=type&type=senior-care') },
        { text: 'Gateways', href: getPermalink('/products?dim=type&type=gateways') },
        { text: 'All Products →', href: getPermalink('/products') },
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
        { text: 'All Solutions →', href: getPermalink('/solutions') },
      ],
    },
    {
      title: 'Resources',
      links: [
        { text: 'Documentation', href: getPermalink('/resources/documentation') },
        { text: 'Videos', href: getPermalink('/resources/videos') },
        { text: 'App Downloads', href: getPermalink('/resources/app') },
        { text: 'FAQ', href: getPermalink('/resources/faq') },
        { text: 'Case Studies', href: getPermalink('/case-studies') },
        { text: 'Blog', href: getBlogPermalink() },
      ],
    },
    {
      title: 'Developers',
      links: [
        { text: 'Integration Overview', href: getPermalink('/developers') },
        { text: 'Method A · Server API', href: getPermalink('/developers/api') },
        { text: 'Method B · MQTT / TCP', href: getPermalink('/developers/mqtt') },
        { text: 'Method D · ZigBee', href: getPermalink('/developers/zigbee') },
        { text: 'Home Assistant', href: getPermalink('/developers/ha') },
        { text: 'Samples', href: getPermalink('/developers/examples') },
      ],
    },
    {
      title: 'About',
      links: [
        { text: 'About Us', href: getPermalink('/about') },
        { text: 'Contact Us', href: getPermalink('/contact') },
      ],
    },
  ],
  secondaryLinks: [],
  socialLinks: [
    { ariaLabel: 'WhatsApp', icon: 'tabler:brand-whatsapp', href: `https://wa.me/${whatsappNumber}` },
    {
      ariaLabel: 'Facebook',
      icon: 'tabler:brand-facebook',
      href: 'https://www.facebook.com/profile.php?id=61581911978541',
    },
    { ariaLabel: 'YouTube', icon: 'tabler:brand-youtube', href: 'https://youtube.com/@owon-technology' },
    { ariaLabel: 'Email', icon: 'tabler:mail', href: `mailto:${contactEmail}` },
    { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
  ],
  footNote: `
    © ${new Date().getFullYear()} XIAMEN OWON TECHNOLOGY CO.,LTD.
  `,
};
