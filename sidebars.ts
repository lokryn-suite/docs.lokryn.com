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
        { type: 'doc', id: 'aws/manifest/manifest-index', label: 'Manifest' },
        { type: 'doc', id: 'aws/field-notes/field-notes-index', label: 'Field Notes' },
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

    // --- Public Works ---
    {
      type: 'category',
      label: 'Public Works',
      items: [
        { type: 'doc', id: 'public-works/public-works-index', label: 'Public Works' },
        {
          type: 'category',
          label: 'Compliance Log Schema',
          items: [
            { type: 'doc', id: 'public-works/compliance-log-schema/compliance-log-schema-index', label: 'Overview' },
            'public-works/compliance-log-schema/schema-reference',
            'public-works/compliance-log-schema/usage-examples',
            'public-works/compliance-log-schema/standard-mappings',
          ],
        },
        {
          type: 'category',
          label: 'Merkle Tree',
          items: [
            { type: 'doc', id: 'public-works/merkle-tree/merkle-tree-index', label: 'Overview' },
            'public-works/merkle-tree/api-reference',
            'public-works/merkle-tree/how-it-works',
          ],
        },
        {
          type: 'category',
          label: 'MCP Log',
          items: [
            { type: 'doc', id: 'public-works/mcp-log/mcp-log-index', label: 'Overview' },
            'public-works/mcp-log/sinks',
            'public-works/mcp-log/configuration',
          ],
        },
      ],
    },
  ],
};

export default sidebars;
