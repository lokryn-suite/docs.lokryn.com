---
id: lokryn-index
title: Lokryn Overview
slug: /lokryn
sidebar_position: 0
---

# Lokryn

**Blue collar data tools for SMBs.**  
Compliance infrastructure that doesn't require an enterprise budget. SOC2, HIPAA, and PCI readiness at fair prices.

---

## What We Build

| Category | Products | Customer | Deployment |
|----------|----------|----------|------------|
| **Core Products** | Field Notes, Manifest, Pipe Audit | SMB dev/ops teams | Container OR SaaS |
| **Open Source** | compliance-log-schema, merkle-tree, mcp-log | Developers (DIY) | npm/PyPI/buf.build |
| **Data Tools** | DuckLake | Data engineers | AWS Marketplace |
| **Shopify Apps** | Affiliate Ping | Merchants | Shopify App Store |

---

## Core Products

Full-featured products available as self-hosted containers or managed SaaS.

### [Field Notes](/docs/field-notes)
Tamper-evident audit logging with cryptographic proofs. Every log entry is hash-chained and merkle-rooted for compliance-grade immutability.

### [Manifest](/docs/manifest)
Webhook retry with dead letter queue. Never lose a Stripe or Shopify event. Ordered replay prevents sequence scrambling.

### [Pipe Audit](/docs/pipe-audit)
File validation with declarative TOML contracts. Define schemas, run validations, quarantine failures.

**Deployment options:**
| Option | Description |
|--------|-------------|
| **Container** | AWS Marketplace. Your VPC, your data, your control. |
| **SaaS** | Control Room. Managed service, usage-based pricing. |

---

## Open Source Libraries

Production-grade libraries. These aren't toy projects—they're the actual components that power our products. Use them standalone, patch them together yourself, or let our products do the integration.

### [Compliance Log Schema](/docs/open-source/compliance-log-schema)
Protocol Buffers schema for audit logging. First-class support for AI/agent events.

### [Merkle Tree](/docs/open-source/merkle-tree)
Hash chaining and merkle proofs for tamper-evident records.

### [MCP Log](/docs/open-source/mcp-log)
Compliance-grade logging for Model Context Protocol clients.

**Licensing:** AGPL-3.0 with commercial licenses available.

---

## Data Tools

Easy button containers for data engineers. Weeks of legwork, done for you.

### [DuckLake](/docs/data-tools/ducklake)
S3 Tables + DuckDB lakehouse in a container. Query Iceberg tables with SQL. No configuration required.

These are standalone utilities—not full products like Field Notes or Manifest. Single purpose, pre-configured, AWS Marketplace deployment.

---

## Shopify Apps

Purpose-built apps for merchants. Same Lokryn DNA, different channel.

### [Affiliate Ping](/docs/shopify/affiliate-ping)
Real-time Slack & email alerts when affiliate discount codes drive sales.

---

## Why Lokryn?

- **Fair pricing for real companies** — Usage-based tiers that scale with you, not enterprise minimums
- **Compliance without consultants** — SOC2, HIPAA, PCI patterns built in
- **Open source foundation** — Inspect the code, contribute improvements, no vendor lock-in
- **Your choice of deployment** — Self-host for control, or let us manage it

---

© 2026 Lokryn LLC. All rights reserved.
