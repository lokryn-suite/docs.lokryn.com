---
id: mcp-log-index
title: MCP Log Overview
slug: /mcp-log
sidebar_position: 0
---

# MCP Log

Compliance-grade audit logging for MCP (Model Context Protocol) client operations.

---

## What It Does

Wraps the official MCP Python SDK's `ClientSession` and logs every operation—tool calls, resource access, prompt executions—in a format that satisfies SOC2, HIPAA, and PCI audit requirements.

Logs conform to the [lokryn-compliance-log-schema](/docs/compliance-log-schema), an open standard for audit logging.

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
- Input arguments
- Outcome (success/failure)
- Error details (on failure)

---

## Error Handling

This is a library, not a service. If the sink fails, the exception propagates to your code. Handle it as appropriate for your use case.

---

## License

AGPL-3.0. Commercial license available—contact license@lokryn.com.

---

## Resources

- [GitHub Repository](https://github.com/lokryn-llc/mcp-log)
- [PyPI Package](https://pypi.org/project/lokryn-mcp-log/)
- [Getting Started Example](https://github.com/lokryn-llc/mcp-log-example)
- [MCP Python SDK](https://github.com/modelcontextprotocol/python-sdk)
