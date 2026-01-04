---
id: pipe-audit-saas
title: Pipe Audit SaaS
slug: /pipe-audit/saas
sidebar_position: 11
---

# Pipe Audit SaaS

Managed Pipe Audit via Control Room. We handle infrastructure, you define contracts.

---

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Your Files │────▶│  Pipe Audit │────▶│   Valid     │
│             │     │     API     │     │   Output    │
└─────────────┘     └──────┬──────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │   Cognito   │
                    │   (auth)    │
                    └─────────────┘
```

---

## Getting Started

### 1. Create an Account

Sign up at [app.lokryn.com](https://app.lokryn.com).

### 2. Create a Contract

In Control Room, navigate to **Pipe Audit → Contracts → Create Contract**.

Use the TOML editor or upload a contract file.

### 3. Get API Credentials

Navigate to **Settings → API Credentials** and create credentials with `pipeaudit.*` scopes.

### 4. Submit Files

```bash
# Get token
TOKEN=$(curl -s -X POST https://auth.lokryn.com/oauth2/token \
  -d "grant_type=client_credentials" \
  -d "client_id=$CLIENT_ID" \
  -d "client_secret=$CLIENT_SECRET" \
  -d "scope=pipeaudit.submit" | jq -r '.access_token')

# Submit file
curl -X POST https://api.lokryn.com/pipeaudit/v1/validate \
  -H "Authorization: Bearer $TOKEN" \
  -F "contract_id=vendor-sales" \
  -F "file=@sales.csv"
```

---

## Authentication

OAuth 2.0 client credentials via Cognito.

### Scopes

| Scope | Description |
|-------|-------------|
| `pipeaudit.submit` | Submit files for validation |
| `pipeaudit.query` | View validation results and history |
| `pipeaudit.admin` | Manage contracts and settings |

---

## Dashboard

Control Room provides:

- **Overview** — Validation stats, pass rate, recent failures
- **Contracts** — Create, edit, manage validation contracts
- **Validations** — History with filtering by contract, status, date
- **Quarantine** — View and manage failed files
- **Settings** — API keys, notifications, integrations

---

## API Reference

### Submit File

```bash
POST /pipeaudit/v1/validate
Authorization: Bearer {token}
Content-Type: multipart/form-data

contract_id=vendor-sales
file=@sales.csv
```

Response:
```json
{
  "validation_id": "val-123",
  "status": "passed",
  "contract_id": "vendor-sales",
  "file_name": "sales.csv",
  "errors": [],
  "timestamp": "2026-01-03T12:00:00Z"
}
```

### List Contracts

```bash
GET /pipeaudit/v1/contracts
Authorization: Bearer {token}
```

### Create Contract

```bash
POST /pipeaudit/v1/contracts
Authorization: Bearer {token}
Content-Type: application/toml

[contract]
name = "vendor-sales"
...
```

### Get Validation History

```bash
GET /pipeaudit/v1/validations?contract_id=vendor-sales&limit=100
Authorization: Bearer {token}
```

### Get Quarantine

```bash
GET /pipeaudit/v1/quarantine
Authorization: Bearer {token}
```

### Download Quarantined File

```bash
GET /pipeaudit/v1/quarantine/{file_id}/download
Authorization: Bearer {token}
```

---

## Pricing

Usage-based pricing. Pay for validations, not seats.

| Tier | Validations/month | Price |
|------|-------------------|-------|
| Free | 100 | $0/month |
| Starter | 5,000 | $29/month |
| Pro | 50,000 | $99/month |
| Enterprise | Custom | Contact us |

All tiers include:
- Unlimited contracts
- Quarantine storage (30 days)
- Validation history
- API access

---

## Integrations

### S3 Trigger

Configure an S3 bucket to automatically validate uploads:

1. In Control Room, go to **Pipe Audit → Integrations → S3**
2. Add your bucket ARN
3. Deploy the provided CloudFormation stack
4. Files uploaded to the bucket trigger validation automatically

### Webhook Notifications

Receive webhooks on validation completion:

```json
{
  "event": "validation.completed",
  "validation_id": "val-123",
  "status": "failed",
  "contract_id": "vendor-sales",
  "errors": [
    {"row": 15, "column": "amount", "message": "Value -50 below minimum 0"}
  ]
}
```

---

## Related

- [Pipe Audit Overview](/docs/pipe-audit) — Product overview
- [Pipe Audit Container](/docs/pipe-audit/container) — Self-hosted option
- [CLI Reference](/docs/pipe-audit/cli) — Command-line interface
- [Control Room](https://app.lokryn.com) — Dashboard
