---
id: mcp-log-index
title: MCP Log
slug: /open-source/mcp-log
sidebar_position: 0
---

# MCP Log

Compliance-grade audit logging for MCP (Model Context Protocol) client operations.

---

## What It Does

Wraps the official MCP Python SDK's `ClientSession` and logs every operation—tool calls, resource access, prompt executions—in a format that satisfies SOC2, HIPAA, and PCI audit requirements.

Logs conform to [lokryn-compliance-log-schema](/docs/open-source/compliance-log-schema), the open standard for compliance audit logging.

---

## Design

**Proxy pattern, not subclassing.** The wrapper delegates to the real `ClientSession` and intercepts calls for logging. This means:

- No inheritance complexity
- Works with any `ClientSession` version
- Explicit configuration (no magic autodiscovery)
- Easy to test in isolation

---

## Installation

```bash
pip install lokryn-mcp-log
```

Or with uv:

```bash
uv add lokryn-mcp-log
```

---

## Quick Start

```python
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client
from lokryn_mcp_log import with_logging, StdoutSink

server_params = StdioServerParameters(command="python", args=["server.py"])

async def main():
    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()

            # Wrap with logging
            logged = with_logging(
                session,
                sink=StdoutSink(),
                environment="development",
            )

            # Use exactly like normal
            await logged.call_tool("add", {"a": 1, "b": 2})
```

---

## Sinks

Sinks are async-first interfaces for where logs go:

| Sink | Description |
|------|-------------|
| `StdoutSink` | Print to stdout (development) |
| `FileSink` | Append to local file |
| `HttpSink` | POST to any HTTP endpoint |
| `FieldNotesSink` | Send directly to [Field Notes](/docs/field-notes) |

### Field Notes Integration

```python
from lokryn_mcp_log import with_logging, FieldNotesSink

sink = FieldNotesSink(
    endpoint="https://api.lokryn.com/fieldnotes/v1/events",
    client_id=os.environ["LOKRYN_CLIENT_ID"],
    client_secret=os.environ["LOKRYN_CLIENT_SECRET"],
)

logged = with_logging(session, sink=sink)
```

---

## What Gets Logged

| Operation | Event Type | Resource |
|-----------|------------|----------|
| `initialize()` | `EVENT_LOGIN` | `session/initialize` |
| `list_tools()` | `EVENT_TOOL_INVOCATION` | `tools/list` |
| `call_tool(name, args)` | `EVENT_TOOL_INVOCATION` | `tools/{name}` |
| `list_resources()` | `EVENT_RESOURCE_ACCESS` | `resources/list` |
| `read_resource(uri)` | `EVENT_CONTEXT_ACCESS` | `{uri}` |
| `list_prompts()` | `EVENT_PROMPT_EXECUTION` | `prompts/list` |
| `get_prompt(name)` | `EVENT_PROMPT_EXECUTION` | `prompts/{name}` |
| (session close) | `EVENT_LOGOUT` | `session/close` |

Each log includes:
- Timestamp
- Actor ID (session/agent identifier)
- Duration (milliseconds)
- Correlation ID (for tracing)
- Input arguments (with configurable redaction)
- Outcome (success/failure with granular codes)
- Error details (on failure)

---

## Configuration

```python
logged = with_logging(
    session,
    sink=StdoutSink(),
    environment="production",
    actor_id="agent-12345",            # Override default session ID
    redact_patterns=["password", "secret"],  # Redact matching keys
    include_outputs=False,             # Don't log tool outputs (PII safety)
)
```

---

## Error Handling

This is a library, not a service. If the sink fails, the exception propagates to your code. Handle it as appropriate for your use case:

```python
try:
    await logged.call_tool("risky_tool", args)
except SinkError as e:
    # Log sink failed, but tool call may have succeeded
    logger.warning(f"Audit log failed: {e}")
```

---

## License

**AGPL-3.0** — Free to use, modify, and distribute. If you run a modified version as a network service, you must open source your changes.

**Commercial License** — Need to use this without AGPL obligations? Contact [sales@lokryn.com](mailto:sales@lokryn.com).

---

## Resources

- [GitHub](https://github.com/lokryn-llc/mcp-log)
- [PyPI](https://pypi.org/project/lokryn-mcp-log/)
- [Example Project](https://github.com/lokryn-llc/mcp-log-example)
- [Compliance Log Schema](/docs/open-source/compliance-log-schema)
- [Field Notes](/docs/field-notes)
- [MCP Python SDK](https://github.com/modelcontextprotocol/python-sdk)
