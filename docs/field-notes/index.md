---
id: field-notes-index
title: Field Notes
slug: /field-notes
sidebar_position: 1
---

# Field Notes

Tamper-evident audit logging with cryptographic proofs. Every log entry is hash-chained and merkle-rooted, giving you compliance-grade immutability that auditors can verify.

---

## The Problem

Scattered logs are a compliance nightmare. When auditors ask "prove this log wasn't modified," most teams can't answer. Field Notes gives small businesses the same audit-grade logging that enterprises pay six figures for.

---

## How It Works

1. **Ingest logs** — POST structured events to the Field Notes API
2. **Hash chain** — Every entry linked to the previous via SHA-256
3. **Merkle root** — Batches produce cryptographic proofs
4. **Store immutably** — Iceberg tables for efficient querying
5. **Prove integrity** — Generate proofs for auditors on demand

---

## Key Features

| Feature | Description |
|---------|-------------|
| **Tamper-evident** | Hash-chained entries using [lokryn-merkle-tree](https://pypi.org/project/lokryn-merkle-tree/) |
| **Cryptographic proofs** | Merkle roots for batch verification |
| **SQL queries** | Query logs via DuckDB over Iceberg tables |
| **Schema support** | Events conform to [lokryn-compliance-log-schema](https://buf.build/lokryn/compliance-log-schema) |
| **AI/Agent logging** | First-class MCP tool calls, model inference, guardrails |

---

## Deployment Options

### [Container (AWS Marketplace)](/docs/field-notes/container)

Deploy into your own AWS environment. Your VPC, your data.

- **Storage:** S3 Tables (Iceberg) + DuckDB
- **Auth:** None required (private VPC), optional HMAC, or bring your own Cognito
- **Pricing:** One-time or hourly via AWS Marketplace

### [SaaS (Control Room)](/docs/field-notes/saas)

Managed service. We handle infrastructure, you handle logging.

- **Storage:** Cloudflare R2 (Iceberg) with Valkey buffering
- **Auth:** OAuth 2.0 client credentials via Cognito
- **Pricing:** Usage-based from free (1GB) to enterprise tiers

---

## Use Cases

### SOC2 Audit Trail
Immutable logs with cryptographic proofs satisfy SOC2 requirements for audit trail integrity. Auditors can verify no entries were modified.

### MCP Agent Logging
Log every tool call, resource access, and prompt execution from your AI agents. Use [lokryn-mcp-log](https://pypi.org/project/lokryn-mcp-log/) for automatic instrumentation.

### Application Audit Logs
Replace scattered application logs with structured, queryable, tamper-evident storage. Debug issues and prove compliance from the same data.

---

## Log Schema

Field Notes accepts events conforming to [lokryn-compliance-log-schema](/docs/open-source/compliance-log-schema). The schema supports:

- Standard audit fields (timestamp, actor, action, outcome)
- AI/agent events (MCP tool calls, model inference, guardrails)
- Sensitivity levels and policy tags for compliance frameworks
- Structured payloads for direct querying

---

## Related

- [Compliance Log Schema](/docs/open-source/compliance-log-schema) — The protobuf schema for events
- [Merkle Tree](/docs/open-source/merkle-tree) — The library powering tamper-evident storage
- [MCP Log](/docs/open-source/mcp-log) — Automatic logging for MCP clients
