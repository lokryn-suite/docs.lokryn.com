---
id: profile
title: Profile
sidebar_position: 2
---

# Profile Module

The **Profile** module provides access to profile definitions and testing utilities.  
Profiles parameterize contract runs with environment‑specific settings.

## Exposed Types
- ProfileList – collection of available profiles
- ProfileTestResult – result of testing a profile

## Exposed Functions
- list_profiles() -> ProfileList
- test_profile(profile: &str) -> ProfileTestResult
