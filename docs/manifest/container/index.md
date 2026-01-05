---
id: manifest-container
title: Manifest Container
slug: /manifest/container
sidebar_position: 1
---

# Manifest Container

Deploy Manifest into your own AWS environment via AWS Marketplace. Your VPC, your data, complete control.

---

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Stripe    │────▶│   Manifest  │────▶│  Your App   │
│   Shopify   │     │  Container  │     │             │
│   etc.      │     └──────┬──────┘     └─────────────┘
└─────────────┘            │
                    ┌──────┴──────┐
                    ▼             ▼
             ┌─────────────┐ ┌─────────────┐
             │  DynamoDB   │ │   Valkey    │
             │  (storage)  │ │ (hot path)  │
             └─────────────┘ └─────────────┘
```

**Key components:**
- **DynamoDB** — Webhook captures, source configs, with TTL for retention
- **Valkey** — Retry queues, deduplication cache, hot path operations
- **Container** — Runs in your VPC

---

## Prerequisites

- AWS account
- VPC with private subnets
- DynamoDB tables (created by CloudFormation or manually)
- ElastiCache Valkey cluster (or self-managed)
- ECS Fargate or EC2 for container hosting

---

## Deployment

### AWS Marketplace

1. Subscribe to Manifest on AWS Marketplace
2. Launch CloudFormation stack (creates DynamoDB tables, IAM roles)
3. Deploy container to ECS
4. Configure environment variables

### Environment Variables

```bash
# Required
MANIFEST_DYNAMODB_TABLE_CAPTURES=manifest-captures
MANIFEST_DYNAMODB_TABLE_SOURCES=manifest-sources
MANIFEST_VALKEY_HOST=your-valkey-cluster.cache.amazonaws.com
MANIFEST_VALKEY_PORT=6379

# Optional
MANIFEST_HMAC_SECRET=your-secret-for-hmac-auth
MANIFEST_LOG_LEVEL=INFO
MANIFEST_DEFAULT_RETENTION_DAYS=90
```

---

## Authentication

Manifest container is designed for private VPC deployment.

### None (Default)
No authentication. Suitable when only accessible within your VPC.

### HMAC
Request signing for webhook forwarding verification:

```python
import hmac
import hashlib

def verify_signature(body: bytes, signature: str, secret: str) -> bool:
    expected = hmac.new(secret.encode(), body, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, signature)
```

---

## API Reference

### Receive Webhook

```bash
POST /v1/sources/{source_id}/receive
Content-Type: application/json

# Body: raw webhook payload from provider
```

### List Sources

```bash
GET /v1/sources
```

### Create Source

```bash
POST /v1/sources
Content-Type: application/json

{
  "source_id": "stripe-prod",
  "name": "Stripe Production",
  "forward_url": "https://api.yourapp.com/webhooks/stripe",
  "retention_days": 90,
  "dedup_mode": "header",
  "dedup_header": "Stripe-Webhook-Id"
}
```

### Replay Events

```bash
POST /v1/sources/{source_id}/replay
Content-Type: application/json

{
  "from_timestamp": "2026-01-01T00:00:00Z",
  "to_timestamp": "2026-01-02T00:00:00Z"
}
```

### Get DLQ Events

```bash
GET /v1/sources/{source_id}/dlq
```

### Retry DLQ Event

```bash
POST /v1/sources/{source_id}/dlq/{event_id}/retry
```

---

## Storage

### DynamoDB Tables

**manifest-captures**
- Partition key: `source_id`
- Sort key: `timestamp`
- TTL attribute: `expires_at`

**manifest-sources**
- Partition key: `source_id`

### Valkey

- Retry queues per source: `manifest:retry:{source_id}`
- Dedup cache: `manifest:dedup:{source_id}:{hash}`
- In-flight tracking: `manifest:inflight:{source_id}`

---

## Retention

DynamoDB TTL handles automatic cleanup. Set `retention_days` per source:

- High-volume, low-value events: 7 days
- Payment webhooks: 90 days
- Compliance-critical: 365+ days

---

## Pricing

AWS Marketplace pricing:

| Model | Price |
|---------------------|-------|
|Up to 1,000 callbacks|free|
|Up to 10,000 callbacks|39$|
|Up to 50,000 callbacks|89$|
|Up to 250,000 callbacks|189$|

Plus your AWS costs for DynamoDB, ElastiCache, and compute.

---

## Monitoring

### Health Check

```bash
GET /health
```

### Metrics

Prometheus metrics at `/metrics`:

- `manifest_webhooks_received_total`
- `manifest_webhooks_forwarded_total`
- `manifest_webhooks_failed_total`
- `manifest_dlq_depth`
- `manifest_retry_queue_depth`

---

## Related

- [Manifest Overview](/docs/manifest) — Product overview
- [Manifest SaaS](/docs/manifest/saas) — Managed service option
