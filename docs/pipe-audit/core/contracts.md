---
id: core-contracts
title: Contracts
sidebar_position: 4
slug: /core/contracts
---

# Contracts

Contracts define the rules and expectations for validating data.  
They are written in TOML and stored in the `contracts/` directory.  
Each contract specifies metadata, file‑level checks, column‑level checks, compound keys, and source/destination locations.

---

## Example Contract

[contract]  
name = "people"  
version = "0.1.0"  
tags = ["pii", "critical"]  

[file]  
validation = [  
  \{ rule = "row_count", min = 1_500_000, max = 2_000_000 \}  
]  

[[columns]]  
name = "person_id"  
validation = [  
  \{ rule = "not_null" \},  
  \{ rule = "unique" \},  
  \{ rule = "pattern", pattern = "^[0-9a-fA-F-]{36}$" \}  
]  

[[columns]]  
name = "age"  
validation = [  
  \{ rule = "range", min = 0, max = 120 \},  
 \{ rule = "outlier_sigma", sigma = 3.0 \}  
]  

[[compound_unique]]  
columns = ["household_id", "person_id"]  

[source]  
type = "s3"  
location = "s3://raw/ondoriya/seed_data/people.csv"  
profile = "minio_raw"  

[destination]  
type = "local"  
location = "data/"  

[quarantine]  
type = "gcs"  
location = "https://storage.cloud.google.com/ondoriya/people.csv"  
profile = "gcs_test"  

---

## Section Breakdown

### [contract]
- **name**: unique identifier for the contract  
- **version**: semantic version of the contract definition  
- **tags**: labels for classification (e.g. `pii`, `critical`)  

### [file]
- **validation**: file‑level rules (e.g. row counts, file size)  

### [[columns]]
- **name**: column name to validate  
- **validation**: list of rules applied to this column  
  - `not_null` → column must not contain nulls  
  - `unique` → values must be unique  
  - `pattern` → regex pattern enforcement  
  - `range` → numeric range enforcement  
  - `outlier_sigma` → statistical outlier detection  

### [[compound_unique]]
- **columns**: enforce uniqueness across multiple columns  

### [source]
- **type**: provider type (s3, gcs, azure, local, etc.)  
- **location**: path or URI to the source file  
- **profile**: reference to a profile in `profiles.toml`  

### [destination]
- **type**: where validated files are written  
- **location**: local path or remote URI  

### [quarantine]
- **type**: where invalid files are moved  
- **location**: quarantine path or URI  
- **profile**: reference to a profile in `profiles.toml`  

---

✅ Contracts combine **metadata**, **rules**, and **movement logic**.  
They are the central artifact for defining what “valid data” means in Pipe Audit.
