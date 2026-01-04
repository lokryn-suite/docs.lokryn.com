---
id: pipe-audit-index
title: Pipe Audit
slug: /pipe-audit
sidebar_position: 3
---

# Pipe Audit

File validation with declarative TOML contracts. Define schemas, validate files, quarantine failures.

---

## The Problem

Data pipelines fail silently. A vendor changes their CSV format, a column shifts, and your downstream systems ingest garbage. By the time you notice, the damage is done.

---

## How It Works

1. **Define a contract** — Specify schema, rules, validation logic in TOML
2. **Submit files** — Upload via API, CLI, or dashboard
3. **Validate** — Pipe Audit checks against the contract
4. **Route results** — Valid files proceed, failures quarantine

---

## Key Features

| Feature | Description |
|---------|-------------|
| **Declarative contracts** | TOML-based, version-controlled validation rules |
| **Multiple formats** | CSV, JSON, Parquet, Excel |
| **Quarantine** | Failed files isolated for inspection |
| **Audit trail** | Every validation logged |
| **CLI + API** | Validate locally or via service |

---

## Deployment Options

### [Container (AWS Marketplace)](/docs/pipe-audit/container)

Deploy into your own AWS environment. Your VPC, your data.

- **Storage:** S3 for files, DynamoDB for contracts/results
- **Auth:** None required (private VPC), optional HMAC
- **Pricing:** Hourly or annual via AWS Marketplace

### [SaaS (Control Room)](/docs/pipe-audit/saas)

Managed service. We handle infrastructure, you define contracts.

- **Storage:** Managed S3 + DynamoDB
- **Auth:** OAuth 2.0 client credentials via Cognito
- **Pricing:** Usage-based by validations/month

---

## Contract Example

```toml
[contract]
name = "vendor-sales-report"
description = "Daily sales CSV from Acme Corp"
source = "acme-sftp"

[schema]
format = "csv"
delimiter = ","
has_header = true

[[columns]]
name = "order_id"
type = "string"
required = true
pattern = "^ORD-[0-9]{8}$"

[[columns]]
name = "amount"
type = "decimal"
required = true
min = 0

[[columns]]
name = "order_date"
type = "date"
format = "%Y-%m-%d"
required = true

[rules]
row_count_min = 1
row_count_max = 100000
```

---

## Use Cases

### ETL Pipeline Guards
Validate files before loading into your data warehouse. Catch schema changes before they corrupt downstream tables.

### Vendor File Intake
Ensure vendor-submitted files match expected formats. Automatically quarantine malformed files for review.

### Compliance Validation
Verify data files meet regulatory requirements. Log every validation for audit trails.

### CI/CD Integration
Run `pipa validate` in your pipeline. Fail builds when test data doesn't match contracts.

---

## Components

### [CLI](/docs/pipe-audit/cli)
Command-line interface (`pipa`) for local validation and CI/CD integration.

```bash
pipa validate --contract vendor-sales.toml --file sales.csv
```

### [Core Library](/docs/pipe-audit/core)
Python library (`pipa-core`) with validation engine, contracts, profiles, and rules.

```python
from pipa_core import Contract, validate_file

contract = Contract.from_toml("vendor-sales.toml")
result = validate_file(contract, "sales.csv")
```

### [Contributing](/docs/pipe-audit/contributing)
Guides for extending with new validators, connectors, and rules.

---

## Related

- [Field Notes](/docs/field-notes) — Tamper-evident audit logging
- [Control Room](https://app.lokryn.com) — Dashboard
