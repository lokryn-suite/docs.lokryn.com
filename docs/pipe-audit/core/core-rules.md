---
id: core-rules
title: Contract Rules
sidebar_position: 5
slug: /pipe-audit/core/rules
---

# Contract Rules

Contracts use `validation` entries to apply rules at the **file**, **column**, or **compound** level.  
This page lists all available rules with TOML examples.

---

## File-Level Rules

**completeness** Check overall completeness of the file (e.g., proportion of non-null cells).  
```toml
[file]
validation = [
  { rule = "completeness", min = 0.95 }
]
```

**row\_count** Require the file to have a row count within a range.

```toml
[file]
validation = [
  { rule = "row_count", min = 1000, max = 5000 }
]
```

-----

## Column-Level Rules

**boolean** Ensure values are boolean-like (`true`/`false`).

```toml
[[columns]]
name = "is_active"
validation = [
  { rule = "boolean" }
]
```

**completeness** Check completeness ratio for a column.

```toml
[[columns]]
name = "email"
validation = [
  { rule = "completeness", min = 0.99 }
]
```

**date\_format** Require values to match a date format.

```toml
[[columns]]
name = "signup_date"
validation = [
  { rule = "date_format", format = "%Y-%m-%d" }
]
```

**distinctness** Check distinctness ratio of a column.

```toml
[[columns]]
name = "country"
validation = [
  { rule = "distinctness", min = 0.1, max = 0.5 }
]
```

**in\_set** Restrict values to a whitelist.

```toml
[[columns]]
name = "status"
validation = [
  { rule = "in_set", values = ["active", "inactive", "pending"] }
]
```

**not\_in\_set** Fail if values appear in a blacklist.

```toml
[[columns]]
name = "status"
validation = [
  { rule = "not_in_set", values = ["error", "unknown"] }
]
```

**max\_length** Enforce maximum string length.

```toml
[[columns]]
name = "username"
validation = [
  { rule = "max_length", length = 32 }
]
```

**mean\_between** Require column mean within a range.

```toml
[[columns]]
name = "age"
validation = [
  { rule = "mean_between", min = 18, max = 65 }
]
```

**stdev\_between** Require column standard deviation within a range.

```toml
[[columns]]
name = "salary"
validation = [
  { rule = "stdev_between", min = 1000, max = 5000 }
]
```

**not\_null** Disallow null or empty values.

```toml
[[columns]]
name = "person_id"
validation = [
  { rule = "not_null" }
]
```

**outlier\_sigma** Flag values outside N standard deviations.

```toml
[[columns]]
name = "height"
validation = [
  { rule = "outlier_sigma", sigma = 3.0 }
]
```

**pattern** Require values to match a regex.

```toml
[[columns]]
name = "uuid"
validation = [
  { rule = "pattern", pattern = "^[0-9a-fA-F-]{36}$" }
]
```

**range** Require numeric values within [min, max].

```toml
[[columns]]
name = "score"
validation = [
  { rule = "range", min = 0, max = 100 }
]
```

**type\_validator** Enforce a declared type (e.g., integer, float, string).

```toml
[[columns]]
name = "age"
validation = [
  { rule = "type_validator", type = "integer" }
]
```

**unique** Require values in the column to be unique.

```toml
[[columns]]
name = "email"
validation = [
  { rule = "unique" }
]
```

-----

## Compound Rules

**unique** Enforce uniqueness across multiple columns.

```toml
[[compound_unique]]
columns = ["household_id", "person_id"]
```

-----

✅ Place rules under `[file]`, `[[columns]]`, or `[[compound_unique]]` depending on scope.  
Rules can be combined within the same section.

