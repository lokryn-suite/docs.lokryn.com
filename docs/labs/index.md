---
id: labs-index
title: Lokryn Labs
slug: /labs
sidebar_position: 0
---

# Lokryn Labs

A collection of internal tools, weekend hacks, and developer utilities. These projects are maintained but provided "as-is." No SLAs. Just raw utility.

---

## Projects

### [Compliance Log Schema](./compliance-log-schema/)

Protocol Buffers schema for compliance-grade audit logging. Built for SOC2, HIPAA, and PCI environments. Works everywhere, optimized for AI/agent systems.

- First-class support for AI/agent event types (tool calls, model inference, guardrails)
- Sensitivity levels and policy tags for compliance frameworks
- One schema, any language (Python, Go, TypeScript, etc.)

[View on GitHub](https://github.com/lokryn-llc/compliance-log-schema) | [Buf Registry](https://buf.build/lokryn/compliance-log-schema)

---

### [Merkle Tree](./merkle-tree/)

Merkle tree and hash chain utilities for immutable audit logs. Python library for creating tamper-evident chains with cryptographic proofs.

- Hash chaining with SHA-256 for tamper-evident records
- Merkle roots for efficient batch verification
- Protocol-based design for flexible integration

[View on GitHub](https://github.com/lokryn-llc/merkle-tree) | [PyPI](https://pypi.org/project/lokryn-merkle-tree/)

---

### [MCP Log](./mcp-log/)

Compliance-grade audit logging for MCP (Model Context Protocol) client operations. Wraps the official MCP Python SDK and logs every operation in a format that satisfies SOC2, HIPAA, and PCI audit requirements.

- Automatic logging of tool calls, resource access, and prompt executions
- Multiple sinks: stdout, file, HTTP, Field Notes
- Conforms to lokryn-compliance-log-schema

[View on GitHub](https://github.com/lokryn-llc/mcp-log) | [PyPI](https://pypi.org/project/lokryn-mcp-log/) | [Example](https://github.com/lokryn-llc/mcp-log-example)
