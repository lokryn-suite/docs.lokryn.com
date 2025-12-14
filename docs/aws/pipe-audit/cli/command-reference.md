---
id: cli-command-reference
title: CLI Command Reference
slug: /pipe-audit/cli/command-reference
sidebar_position: 3
---

# CLI Command Reference

The `pipa` CLI provides commands for managing projects, running validations, and verifying audit logs.

---

### `pipa init`

Initialize a new Pipe Audit project in the current directory. This creates the standard folder structure and configuration files.

```bash
pipa init
````

**Scaffolded structure:**

  * `contracts/` – contract definitions
  * `logs/` – audit logs
  * `profiles.toml` – connection profiles
  * `.env` – environment variables

-----

### `pipa run`

Execute data validation based on defined contracts.

```bash
# Run a single contract
pipa run --contract <CONTRACT_NAME>

# Run all contracts
pipa run --all
```

-----

### `pipa contract`

Manage data contracts.

```bash
# List contracts
pipa contract list

# Show contract details
pipa contract show <CONTRACT_NAME>

# Validate contract syntax
pipa contract validate <PATH_TO_CONTRACT.toml>
```

-----

### `pipa profile`

Manage connection profiles defined in `profiles.toml`.

```bash
# List profiles
pipa profile list

# Test a profile connection
pipa profile test <PROFILE_NAME>
```

-----

### `pipa logs`

Verify and manage audit logs.

```bash
# Verify logs for a specific date (YYYY-MM-DD)
pipa logs verify --date 2025-09-26

# Verify all logs
pipa logs verify --all
```

-----

### `pipa health`

Run a system health check to ensure configurations and connectors are working correctly.

```bash
pipa health
```

