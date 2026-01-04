---
id: manifest-index
title: Manifest
slug: /manifest
sidebar_position: 2
---

# Manifest

Webhook retry with dead letter queue. Never lose a Stripe, Shopify, or any other webhook due to downtime.

---

## The Problem

Missed webhooks silently break your business. One network glitch and you lose a critical event. Worse, replaying them later often scrambles the sequence—charging a customer before their subscription exists.

---

## How It Works

1. **Configure sources** — Point your webhook providers at Manifest endpoints
2. **Capture & store** — Every webhook stored before forwarding
3. **Forward** — Deliver to your application endpoint
4. **Handle failures** — Failed deliveries enter retry queue with backoff
5. **Replay** — Manually or automatically replay from any point

---

## Key Features

| Feature | Description |
|---------|-------------|
| **Guaranteed capture** | Every webhook stored before forwarding |
| **Ordered replay** | Events re-delivered in exact sequence per source |
| **Dead letter queue** | Failed deliveries held for inspection and retry |
| **Deduplication** | Prevent duplicate processing (off, header-based, or body hash) |
| **Configurable retention** | TTL-based cleanup per source |
| **Head-of-line blocking** | Failed event blocks subsequent events from same source |

---

## Deployment Options

### [Container (AWS Marketplace)](/docs/manifest/container)

Deploy into your own AWS environment. Your VPC, your data.

- **Storage:** DynamoDB (captures, configs) + Valkey (retry queues)
- **Auth:** None required (private VPC), optional HMAC
- **Pricing:** Hourly or annual via AWS Marketplace

### [SaaS (Control Room)](/docs/manifest/saas)

Managed service. We handle infrastructure, you configure sources.

- **Storage:** DynamoDB + Valkey (same architecture)
- **Auth:** OAuth 2.0 client credentials via Cognito
- **Pricing:** Usage-based by captures/month

---

## Use Cases

### Payment Webhooks
Capture every Stripe, PayPal, or Square event. Never miss a payment confirmation or dispute notification. Replay in order after outages.

### E-commerce Events
Shopify order webhooks processed in sequence. No more inventory sync issues from out-of-order replays.

### Subscription Lifecycle
Ensure subscription events (created → updated → cancelled) process in order. Prevent billing errors from sequence scrambling.

### Compliance Audit
Maintain a complete record of all incoming webhooks. Pair with [Field Notes](/docs/field-notes) for tamper-evident storage.

---

## Source Configuration

Each webhook source is configured independently:

```json
{
  "source_id": "stripe-prod",
  "name": "Stripe Production",
  "forward_url": "https://api.yourapp.com/webhooks/stripe",
  "retention_days": 90,
  "dedup_mode": "header",
  "dedup_header": "Stripe-Webhook-Id",
  "retry_policy": {
    "max_attempts": 5,
    "backoff": "exponential",
    "initial_delay_ms": 1000,
    "max_delay_ms": 300000
  }
}
```

---

## Deduplication Modes

| Mode | Description | Use When |
|------|-------------|----------|
| `off` | No deduplication | You handle idempotency yourself |
| `header` | Dedupe using provider's header | Provider sends idempotency header (Stripe, Shopify) |
| `body_hash` | Dedupe using SHA-256 of body | No idempotency header available |

---

## Related

- [Field Notes](/docs/field-notes) — Tamper-evident audit logging
- [Control Room](https://app.lokryn.com) — Dashboard for managing sources
