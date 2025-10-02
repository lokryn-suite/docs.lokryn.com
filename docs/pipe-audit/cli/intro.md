---
id: intro
title: Introduction
sidebar_position: 1
---

# Introduction to Pipe Audit CLI

The **`pipa`** crate is the command‑line interface for the Pipe Audit engine.  
It provides a user‑friendly way to scaffold projects, run validations, and inspect results without writing Rust code.

## Highlights

- **Quick project setup** with `pipa init`
- **Run contract validations** directly from the terminal
- **Profile management** for parameterized runs
- **Audit log verification** with tamper‑evident sealing
- **System health checks** to validate environment and connectors

## Key Entry Points

- **CLI definitions**: [`pipa/src/cli.rs`](pipa/src/cli.rs)  
- **Commands**:  
  - `pipa contract` → list, validate, run contracts  
  - `pipa profile` → list and test profiles  
  - `pipa run` → execute validations end‑to‑end  
  - `pipa logs` → verify audit logs  
  - `pipa health` → run system checks  
  - `pipa init` → scaffold a new project  

## When to Use the CLI

Use the CLI when you want to:

- Run validations as part of a **developer workflow** or **CI/CD pipeline**
- Quickly scaffold a new project with contracts and profiles
- Verify logs and system health without writing code
- Share a reproducible, command‑driven workflow with your team

For programmatic integration or custom extensions, see the [Core Library Introduction](../core/intro).
