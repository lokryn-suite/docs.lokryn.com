---
id: standard-mappings
title: Standard Mappings
sidebar_position: 3
---

# Standard Mappings

Lokryn is the canonical format. All mappings are **export-only** (Lokryn → Target). The schema stores pre-translated values at write time, so export is field rename only—no runtime transformation.

---

## Target Standards

| Standard | Version | Owner | Primary Users |
|----------|---------|-------|---------------|
| OCSF | 1.3.0 | Linux Foundation | AWS Security Lake, Google Chronicle |
| OTel GenAI | 1.37.0 | CNCF | Datadog, observability platforms |
| Elastic ECS | 8.17 | Elastic | Elasticsearch, Kibana |
| Splunk CIM | 6.1 | Splunk | Splunk Enterprise, Splunk Cloud |
| Datadog | current | Datadog | Datadog Logs |
| Microsoft ASIM | current | Microsoft | Microsoft Sentinel |

---

## Field Mapping Overview

### Direct Passthrough Fields

| Lokryn Field | OCSF | ECS | Splunk CIM | Datadog |
|--------------|------|-----|------------|---------|
| `severity` (1-8) | `severity_id` | `event.severity` | `severity` | `status` |
| `time` | `time` | `@timestamp` | `_time` | `timestamp` |
| `trace_id` | `correlation_uid` | `trace.id` | `trace_id` | `dd.trace_id` |
| `span_id` | N/A | `span.id` | N/A | `dd.span_id` |
| `message` | `message` | `message` | `signature` | `message` |
| `actor_id` | `actor.user.uid` | `user.id` | `user` | `usr.id` |
| `component` | `metadata.product.feature.name` | `service.name` | `app` | `service` |
| `environment` | `metadata.product.deployment` | `service.environment` | `environment` | `env` |

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

## EventType → Elastic ECS Mapping

Reference: [elastic.co/guide/en/ecs/current](https://www.elastic.co/guide/en/ecs/current/ecs-allowed-values-event-category.html)

| EventType | event.category | event.type |
|-----------|----------------|------------|
| EVENT_LOGIN | `authentication` | `start` |
| EVENT_LOGOUT | `authentication` | `end` |
| EVENT_FILE_ACCESS | `file` | `access` |
| EVENT_POLICY_CHANGE | `configuration` | `change` |
| EVENT_PRIVILEGE_USE | `iam` | `admin` |
| EVENT_CONFIG_CHANGE | `configuration` | `change` |
| EVENT_DATA_EXPORT | `file` | `access` |
| EVENT_NETWORK_CONNECTION | `network` | `connection` |
| EVENT_PROCESS_START | `process` | `start` |
| EVENT_PROCESS_STOP | `process` | `end` |
| EVENT_USER_MANAGEMENT | `iam` | `user` |
| EVENT_RESOURCE_ACCESS | `api` | `access` |
| EVENT_TOOL_INVOCATION | `api` | `access` |
| EVENT_MODEL_INFERENCE | `api` | `access` |
| EVENT_AGENT_DECISION | `api` | `info` |
| EVENT_GUARDRAIL_CHECK | `intrusion_detection` | `info` |
| EVENT_MCP_* | `api` | `access` / `start` / `end` |
| EVENT_TRANSPORT_* | `network` | `connection` / `start` / `end` |

---

## EventType → Splunk CIM Mapping

Reference: [docs.splunk.com/Documentation/CIM](https://docs.splunk.com/Documentation/CIM)

| EventType | Data Model | Tags |
|-----------|------------|------|
| EVENT_LOGIN | Authentication | `authentication` |
| EVENT_LOGOUT | Authentication | `authentication` |
| EVENT_FILE_ACCESS | Data Access | `data`, `access` |
| EVENT_POLICY_CHANGE | Change | `change`, `audit` |
| EVENT_CONFIG_CHANGE | Change | `change`, `audit` |
| EVENT_NETWORK_CONNECTION | Network Traffic | `network`, `communicate` |
| EVENT_PROCESS_START | Endpoint | `process`, `report` |
| EVENT_PROCESS_STOP | Endpoint | `process`, `report` |
| EVENT_USER_MANAGEMENT | Change | `change`, `account` |
| EVENT_TOOL_INVOCATION | Web | `web` |
| EVENT_MODEL_INFERENCE | Web | `web` |
| EVENT_MCP_* | Web | `web` |

---

## Notes

### OCSF AI/Agent Events
OCSF doesn't have native AI event classes yet. We map to API Activity (6003) which is the closest fit. Lokryn is ahead of the standard here.

### MCP Events
These are Lokryn-specific. No direct mapping exists in any standard. We map to closest equivalent (API Activity, Network Activity).

### Datadog LLM Observability
Supports OTel GenAI SemConv natively as of 2024. Export via OTel path.
