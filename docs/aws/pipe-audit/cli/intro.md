---
id: cli-intro
title: Introduction
sidebar_position: 1
slug: /pipe-audit/cli/intro
---

# Introduction to Pipe Audit CLI

The **`pipa`** crate is the command-line interface for the Pipe Audit engine.  
It provides a user-friendly way to scaffold projects, run validations, and inspect results without writing Rust code.

## Highlights

- **Quick project setup** with `pipa init`
- **Run contract validations** directly from the terminal
- **Profile management** for parameterized runs
- **Audit log verification** with tamper-evident sealing
- **System health checks** to validate environment and connectors

## Key Commands

- `pipa init` → scaffold a new project
- `pipa run` → execute validations end-to-end
- `pipa contract` → list, show, and validate contracts
- `pipa profile` → list and test profiles
- `pipa logs` → verify audit logs
- `pipa health` → run system checks

## When to Use the CLI

Use the CLI when you want to:

- Run validations as part of a **developer workflow** or **CI/CD pipeline**
- Quickly scaffold a new project with contracts and profiles
- Verify logs and system health without writing code
- Share a reproducible, command-driven workflow with your team

For programmatic integration or custom extensions, see the [Core Library Introduction](/docs/pipe-audit/core/intro).