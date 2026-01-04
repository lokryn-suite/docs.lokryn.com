---
id: standard-mappings
title: Standard Mappings
sidebar_position: 3
---

# Standard Mappings

Lokryn is the canonical format. All mappings are **export-only** (Lokryn → Target). The schema stores pre-translated values at write time, so export is field rename only—no runtime transformation.

---

## Supported Standards

| Standard | Type | Notes |
|----------|------|-------|
| OCSF | Open (Linux Foundation) | Primary target for security data lakes |
| OTel GenAI | Open (CNCF) | Primary target for AI/ML observability |
| SIEM CIM formats | Proprietary | Field-compatible with major SIEM platforms |
| ECS formats | Proprietary | Field-compatible with common log schemas |

---

## Field Mapping Overview

### Core Fields

| Lokryn Field | OCSF | OTel GenAI |
|--------------|------|------------|
| `severity` (1-8) | `severity_id` | `event.severity` |
| `time` | `time` | `@timestamp` |
| `trace_id` | `correlation_uid` | `trace.id` |
| `span_id` | N/A | `span.id` |
| `message` | `message` | `message` |
| `actor_id` | `actor.user.uid` | `user.id` |
| `component` | `metadata.product.feature.name` | `service.name` |
| `environment` | `metadata.product.deployment` | `service.environment` |

### Prefix Collapse Rules

| Lokryn Enum | Rule | Target Value |
|-------------|------|--------------|
| `OUTCOME_FAILURE_*` | Prefix match | OCSF `status_id: 2` |
| `SENSITIVITY_PUBLIC_*` | Prefix match | OCSF `confidentiality_id: 1` |

### Pre-translated Fields

These are computed at write time from EventType lookups:

| Lokryn Field | Source | Used By |
|--------------|--------|---------|
| `ocsf_class_uid` | EventType lookup | OCSF export |
| `ocsf_activity_id` | EventType lookup | OCSF export |
| `otel_operation_name` | EventType lookup | OTel GenAI export |

---

## EventType → OCSF Mapping

Reference: [schema.ocsf.io](https://schema.ocsf.io/)

| EventType | ocsf_class_uid | ocsf_class_name | ocsf_activity_id | ocsf_activity_name |
|-----------|----------------|-----------------|------------------|-------------------|
| EVENT_LOGIN (1) | 3002 | Authentication | 1 | Logon |
| EVENT_LOGOUT (2) | 3002 | Authentication | 2 | Logoff |
| EVENT_FILE_ACCESS (3) | 4010 | File Activity | 1 | Read |
| EVENT_POLICY_CHANGE (4) | 5001 | Security Finding | 2 | Update |
| EVENT_PRIVILEGE_USE (5) | 3002 | Authentication | 3 | Privilege Escalation |
| EVENT_CONFIG_CHANGE (6) | 5002 | Configuration Change | 1 | Create |
| EVENT_DATA_EXPORT (7) | 3005 | Data Access | 5 | Export |
| EVENT_NETWORK_CONNECTION (8) | 4001 | Network Activity | 1 | Open |
| EVENT_PROCESS_START (9) | 1007 | Process Activity | 1 | Launch |
| EVENT_PROCESS_STOP (10) | 1007 | Process Activity | 2 | Terminate |
| EVENT_USER_MANAGEMENT (11) | 3001 | Account Change | 1 | Create |
| EVENT_RESOURCE_ACCESS (12) | 6003 | API Activity | 3 | Read |
| EVENT_TOOL_INVOCATION (20) | 6003 | API Activity | 1 | Create |
| EVENT_MODEL_INFERENCE (21) | 6003 | API Activity | 1 | Create |
| EVENT_AGENT_DECISION (22) | 6003 | API Activity | 1 | Create |
| EVENT_DELEGATION (23) | 6003 | API Activity | 1 | Create |
| EVENT_CONTEXT_ACCESS (24) | 3005 | Data Access | 1 | Read |
| EVENT_PROMPT_EXECUTION (25) | 6003 | API Activity | 1 | Create |
| EVENT_GUARDRAIL_CHECK (26) | 5001 | Security Finding | 1 | Create |
| EVENT_MCP_INITIALIZE (30) | 6003 | API Activity | 1 | Create |
| EVENT_MCP_INITIALIZED (31) | 6003 | API Activity | 1 | Create |
| EVENT_MCP_PING (32) | 6003 | API Activity | 3 | Read |
| EVENT_MCP_SHUTDOWN (33) | 6003 | API Activity | 4 | Delete |
| EVENT_TOOL_LIST (34) | 6003 | API Activity | 3 | Read |
| EVENT_RESOURCE_LIST (35) | 6003 | API Activity | 3 | Read |
| EVENT_PROMPT_LIST (36) | 6003 | API Activity | 3 | Read |
| EVENT_RESOURCE_READ (37) | 3005 | Data Access | 1 | Read |
| EVENT_SAMPLING_REQUEST (38) | 6003 | API Activity | 1 | Create |
| EVENT_SAMPLING_RESPONSE (39) | 6003 | API Activity | 1 | Create |
| EVENT_TRANSPORT_CONNECT (40) | 4001 | Network Activity | 1 | Open |
| EVENT_TRANSPORT_DISCONNECT (41) | 4001 | Network Activity | 2 | Close |
| EVENT_TRANSPORT_ERROR (42) | 4001 | Network Activity | 5 | Fail |

---

## EventType → OTel GenAI Mapping

Reference: [opentelemetry.io/docs/specs/semconv/gen-ai](https://opentelemetry.io/docs/specs/semconv/gen-ai/)

| EventType | otel_operation_name |
|-----------|---------------------|
| EVENT_TOOL_INVOCATION (20) | `execute_tool` |
| EVENT_MODEL_INFERENCE (21) | `chat` |
| EVENT_AGENT_DECISION (22) | `invoke_agent` |
| EVENT_DELEGATION (23) | `invoke_agent` |
| EVENT_CONTEXT_ACCESS (24) | `embeddings` |
| EVENT_PROMPT_EXECUTION (25) | `chat` |
| EVENT_MCP_INITIALIZE (30) | `create_agent` |
| EVENT_MCP_INITIALIZED (31) | `create_agent` |
| EVENT_SAMPLING_REQUEST (38) | `chat` |
| EVENT_SAMPLING_RESPONSE (39) | `chat` |
| All others | `null` |

---

## Notes

### OCSF AI/Agent Events
OCSF doesn't have native AI event classes yet. We map to API Activity (6003) which is the closest fit. Lokryn is ahead of the standard here.

### MCP Events
These are Lokryn-specific. No direct mapping exists in any standard. We map to the closest equivalent (API Activity, Network Activity).

### Proprietary Format Export
For SIEM and observability platforms with proprietary formats, export uses the OTel GenAI path where supported, or direct field mapping where documented.
