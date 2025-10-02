---
id: intro
title: Introduction
sidebar_position: 1
---

# Introduction to Pipe Audit Core

The **`pipa-core`** crate is the reusable Rust library behind the Pipe Audit engine.  
While most users interact with Pipe Audit through the CLI, the same functionality is available programmatically through this library.

## Highlights

- Validate data contracts and run end‑to‑end checks
- Profile‑aware connectors and file movement
- Tamper‑evident audit logs with sealing and verification
- Stable, branded API surface that insulates consumers from internal refactors

## Key Entry Points
- **Contract runner**: [`engine::contracts::runner::run_contract_validation`](pipa-core/src/engine/contracts/runner.rs)  
- **Contract metadata helpers**:  
  - [`list_contracts`](pipa-core/src/engine/contracts/meta.rs)  
  - [`get_contract`](pipa-core/src/engine/contracts/meta.rs)  
  - [`validate_contract`](pipa-core/src/engine/contracts/meta.rs)

## Internal vs Public Modules

- **Internal modules** (engine, connectors, movement, validators, etc.) are private and may evolve without breaking consumers.  
- **Public modules** (`contract`, `profile`, `run`, `logs`, `health`, `init`) re‑export curated APIs for stable use.
