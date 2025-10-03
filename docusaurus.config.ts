import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Lokryn Docs',
  tagline: 'Compliance‑ready developer tools',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://docs.lokryn.com',
  baseUrl: '/',

  organizationName: 'lokryn-suite', // GitHub org/user
  projectName: 'docs.lokryn.com',   // Repo name

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // If you want "Edit this page" links, uncomment and update:
          // editUrl: 'https://github.com/lokryn-suite/docs.lokryn.com/tree/main/',
        },
        // Blog removed to avoid broken /blog links
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Lokryn',
      logo: {
        alt: 'Lokryn Logo',
        src: 'img/logo.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          href: 'https://github.com/lokryn-suite/docs.lokryn.com',
          label: 'GitHub',
          position: 'right',
        },
        {
          href: 'https://discord.gg/4JJT9qEfCA',
          label: 'Discord',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Overview',
              to: '/docs/cli/quickstart', // point to your real quickstart
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Discord',
              href: 'https://discord.gg/4JJT9qEfCA',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/lokryn-suite/docs.lokryn.com',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Lokryn. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
