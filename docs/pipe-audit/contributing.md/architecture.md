---
id: architecture
title: Architecture Overview
sidebar_position: 1
---

# Architecture Overview

This page explains how the major components of Pipe Audit fit together.  
Understanding this flow helps contributors see where validators, connectors, profiles, and contracts interact.

---

## High-Level Flow

1. **Profiles (`profiles.toml`)**  
   - Define connection details for data sources and sinks.  
   - Reference connectors by `provider` type (s3, gcs, azure, local).  

2. **Connectors (`pipa-core/src/connectors/`)**  
   - Each connector implements the `Connector` trait.  
   - Required method: `fetch(&self, location: &str) -> Result<DataSet, Error>`.  
   - Responsible for retrieving raw data from the configured profile.  

3. **Contracts (`contracts/*.toml`)**  
   - Define validation expectations.  
   - Reference profiles by name.  
   - Contain file-level, column-level, and compound rules.  

4. **Validators (`pipa-core/src/validators/`)**  
   - Each validator implements the `Validator` trait.  
   - Responsible for enforcing a single rule (e.g., `not_null`, `range`, `pattern`).  
   - Invoked by the contract runner against the dataset.  

5. **Execution (`pipa run` / `pipa-core::run`)**  
   - Loads contracts.  
   - Resolves profiles → connectors → fetch data.  
   - Applies validators to the dataset.  
   - Produces results and audit logs.  

6. **Logs (`logs/`)**  
   - Tamper-evident, append-only record of validation runs.  
   - Verifiable with `pipa logs verify`.  

7. **Quarantine**  
   - Invalid files are moved to a quarantine destination.  
   - Configured in the contract with `[quarantine]`.  

---

## Mental Model

- **Profiles** = *where data lives*  
- **Connectors** = *how to fetch it*  
- **Contracts** = *what “valid” means*  
- **Validators** = *the rules that enforce validity*  
- **Execution** = *the engine that ties it together*  
- **Logs** = *the record of what happened*  
- **Quarantine** = *where bad data goes*  

---

✅ With this overview, contributors can quickly orient themselves in the codebase and know where to add new validators, connectors, or docs.
