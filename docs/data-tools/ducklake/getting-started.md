---
id: ducklake-getting-started
sidebar_position: 2
title: Getting Started
slug: /data-tools/ducklake/getting-started
description: Deploy DuckLake Container on AWS
---

# Getting Started

Deploy DuckLake Container on ECS in about 5 minutes.

## Prerequisites

- AWS account with permissions to create ECS services, IAM roles, and S3 buckets
- An S3 bucket for your data
- AWS CLI configured locally (for setup)

## Step 1: Subscribe on AWS Marketplace

1. Go to the [DuckLake Container listing](https://aws.amazon.com/marketplace) on AWS Marketplace
2. Click **Continue to Subscribe**
3. Accept the terms and wait for subscription to activate (usually instant)

## Step 2: Create an S3 Bucket

If you don't already have one, create an S3 bucket for your lakehouse data:

```bash
aws s3 mb s3://your-company-lakehouse --region us-east-1
```

## Step 3: Create an IAM Role

Create an IAM role for the ECS task with S3 and Marketplace permissions. See [IAM Permissions](/docs/data-tools/ducklake/iam-permissions) for the full policy.

Minimum permissions:
- `s3:GetObject`, `s3:PutObject`, `s3:DeleteObject`, `s3:ListBucket` on your bucket
- `aws-marketplace:RegisterUsage` for metering

## Step 4: Store Configuration in Secrets Manager

Create a secret named `lokryn/ducklake/config`:

```bash
aws secretsmanager create-secret \
  --name lokryn/ducklake/config \
  --secret-string '{
    "POSTGRES_USER": "admin",
    "POSTGRES_PASSWORD": "your-secure-password",
    "POSTGRES_DB": "lakehouse",
    "S3_BUCKET_URL": "s3://your-company-lakehouse/data/",
    "AWS_REGION": "us-east-1"
  }'
```

## Step 5: Deploy to ECS

Use the AWS Console or CLI to create an ECS service using the DuckLake container image from your marketplace subscription.

Key settings:
- **Task role**: The IAM role from Step 3
- **Port mapping**: 5432 (PostgreSQL)
- **Health check**: `pg_isready -U admin -d lakehouse`

For a complete ECS task definition, see [Configuration](/docs/data-tools/ducklake/configuration).

## Step 6: Connect and Query

Once the container is running, connect from any DuckDB client:

```python
import duckdb

conn = duckdb.connect()
conn.execute("INSTALL ducklake; LOAD ducklake;")
conn.execute("""
    ATTACH 'ducklake:postgres:host=your-ecs-service.amazonaws.com 
    port=5432 user=admin password=your-password dbname=lakehouse' AS lake
""")

# Create a table
conn.execute("CREATE TABLE lake.events (id INT, name VARCHAR, created_at TIMESTAMP)")

# Insert data
conn.execute("INSERT INTO lake.events VALUES (1, 'signup', now())")

# Query
print(conn.execute("SELECT * FROM lake.events").fetchall())
```

## Next Steps

- [Configuration](/docs/data-tools/ducklake/configuration) - All configuration options
- [Connecting](/docs/data-tools/ducklake/connecting) - Connect from different clients
- [Troubleshooting](/docs/data-tools/ducklake/troubleshooting) - Common issues and solutions