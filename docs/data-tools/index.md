---
id: data-tools-index
title: Data Tools
slug: /data-tools
sidebar_position: 20
---

# Data Tools

Easy button containers for data engineers. Weeks of legwork, done for you.

---

## The Problem

Setting up modern data infrastructure is painful. Want a lakehouse? Spend a week configuring S3 Tables, DuckDB, IAM roles, networking. Want to query Iceberg tables? Figure out catalog management, compaction, schema evolution.

We do the legwork. You deploy a container.

---

## Philosophy

These aren't full products like Field Notes or Manifest. They're standalone utilities:

- **Single purpose** — Does one thing well
- **Pre-configured** — Sane defaults, minimal setup
- **AWS Marketplace** — Deploy in minutes, pay hourly
- **No SaaS** — Your environment, your data, no ongoing relationship

---

## Available Tools

### [DuckLake](/docs/data-tools/ducklake)

S3 Tables + DuckDB lakehouse in a container.

- Query Iceberg tables with SQL
- Auto-compaction and schema evolution
- REST API for queries
- Dashboard for exploration

### [Relay](/docs/relay) *(Coming Soon)*

IoT-style fleet communication container.

- Secure event distribution across services
- Runs inside your VPC
- MQTT-based authenticated channels
- Lightweight footprint

---

## Coming Soon

| Tool | Description |
|------|-------------|
| **Parquet Viewer** | Web UI for browsing Parquet files in S3 |
| **Schema Registry** | Lightweight Avro/Protobuf schema management |
| **CDC Collector** | Capture database changes to Iceberg tables |

---

## Pricing

All data tools use AWS Marketplace pricing:

| Model | Typical Price |
|-------|---------------|
| Hourly | $0.05 - $0.50/hour |
| Annual | 20% discount |

Plus your AWS costs for storage and compute.

---

## Related

- [Field Notes](/docs/field-notes) — If you need compliance-grade logging
- [Open Source](/docs/open-source) — If you want to build it yourself
