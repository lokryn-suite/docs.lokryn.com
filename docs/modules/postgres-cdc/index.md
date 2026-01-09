---
id: postgres-cdc-index
title: postgres-cdc
slug: /modules/postgres-cdc
sidebar_position: 1
---

# postgres-cdc

Streams changes from PostgreSQL to S3 Tables (Iceberg) using WAL-based logical replication.

---

## What It Does

1. Reads PostgreSQL WAL (Write-Ahead Log) via logical replication
2. Captures INSERT, UPDATE, DELETE operations in real-time
3. Buffers changes in memory (10k rows or 60 seconds)
4. Writes to S3 Tables as Iceberg tables
5. Acknowledges WAL position only after successful write

No polling, no `updated_at` columns, no missed deletes.

---

## Why Use This

- **Simple deployment** — One container, no additional infrastructure
- **Real-time streaming** — WAL-based, captures INSERT/UPDATE/DELETE as they happen
- **Iceberg format** — Time travel, schema evolution, query with any engine
- **Cost effective** — Pay only for what you use

---

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  PostgreSQL │────▶│ postgres-cdc│────▶│  S3 Tables  │
│    (WAL)    │     │  Container  │     │  (Iceberg)  │
└─────────────┘     └─────────────┘     └─────────────┘
```

**Data flow:**
1. PostgreSQL streams WAL changes via replication protocol
2. Container decodes binary `pgoutput` messages
3. Changes buffer in memory until flush trigger
4. DuckDB writes to S3 Tables (Iceberg format)
5. LSN acknowledged after successful S3 write

**Guarantees:**
- At-least-once delivery (WAL replay on crash)
- No data loss (replication slot holds WAL)
- Full change history (INSERT/UPDATE/DELETE with timestamps)

---

## Quick Start

### 1. Set up PostgreSQL

```sql
-- Enable logical replication (requires restart)
ALTER SYSTEM SET wal_level = 'logical';

-- Create publication
CREATE PUBLICATION cdc_publication FOR TABLE orders, customers;
```

### 2. Create S3 Tables bucket

```bash
aws s3tables create-table-bucket --name my-cdc-bucket --region us-east-2
```

### 3. Deploy the container

```bash
docker run \
  -e POSTGRES_HOST=mydb.example.com \
  -e POSTGRES_PORT=5432 \
  -e POSTGRES_DB=mydb \
  -e POSTGRES_USER=cdc_user \
  -e POSTGRES_PASSWORD=secret \
  -e S3_TABLE_BUCKET_ARN=arn:aws:s3tables:us-east-2:123456789:bucket/my-cdc-bucket \
  -e AWS_REGION=us-east-2 \
  -e PUBLICATION_NAME=cdc_publication \
  -e SLOT_NAME=my_cdc_slot \
  postgres-cdc
```

### 4. Query your data

```python
import duckdb

con = duckdb.connect()
con.execute("INSTALL iceberg; LOAD iceberg;")
con.execute("CREATE SECRET (TYPE s3, PROVIDER credential_chain);")
con.execute("""
    ATTACH 'arn:aws:s3tables:us-east-2:123456789:bucket/my-cdc-bucket' AS s3tables (
        TYPE iceberg, ENDPOINT_TYPE s3_tables
    );
""")

con.execute("SELECT * FROM s3tables.cdc.public_orders ORDER BY _ts DESC").fetchdf()
```

---

## Pricing

| Model | Price |
|-------|-------|
| **7-day trial** | Free |
| **Hourly** | $0.08/hr |

Available on [AWS Marketplace](#).

---

## Features

- **INSERT capture** — New rows captured immediately
- **UPDATE capture** — Changes with new values
- **DELETE capture** — Removed rows tracked
- **Before/after values** — Full row images with REPLICA IDENTITY FULL
- **Time travel queries** — Iceberg snapshots for point-in-time queries
- **Schema evolution** — Automatic handling of column changes
- **Single container** — No additional infrastructure required

---

## Next Steps

- [Getting Started](/docs/modules/postgres-cdc/getting-started) — Full setup walkthrough
- [Configuration](/docs/modules/postgres-cdc/configuration) — All environment variables
- [PostgreSQL Setup](/docs/modules/postgres-cdc/postgres-setup) — WAL, replication, and publications
- [Querying Data](/docs/modules/postgres-cdc/querying) — DuckDB, Athena, and Spark
- [Event Notifications](/docs/modules/postgres-cdc/events) — Trigger downstream processing
