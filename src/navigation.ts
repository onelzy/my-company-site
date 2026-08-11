import { getPermalink, getAsset, getBlogPermalink } from './utils/permalinks';
import { SITE } from 'astrowind:config';

const whatsappNumber = SITE.contact?.whatsapp || '8618650139895';
const contactEmail = SITE.contact?.email || 'info@owon-iot.com';

export const headerData = {
  links: [
    {
      text: 'Products',
      links: [
        { text: 'Smart Energy Meters', href: getPermalink('/products?dim=type&type=smart-meters') },
        { text: 'Smart Thermostats', href: getPermalink('/products?dim=type&type=thermostats') },
        { text: 'Hotel Control', href: getPermalink('/products?dim=type&type=hotel-control') },
        { text: 'Senior Care', href: getPermalink('/products?dim=type&type=senior-care') },
        { text: 'Software & Platforms', href: getPermalink('/products?dim=type&type=software-platforms') },
        { text: 'All Products →', href: getPermalink('/products') },
      ],
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
    },
    {
      text: 'Developers',
      href: getPermalink('/developers'),
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
        { text: 'Software & Platforms', href: getPermalink('/products?dim=type&type=software-platforms') },
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
        { text: 'Developer Center', href: getPermalink('/developers') },
        { text: 'HTTP Server API', href: getPermalink('/developers/api') },
        { text: 'ZigBee Clusters', href: getPermalink('/developers/zigbee') },
        { text: 'MQTT Quick Start', href: getPermalink('/developers/mqtt') },
        { text: 'SDKs & Libraries', href: getPermalink('/developers/sdks') },
        { text: 'Home Assistant', href: getPermalink('/developers/ha') },
        { text: 'Code Examples', href: getPermalink('/developers/examples') },
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
    { ariaLabel: 'Email', icon: 'tabler:mail', href: `mailto:${contactEmail}` },
    { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
  ],
  footNote: `
    © ${new Date().getFullYear()} XIAMEN OWON TECHNOLOGY CO.,LTD.
  `,
};
