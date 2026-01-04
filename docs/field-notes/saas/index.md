---
id: field-notes-saas
title: Field Notes SaaS
slug: /field-notes/saas
sidebar_position: 2
---

# Field Notes SaaS

Managed Field Notes via Control Room. We handle the infrastructure, you handle logging.

**Launching January 15, 2026**

---

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Your App   │────▶│  Field Notes │────▶│   Valkey    │────▶│  R2 Iceberg │
│             │     │     API      │     │  (buffer)   │     │  (storage)  │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │   Cognito   │
                    │   (auth)    │
                    └─────────────┘
```

**Key components:**
- **Valkey** — ElastiCache for write buffering and batching
- **R2 Iceberg** — Cloudflare R2 with Iceberg tables (zero egress costs)
- **Cognito** — OAuth 2.0 client credentials for authentication
- **Control Room** — Dashboard for management and queries

---

## Getting Started

### 1. Create an Account

Sign up at [app.lokryn.com](https://app.lokryn.com) and create an organization.

### 2. Create API Credentials

In Control Room, navigate to **Settings → API Credentials** and create a new credential set. You'll receive:

- `client_id`
- `client_secret`

### 3. Exchange for Token

```bash
curl -X POST https://auth.lokryn.com/oauth2/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "scope=fieldnotes.ingest"
```

### 4. Send Events

```bash
curl -X POST https://api.lokryn.com/fieldnotes/v1/events \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/x-protobuf" \
  --data-binary @event.pb
```

---

## Authentication

Field Notes SaaS uses OAuth 2.0 client credentials flow via AWS Cognito.

### Scopes

| Scope | Description |
|-------|-------------|
| `fieldnotes.ingest` | Write log entries |
| `fieldnotes.query` | Read and search logs |
| `fieldnotes.admin` | Manage tables and retention |

### Token Lifecycle

- Tokens expire after 1 hour
- Cache tokens and refresh before expiry
- Use the `expires_in` field from token response

### Python Example

```python
import httpx
import os
from datetime import datetime, timedelta

class FieldNotesClient:
    def __init__(self):
        self.token = None
        self.token_expires = None
    
    def get_token(self):
        if self.token and datetime.utcnow() < self.token_expires:
            return self.token
        
        response = httpx.post(
            "https://auth.lokryn.com/oauth2/token",
            data={
                "grant_type": "client_credentials",
                "client_id": os.environ["LOKRYN_CLIENT_ID"],
                "client_secret": os.environ["LOKRYN_CLIENT_SECRET"],
                "scope": "fieldnotes.ingest fieldnotes.query",
            },
        )
        data = response.json()
        self.token = data["access_token"]
        self.token_expires = datetime.utcnow() + timedelta(seconds=data["expires_in"] - 60)
        return self.token
```

---

## API Reference

### Ingest Event

```bash
POST /fieldnotes/v1/events
Authorization: Bearer {token}
Content-Type: application/x-protobuf
```

### Ingest Batch

```bash
POST /fieldnotes/v1/events/batch
Authorization: Bearer {token}
Content-Type: application/x-protobuf
```

### Query Logs

```bash
POST /fieldnotes/v1/query
Authorization: Bearer {token}
Content-Type: application/json

{
  "sql": "SELECT * FROM logs WHERE actor_id = ? LIMIT 100",
  "params": ["user-123"]
}
```

### Get Merkle Proof

```bash
GET /fieldnotes/v1/proof/{batch_id}
Authorization: Bearer {token}
```

---

## Storage

### Cloudflare R2 with Iceberg

- **Zero egress** — No charges for querying your own data
- **Auto-compaction** — Automatic file management
- **Tenant isolation** — Query-level enforcement, your data is isolated

### Retention

Default: 90 days. Configurable per organization in Control Room settings.

---

## Pricing

Usage-based pricing. Pay for storage, not seats.

| Tier | Storage | Price |
|------|---------|-------|
| Free | 1 GB | $0/month |
| Starter | 10 GB | $29/month |
| Pro | 100 GB | $199/month |
| Enterprise | Custom | Contact us |

All tiers include:
- Tamper-evident storage with merkle proofs
- SQL queries over Iceberg tables
- OAuth 2.0 authentication
- Configurable retention

Billing via Stripe. Usage calculated by Stripe based on ingested bytes.

---

## Dashboard

Control Room provides:

- **Overview** — Ingestion stats, storage usage, recent activity
- **Query** — SQL interface for searching logs
- **Proofs** — Generate and download merkle proofs for auditors
- **Settings** — Retention, credentials, notifications

---

## Rate Limits

| Tier | Requests/second | Batch size |
|------|-----------------|------------|
| Free | 10 | 100 events |
| Starter | 100 | 1,000 events |
| Pro | 1,000 | 10,000 events |
| Enterprise | Custom | Custom |

---

## Related

- [Field Notes Overview](/docs/field-notes) — Product overview
- [Field Notes Container](/docs/field-notes/container) — Self-hosted option
- [Control Room](https://app.lokryn.com) — Dashboard
