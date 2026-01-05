---
id: ducklake-index
title: DuckLake
slug: /data-tools/ducklake
sidebar_position: 1
---

# DuckLake

S3 Tables + DuckDB lakehouse in a container. Deploy via AWS Marketplace.

---

## What It Does

DuckLake gives you a ready-to-use lakehouse:

- **S3 Tables** — AWS's native Iceberg implementation for storage
- **DuckDB** — Embedded query engine for fast SQL
- **REST API** — Query via HTTP
- **Dashboard** — Web UI for exploration

No configuration required. Deploy, point at your S3 bucket, start querying.

---

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │────▶│  DuckLake   │────▶│  S3 Tables  │
│  (API/UI)   │     │  Container  │     │  (Iceberg)  │
└─────────────┘     └─────────────┘     └─────────────┘
```

**Key components:**
- **DuckDB** — In-process OLAP database
- **S3 Tables** — Iceberg tables managed by AWS
- **REST API** — Execute SQL, get JSON results
- **Dashboard** — React UI for ad-hoc queries

---

## Prerequisites

- AWS account with S3 Tables enabled
- VPC with private subnets (recommended)
- IAM role with S3 Tables permissions
- ECS Fargate or EC2 for hosting

---

## Deployment

### AWS Marketplace

1. Subscribe to DuckLake on AWS Marketplace
2. Launch CloudFormation stack
3. Configure environment variables
4. Access via dashboard or API

### Environment Variables

```bash
# Required
DUCKLAKE_S3_BUCKET=your-iceberg-bucket
DUCKLAKE_S3_TABLE_NAMESPACE=analytics

# Optional
DUCKLAKE_AUTH_ENABLED=false  # Enable for production
DUCKLAKE_AUTH_TOKEN=your-secret-token
DUCKLAKE_LOG_LEVEL=INFO
```

---

## API Reference

### Execute Query

```bash
POST /v1/query
Content-Type: application/json

{
  "sql": "SELECT * FROM my_table LIMIT 100"
}
```

Response:
```json
{
  "columns": ["id", "name", "created_at"],
  "rows": [
    [1, "Alice", "2026-01-01T00:00:00Z"],
    [2, "Bob", "2026-01-02T00:00:00Z"]
  ],
  "row_count": 2,
  "duration_ms": 45
}
```

### List Tables

```bash
GET /v1/tables
```

### Get Table Schema

```bash
GET /v1/tables/{table_name}/schema
```

### Get Table Stats

```bash
GET /v1/tables/{table_name}/stats
```

---

## Dashboard

Access the web UI at `http://your-container:8080`

Features:
- SQL editor with syntax highlighting
- Query history
- Table browser
- Export results to CSV/JSON

---

## S3 Tables Integration

DuckLake uses AWS S3 Tables, the native Iceberg implementation:

### Automatic Features
- **Compaction** — AWS handles file merging
- **Schema evolution** — Add columns without rewriting
- **Time travel** — Query historical snapshots
- **Partitioning** — Efficient date-based queries

### Creating Tables

```sql
CREATE TABLE events (
  event_id VARCHAR,
  timestamp TIMESTAMP,
  user_id VARCHAR,
  event_type VARCHAR,
  payload JSON
)
WITH (
  partitioning = ARRAY['day(timestamp)']
);
```

### Inserting Data

```sql
INSERT INTO events
SELECT * FROM read_parquet('s3://bucket/data/*.parquet');
```

---

## Use Cases

### Ad-Hoc Analytics
Query your data lake without spinning up EMR or Athena. Just SQL.

### Data Exploration
Browse tables, preview data, understand schemas before building pipelines.

### Local Development
Point at production S3 Tables from your dev environment.

### Quick Reporting
Build simple dashboards without a full BI tool.

---

## Pricing

AWS Marketplace:

| Model | Price |
|-------|-------|
| Hourly | $0.05/hour |
| Annual | $350/year |

Plus your AWS costs for S3 and compute.

---

## Limitations

- **Single node** — Not for petabyte-scale workloads
- **Read-heavy** — Optimized for queries, not high-volume writes
- **No multi-tenancy** — One container per use case

For compliance logging with tamper-evident storage, see [Field Notes](/docs/field-notes).

---

## Related

- [Data Tools Overview](/docs/data-tools) — Other utilities
- [Field Notes](/docs/field-notes) — Compliance-grade logging with Iceberg
