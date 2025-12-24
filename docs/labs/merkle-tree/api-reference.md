---
id: api-reference
title: API Reference
sidebar_position: 1
---

# API Reference

Complete reference for the Merkle Tree library.

---

## `HashableRecord` Protocol

A protocol defining the interface for hashable records.

### Attributes

| Attribute | Type | Description |
|-----------|------|-------------|
| `record_hash` | `str` | SHA-256 hash of this record's content |
| `prev_hash` | `str` | Hash of the previous record in the chain |
| `batch_id` | `str` | UUID identifying the batch this record belongs to |
| `batch_sequence` | `int` | Zero-indexed position within the batch |
| `batch_merkle_root` | `str` | Merkle root (set only on the last record of a batch) |

### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `get_hash_content()` | `bytes` | The bytes to be hashed for this record |

---

## `Hasher` Class

The main class for hashing records and computing Merkle roots.

### Constructor

```python
Hasher(last_hash: str = "")
```

Create a new hasher. Optionally provide the last hash from an existing chain to continue it.

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `last_hash` | `str` | The hash of the most recently processed record |

### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `set_last_hash(last_hash: str)` | `None` | Update the chain state |
| `hash_record(record: T)` | `str` | Hash a record and link it to the chain |
| `hash_batch(records: list[T])` | `str` | Hash a batch and compute Merkle root |
| `compute_merkle_root(hashes: list[str])` | `str` | Static: compute Merkle root from hashes |
| `verify_chain(records: list[T])` | `tuple[bool, list[dict]]` | Static: verify chain continuity |
| `verify_batch(records: list[T])` | `tuple[bool, str, str]` | Static: verify batch Merkle root |

---

## Continuing an Existing Chain

To append to an existing chain, initialize `Hasher` with the last known hash:

```python
# Get the last hash from your database
last_hash = db.get_last_record_hash()

# Continue the chain
hasher = Hasher(last_hash=last_hash)
hasher.hash_record(new_entry)  # Links to existing chain
```
