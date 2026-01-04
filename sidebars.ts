import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    // --- Lokryn Overview ---
    {
      type: 'doc',
      id: 'lokryn/lokryn-index',
      label: 'Lokryn Overview',
    },

    // --- Core Products ---
    {
      type: 'category',
      label: 'Field Notes',
      items: [
        { type: 'doc', id: 'field-notes/field-notes-index', label: 'Overview' },
        { type: 'doc', id: 'field-notes/container/field-notes-container', label: 'Container (AWS)' },
        { type: 'doc', id: 'field-notes/saas/field-notes-saas', label: 'SaaS' },
      ],
    },
    {
      type: 'category',
      label: 'Manifest',
      items: [
        { type: 'doc', id: 'manifest/manifest-index', label: 'Overview' },
        { type: 'doc', id: 'manifest/container/manifest-container', label: 'Container (AWS)' },
        { type: 'doc', id: 'manifest/saas/manifest-saas', label: 'SaaS' },
      ],
    },
    {
      type: 'category',
      label: 'Pipe Audit',
      items: [
        { type: 'doc', id: 'pipe-audit/pipe-audit-index', label: 'Overview' },
        { type: 'doc', id: 'pipe-audit/container/pipe-audit-container', label: 'Container (AWS)' },
        { type: 'doc', id: 'pipe-audit/saas/pipe-audit-saas', label: 'SaaS' },
        {
          type: 'category',
          label: 'CLI',
          items: [
            { type: 'doc', id: 'pipe-audit/cli/cli-index', label: 'Overview' },
            { type: 'doc', id: 'pipe-audit/cli/cli-quickstart', label: 'Quickstart' },
            { type: 'doc', id: 'pipe-audit/cli/cli-command-reference', label: 'Command Reference' },
          ],
        },
        {
          type: 'category',
          label: 'Core Library',
          items: [
            { type: 'doc', id: 'pipe-audit/core/core-index', label: 'Overview' },
            { type: 'doc', id: 'pipe-audit/core/core-quickstart', label: 'Quickstart' },
            { type: 'doc', id: 'pipe-audit/core/core-contracts', label: 'Contracts' },
            { type: 'doc', id: 'pipe-audit/core/core-profiles', label: 'Profiles' },
            { type: 'doc', id: 'pipe-audit/core/core-rules', label: 'Rules' },
            { type: 'doc', id: 'pipe-audit/core/core-logs-quarantine', label: 'Logs & Quarantine' },
          ],
        },
        {
          type: 'category',
          label: 'Contributing',
          items: [
            { type: 'doc', id: 'pipe-audit/contributing/contributing-index', label: 'Overview' },
            { type: 'doc', id: 'pipe-audit/contributing/contributing-architecture', label: 'Architecture' },
            { type: 'doc', id: 'pipe-audit/contributing/adding-rules', label: 'Adding Rules' },
            { type: 'doc', id: 'pipe-audit/contributing/adding-connectors', label: 'Adding Connectors' },
            { type: 'doc', id: 'pipe-audit/contributing/testing', label: 'Testing' },
            { type: 'doc', id: 'pipe-audit/contributing/docs-onboarding', label: 'Docs Onboarding' },
          ],
        },
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
          label: 'Compliance Log Schema',
          items: [
            { type: 'doc', id: 'open-source/compliance-log-schema/compliance-log-schema-index', label: 'Overview' },
            { type: 'doc', id: 'open-source/compliance-log-schema/schema-reference', label: 'Schema Reference' },
            { type: 'doc', id: 'open-source/compliance-log-schema/usage-examples', label: 'Usage Examples' },
            { type: 'doc', id: 'open-source/compliance-log-schema/standard-mappings', label: 'Standard Mappings' },
          ],
        },
        {
          type: 'category',
          label: 'Merkle Tree',
          items: [
            { type: 'doc', id: 'open-source/merkle-tree/merkle-tree-index', label: 'Overview' },
            { type: 'doc', id: 'open-source/merkle-tree/api-reference', label: 'API Reference' },
            { type: 'doc', id: 'open-source/merkle-tree/how-it-works', label: 'How It Works' },
          ],
        },
        {
          type: 'category',
          label: 'MCP Log',
          items: [
            { type: 'doc', id: 'open-source/mcp-log/mcp-log-index', label: 'Overview' },
            { type: 'doc', id: 'open-source/mcp-log/sinks', label: 'Sinks' },
            { type: 'doc', id: 'open-source/mcp-log/configuration', label: 'Configuration' },
          ],
        },
      ],
    },

    // --- Data Tools ---
    {
      type: 'category',
      label: 'Data Tools',
      items: [
        { type: 'doc', id: 'data-tools/data-tools-index', label: 'Overview' },
        {
          type: 'category',
          label: 'DuckLake',
          items: [
            { type: 'doc', id: 'data-tools/ducklake/ducklake-index', label: 'Overview' },
            { type: 'doc', id: 'data-tools/ducklake/ducklake-getting-started', label: 'Getting Started' },
            { type: 'doc', id: 'data-tools/ducklake/ducklake-configuration', label: 'Configuration' },
            { type: 'doc', id: 'data-tools/ducklake/ducklake-connecting', label: 'Connecting' },
            { type: 'doc', id: 'data-tools/ducklake/iam-permissions', label: 'IAM Permissions' },
            { type: 'doc', id: 'data-tools/ducklake/troubleshooting', label: 'Troubleshooting' },
          ],
        },
        { type: 'doc', id: 'aws/relay/relay-index', label: 'Relay (Coming Soon)' },
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
