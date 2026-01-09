---
id: postgres-cdc-getting-started
title: Getting Started
slug: /modules/postgres-cdc/getting-started
sidebar_position: 2
---

# Getting Started

Deploy postgres-cdc in 15 minutes.

---

## Prerequisites

- PostgreSQL 10+ with `wal_level = logical`
- S3 Tables bucket for output
- IAM credentials with S3 Tables access

---

## Step 1: Prepare PostgreSQL

### Enable logical replication

Check current setting:

```sql
SHOW wal_level;
```

If the result is not `logical`, you must change it:

**RDS/Aurora:**

Parameter group → `rds.logical_replication = 1` → Reboot instance

**Self-hosted:**

```sql
ALTER SYSTEM SET wal_level = 'logical';
```

Restart PostgreSQL. This is a one-time change.

### Create CDC user

**Self-hosted:**

```sql
CREATE USER cdc_user WITH PASSWORD 'your_secure_password' REPLICATION;
GRANT USAGE ON SCHEMA public TO cdc_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO cdc_user;
```

**RDS/Aurora:**

```sql
CREATE USER cdc_user WITH PASSWORD 'your_secure_password';
GRANT rds_replication TO cdc_user;
GRANT USAGE ON SCHEMA public TO cdc_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO cdc_user;
```

### Create publication

```sql
CREATE PUBLICATION cdc_publication FOR TABLE orders, customers, products;
```

---

## Step 2: Create S3 Tables Bucket

S3 Tables is a new S3 storage class optimized for tabular data with built-in Iceberg support.

```bash
aws s3tables create-table-bucket --name my-cdc-bucket --region us-east-2
```

Note the ARN:

```
arn:aws:s3tables:us-east-2:123456789012:bucket/my-cdc-bucket
```

---

## Step 3: Deploy Container

### Option A: Docker Compose

Create `docker-compose.yml`:

```yaml
services:
  postgres-cdc:
    image: lokryn/postgres-cdc:latest
    environment:
      - POSTGRES_HOST=host.docker.internal
      - POSTGRES_PORT=5432
      - POSTGRES_DB=mydb
      - POSTGRES_USER=cdc_user
      - POSTGRES_PASSWORD=secret
      - S3_TABLE_BUCKET_ARN=arn:aws:s3tables:us-east-2:123456789012:bucket/my-cdc-bucket
      - AWS_REGION=us-east-2
      - PUBLICATION_NAME=cdc_publication
      - SLOT_NAME=my_cdc_slot
    volumes:
      - ~/.aws:/root/.aws
```

```bash
docker compose up -d
```

### Option B: AWS Marketplace

1. Subscribe to postgres-cdc on AWS Marketplace
2. Launch the CloudFormation stack
3. Configure environment variables
4. Container runs in your VPC with IAM role

---

## Step 4: Verify

The container creates a replication slot and starts streaming. Check logs:

```
2025-01-09 15:30:00 INFO Starting CDC for publication: cdc_publication
2025-01-09 15:30:00 INFO Buffer size: 10000 rows, flush interval: 60s
2025-01-09 15:30:01 INFO Connected to S3 Tables: arn:aws:s3tables:us-east-2:123456789012:bucket/my-cdc-bucket
2025-01-09 15:30:01 INFO Replication slot exists: my_cdc_slot
2025-01-09 15:30:01 INFO Listening for changes on cdc_publication...
```

Make a change in PostgreSQL:

```sql
INSERT INTO orders (customer_name, amount) VALUES ('Alice', 99.99);
```

You should see:

```
2025-01-09 15:31:05 INFO Wrote 1 rows to s3tables.cdc.public_orders
```

---

## Step 5: Query Your Data

```python
import duckdb

con = duckdb.connect()
con.execute("INSTALL iceberg; LOAD iceberg;")
con.execute("CREATE SECRET (TYPE s3, PROVIDER credential_chain);")
con.execute("""
    ATTACH 'arn:aws:s3tables:us-east-2:123456789012:bucket/my-cdc-bucket' AS s3tables (
        TYPE iceberg,
        ENDPOINT_TYPE s3_tables
    );
""")

# View CDC data
df = con.execute("SELECT * FROM s3tables.cdc.public_orders ORDER BY _ts DESC").fetchdf()
print(df)
```

Output:

```
  _op                       _ts  id customer_name  amount
0   I 2025-01-09 15:31:05+00:00   1         Alice   99.99
```

---

## Next Steps

- [Configuration](/docs/modules/postgres-cdc/configuration) — All environment variables
- [PostgreSQL Setup](/docs/modules/postgres-cdc/postgres-setup) — Advanced WAL configuration
- [Querying Data](/docs/modules/postgres-cdc/querying) — DuckDB, Athena, and Spark
