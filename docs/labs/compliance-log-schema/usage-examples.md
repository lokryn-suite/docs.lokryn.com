---
id: usage-examples
title: Usage Examples
sidebar_position: 2
---

# Usage Examples

Practical examples for common logging scenarios.

---

## Python Setup

After generating the Python code from the schema:

```python
from lokryn.compliance.v1 import log_pb2
```

---

## Logging an MCP Tool Call

When an AI agent invokes a tool via MCP:

```python
log = log_pb2.LogRequest(
    event_type=log_pb2.EVENT_TOOL_INVOCATION,
    outcome=log_pb2.OUTCOME_SUCCESS,
    severity=log_pb2.SEVERITY_INFO,
    actor_id="agent-001",
    component="mcp-client",
    environment="production",
    resource="tools/database_query",
    message="Executed database query tool",
    payload=b'{"query": "SELECT * FROM users", "rows_returned": 42}',
    policy_tags=["SOC2", "data-access"],
    sensitivity=log_pb2.SENSITIVITY_CONFIDENTIAL,
)

# Serialize for storage/transport
data = log.SerializeToString()
```

---

## Logging a Guardrail Check

When a safety filter blocks agent output:

```python
log = log_pb2.LogRequest(
    event_type=log_pb2.EVENT_GUARDRAIL_CHECK,
    outcome=log_pb2.OUTCOME_FAILURE_DENIED,
    severity=log_pb2.SEVERITY_WARNING,
    actor_id="agent-001",
    component="safety-filter",
    environment="production",
    resource="guardrails/pii-detection",
    message="PII detected in agent output, blocked",
    payload=b'{"rule": "ssn-pattern", "action": "block"}',
    policy_tags=["PII", "HIPAA"],
    sensitivity=log_pb2.SENSITIVITY_HIGHLY_RESTRICTED,
)
```

---

## Logging an Agent Decision

When an autonomous agent makes a branching decision:

```python
log = log_pb2.LogRequest(
    event_type=log_pb2.EVENT_AGENT_DECISION,
    outcome=log_pb2.OUTCOME_SUCCESS,
    severity=log_pb2.SEVERITY_INFO,
    actor_id="agent-001",
    component="decision-engine",
    environment="production",
    resource="workflows/customer-support",
    message="Agent chose to escalate to human",
    payload=b'{"options": ["respond", "escalate", "defer"], "selected": "escalate", "confidence": 0.92}',
    policy_tags=["audit-trail"],
    sensitivity=log_pb2.SENSITIVITY_INTERNAL,
)
```

---

## Logging Model Inference

When calling an LLM API:

```python
log = log_pb2.LogRequest(
    event_type=log_pb2.EVENT_MODEL_INFERENCE,
    outcome=log_pb2.OUTCOME_SUCCESS,
    severity=log_pb2.SEVERITY_INFO,
    actor_id="service-backend",
    component="llm-client",
    environment="production",
    resource="models/gpt-4",
    message="Completed chat completion request",
    payload=b'{"tokens_in": 1250, "tokens_out": 342, "latency_ms": 1823}',
    policy_tags=["SOC2"],
    sensitivity=log_pb2.SENSITIVITY_CONFIDENTIAL,
)
```

---

## Logging User Authentication

Traditional login event:

```python
log = log_pb2.LogRequest(
    event_type=log_pb2.EVENT_LOGIN,
    outcome=log_pb2.OUTCOME_SUCCESS,
    severity=log_pb2.SEVERITY_INFO,
    actor_id="user-12345",
    component="auth-service",
    environment="production",
    resource="auth/login",
    message="User authenticated via SSO",
    payload=b'{"method": "saml", "provider": "okta", "mfa": true}',
    policy_tags=["SOC2", "access-control"],
    sensitivity=log_pb2.SENSITIVITY_INTERNAL,
)
```

---

## Logging Failed Authorization

When access is denied:

```python
log = log_pb2.LogRequest(
    event_type=log_pb2.EVENT_RESOURCE_ACCESS,
    outcome=log_pb2.OUTCOME_FAILURE_DENIED,
    severity=log_pb2.SEVERITY_WARNING,
    actor_id="user-67890",
    component="api-gateway",
    environment="production",
    resource="api/v1/admin/users",
    message="Access denied to admin endpoint",
    payload=b'{"required_role": "admin", "user_role": "viewer"}',
    policy_tags=["SOC2", "access-control"],
    sensitivity=log_pb2.SENSITIVITY_INTERNAL,
)
```

---

## Logging Data Export

When data leaves the system:

```python
log = log_pb2.LogRequest(
    event_type=log_pb2.EVENT_DATA_EXPORT,
    outcome=log_pb2.OUTCOME_SUCCESS,
    severity=log_pb2.SEVERITY_NOTICE,
    actor_id="user-12345",
    component="export-service",
    environment="production",
    resource="exports/customer-report",
    message="Exported customer data to CSV",
    payload=b'{"records": 1500, "format": "csv", "destination": "download"}',
    policy_tags=["SOC2", "data-export", "PII"],
    sensitivity=log_pb2.SENSITIVITY_RESTRICTED,
)
```
