---
id: adding-rules
title: Adding a New Rule
slug: /pipe-audit/contributing/adding-rules
sidebar_position: 2
---

# Adding a New Rule

Rules live under `pipa-core/src/validators/`.

## Steps
1. Create a new module in `pipa-core/src/validators/` (e.g. `median_between.rs`).
2. Implement the `Validator` trait:
   - `name()` → string identifier used in contracts
   - `validate()` → core validation logic
3. Add deterministic unit tests in `tests/validators/`:
   - Cover edge cases and failure modes
   - Include at least one failing dataset
4. Update `docs/core/rules.md` with TOML usage examples.
5. Run `cargo test` to ensure coverage.

✅ Every validator must have:
- Clear parameters
- Deterministic test datasets
- Documentation entry
