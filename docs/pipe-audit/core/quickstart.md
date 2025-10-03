---
id: core-quickstart
title: Quickstart
sidebar_position: 2
slug: /core/quickstart
---


# Core Quickstart

The `pipa-core` crate exposes the same functionality as the CLI, but programmatically.  
This guide shows how to set up a contract, configure a profile, and run validations in Rust.

## 1. Add Dependency

In Cargo.toml:

[dependencies]
pipa-core = "0.1"

## 2. Load and Validate a Contract

use pipa_core::contract::\{list_contracts, validate_contract\};

fn main() \{
    let contracts = list_contracts();
    for c in contracts \{
        let result = validate_contract(&c);
        println!("Contract \{\}: \{:?\}", c.name, result.outcome);
    \}
\}

## 3. Work with Profiles

use pipa_core::profile::\{list_profiles, test_profile\};

fn main() \{
    let profiles = list_profiles();
    for p in profiles \{
        let result = test_profile(&p.name);
        println!("Profile \{\}: \{:?\}", p.name, result);
    }
}

## 4. Use Environment Variables

use dotenv::dotenv;

fn main() \{
    dotenv().ok();
    let key = std::env::var("AWS_ACCESS_KEY_ID").unwrap();
    println!("Loaded key: \{\}", key);
\}

## 5. Run a Validation Programmatically

use pipa_core::contract::\{get_contract, run_contract_validation\};
use pipa_core::logging::schema::Executor;

fn main() \{
    let contract = get_contract("example_contract").unwrap();
    let executor = Executor::default();
    let outcome = run_contract_validation(&contract, &executor);
    println!\("Validation outcome: \{:?\}", outcome);
\}

✅ With `pipa-core`, you can embed Pipe Audit directly into your Rust applications or services.