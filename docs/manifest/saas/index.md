---
id: manifest-saas
title: Manifest SaaS
slug: /manifest/saas
sidebar_position: 2
---

# Manifest SaaS

Managed Manifest via Control Room. We handle the infrastructure, you configure sources.

---

## Architecture

Same as container deployment—DynamoDB + Valkey—but fully managed:

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Stripe    │────▶│   Manifest  │────▶│  Your App   │
│   Shopify   │     │     API     │     │             │
│   etc.      │     └──────┬──────┘     └─────────────┘
└─────────────┘            │
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

### 2. Create a Source

In Control Room, navigate to **Manifest → Sources → Create Source**.

Configure:
- Source ID (e.g., `stripe-prod`)
- Forward URL (your webhook endpoint)
- Retention days
- Deduplication mode

### 3. Get Your Endpoint

Your webhook endpoint will be:
```
https://api.lokryn.com/manifest/v1/sources/{source_id}/receive
```

### 4. Update Your Provider

Point your webhook provider (Stripe, Shopify, etc.) at the Manifest endpoint.

---

## Authentication

### Inbound Webhooks

Manifest accepts webhooks from providers without authentication. Security via:
- Verifying provider signatures (if supported)
- Rate limiting per source
- Logging all attempts

### API Access

Dashboard and API use OAuth 2.0 client credentials:

```bash
curl -X POST https://auth.lokryn.com/oauth2/token \
  -d "grant_type=client_credentials" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "scope=manifest.replay manifest.admin"
```

### Scopes

| Scope | Description |
|-------|-------------|
| `manifest.receive` | Accept incoming webhooks (internal) |
| `manifest.replay` | Trigger replays and manage DLQ |
| `manifest.admin` | Configure sources and retention |

---

## Dashboard

Control Room provides:

- **Overview** — Capture stats, forward success rate, DLQ depth
- **Sources** — Create and manage webhook sources
- **Events** — Search and inspect captured webhooks
- **DLQ** — View failed events, retry individually or in batch
- **Replay** — Trigger replays from any timestamp

---

## API Reference

### List Sources

```bash
GET /manifest/v1/sources
Authorization: Bearer {token}
```

### Create Source

```bash
POST /manifest/v1/sources
Authorization: Bearer {token}
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

### Get Events

```bash
GET /manifest/v1/sources/{source_id}/events?since=2026-01-01T00:00:00Z&limit=100
Authorization: Bearer {token}
```

### Replay

```bash
POST /manifest/v1/sources/{source_id}/replay
Authorization: Bearer {token}
Content-Type: application/json

{
  "from_timestamp": "2026-01-01T00:00:00Z",
  "to_timestamp": "2026-01-02T00:00:00Z"
}
```

### Get DLQ

```bash
GET /manifest/v1/sources/{source_id}/dlq
Authorization: Bearer {token}
```

### Retry DLQ Event

```bash
POST /manifest/v1/sources/{source_id}/dlq/{event_id}/retry
Authorization: Bearer {token}
```

---

## Pricing

Usage-based pricing. Pay for captures, not seats.

| Tier | Captures/month | Price |
|------|----------------|-------|
| Free | 1,000 | $0/month |
| Starter | 50,000 | $29/month |
| Pro | 500,000 | $99/month |
| Enterprise | Custom | Contact us |

All tiers include:
- Unlimited sources
- Dead letter queue
- Ordered replay
- Configurable retention (up to tier limit)

---

## Rate Limits

| Tier | Inbound/second | Replay/second |
|------|----------------|---------------|
| Free | 10 | 5 |
| Starter | 100 | 50 |
| Pro | 1,000 | 500 |
| Enterprise | Custom | Custom |

---

## Related

- [Manifest Overview](/docs/manifest) — Product overview
- [Manifest Container](/docs/manifest/container) — Self-hosted option
- [Control Room](https://app.lokryn.com) — Dashboard
