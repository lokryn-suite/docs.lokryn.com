---
id: run
title: Run
sidebar_position: 3
---

# Run Module

The **Run** module exposes the core validation runner directly.  
This is useful for programmatic invocation without going through the CLI.

## Exposed Function
- run_contract_validation(contract: &ContractInfo, executor: &Executor) -> ValidationOutcome
