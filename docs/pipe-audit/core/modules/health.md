---
id: core-module-health
title: Health
sidebar_position: 5
slug: /core/modules/health
---

# Health Module

The **Health** module provides system‑level diagnostics.  
It is useful for pre‑flight checks before running validations.

## Exposed Types
- HealthStatus – overall system health

## Exposed Functions
- check_system_health() -> HealthStatus
- run_health_check() -> HealthStatus
