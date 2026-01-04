---
id: field-notes-container
title: Field Notes Container
slug: /field-notes/container
sidebar_position: 1
---

# Field Notes Container

Deploy Field Notes into your own AWS environment via AWS Marketplace. Your VPC, your data, complete control.

---

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Your App   │────▶│ Field Notes │────▶│  S3 Tables  │
│             │     │  Container  │     │  (Iceberg)  │
└─────────────┘     └──────┬──────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │   DuckDB    │
                    │  (queries)  │
                    └─────────────┘
```

**Key components:**
- **S3 Tables** — AWS's native Iceberg tables for storage
- **DuckDB** — Embedded query engine for SQL over Iceberg
- **Container** — Runs in your VPC, no data leaves your environment

---

## Prerequisites

- AWS account with S3 Tables enabled
- VPC with private subnets
- ECS Fargate or EC2 for container hosting
- IAM role with S3 Tables permissions

---

## Deployment

### AWS Marketplace

1. Subscribe to Field Notes on AWS Marketplace
2. Launch via ECS or EC2
3. Configure environment variables
4. Point your applications at the container endpoint

### Environment Variables

```bash
# Required
FIELD_NOTES_S3_BUCKET=your-iceberg-bucket
FIELD_NOTES_S3_TABLE_NAMESPACE=field_notes

# Optional
FIELD_NOTES_HMAC_SECRET=your-secret-for-hmac-auth
FIELD_NOTES_LOG_LEVEL=INFO
```

---

## Authentication

Field Notes container is designed for private VPC deployment. Three auth modes:

### None (Default)
No authentication. Suitable when the container is only accessible within your VPC via security groups.

### HMAC
Request signing for additional security:

```python
import hmac
import hashlib

def sign_request(body: bytes, secret: str) -> str:
    return hmac.new(
        secret.encode(),
        body,
        hashlib.sha256
    ).hexdigest()

# Include in request header
headers = {"X-Signature": sign_request(payload, HMAC_SECRET)}
```

### Bring Your Own Cognito (Coming Soon)
Configure your own Cognito User Pool for OAuth 2.0 authentication.

---

## API Reference

### Ingest Event

```bash
POST /v1/events
Content-Type: application/x-protobuf

# Body: serialized AuditEvent protobuf
```

### Query Logs

```bash
POST /v1/query
Content-Type: application/json

{
  "sql": "SELECT * FROM logs WHERE actor_id = ? LIMIT 100",
  "params": ["user-123"]
}
```

### Get Merkle Proof

```bash
GET /v1/proof/{batch_id}
```

Returns the merkle root and proof path for a specific batch.

---

## Storage

### S3 Tables (Iceberg)

Field Notes uses AWS S3 Tables, the native Iceberg implementation:

- **Auto-compaction** — AWS manages file compaction
- **Schema evolution** — Add fields without rewriting data
- **Time travel** — Query historical snapshots
- **Partitioning** — By date for efficient queries

### Table Schema

```sql
CREATE TABLE logs (
  log_id STRING,
  timestamp TIMESTAMP,
  event_type STRING,
  outcome STRING,
  severity STRING,
  sensitivity STRING,
  actor_id STRING,
  component STRING,
  environment STRING,
  resource STRING,
  message STRING,
  payload STRING,  -- JSON
  policy_tags ARRAY<STRING>,
  session_id STRING,
  request_id STRING,
  source_ip STRING,
  record_hash STRING,
  prev_hash STRING,
  batch_id STRING,
  batch_merkle_root STRING
)
PARTITIONED BY (days(timestamp))
```

---

## Pricing

AWS Marketplace pricing:

| Model | Price |
|-------|-------|
| Hourly | $X.XX/hour |
| Annual | $X,XXX/year |

Plus your AWS costs for S3, compute, and data transfer.

---

## Monitoring

### Health Check

```bash
GET /health
```

### Metrics

Field Notes exposes Prometheus metrics:

```bash
GET /metrics
```

Key metrics:
- `field_notes_events_ingested_total`
- `field_notes_batches_written_total`
- `field_notes_query_duration_seconds`

---

## Troubleshooting

### Events not appearing in queries

1. Check batch buffer hasn't flushed yet (default: 1000 events or 60 seconds)
2. Verify S3 Tables permissions
3. Check container logs for errors

### HMAC signature failures

1. Ensure secret matches between client and container
2. Verify body bytes match exactly (no encoding differences)
3. Check for clock skew if using timestamp in signature

---

## Related

- [Field Notes Overview](/docs/field-notes) — Product overview
- [Field Notes SaaS](/docs/field-notes/saas) — Managed service option
