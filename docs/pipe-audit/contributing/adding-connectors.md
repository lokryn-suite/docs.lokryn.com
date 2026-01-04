---
id: adding-connectors
title: Adding a New Connector
slug: /pipe-audit/contributing/adding-connectors
sidebar_position: 3
---

# Adding a New Connector

Data connectors (providers) live under `pipa-core/src/connectors/`.  
Each connector implements the `Connector` trait, which currently requires only `fetch()`.
## Steps
1. Create a new module in `pipa-core/src/connectors/` (e.g. `snowflake.rs`).
2. Implement the `Connector` trait:
   - `fetch(&self, location: &str) -> Result<DataSet, Error>`
3. Add a profile schema entry in `profiles.toml` docs.
4. Write integration tests in `tests/connectors/`:
   - Use environment variables for credentials
   - Include at least one failing case
5. Update `docs/core/profiles.md` with an example profile.

✅ Connectors must:
- Support `.env` substitution for secrets
- Pass `pipa profile test`
- Include contributor notes in code comments
