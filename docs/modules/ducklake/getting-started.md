---
id: ducklake-getting-started
sidebar_position: 2
title: Getting Started
slug: /modules/ducklake/getting-started
description: Deploy DuckLake Catalog on AWS
---

# Getting Started

Deploy the DuckLake PostgreSQL catalog on ECS in about 5 minutes.

---

## Prerequisites

- AWS account with permissions to create ECS services, IAM roles, and S3 buckets
- S3 bucket for your data
- DuckDB 1.0+ installed locally

---

## Step 1: Subscribe on AWS Marketplace

1. Go to the [DuckLake Catalog listing](https://aws.amazon.com/marketplace) on AWS Marketplace
2. Click **Continue to Subscribe**
3. Accept the terms and wait for subscription to activate

---

## Step 2: Create an S3 Bucket

Create an S3 bucket for your lakehouse data:

```bash
aws s3 mb s3://your-company-lakehouse --region us-east-1
```

---

## Step 3: Create an IAM Role

Create an IAM role for the ECS task. See [IAM Permissions](/docs/modules/ducklake/iam-permissions) for the full policy.

Minimum permissions:
- `s3:GetObject`, `s3:PutObject`, `s3:DeleteObject`, `s3:ListBucket` on your bucket
- `aws-marketplace:RegisterUsage` for metering

---

## Step 4: Store Configuration in Secrets Manager

Create a secret named `lokryn/ducklake/config`:

```bash
aws secretsmanager create-secret \
  --name lokryn/ducklake/config \
  --secret-string '{
    "postgres_user": "admin",
    "postgres_password": "your-secure-password",
    "postgres_db": "lakehouse",
    "s3_bucket_url": "s3://your-company-lakehouse/data/",
    "aws_region": "us-east-1"
  }'
```

---

## Step 5: Deploy to ECS

Create an ECS service using the DuckLake container image from your marketplace subscription.

Key settings:
- **Task role**: The IAM role from Step 3
- **Port mapping**: 5432 (PostgreSQL)
- **Health check**: `pg_isready -U admin -d lakehouse`

For a complete ECS task definition, see [Configuration](/docs/modules/ducklake/configuration).

---

## Step 6: Connect from DuckDB

Once the container is running, connect from DuckDB:

```python
import duckdb

conn = duckdb.connect()

# Install required extensions
conn.execute("INSTALL ducklake; LOAD ducklake;")
conn.execute("INSTALL postgres; LOAD postgres;")
conn.execute("INSTALL httpfs; LOAD httpfs;")

# S3 credentials for data access
conn.execute("""
    CREATE SECRET (TYPE s3, PROVIDER credential_chain);
""")

# Attach the catalog
conn.execute("""
    ATTACH 'ducklake:postgres:host=your-ecs-service.amazonaws.com 
    port=5432 user=admin password=your-password dbname=lakehouse' AS lake
""")

conn.execute("USE lake;")

# Create a table
conn.execute("""
    CREATE TABLE events (
        id INTEGER,
        name VARCHAR,
        created_at TIMESTAMP
    )
""")

# Insert data
conn.execute("INSERT INTO events VALUES (1, 'signup', now())")

# Query
print(conn.execute("SELECT * FROM events").fetchall())
```

---

## What's Happening

1. **Your DuckDB client** connects to the PostgreSQL catalog (the container)
2. **Table metadata** (schemas, versions) is stored in PostgreSQL
3. **Data files** (Parquet) are written directly to S3 from your DuckDB client
4. **Queries** read data from S3, using metadata from the catalog

The container only stores metadata. Your data lives in S3.

---

## Next Steps

- [Configuration](/docs/modules/ducklake/configuration) — All configuration options
- [Connecting](/docs/modules/ducklake/connecting) — Connect from different clients
- [Troubleshooting](/docs/modules/ducklake/troubleshooting) — Common issues
