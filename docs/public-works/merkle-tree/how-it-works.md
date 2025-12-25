---
id: how-it-works
title: How It Works
sidebar_position: 2
---

# How It Works

Understanding hash chaining and Merkle trees.

---

## Hash Chaining

Each record's `prev_hash` points to the previous record's `record_hash`, forming a chain:

```
Record 1          Record 2          Record 3
┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│ record_hash │◄──│ prev_hash   │   │             │
│     A       │   │     A       │◄──│ prev_hash   │
│             │   │ record_hash │   │     B       │
│ prev_hash   │   │     B       │   │ record_hash │
│     A*      │   │             │   │     C       │
└─────────────┘   └─────────────┘   └─────────────┘

* First record: prev_hash = record_hash
```

If any record in the chain is modified, its hash changes. This breaks the link to the next record, making tampering detectable.

---

## Merkle Tree

Batch processing computes a Merkle root for efficient verification:

```
                    Root
                   /    \
                  /      \
               H(AB)    H(CD)
               /  \      /  \
              A    B    C    D

A, B, C, D = record hashes
H(AB) = SHA-256(A + B)
Root = SHA-256(H(AB) + H(CD))
```

For odd numbers of hashes, the last hash is carried up unchanged.

### Why Merkle Trees?

- **Efficient verification** — Verify any single record with O(log n) hashes instead of O(n)
- **Compact proofs** — Store just the root to prove the entire batch is intact
- **Batch integrity** — Detect if any record in a batch was modified

---

## Flexible Record Types

The protocol-based design means you can hash any data structure:

```python
# A simple log entry
@dataclass
class LogEntry:
    message: str
    level: str
    # ... protocol fields ...

    def get_hash_content(self) -> bytes:
        return f"{self.level}:{self.message}".encode()


# A financial transaction
@dataclass
class Transaction:
    from_account: str
    to_account: str
    amount: Decimal
    currency: str
    # ... protocol fields ...

    def get_hash_content(self) -> bytes:
        return f"{self.from_account}>{self.to_account}:{self.amount}{self.currency}".encode()


# A file with binary content
@dataclass
class FileRecord:
    filename: str
    content: bytes
    # ... protocol fields ...

    def get_hash_content(self) -> bytes:
        return self.filename.encode() + self.content
```

The `get_hash_content()` method gives you full control over what data contributes to the hash. Include fields that should be immutable; exclude fields that may change (like status or metadata).
