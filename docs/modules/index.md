---
id: modules-index
title: Modules
slug: /modules
sidebar_position: 1
---

# Modules

Drop-in infrastructure containers. Deploy via AWS Marketplace.

---

## Philosophy

Teams burn sprint points on infrastructure plumbing. "I need CDC" becomes Airflow + Debezium + Kafka + weeks of configuration. We build the boring middle: production-ready modules that just work.

**Design Principles:**

| Principle | What It Means |
|-----------|---------------|
| **Drop-in** | One command to deploy. No PhD required. |
| **No decisions** | Sensible defaults. Right levers exposed, complexity hidden. |
| **Explicit failure** | Fail loudly if config is wrong. No silent defaults. |
| **Composable** | Modules work alone or together. No forced bundling. |
| **Your VPC** | Data stays in your cloud. We never see it. |

---

## Tier 1: Core Pipeline

Complete data pipeline story: Ingest → Query → Validate → Load

| Module | Description | Status |
|--------|-------------|--------|
| [`postgres-cdc`](/docs/modules/postgres-cdc) | Postgres WAL → S3 Parquet + SNS/SQS events | **Live** |
| [`ducklake`](/docs/modules/ducklake) | DuckDB lakehouse on S3 Tables | **Live** |
| [`data-validator`](/docs/modules/data-validator) | Schema validation + table scans, quarantine bad data | Coming Soon |
| [`file-drop`](/docs/modules/file-drop) | S3 landing zone with event triggers | Coming Soon |
| [`snowflake-loader`](/docs/modules/snowflake-loader) | S3 → Snowflake sync | Coming Soon |

---

## Tier 2: Fast Follows

| Module | Description | Status |
|--------|-------------|--------|
| [`webhook-relay`](/docs/modules/webhook-relay) | Dead letter queue with ordered replay | Coming Soon |
| [`audit-logger`](/docs/modules/audit-logger) | Tamper-evident compliance logs (merkle proofs) | Coming Soon |
| `mysql-cdc` | MySQL binlog → S3/Iceberg | Planned |
| `redshift-loader` | S3 → Redshift sync | Planned |
| `bigquery-loader` | S3 → BigQuery sync | Planned |
| `api-poller` | REST API → S3 on schedule | Planned |
| `sql-transform` | Pre-configured dbt, pick your warehouse | Planned |
| `reverse-etl` | S3 → Postgres/MySQL/etc (DuckDB read, Polars write) | Planned |

---

## Pricing

All modules available on AWS Marketplace with usage-based pricing.

| Model | Price | Notes |
|-------|-------|-------|
| **7-day trial** | Free | All modules |
| **Hourly** | $0.05–0.10/hr | Pay as you go |

---

## Deployment Model

Every module deploys to **your VPC**:

- Your AWS account
- Your S3 buckets
- Your IAM roles
- Your data never leaves your environment

We provide the container. You control everything else.
