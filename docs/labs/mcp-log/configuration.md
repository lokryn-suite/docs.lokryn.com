---
id: configuration
title: Configuration
sidebar_position: 2
---

# Configuration

Configure the logging wrapper to match your environment and compliance requirements.

---

## with_logging Options

```python
from lokryn_mcp_log import with_logging
from lokryn_mcp_log.schema import log_pb2

logged = with_logging(
    session,
    sink=my_sink,
    environment="production",           # Required
    actor_id="agent-001",                # Optional, auto-generated if omitted
    component="my-agent",                # Defaults to "mcp-client"
    policy_tags=["SOC2", "HIPAA"],       # Optional compliance tags
    default_sensitivity=log_pb2.SENSITIVITY_CONFIDENTIAL,
)
```

---

## Parameters

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `session` | Yes | — | The MCP `ClientSession` to wrap |
| `sink` | Yes | — | Where to send logs (see [Sinks](./sinks)) |
| `environment` | Yes | — | Environment name (`production`, `staging`, `development`) |
| `actor_id` | No | Auto-generated | Identifier for the agent/session |
| `component` | No | `"mcp-client"` | Component name for log attribution |
| `policy_tags` | No | `[]` | Compliance framework tags (`SOC2`, `HIPAA`, `PCI`, etc.) |
| `default_sensitivity` | No | `SENSITIVITY_INTERNAL` | Default data sensitivity level |

---

## Sensitivity Levels

From the [Compliance Log Schema](/docs/compliance-log-schema):

| Level | Description |
|-------|-------------|
| `SENSITIVITY_PUBLIC` | No restrictions |
| `SENSITIVITY_INTERNAL` | Internal use only |
| `SENSITIVITY_CONFIDENTIAL` | Need-to-know basis |
| `SENSITIVITY_RESTRICTED` | Regulatory/contractual restrictions |
| `SENSITIVITY_HIGHLY_RESTRICTED` | Maximum protection (PII, PHI, PCI) |

---

## Policy Tags

Use policy tags to filter logs by compliance framework during audits:

```python
logged = with_logging(
    session,
    sink=my_sink,
    environment="production",
    policy_tags=["SOC2", "HIPAA", "data-access"],
)
```

Common tags:
- `SOC2` — SOC 2 Type II compliance
- `HIPAA` — Healthcare data (PHI)
- `PCI` — Payment card data
- `GDPR` — EU data protection
- `data-access` — Data read operations
- `data-export` — Data leaving the system
- `audit-trail` — General audit logging
