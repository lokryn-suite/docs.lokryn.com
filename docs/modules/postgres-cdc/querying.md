---
id: postgres-cdc-querying
title: Querying Data
slug: /modules/postgres-cdc/querying
sidebar_position: 5
---

# Querying Data

Query CDC data with DuckDB, Athena, Spark, or any Iceberg-compatible engine.

---

## Table Structure

Each PostgreSQL table becomes an Iceberg table in S3 Tables:

```
s3tables.{namespace}.{schema}_{table}
```

Example: `s3tables.cdc.public_orders`

---

## CDC Metadata Columns

Every record includes metadata columns:

| Column | Type | Description |
|--------|------|-------------|
| `_op` | VARCHAR | Operation: `I` (insert), `U` (update), `D` (delete) |
| `_ts` | TIMESTAMPTZ | When the change was captured |

Your table columns appear as VARCHAR (original types preserved in values).

---

## DuckDB

DuckDB has native S3 Tables support.

### Setup

```python
import duckdb

con = duckdb.connect()
con.execute("INSTALL iceberg; LOAD iceberg;")

# AWS credentials
con.execute("""
    CREATE SECRET s3tables_secret (
        TYPE s3,
        PROVIDER credential_chain
    );
""")

# Attach S3 Tables
con.execute("""
    ATTACH 'arn:aws:s3tables:us-east-2:123456789012:bucket/my-cdc-bucket' AS s3tables (
        TYPE iceberg,
        ENDPOINT_TYPE s3_tables
    );
""")
```

### Query CDC data

```sql
-- View all changes
SELECT * FROM s3tables.cdc.public_orders ORDER BY _ts DESC;

-- Filter by operation
SELECT * FROM s3tables.cdc.public_orders WHERE _op = 'D';

-- Changes in last hour
SELECT * FROM s3tables.cdc.public_orders 
WHERE _ts > NOW() - INTERVAL '1 hour';
```

### Get current state

To reconstruct the current table state from CDC data:

```sql
SELECT * FROM (
    SELECT *, ROW_NUMBER() OVER (PARTITION BY id ORDER BY _ts DESC) as rn
    FROM s3tables.cdc.public_orders
) 
WHERE rn = 1 AND _op != 'D';
```

---

## Athena

Athena can query S3 Tables via the Iceberg connector.

### Create external table

```sql
CREATE EXTERNAL TABLE cdc_orders
LOCATION 's3://my-s3tables-bucket/cdc/public_orders'
TBLPROPERTIES ('table_type' = 'ICEBERG');
```

### Query

```sql
SELECT * FROM cdc_orders
WHERE _ts > TIMESTAMP '2025-01-08 00:00:00'
ORDER BY _ts DESC;
```

---

## Spark

PySpark with Iceberg support:

```python
from pyspark.sql import SparkSession

spark = SparkSession.builder \
    .config("spark.sql.extensions", "org.apache.iceberg.spark.extensions.IcebergSparkSessionExtensions") \
    .config("spark.sql.catalog.s3tables", "org.apache.iceberg.spark.SparkCatalog") \
    .config("spark.sql.catalog.s3tables.catalog-impl", "software.amazon.s3tables.iceberg.S3TablesCatalog") \
    .config("spark.sql.catalog.s3tables.warehouse", "arn:aws:s3tables:us-east-2:123456789012:bucket/my-cdc-bucket") \
    .getOrCreate()

# Query
df = spark.sql("SELECT * FROM s3tables.cdc.public_orders")
df.show()
```

---

## Common Queries

### Count changes by operation

```sql
SELECT _op, COUNT(*) as count
FROM s3tables.cdc.public_orders
GROUP BY _op;
```

Output:

```
_op | count
----|------
I   | 1523
U   | 847
D   | 92
```

### Changes per hour

```sql
SELECT 
    DATE_TRUNC('hour', _ts) as hour,
    COUNT(*) as changes
FROM s3tables.cdc.public_orders
GROUP BY 1
ORDER BY 1 DESC;
```

### Most updated records

```sql
SELECT id, COUNT(*) as change_count
FROM s3tables.cdc.public_orders
GROUP BY id
ORDER BY change_count DESC
LIMIT 10;
```

### View change history for a record

```sql
SELECT _op, _ts, customer_name, amount
FROM s3tables.cdc.public_orders
WHERE id = '123'
ORDER BY _ts;
```

Output:

```
_op | _ts                      | customer_name | amount
----|--------------------------|---------------|-------
I   | 2025-01-08 10:00:00+00  | Alice         | 50.00
U   | 2025-01-08 12:30:00+00  | Alice         | 75.00
U   | 2025-01-08 15:45:00+00  | Alice         | 100.00
D   | 2025-01-09 09:00:00+00  | Alice         | 100.00
```

---

## Time Travel

Iceberg supports time travel queries. View data as it was at a specific point:

### DuckDB

```sql
SELECT * FROM s3tables.cdc.public_orders
FOR TIMESTAMP AS OF TIMESTAMP '2025-01-08 12:00:00';
```

### Athena

```sql
SELECT * FROM cdc_orders
FOR SYSTEM_TIME AS OF TIMESTAMP '2025-01-08 12:00:00';
```

---

## Schema Evolution

When your PostgreSQL schema changes:

1. Add a column → New column appears in future records
2. Drop a column → Column stops appearing in future records
3. Rename a column → Appears as new column (old column stops appearing)

Iceberg handles this automatically. Queries merge schemas from all data files.

---

## Performance Tips

1. **Filter by time** — Use `_ts` in WHERE clauses to leverage partition pruning
2. **Project columns** — Select only needed columns to reduce I/O
3. **Use time travel sparingly** — Full table scans can be expensive
4. **Compact tables** — Run Iceberg maintenance periodically for optimal query performance
