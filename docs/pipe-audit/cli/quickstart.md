---
id: cli-quickstart
title: Quickstart
sidebar_position: 2
slug: /cli/quickstart
---

# CLI Quickstart

The `pipa` CLI is the fastest way to get started with Pipe Audit.  
This guide walks you through creating a project, defining a contract, setting up a profile, and running your first validation.

## 1. Initialize a Project

pipa init

This scaffolds:

- contracts/ – contract definitions
- data/ – input/output files
- logs/ – audit logs
- quarantine/ – quarantined files
- profiles.toml – connection profiles
- .env – environment variables

## 2. Define a Contract

Create a file in contracts/example.toml:

name = "example_contract"
description = "Validate CSV headers"
type = "csv"

[checks]
required_headers = ["id", "name", "email"]

## 3. Configure a Profile

Edit profiles.toml:

[local]
type = "filesystem"
path = "./data"

Test the profile:

pipa profile test local

## 4. Use Environment Variables

Add secrets or connection details to .env:

AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret

These values are automatically loaded when running commands.

## 5. Run a Validation

Run a single contract:

pipa run --contract example_contract

Run all contracts:

pipa run --all

✅ You now have a working Pipe Audit project with contracts, profiles, and environment configuration.
