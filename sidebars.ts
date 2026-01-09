import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    // --- Lokryn Overview ---
    {
      type: 'doc',
      id: 'lokryn/lokryn-index',
      label: 'Lokryn Overview',
    },

    // --- Modules ---
    {
      type: 'category',
      label: 'Modules',
      items: [
        { type: 'doc', id: 'modules/modules-index', label: 'Overview' },
        {
          type: 'category',
          label: 'postgres-cdc',
          items: [
            { type: 'doc', id: 'modules/postgres-cdc/postgres-cdc-index', label: 'Overview' },
            { type: 'doc', id: 'modules/postgres-cdc/postgres-cdc-getting-started', label: 'Getting Started' },
            { type: 'doc', id: 'modules/postgres-cdc/postgres-cdc-configuration', label: 'Configuration' },
            { type: 'doc', id: 'modules/postgres-cdc/postgres-cdc-postgres-setup', label: 'PostgreSQL Setup' },
            { type: 'doc', id: 'modules/postgres-cdc/postgres-cdc-querying', label: 'Querying Data' },
            { type: 'doc', id: 'modules/postgres-cdc/postgres-cdc-events', label: 'Event Notifications' },
          ],
        },
        {
          type: 'category',
          label: 'ducklake',
          items: [
            { type: 'doc', id: 'modules/ducklake/ducklake-index', label: 'Overview' },
            { type: 'doc', id: 'modules/ducklake/ducklake-getting-started', label: 'Getting Started' },
            { type: 'doc', id: 'modules/ducklake/ducklake-configuration', label: 'Configuration' },
            { type: 'doc', id: 'modules/ducklake/ducklake-connecting', label: 'Connecting' },
            { type: 'doc', id: 'modules/ducklake/ducklake-iam-permissions', label: 'IAM Permissions' },
            { type: 'doc', id: 'modules/ducklake/ducklake-troubleshooting', label: 'Troubleshooting' },
          ],
        },
        { type: 'doc', id: 'modules/data-validator/data-validator-index', label: 'data-validator (Coming Soon)' },
        { type: 'doc', id: 'modules/file-drop/file-drop-index', label: 'file-drop (Coming Soon)' },
        { type: 'doc', id: 'modules/snowflake-loader/snowflake-loader-index', label: 'snowflake-loader (Coming Soon)' },
        { type: 'doc', id: 'modules/webhook-relay/webhook-relay-index', label: 'webhook-relay (Coming Soon)' },
        { type: 'doc', id: 'modules/audit-logger/audit-logger-index', label: 'audit-logger (Coming Soon)' },
      ],
    },

    // --- Open Source ---
    {
      type: 'category',
      label: 'Open Source',
      items: [
        { type: 'doc', id: 'open-source/open-source-index', label: 'Overview' },
        {
          type: 'category',
          label: 'compliance-log-schema',
          items: [
            { type: 'doc', id: 'open-source/compliance-log-schema/compliance-log-schema-index', label: 'Overview' },
            { type: 'doc', id: 'open-source/compliance-log-schema/schema-reference', label: 'Schema Reference' },
            { type: 'doc', id: 'open-source/compliance-log-schema/usage-examples', label: 'Usage Examples' },
            { type: 'doc', id: 'open-source/compliance-log-schema/standard-mappings', label: 'Standard Mappings' },
          ],
        },
        {
          type: 'category',
          label: 'merkle-tree',
          items: [
            { type: 'doc', id: 'open-source/merkle-tree/merkle-tree-index', label: 'Overview' },
            { type: 'doc', id: 'open-source/merkle-tree/api-reference', label: 'API Reference' },
            { type: 'doc', id: 'open-source/merkle-tree/how-it-works', label: 'How It Works' },
          ],
        },
        {
          type: 'category',
          label: 'mcp-log',
          items: [
            { type: 'doc', id: 'open-source/mcp-log/mcp-log-index', label: 'Overview' },
            { type: 'doc', id: 'open-source/mcp-log/sinks', label: 'Sinks' },
            { type: 'doc', id: 'open-source/mcp-log/configuration', label: 'Configuration' },
          ],
        },
      ],
    },

    // --- Shopify Apps ---
    {
      type: 'category',
      label: 'Shopify Apps',
      items: [
        { type: 'doc', id: 'shopify/shopify-index', label: 'Overview' },
        { type: 'doc', id: 'shopify/affiliate-ping/affiliate-ping-index', label: 'Affiliate Ping' },
        { type: 'doc', id: 'shopify/affiliate-ping/affiliate-ping-faq', label: 'FAQ' },
      ],
    },
  ],
};

export default sidebars;
