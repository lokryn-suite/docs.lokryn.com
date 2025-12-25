---
id: sinks
title: Sinks
sidebar_position: 1
---

# Sinks

Sinks determine where your audit logs are sent. MCP Log includes several built-in sinks, and you can create custom ones.

---

## StdoutSink

Writes logs to standard output. Useful for development and debugging.

```python
from lokryn_mcp_log import StdoutSink

sink = StdoutSink()            # JSON to stdout
sink = StdoutSink(pretty=True) # Pretty-printed
```

---

## FileSink

Writes logs to a file in JSONL format (one JSON object per line).

```python
from lokryn_mcp_log import FileSink

sink = FileSink("/var/log/mcp-audit.jsonl")
```

---

## HTTPSink

Sends logs to an HTTP endpoint. Supports JSON and Protobuf formats, with optional HMAC signing.

```python
import os
from lokryn_mcp_log import HTTPSink

# JSON format (default)
sink = HTTPSink(
    endpoint="https://your-log-collector.com/ingest",
    headers={"Authorization": "Bearer <token>"},
)

# Protobuf format
sink = HTTPSink(
    endpoint="https://your-log-collector.com/ingest/proto",
    format="protobuf",
)

# With HMAC signing
sink = HTTPSink(
    endpoint="https://your-log-collector.com/ingest",
    hmac_key="your-secret-key",
)

# Using environment variables
sink = HTTPSink(
    endpoint=os.environ["LOG_ENDPOINT"],
    hmac_key=os.environ.get("LOG_HMAC_KEY"),
    format=os.environ.get("LOG_FORMAT", "json"),
)
```

---

## FieldNotesSink

Send logs directly to [Field Notes](/docs/field-notes) for tamper-evident storage and querying.

```python
from lokryn_mcp_log import FieldNotesSink

# Configure via environment variables:
# FIELDNOTES_HMAC_KEY=your-secret-key
# FIELDNOTES_FORMAT=json  (or "protobuf")

sink = FieldNotesSink()

# Or pass explicitly
sink = FieldNotesSink(hmac_key="your-secret-key", format="protobuf")
```

---

## Custom Sink

Implement the `Sink` protocol to create your own sink:

```python
from lokryn_mcp_log.schema import log_pb2

class MySink:
    async def emit(self, record: log_pb2.LogRequest) -> None:
        # Your logic here
        pass
```

---

## JSON Output Format

When using JSON format, the `payload` field is base64-encoded per the protobuf JSON mapping specification. This field contains structured data like tool arguments, correlation IDs, and durations.

To decode the payload:

```python
import base64
import json

log_record = {"payload": "eyJ0b29sX25hbWUiOiAiYWRkIiwgImFyZ3VtZW50cyI6IHsiYSI6IDEsICJiIjogMn19"}

payload = json.loads(base64.b64decode(log_record["payload"]))
# {"tool_name": "add", "arguments": {"a": 1, "b": 2}}
```

Or from the command line:

```bash
echo "eyJ0b29sX25hbWUiOiAiYWRkIn0=" | base64 -d
```

When using protobuf format, the payload is embedded as raw bytes and no decoding is needed.
