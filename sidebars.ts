import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    // --- Lokryn Landing Page ---
    {
      type: 'doc',
      id: 'lokryn/lokryn-index',
      label: 'Lokryn',
    },

    // --- AWS Marketplace ---
    {
      type: 'category',
      label: 'AWS Marketplace',
      items: [
        { type: 'doc', id: 'aws/redeliver/redeliver-index', label: 'Redeliver' },
        { type: 'doc', id: 'aws/flight-recorder/flight-recorder-index', label: 'Flight Recorder' },
        { type: 'doc', id: 'aws/relay/relay-index', label: 'Relay' },
        {
          type: 'category',
          label: 'Containers',
          items: [
            {
              type: 'category',
              label: 'DuckLake',
              items: [
                { type: 'doc', id: 'aws/containers/ducklake/ducklake-index', label: 'Overview' },
                'aws/containers/ducklake/getting-started',
                'aws/containers/ducklake/configuration',
                'aws/containers/ducklake/connecting',
                'aws/containers/ducklake/iam-permissions',
                'aws/containers/ducklake/troubleshooting',
              ],
            },
          ],
        },
      ],
    },

    // --- Shopify Marketplace ---
    {
      type: 'category',
      label: 'Shopify Marketplace',
      items: [
        {
          type: 'doc',
          id: 'shopify/affiliate-ping/affiliate-ping-index',
          label: 'Affiliate Ping'
        },
        {
          type: 'doc',
          id: 'shopify/affiliate-ping/affiliate-ping-faq',
          label: 'FAQ'
        },
      ],
    },


    // --- API Marketplace ---
    {
      type: 'category',
      label: 'API Marketplace',
      items: [
        { type: 'doc', id: 'api/logoqr-pro/logoqr-pro-index', label: 'LogoQR Pro' },
      ],
    },
  ],
};

export default sidebars;
