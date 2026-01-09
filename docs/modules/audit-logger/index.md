---
id: audit-logger-index
title: audit-logger
slug: /modules/audit-logger
sidebar_position: 5
---

# audit-logger

Tamper-evident compliance logs with cryptographic proofs.

---

## Coming Soon

This module is under active development.

---

## What It Does

1. Ingest structured log events via API
2. Hash-chain every entry (SHA-256)
3. Produce merkle roots for batch verification
4. Store immutably in Iceberg tables
5. Generate proofs for auditors on demand

---

## Use Cases

- **SOC2 Audit Trail** — Prove logs weren't modified
- **MCP Agent Logging** — Log every tool call and model inference
- **Application Audit Logs** — Structured, queryable, tamper-evident

---

## Key Features

| Feature | Description |
|---------|-------------|
| **Tamper-evident** | Hash-chained entries using merkle trees |
| **Cryptographic proofs** | Merkle roots for batch verification |
| **SQL queries** | Query logs via DuckDB over Iceberg tables |
| **Schema support** | Events conform to compliance-log-schema |
| **AI/Agent logging** | First-class MCP tool calls, model inference |

---

## Related Open Source

This module is powered by:

- [compliance-log-schema](/docs/open-source/compliance-log-schema) — Protobuf schema for audit logs
- [merkle-tree](/docs/open-source/merkle-tree) — Tamper-evidence primitives
- [mcp-log](/docs/open-source/mcp-log) — MCP interaction logging

---

## Notify Me

Want to know when audit-logger launches? Email support@lokryn.com with "audit-logger waitlist" in the subject.
