---
id: compliance-log-schema-index
title: Compliance Log Schema
slug: /open-source/compliance-log-schema
sidebar_position: 0
---

# Compliance Log Schema

Protocol Buffers schema for compliance-grade audit logging. The canonical format for SOC2, HIPAA, and PCI environments, with first-class support for AI/agent systems.

---

## The Problem

There's no standard for compliance-grade audit logging. Everyone rolls their own. When you need to prove what happened, when, and why—especially with AI agents making autonomous decisions—you're stuck stitching together ad-hoc logs that weren't designed for auditors.

---

## The Solution

A single schema that serves as a "universal translator" for compliance logs:

- **Traditional audit events** — Login, file access, config changes
- **AI/agent events** — MCP tool calls, model inference, guardrails, autonomous decisions
- **Pre-translated fields** — Zero-cost export to OCSF and OpenTelemetry GenAI
- **Sensitivity classification** — Data handling policies built in
- **Outcome tracking** — Granular failures that collapse to standard categories

One format. Drop-in ready for any logging system. Built for compliance teams to actually use.

---

## Architecture

```
                    ┌─────────────────────────────────────────┐
                    │       lokryn-compliance-log-schema      │
                    │            (canonical format)           │
                    └────────────────────┬────────────────────┘
                                         │
        ┌────────────────┬───────────────┼───────────────┬────────────────┐
        ▼                ▼               ▼               ▼                ▼
   ┌─────────┐    ┌─────────┐    ┌─────────────┐  ┌───────────┐   ┌─────────┐
   │  OCSF   │    │  OTel   │    │    SIEM     │  │  Logging  │   │ Custom  │
   │         │    │  GenAI  │    │   Formats   │  │ Platforms │   │  Export │
   └─────────┘    └─────────┘    └─────────────┘  └───────────┘   └─────────┘
```

**Key design:** Pre-translated fields enable zero-cost export through field renaming rather than runtime transformation.

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

## Event Types

### Standard Audit Events
Traditional operations: authentication, authorization, data access, configuration changes.

### AI/Agent Events

| Event Type | Description |
|------------|-------------|
| `TOOL_CALL` | MCP tool invocation with inputs/outputs |
| `MODEL_INFERENCE` | LLM call with prompt, response, tokens |
| `GUARDRAIL` | Safety check trigger and result |
| `AUTONOMOUS_DECISION` | Agent decision without human approval |
| `CONTEXT_ACCESS` | Information retrieval during reasoning |
| `DELEGATION` | Agent-to-agent or agent-to-tool handoff |

### Outcome Granularity

Outcomes use a prefix convention for granular tracking that collapses to standard categories:

```
FAILURE_PERMISSION    → maps to OCSF "Failure"
FAILURE_VALIDATION    → maps to OCSF "Failure"
FAILURE_TIMEOUT       → maps to OCSF "Failure"
SUCCESS               → maps to OCSF "Success"
SUCCESS_WITH_WARNING  → maps to OCSF "Success"
```

This preserves debugging detail while maintaining compatibility with standard frameworks.

---

## Structured Payloads

AI/agent events include structured payloads for direct querying (not opaque bytes):

```protobuf
message ToolCallPayload {
  string tool_name = 1;
  string tool_input_json = 2;
  string tool_output_json = 3;
  int64 duration_ms = 4;
  string mcp_server_uri = 5;
}

message ModelInferencePayload {
  string model_id = 1;
  string provider = 2;
  int32 input_tokens = 3;
  int32 output_tokens = 4;
  float temperature = 5;
  string prompt_hash = 6;  // For PII safety
}
```

---

## Standard Mappings

Pre-translated fields enable efficient export:

| Lokryn Field | OCSF | OpenTelemetry GenAI |
|--------------|------|---------------------|
| `timestamp` | `time` | `@timestamp` |
| `actor.id` | `actor.user.uid` | `user.id` |
| `action` | `activity_name` | `gen_ai.operation.name` |
| `outcome` | `status` | `gen_ai.response.finish_reasons` |
| `resource.id` | `object.uid` | `gen_ai.request.model` |

See [Standard Mappings](/docs/open-source/compliance-log-schema/standard-mappings) for complete tables.

---

## Why This Schema?

### For Compliance Teams

- Maps directly to SOC2, HIPAA, PCI audit requirements
- Sensitivity levels match data classification policies
- Policy tags filter by compliance framework
- Outcome tracking shows attempted vs. successful actions

### For AI/Agent Systems

- First-class MCP protocol coverage
- Delegation chains track agent → sub-agent → tool flows
- Guardrail events create safety audit trails
- Structured payloads enable queries like "show all tool calls that failed with timeout"

### For Developers

- Single schema, any language (Python, Go, TypeScript, Rust, etc.)
- Protobuf means type safety and compact serialization
- Pre-translated fields reduce export complexity
- Works with Field Notes or your own system

---

## Ecosystem

This schema is the foundation for:

- **[lokryn-mcp-log](/docs/open-source/mcp-log)** — Auto-generates compliant logs from MCP clients
- **Field Notes** — Tamper-evident storage with merkle proofs
- **[lokryn-merkle-tree](/docs/open-source/merkle-tree)** — Hash chaining used by Field Notes

---

## License

**AGPL-3.0** — Free to use, modify, and distribute. If you run a modified version as a network service, you must open source your changes.

**Commercial License** — Need to use this without AGPL obligations? Contact [sales@lokryn.com](mailto:sales@lokryn.com).

---

## Resources

- [Schema Reference](/docs/open-source/compliance-log-schema/schema-reference) — Full field documentation
- [Standard Mappings](/docs/open-source/compliance-log-schema/standard-mappings) — Export format tables
- [Usage Examples](/docs/open-source/compliance-log-schema/usage-examples) — Code samples
- [GitHub](https://github.com/lokryn-llc/compliance-log-schema)
- [Buf Registry](https://buf.build/lokryn/compliance-log-schema)
