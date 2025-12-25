---
id: merkle-tree-index
title: Merkle Tree Overview
slug: /merkle-tree
sidebar_position: 0
---

# Merkle Tree

Merkle tree and hash chain utilities for immutable audit logs.

---

## Features

- **Hash Chaining** — Link records together with SHA-256 hashes to create tamper-evident chains
- **Merkle Trees** — Compute Merkle roots for efficient batch verification
- **Batch Processing** — Process multiple records as a batch with automatic sequencing
- **Chain Verification** — Detect tampering by verifying hash chain integrity
- **Protocol-Based** — Flexible design using Python protocols for easy integration

---

## Installation

```bash
pip install lokryn-merkle-tree
```

Or with uv:

```bash
uv add lokryn-merkle-tree
```

---

## Quick Start

### 1. Define Your Record Type

Any class can be hashed as long as it implements the `HashableRecord` protocol. You control exactly what data is included in the hash by implementing `get_hash_content()`:

```python
from dataclasses import dataclass
from merkle_tree import HashableRecord, Hasher


@dataclass
class AuditEntry:
    """An audit log entry."""

    timestamp: str
    user_id: str
    action: str
    details: str

    # Required protocol fields
    record_hash: str = ""
    prev_hash: str = ""
    batch_id: str = ""
    batch_sequence: int = 0
    batch_merkle_root: str = ""

    def get_hash_content(self) -> bytes:
        """Define what data is included in the hash."""
        return f"{self.timestamp}|{self.user_id}|{self.action}|{self.details}".encode()
```

### 2. Hash Individual Records

```python
hasher = Hasher()

entry1 = AuditEntry(
    timestamp="2024-01-15T10:30:00Z",
    user_id="user_123",
    action="LOGIN",
    details="Successful login from 192.168.1.1"
)

entry2 = AuditEntry(
    timestamp="2024-01-15T10:31:00Z",
    user_id="user_123",
    action="VIEW",
    details="Viewed document doc_456"
)

hasher.hash_record(entry1)
hasher.hash_record(entry2)

# Records are now chained
print(entry1.record_hash)  # SHA-256 hash of entry1
print(entry2.prev_hash)    # Points to entry1's hash
```

### 3. Process Batches with Merkle Roots

```python
hasher = Hasher()

entries = [
    AuditEntry(timestamp="2024-01-15T10:30:00Z", user_id="user_1", action="CREATE", details="..."),
    AuditEntry(timestamp="2024-01-15T10:30:01Z", user_id="user_2", action="UPDATE", details="..."),
    AuditEntry(timestamp="2024-01-15T10:30:02Z", user_id="user_1", action="DELETE", details="..."),
]

merkle_root = hasher.hash_batch(entries)

# All entries share the same batch_id
# The last entry contains the merkle_root
print(entries[-1].batch_merkle_root)
```

### 4. Verify Integrity

```python
# Verify hash chain continuity
is_valid, breaks = Hasher.verify_chain(entries)
if not is_valid:
    print(f"Chain broken at indices: {[b['record_index'] for b in breaks]}")

# Verify batch Merkle root
is_valid, stored_root, computed_root = Hasher.verify_batch(entries)
if not is_valid:
    print(f"Merkle root mismatch: stored={stored_root}, computed={computed_root}")
```

---

## Use Cases

- **Audit Logs** — Create tamper-evident logs for compliance and security
- **Data Integrity** — Verify that historical data hasn't been modified
- **Blockchain-like Structures** — Build lightweight chain structures without full blockchain overhead
- **Document Versioning** — Track document changes with cryptographic proof
- **Event Sourcing** — Ensure event stream integrity

---

## License

AGPL-3.0 — Free to use, modify, and distribute. If you run a modified version as a network service, you must open source your changes.

---

## Resources

- [GitHub Repository](https://github.com/lokryn-llc/merkle-tree)
- [PyPI Package](https://pypi.org/project/lokryn-merkle-tree/)
