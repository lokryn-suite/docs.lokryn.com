---
id: open-source-index
title: Open Source
slug: /open-source
sidebar_position: 10
---

# Open Source

Production-grade libraries. Use them standalone, patch them together yourself, or let our products do the integration for you.

---

## Philosophy

These aren't toy libraries or marketing exercises. They're the actual components that power Field Notes, Manifest, and Pipe Audit. When we fix a bug or add a feature, everyone benefits.

**Why open source?**
- Build trust through transparency
- Enable DIY users who want full control
- Attract contributors who improve the ecosystem
- Ensure no vendor lock-in

---

## Libraries

### [Compliance Log Schema](/docs/open-source/compliance-log-schema)

Protocol Buffers schema for compliance-grade audit logging. The canonical format for SOC2, HIPAA, and PCI environments.

- First-class AI/agent event types (MCP tool calls, model inference, guardrails)
- Pre-translated fields for OCSF and OpenTelemetry GenAI standards
- Works everywhere: Python, Go, TypeScript, Rust, etc.

**Links:** [GitHub](https://github.com/lokryn-llc/compliance-log-schema) · [Buf Registry](https://buf.build/lokryn/compliance-log-schema)

---

### [Merkle Tree](/docs/open-source/merkle-tree)

Tamper-evident data structures for audit logs. Hash chaining with SHA-256 and merkle roots for efficient batch verification.

- Hash chain every record for tamper evidence
- Generate merkle roots for batch verification proofs
- The same library Field Notes uses internally

**Links:** [GitHub](https://github.com/lokryn-llc/merkle-tree) · [PyPI](https://pypi.org/project/lokryn-merkle-tree/)

---

### [MCP Log](/docs/open-source/mcp-log)

Compliance-grade logging for Model Context Protocol clients. Wraps the official MCP Python SDK and logs every operation.

- Automatic logging of tool calls, resource access, prompt executions
- Multiple sinks: stdout, file, HTTP, Field Notes
- Proxy pattern—no subclassing, explicit configuration

**Links:** [GitHub](https://github.com/lokryn-llc/mcp-log) · [PyPI](https://pypi.org/project/lokryn-mcp-log/)

---

## DIY Path

Want to build your own compliance logging without using our products? Here's how the pieces fit together:

```
┌─────────────────────────────────────────────────────────────┐
│                    Your Application                         │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  lokryn-mcp-log (if using MCP) OR custom instrumentation    │
└─────────────────────────────┬───────────────────────────────┘
                              │ generates events conforming to
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              lokryn-compliance-log-schema                   │
└─────────────────────────────┬───────────────────────────────┘
                              │ events hashed with
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  lokryn-merkle-tree                         │
└─────────────────────────────┬───────────────────────────────┘
                              │ stored in
                              ▼
┌─────────────────────────────────────────────────────────────┐
│            Your storage (S3, Iceberg, database)             │
└─────────────────────────────────────────────────────────────┘
```

---

## Licensing

All Lokryn libraries are dual-licensed:

### AGPL-3.0 (Open Source)
Free for open source projects. If you distribute software using these libraries, you must also distribute your source code under AGPL-3.0.

### Commercial License
For proprietary/closed-source use without AGPL obligations. Contact [sales@lokryn.com](mailto:sales@lokryn.com).

**Why AGPL?**
- Ensures improvements flow back to the community
- Prevents cloud providers from offering our code as a service without contributing
- Commercial license available for those who need it

---

## Roadmap

| Library | Purpose | Status |
|---------|---------|--------|
| lokryn-iceberg-sink | Write compliance logs to Iceberg tables | Planned |
| lokryn-ocsf-export | Export compliance logs to OCSF format | Planned |
| lokryn-siem-adapters | Adapters for popular SIEM and observability platforms | Planned |

---

## Contributing

We welcome contributions. See individual repository READMEs for:
- Development setup
- Testing requirements
- Pull request process

---

## Support

- **Issues** — File on the relevant GitHub repository
- **Discord** — [discord.gg/4JJT9qEfCA](https://discord.gg/4JJT9qEfCA)
- **Email** — [support@lokryn.com](mailto:support@lokryn.com) (commercial license holders)
