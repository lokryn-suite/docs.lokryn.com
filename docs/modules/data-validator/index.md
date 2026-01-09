---
id: data-validator-index
title: data-validator
slug: /modules/data-validator
sidebar_position: 3
---

# data-validator

Schema validation + table scans. Quarantine bad data before it corrupts your warehouse.

---

## Coming Soon

This module is under active development.

---

## What It Does

1. Define schemas in declarative TOML contracts
2. Validate files (CSV, JSON, Parquet, Excel)
3. Route valid files forward, quarantine failures
4. Log every validation for audit trails

---

## Use Cases

- **ETL Pipeline Guards** — Catch schema changes before they corrupt downstream tables
- **Vendor File Intake** — Ensure vendor files match expected formats
- **Compliance Validation** — Verify data files meet regulatory requirements

---

## Contract Example

```toml
[contract]
name = "vendor-sales-report"
description = "Daily sales CSV from Acme Corp"

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

## Notify Me

Want to know when data-validator launches? Email support@lokryn.com with "data-validator waitlist" in the subject.
