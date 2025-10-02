---
id: testing
title: Testing & QA
slug: /contributing/testing
sidebar_position: 4
---

# Testing & QA

Pipe Audit enforces deterministic, educational tests.

## Guidelines
- **Unit tests**: one file per validator or connector.
- **Datasets**: small, deterministic, cover edge cases.
- **Coverage**: aim for 100% branch coverage.
- **Failure modes**: include at least one failing case per validator/connector.
- **CI**: run `cargo test --all` before submitting PRs.

✅ Tests are part of onboarding — they teach future contributors how the validator or connector works.
