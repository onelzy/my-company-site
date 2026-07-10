import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';

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
      links: [
        {
          text: 'API Reference',
          href: getPermalink('/developers/api'),
        },
        {
          text: 'SDKs & Libraries',
          href: getPermalink('/developers/sdks'),
        },
        {
          text: 'Code Examples',
          href: getPermalink('/developers/examples'),
        },
        {
          text: 'Firmware Changelog',
          href: getPermalink('/developers/changelog'),
        },
      ],
    },
    {
      text: 'Resources',
      links: [
        {
          text: 'Blog',
          href: getBlogPermalink(),
        },
        {
          text: 'Brochures & Datasheets',
          href: getPermalink('/resources/brochures'),
        },
        {
          text: 'Video Center',
          href: getPermalink('/resources/videos'),
        },
        {
          text: 'FAQ',
          href: getPermalink('/resources/faq'),
        },
        {
          text: 'About Us',
          href: getPermalink('/about'),
        },
      ],
    },
  ],
  actions: [{ text: 'Contact Sales', href: getPermalink('/contact-sales') }],
};

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
        { text: 'Smart Hotels', href: getPermalink('/solutions') },
        { text: 'Senior Care', href: getPermalink('/solutions') },
        { text: 'Energy Management', href: getPermalink('/solutions') },
        { text: 'Smart Building', href: getPermalink('/solutions') },
        { text: 'Industrial IoT', href: getPermalink('/solutions') },
      ],
    },
    {
      title: 'Company',
      links: [
        { text: 'About', href: getPermalink('/about') },
        { text: 'Contact Sales', href: getPermalink('/contact-sales') },
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
  secondaryLinks: [
    { text: 'Terms', href: getPermalink('/terms') },
    { text: 'Privacy Policy', href: getPermalink('/privacy') },
  ],
  socialLinks: [
    { ariaLabel: 'LinkedIn', icon: 'tabler:brand-linkedin', href: '#' },
    { ariaLabel: 'YouTube', icon: 'tabler:brand-youtube', href: '#' },
    { ariaLabel: 'Facebook', icon: 'tabler:brand-facebook', href: '#' },
    { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
  ],
  footNote: `
    © ${new Date().getFullYear()} XIAMEN OWON TECHNOLOGY CO.,LTD. All rights reserved.
  `,
};
