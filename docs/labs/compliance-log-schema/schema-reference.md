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
}
```

---

## EventType

What happened.

### Traditional Events

| Event | Description |
|-------|-------------|
| `EVENT_LOGIN` | User authentication |
| `EVENT_LOGOUT` | Session termination |
| `EVENT_FILE_ACCESS` | File read/write/delete |
| `EVENT_POLICY_CHANGE` | Security policy modification |
| `EVENT_PRIVILEGE_USE` | Elevated permission usage |
| `EVENT_CONFIG_CHANGE` | System configuration change |
| `EVENT_DATA_EXPORT` | Data leaving the system |
| `EVENT_NETWORK_CONNECTION` | Network activity |
| `EVENT_PROCESS_START` | Process execution |
| `EVENT_PROCESS_STOP` | Process termination |
| `EVENT_USER_MANAGEMENT` | User account changes |
| `EVENT_RESOURCE_ACCESS` | Generic resource access |

### AI/Agent Events

| Event | Description |
|-------|-------------|
| `EVENT_TOOL_INVOCATION` | MCP tool call, function call, API invocation |
| `EVENT_MODEL_INFERENCE` | LLM API call (completion, embedding, etc.) |
| `EVENT_AGENT_DECISION` | Autonomous decision point (branching, action selection) |
| `EVENT_DELEGATION` | Agent delegating to sub-agent or another system |
| `EVENT_CONTEXT_ACCESS` | RAG retrieval, memory access, context window operations |
| `EVENT_PROMPT_EXECUTION` | Prompt template execution |
| `EVENT_GUARDRAIL_CHECK` | Safety/guardrail evaluation (pass/fail) |

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
