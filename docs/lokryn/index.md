---
id: lokryn-index
title: Lokryn
slug: /lokryn
sidebar_position: 0
---

# Lokryn

Modular infrastructure that junior devs drop in and LLMs compose — no overengineering, no plumbing sprints.

---

## The Problem We Solve

Teams burn sprint points on infrastructure plumbing. They either:

1. **Overengineer** — "I need CDC" becomes Airflow + Debezium + Kafka + weeks of configuration
2. **Underdeliver** — Skip proper logging/validation/retry logic because setup is too expensive
3. **Overpay** — Enterprise tools with sales calls, contracts, and 10x markup

We build the boring middle: production-ready modules that just work.

---

## Module Catalog

Drop-in containers. Deploy via AWS Marketplace. All include a **7-day free trial**.

### Tier 1: Core Pipeline

| Module | Description | Status |
|--------|-------------|--------|
| [`postgres-cdc`](/docs/modules/postgres-cdc) | Postgres → S3 Parquet + SNS/SQS events | **Live** |
| [`ducklake`](/docs/modules/ducklake) | DuckDB lakehouse on S3 Tables | **Live** |
| [`data-validator`](/docs/modules/data-validator) | Schema validation, quarantine bad data | Coming Soon |
| [`file-drop`](/docs/modules/file-drop) | S3 landing zone with event triggers | Coming Soon |
| [`snowflake-loader`](/docs/modules/snowflake-loader) | S3 → Snowflake sync | Coming Soon |

### Tier 2: Fast Follows

| Module | Description | Status |
|--------|-------------|--------|
| [`webhook-relay`](/docs/modules/webhook-relay) | Dead letter queue with ordered replay | Coming Soon |
| [`audit-logger`](/docs/modules/audit-logger) | Tamper-evident compliance logs | Coming Soon |

[View all modules →](/docs/modules)

---

## Open Source Libraries

Production-grade libraries. These power our modules — use them standalone or let our modules do the integration.

| Library | Registry | Purpose |
|---------|----------|---------|
| [compliance-log-schema](/docs/open-source/compliance-log-schema) | buf.build | Protobuf schema for audit logs |
| [merkle-tree](/docs/open-source/merkle-tree) | PyPI | Hash chaining and merkle proofs |
| [mcp-log](/docs/open-source/mcp-log) | PyPI | MCP interaction logging |

**Licensing:** AGPL-3.0 with commercial licenses available.

---

## Shopify Apps

Purpose-built apps for merchants.

| App | Description |
|-----|-------------|
| [Affiliate Ping](/docs/shopify/affiliate-ping) | Real-time alerts when affiliate codes drive sales |

---

## Design Principles

| Principle | What It Means |
|-----------|---------------|
| **Drop-in** | One command to deploy. No PhD required. |
| **No decisions** | Sensible defaults. Right levers exposed, complexity hidden. |
| **Explicit failure** | Fail loudly if config is wrong. No silent defaults. |
| **Composable** | Modules work alone or together. No forced bundling. |
| **Your VPC** | Data stays in your cloud. We never see it. |

---

## Pricing

All modules available on AWS Marketplace with usage-based pricing.

| Model | Price |
|-------|-------|
| **7-day trial** | Free |
| **Hourly** | $0.05–0.10/hr |

No sales calls. No contracts. No enterprise minimums.

---

© 2026 Lokryn LLC. All rights reserved.
