import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

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
      ],
    },

    // --- Shopify Marketplace ---
    {
      type: 'category',
      label: 'Shopify Marketplace',
      items: [
        { type: 'doc', id: 'shopify/affiliate-ping/affiliate-ping-index', label: 'Affiliate Ping' },
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
