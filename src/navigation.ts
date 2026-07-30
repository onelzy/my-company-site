import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';
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
        { text: 'Smart Hotels', href: getPermalink('/solutions/smart-hotel-energy-management') },
        { text: 'Senior Care', href: getPermalink('/solutions/senior-care-monitoring') },
        { text: 'Energy Management', href: getPermalink('/solutions/industrial-energy-submetering') },
        { text: 'Smart Building', href: getPermalink('/solutions') },
        { text: 'Industrial IoT', href: getPermalink('/solutions') },
      ],
    },
    {
      text: 'Resources',
      links: [
        { text: '📥 Brochures', href: getPermalink('/resources/brochures') },
        { text: '📝 Case Studies', href: getBlogPermalink() },
        { text: '❓ FAQ', href: getPermalink('/resources/faq') },
        { text: '🔌 API Docs', href: getPermalink('/developers/api') },
        { text: '📰 Blog', href: getBlogPermalink() },
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
  actions: [
    {
      text: 'WhatsApp',
      href: `https://wa.me/${whatsappNumber}`,
      icon: 'tabler:brand-whatsapp',
    },
    { text: 'Contact Sales', href: getPermalink('/contact-sales'), icon: 'tabler:message' },
  ],
};

export const footerData = {
  links: [
    {
      title: 'Products & Solutions',
      links: [
        { text: 'Smart Energy Meters', href: getPermalink('/products?dim=type&type=smart-meters') },
        { text: 'Smart Thermostats', href: getPermalink('/products?dim=type&type=thermostats') },
        { text: 'Hotel Control Systems', href: getPermalink('/products?dim=type&type=hotel-control') },
        { text: 'Senior Care Solutions', href: getPermalink('/products?dim=type&type=senior-care') },
        { text: 'EdgeEco IoT Platform', href: getPermalink('/products?dim=type&type=software-platforms') },
        { text: 'All Products →', href: getPermalink('/products') },
      ],
    },
    {
      title: 'Solutions',
      links: [
        { text: 'Smart Hotels', href: getPermalink('/solutions/smart-hotel-energy-management') },
        { text: 'Senior Care', href: getPermalink('/solutions/senior-care-monitoring') },
        { text: 'Energy Management', href: getPermalink('/solutions/industrial-energy-submetering') },
        { text: 'Smart Building', href: getPermalink('/solutions') },
        { text: 'Industrial IoT', href: getPermalink('/solutions') },
      ],
    },
    {
      title: 'Resources',
      links: [
        { text: '📥 Brochures', href: getPermalink('/resources/brochures') },
        { text: '📝 Case Studies', href: getBlogPermalink() },
        { text: '❓ FAQ', href: getPermalink('/resources/faq') },
        { text: '🔌 API Documentation', href: getPermalink('/developers/api') },
        { text: '📰 Blog', href: getBlogPermalink() },
      ],
    },
    {
      title: 'Company',
      links: [
        { text: 'About Us', href: getPermalink('/about') },
        { text: 'Contact Sales', href: getPermalink('/contact-sales') },
        { text: `✉️ ${contactEmail}`, href: `mailto:${contactEmail}` },
        { text: 'Privacy Policy', href: getPermalink('/privacy') },
        { text: 'Terms of Use', href: getPermalink('/terms') },
      ],
    },
  ],
  secondaryLinks: [],
  socialLinks: [
    { ariaLabel: 'WhatsApp', icon: 'tabler:brand-whatsapp', href: `https://wa.me/${whatsappNumber}` },
    { ariaLabel: 'Email', icon: 'tabler:mail', href: `mailto:${contactEmail}` },
    { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
  ],
  footNote: `
    © ${new Date().getFullYear()} XIAMEN OWON TECHNOLOGY CO.,LTD. · ISO 9001 Certified
  `,
};
