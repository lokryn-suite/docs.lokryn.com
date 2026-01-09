---
id: ducklake-index
title: ducklake
slug: /modules/ducklake
sidebar_position: 2
---

# ducklake

PostgreSQL catalog for the DuckLake extension. Deploy via AWS Marketplace.

---

## What It Does

DuckLake is a DuckDB extension that provides lakehouse functionality with PostgreSQL as the metadata catalog:

- **DuckLake extension** — Open-source DuckDB extension for lakehouse operations
- **PostgreSQL catalog** — Stores table metadata, schemas, and versions
- **S3 data storage** — Parquet files in your S3 bucket
- **ACID transactions** — Full transactional support via PostgreSQL

This container provides the PostgreSQL catalog. You connect from DuckDB on your machine or application.

---

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   DuckDB    │────▶│  PostgreSQL │     │     S3      │
│  (client)   │     │  (catalog)  │     │   (data)    │
└──────┬──────┘     └─────────────┘     └──────▲──────┘
       │                                       │
       └───────────────────────────────────────┘
```

**How it works:**
1. You run DuckDB locally or in your application
2. DuckDB connects to the PostgreSQL catalog (this container)
3. Data is read/written directly to S3 from your DuckDB client
4. Metadata (schemas, table definitions) lives in PostgreSQL

---

## Quick Start

### 1. Deploy the container

Deploy via AWS Marketplace to ECS. See [Getting Started](/docs/modules/ducklake/getting-started).

### 2. Connect from DuckDB

```python
import duckdb

conn = duckdb.connect()
conn.execute("INSTALL ducklake; LOAD ducklake;")
conn.execute("INSTALL postgres; LOAD postgres;")
conn.execute("INSTALL httpfs; LOAD httpfs;")

# S3 credentials for data access
conn.execute("""
    CREATE SECRET (TYPE s3, PROVIDER credential_chain);
""")

# Attach the catalog
conn.execute("""
    ATTACH 'ducklake:postgres:host=your-catalog.amazonaws.com 
    port=5432 user=admin password=your-password dbname=lakehouse' AS lake
""")

# Create and query tables
conn.execute("CREATE TABLE lake.events (id INT, name VARCHAR)")
conn.execute("INSERT INTO lake.events VALUES (1, 'signup')")
conn.execute("SELECT * FROM lake.events").fetchall()
```

---

## Prerequisites

- AWS account with ECS and S3 access
- S3 bucket for data storage
- DuckDB 1.0+ on your client machine

---

## Pricing

| Model | Price |
|-------|-------|
| **7-day trial** | Free |
| **Hourly** | $0.05/hr |

Available on [AWS Marketplace](#).

Plus your AWS costs for S3 and compute.

---

## Why Use This

- **Managed catalog** — No need to run your own PostgreSQL for DuckLake
- **AWS Marketplace** — One-click deployment, usage-based billing
- **Production ready** — Health checks, logging, and Secrets Manager integration

---

## Next Steps

- [Getting Started](/docs/modules/ducklake/getting-started) — Deploy in 5 minutes
- [Configuration](/docs/modules/ducklake/configuration) — All configuration options
- [Connecting](/docs/modules/ducklake/connecting) — Connect from Python, Go, CLI
- [IAM Permissions](/docs/modules/ducklake/iam-permissions) — Required AWS permissions
- [Troubleshooting](/docs/modules/ducklake/troubleshooting) — Common issues
