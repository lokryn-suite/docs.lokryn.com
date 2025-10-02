---
id: logs
title: Logs
sidebar_position: 4
---

# Logs Module

The **Logs** module surfaces log verification and integrity checking.  
It includes cryptographic verification of log chains.

## Exposed Types
- LogVerification – result of verifying logs
- FileStatus – status of a log file

## Exposed Functions
- verify_logs(path: &str) -> LogVerification
