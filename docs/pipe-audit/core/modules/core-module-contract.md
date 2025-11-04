---
id: core-module-contract
title: Contract
sidebar_position: 1
slug: /pipe-audit/core/modules/contract
---

# Contract Module
The **Contract** module provides APIs for managing and validating contracts.  
Contracts define the rules and expectations for data quality checks.

## Exposed Types
- ContractInfo – metadata about a contract
- ContractList – collection of available contracts
- ContractValidation – result of a validation run
- ValidationOutcome – enum describing pass/fail outcomes
- Executor – execution context for running contracts

## Exposed Functions
- get_contract(name: &str) -> ContractInfo
- list_contracts() -> ContractList
- validate_contract(contract: &ContractInfo) -> ContractValidation
- run_contract_validation(contract: &ContractInfo, executor: &Executor) -> ValidationOutcome
