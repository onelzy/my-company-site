import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';
import { SITE } from 'astrowind:config';

const whatsappNumber = SITE.contact?.whatsapp || '8618650139895';

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
      text: 'Blog',
      href: getBlogPermalink(),
    },
    {
      text: 'Developers',
      href: getPermalink('/developers'),
    },
    {
      text: 'Resources',
      links: [
        {
          text: 'Datasheets & Brochures',
          href: getPermalink('/resources/brochures'),
        },
        {
          text: 'Video Center',
          href: getPermalink('/resources/videos'),
        },
      ],
    },
  ],
  actions: [
    {
      text: 'WhatsApp',
      href: `https://wa.me/${whatsappNumber}`,
      icon: 'tabler:brand-whatsapp',
    },
    { text: 'Talk to Sales', href: getPermalink('/contact-sales'), icon: 'tabler:message' },
  ],
};

export const footerData = {
  links: [
    {
      title: 'Products',
      links: [
        { text: 'Smart Meters', href: getPermalink('/products/smart-meters') },
        { text: 'Thermostats', href: getPermalink('/products/thermostats') },
        { text: 'Senior Care', href: getPermalink('/products/senior-care') },
        { text: 'Hotel Control', href: getPermalink('/products/hotel-control') },
        { text: 'Software & Platforms', href: getPermalink('/products/software-platforms') },
        { text: 'All Products', href: getPermalink('/products') },
      ],
    },
    {
      title: 'Solutions',
      links: [
        { text: 'Smart Hotels', href: getPermalink('/solutions') },
        { text: 'Senior Care', href: getPermalink('/solutions') },
        { text: 'Energy Management', href: getPermalink('/solutions') },
        { text: 'Smart Building', href: getPermalink('/solutions') },
        { text: 'Industrial IoT', href: getPermalink('/solutions') },
      ],
    },
    {
      title: 'Developers',
      links: [
        { text: 'API Reference', href: getPermalink('/developers/api') },
        { text: 'SDKs & Libraries', href: getPermalink('/developers/sdks') },
        { text: 'Documentation', href: getPermalink('/developers') },
      ],
    },
    {
      title: 'Company',
      links: [
        { text: 'About Us', href: getPermalink('/about') },
        { text: 'FAQ', href: getPermalink('/resources/faq') },
        { text: 'Contact Sales', href: getPermalink('/contact-sales') },
        { text: 'Blog', href: getBlogPermalink() },
      ],
    },
  ],
  secondaryLinks: [
    { text: 'Terms', href: getPermalink('/terms') },
    { text: 'Privacy Policy', href: getPermalink('/privacy') },
  ],
  socialLinks: [
    { ariaLabel: 'WhatsApp', icon: 'tabler:brand-whatsapp', href: `https://wa.me/${whatsappNumber}` },
    { ariaLabel: 'LinkedIn', icon: 'tabler:brand-linkedin', href: '#' },
    { ariaLabel: 'YouTube', icon: 'tabler:brand-youtube', href: '#' },
    { ariaLabel: 'Facebook', icon: 'tabler:brand-facebook', href: '#' },
    { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
  ],
  footNote: `
    © ${new Date().getFullYear()} XIAMEN OWON TECHNOLOGY CO.,LTD. All rights reserved.
  `,
};
