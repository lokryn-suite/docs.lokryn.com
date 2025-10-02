---
id: rules
title: Contract Rules
sidebar_position: 5
---

# Contract Rules

Contracts use `validation` entries to apply rules at the **file**, **column**, or **compound** level.  
This page lists all available rules with TOML examples.

---

## File-Level Rules

**completeness**  
Check overall completeness of the file (e.g., proportion of non-null cells).  
[file]  
validation = [  
  \{ rule = "completeness", min = 0.95 \}  
]

**row_count**  
Require the file to have a row count within a range.  
[file]  
validation = [  
  \{ rule = "row_count", min = 1000, max = 5000 \}  
]

---

## Column-Level Rules

**boolean**  
Ensure values are boolean-like (`true`/`false`).  
[[columns]]  
name = "is_active"  
validation = [  
  \{ rule = "boolean" \}  
]

**completeness**  
Check completeness ratio for a column.  
[[columns]]  
name = "email"  
validation = [  
  \{ rule = "completeness", min = 0.99 \}  
]

**date_format**  
Require values to match a date format.  
[[columns]]  
name = "signup_date"  
validation = [  
  \{ rule = "date_format", format = "%Y-%m-%d" \}  
]

**distinctness**  
Check distinctness ratio of a column.  
[[columns]]  
name = "country"  
validation = [  
  \{ rule = "distinctness", min = 0.1, max = 0.5 \}  
]

**in_set**  
Restrict values to a whitelist.  
[[columns]]  
name = "status"  
validation = [  
  \{ rule = "in_set", values = ["active", "inactive", "pending"] \}  
]

**not_in_set**  
Fail if values appear in a blacklist.  
[[columns]]  
name = "status"  
validation = [  
  \{ rule = "not_in_set", values = ["error", "unknown"] \}  
]

**max_length**  
Enforce maximum string length.  
[[columns]]  
name = "username"  
validation = [  
  \{ rule = "max_length", length = 32 \}  
]

**mean_between**  
Require column mean within a range.  
[[columns]]  
name = "age"  
validation = [  
  \{ rule = "mean_between", min = 18, max = 65 \}  
]

**stdev_between**  
Require column standard deviation within a range.  
[[columns]]  
name = "salary"  
validation = [  
  \{ rule = "stdev_between", min = 1000, max = 5000 \}  
]

**not_null**  
Disallow null or empty values.  
[[columns]]  
name = "person_id"  
validation = [  
  \{ rule = "not_null" \}  
]

**outlier_sigma**  
Flag values outside N standard deviations.  
[[columns]]  
name = "height"  
validation = [  
  \{ rule = "outlier_sigma", sigma = 3.0 \}  
]

**pattern**  
Require values to match a regex.  
[[columns]]  
name = "uuid"  
validation = [  
  \{ rule = "pattern", pattern = "^[0-9a-fA-F-]{36}$" \}  
]

**range**  
Require numeric values within [min, max].  
[[columns]]  
name = "score"  
validation = [  
  \{ rule = "range", min = 0, max = 100 \}  
]

**type_validator**  
Enforce a declared type (e.g., integer, float, string).  
[[columns]]  
name = "age"  
validation = [  
  \{ rule = "type_validator", type = "integer" \}  
]

**unique**  
Require values in the column to be unique.  
[[columns]]  
name = "email"  
validation = [  
  \{ rule = "unique" \}  
]

---

## Compound Rules

**unique**  
Enforce uniqueness across multiple columns.  
[[compound_unique]]  
columns = ["household_id", "person_id"]

---

✅ Place rules under `[file]`, `[[columns]]`, or `[[compound_unique]]` depending on scope.  
Rules can be combined within the same section.  

---