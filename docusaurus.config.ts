import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import {themes as prismThemes} from 'prism-react-renderer';

const config: Config = {
  title: 'Lokryn Docs',
  tagline: 'Compliance‑ready developer tools',
  favicon: 'img/favicon.ico',

  future: { v4: true },

  url: 'https://docs.lokryn.com',
  baseUrl: '/',

  organizationName: 'lokryn-suite',
  projectName: 'docs.lokryn.com',

  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn', // <-- ADD IT HERE
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      '@docusaurus/preset-classic',
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: 'docs',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        blog: false,
        // ... other settings (blog, theme)
      }),
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    colorMode: { defaultMode: 'light', disableSwitch: true },
    navbar: {
      title: 'Lokryn',
      logo: { alt: 'Lokryn Logo', src: 'img/logo.png' },
      items: [
        { type: 'docSidebar', sidebarId: 'docsSidebar', position: 'left', label: 'Docs' },
        { href: 'https://github.com/lokryn-suite/docs.lokryn.com', label: 'GitHub', position: 'right' },
        { href: 'https://discord.gg/4JJT9qEfCA', label: 'Discord', position: 'right' },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [{ label: 'Overview', to: '/docs/cli/quickstart' }],
        },
        {
          title: 'Community',
          items: [
            { label: 'Discord', href: 'https://discord.gg/4JJT9qEfCA' },
            { label: 'GitHub', href: 'https://github.com/lokryn-suite/docs.lokryn.com' },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Lokryn.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
