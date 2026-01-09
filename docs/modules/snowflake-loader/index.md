---
id: snowflake-loader-index
title: snowflake-loader
slug: /modules/snowflake-loader
sidebar_position: 7
---

# snowflake-loader

S3 → Snowflake sync.

---

## Coming Soon

This module is under active development.

---

## What It Does

1. Monitor S3 prefix for new Parquet files
2. Automatically load into Snowflake tables
3. Handle schema evolution
4. Track load state for exactly-once delivery

---

## Use Cases

- **Data Lake to Warehouse** — Sync S3 data to Snowflake automatically
- **CDC Pipeline Completion** — Load postgres-cdc output into Snowflake
- **Batch Ingestion** — Regular sync from S3 landing zones

---

## Planned Features

| Feature | Description |
|---------|-------------|
| **Auto-discovery** | Detect new files in S3 prefix |
| **Schema evolution** | Handle new columns automatically |
| **Exactly-once** | Track loaded files to prevent duplicates |
| **Partitioning** | Efficient loads using Snowflake stages |
| **Error handling** | Quarantine failed files |

---

## Notify Me

Want to know when snowflake-loader launches? Email support@lokryn.com with "snowflake-loader waitlist" in the subject.
