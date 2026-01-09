---
id: webhook-relay-index
title: webhook-relay
slug: /modules/webhook-relay
sidebar_position: 4
---

# webhook-relay

Dead letter queue with ordered replay. Never lose a webhook.

---

## Coming Soon

This module is under active development.

---

## What It Does

1. Capture every webhook before forwarding
2. Forward to your application endpoint
3. Failed deliveries enter retry queue with backoff
4. Replay in exact sequence per source

---

## Use Cases

- **Payment Webhooks** — Never miss a Stripe or PayPal event
- **E-commerce Events** — Shopify orders processed in sequence
- **Subscription Lifecycle** — Events replay in order after outages

---

## Key Features

| Feature | Description |
|---------|-------------|
| **Guaranteed capture** | Every webhook stored before forwarding |
| **Ordered replay** | Events re-delivered in exact sequence per source |
| **Dead letter queue** | Failed deliveries held for inspection and retry |
| **Deduplication** | Prevent duplicate processing |
| **Head-of-line blocking** | Failed event blocks subsequent events from same source |

---

## Source Configuration Example

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

## Notify Me

Want to know when webhook-relay launches? Email support@lokryn.com with "webhook-relay waitlist" in the subject.
