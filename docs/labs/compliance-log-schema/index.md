---
id: compliance-log-schema-index
title: Compliance Log Schema Overview
slug: /compliance-log-schema
sidebar_position: 0
---

# Compliance Log Schema

Protocol Buffers schema for compliance-grade audit logging. Built for SOC2, HIPAA, and PCI environments. Works everywhere, optimized for AI/agent systems.

---

## The Problem

There's no standard for compliance-grade audit logging. Everyone rolls their own. When you need to prove what happened, when, and why—especially with AI agents making autonomous decisions—you're stuck stitching together ad-hoc logs that weren't designed for auditors.

---

## The Solution

A single, opinionated schema that covers:

- **Traditional audit events** — Login, file access, config changes
- **AI/agent-specific events** — Tool calls, model inference, autonomous decisions
- **Sensitivity classification** — Data handling policies built in
- **Outcome tracking** — Success/failure analysis for compliance

One format. Drop-in ready for any logging system. Built for compliance teams to actually use.

---

## Installation

### Buf (Recommended)

Add to your `buf.yaml`:

```yaml
deps:
  - buf.build/lokryn/compliance-log-schema
```

Then run:

```bash
buf mod update
```

### Generate Python Code

```bash
buf generate buf.build/lokryn/compliance-log-schema
```

Or with `buf.gen.yaml`:

```yaml
version: v2
plugins:
  - remote: buf.build/protocolbuffers/python
    out: gen
```

---

## Why This Schema?

### For Compliance Teams

- Maps directly to SOC2, HIPAA, PCI audit requirements
- Sensitivity levels match data classification policies
- Policy tags let you filter by compliance framework
- Outcome tracking shows attempted vs. successful actions

### For AI/Agent Systems

- First-class support for tool calls, model inference, and autonomous decisions
- Tracks delegation chains (agent → sub-agent → tool)
- Guardrail events create audit trail for safety checks
- Context access events show what information agents used

### For Developers

- Single schema, multiple languages (Python, Go, TypeScript, etc.)
- Protobuf means type safety and compact serialization
- Drop-in ready for any logging backend
- Works with Field Notes or your own system

---

## Ecosystem

This schema is the foundation for:

- **lokryn-mcp** — MCP client wrapper that auto-generates compliant logs
- **Field Notes** — Tamper-evident audit logging with sub-second queries

---

## License

**AGPL-3.0** — Free to use, modify, and distribute. If you run a modified version as a network service, you must open source your changes.

**Commercial License** — Need to use this without AGPL obligations? Contact us at license@lokryn.com.

---

## Resources

- [GitHub Repository](https://github.com/lokryn-llc/compliance-log-schema)
- [Buf Registry](https://buf.build/lokryn/compliance-log-schema)
