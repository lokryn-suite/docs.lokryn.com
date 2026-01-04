---
id: schema-reference
title: Schema Reference
sidebar_position: 1
---

# Schema Reference

Complete reference for the Compliance Log Schema message types and enums.

---

## LogRequest Message

The core message structure for all audit events:

```protobuf
message LogRequest {
  EventType event_type   = 1;   // What happened
  Outcome outcome        = 2;   // Did it work?
  Severity severity      = 3;   // How important?
  string actor_id        = 4;   // Who did it (user, service, agent)
  string component       = 5;   // What system component
  string environment     = 6;   // prod, staging, dev
  string resource        = 7;   // What was accessed/modified
  string message         = 8;   // Human-readable description
  bytes payload          = 9;   // Structured data (JSON/CBOR)
  repeated string policy_tags = 10;  // Compliance tags (PCI, HIPAA, etc.)
  Sensitivity sensitivity = 11; // Data sensitivity level
  string trace_id        = 12;  // Distributed tracing ID
  string span_id         = 13;  // Span ID within trace

  // Pre-translated mapping fields (set at write time)
  uint32 ocsf_class_uid     = 20;  // OCSF class UID
  uint32 ocsf_activity_id   = 21;  // OCSF activity ID
  string otel_operation_name = 22; // OTel GenAI operation name
}
```

---

## EventType

What happened.

### Traditional Events (1-19)

| ID | Event | Description |
|----|-------|-------------|
| 1 | `EVENT_LOGIN` | User authentication |
| 2 | `EVENT_LOGOUT` | Session termination |
| 3 | `EVENT_FILE_ACCESS` | File read/write/delete |
| 4 | `EVENT_POLICY_CHANGE` | Security policy modification |
| 5 | `EVENT_PRIVILEGE_USE` | Elevated permission usage |
| 6 | `EVENT_CONFIG_CHANGE` | System configuration change |
| 7 | `EVENT_DATA_EXPORT` | Data leaving the system |
| 8 | `EVENT_NETWORK_CONNECTION` | Network activity |
| 9 | `EVENT_PROCESS_START` | Process execution |
| 10 | `EVENT_PROCESS_STOP` | Process termination |
| 11 | `EVENT_USER_MANAGEMENT` | User account changes |
| 12 | `EVENT_RESOURCE_ACCESS` | Generic resource access |

### AI/Agent Events (20-29)

| ID | Event | Description |
|----|-------|-------------|
| 20 | `EVENT_TOOL_INVOCATION` | MCP tool call, function call, API invocation |
| 21 | `EVENT_MODEL_INFERENCE` | LLM API call (completion, embedding, etc.) |
| 22 | `EVENT_AGENT_DECISION` | Autonomous decision point (branching, action selection) |
| 23 | `EVENT_DELEGATION` | Agent delegating to sub-agent or another system |
| 24 | `EVENT_CONTEXT_ACCESS` | RAG retrieval, memory access, context window operations |
| 25 | `EVENT_PROMPT_EXECUTION` | Prompt template execution |
| 26 | `EVENT_GUARDRAIL_CHECK` | Safety/guardrail evaluation (pass/fail) |

### MCP Protocol Events (30-49)

| ID | Event | Description |
|----|-------|-------------|
| 30 | `EVENT_MCP_INITIALIZE` | MCP initialize request |
| 31 | `EVENT_MCP_INITIALIZED` | MCP initialized response |
| 32 | `EVENT_MCP_PING` | MCP ping/pong |
| 33 | `EVENT_MCP_SHUTDOWN` | MCP session shutdown |
| 34 | `EVENT_TOOL_LIST` | List available tools |
| 35 | `EVENT_RESOURCE_LIST` | List available resources |
| 36 | `EVENT_PROMPT_LIST` | List available prompts |
| 37 | `EVENT_RESOURCE_READ` | Read a specific resource |
| 38 | `EVENT_SAMPLING_REQUEST` | Sampling/completion request |
| 39 | `EVENT_SAMPLING_RESPONSE` | Sampling/completion response |

### Transport Events (40-49)

| ID | Event | Description |
|----|-------|-------------|
| 40 | `EVENT_TRANSPORT_CONNECT` | Transport connection established |
| 41 | `EVENT_TRANSPORT_DISCONNECT` | Transport connection closed |
| 42 | `EVENT_TRANSPORT_ERROR` | Transport error occurred |

---

## Severity

How important is this event. Follows RFC 5424 syslog levels.

| Level | Value | When to Use |
|-------|-------|-------------|
| `SEVERITY_DEBUG` | 1 | Detailed debugging |
| `SEVERITY_INFO` | 2 | Normal operations |
| `SEVERITY_NOTICE` | 3 | Significant but normal |
| `SEVERITY_WARNING` | 4 | Something's off |
| `SEVERITY_ERROR` | 5 | Operation failed |
| `SEVERITY_CRITICAL` | 6 | System component failing |
| `SEVERITY_ALERT` | 7 | Immediate action needed |
| `SEVERITY_EMERGENCY` | 8 | System unusable |

---

## Outcome

Did it work?

| Outcome | Description |
|---------|-------------|
| `OUTCOME_SUCCESS` | Operation completed |
| `OUTCOME_FAILURE_UNAUTHORIZED` | Authentication failed |
| `OUTCOME_FAILURE_DENIED` | Authorization failed |
| `OUTCOME_FAILURE_ERROR` | System/application error |
| `OUTCOME_PARTIAL` | Partially completed |

---

## Sensitivity

How sensitive is the data involved?

| Level | Description |
|-------|-------------|
| `SENSITIVITY_PUBLIC` | No restrictions |
| `SENSITIVITY_INTERNAL` | Internal use only |
| `SENSITIVITY_CONFIDENTIAL` | Need-to-know basis |
| `SENSITIVITY_RESTRICTED` | Regulatory/contractual restrictions |
| `SENSITIVITY_HIGHLY_RESTRICTED` | Maximum protection (PII, PHI, PCI) |
