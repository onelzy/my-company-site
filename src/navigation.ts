import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'Products',
      links: [
        {
          text: 'All Products',
          href: getPermalink('/products'),
        },
        {
          text: 'Smart Meters',
          href: getPermalink('/products/smart-meters'),
        },
        {
          text: 'Thermostats',
          href: getPermalink('/products/thermostats'),
        },
        {
          text: 'Senior Care',
          href: getPermalink('/products/senior-care'),
        },
        {
          text: 'Hotel Control',
          href: getPermalink('/products/hotel-control'),
        },
        {
          text: 'Software & Platforms',
          href: getPermalink('/products/software-platforms'),
        },
      ],
    },
    {
      text: 'Solutions',
      links: [
        {
          text: 'All Solutions',
          href: getPermalink('/solutions'),
        },
        {
          text: 'Tuya Ecosystem',
          href: getPermalink('/solutions/tuya'),
        },
        {
          text: 'MQTT Protocol',
          href: getPermalink('/solutions/mqtt'),
        },
        {
          text: 'ZigBee Standard',
          href: getPermalink('/solutions/zigbee'),
        },
      ],
    },
    {
      text: 'Company',
      links: [
        {
          text: 'About Us',
          href: getPermalink('/about'),
        },
        {
          text: 'Contact',
          href: getPermalink('/contact'),
        },
        {
          text: 'Blog',
          href: getBlogPermalink(),
        },
      ],
    },
  ],
  actions: [
    { text: 'Contact Us', href: getPermalink('/contact') },
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
      ],
    },
    {
      title: 'Solutions',
      links: [
        { text: 'Tuya Ecosystem', href: getPermalink('/solutions/tuya') },
        { text: 'MQTT Protocol', href: getPermalink('/solutions/mqtt') },
        { text: 'ZigBee Standard', href: getPermalink('/solutions/zigbee') },
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
    © ${new Date().getFullYear()} OWON Technology Inc. All rights reserved.
  `,
};
