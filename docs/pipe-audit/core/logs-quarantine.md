---
id: logs-quarantine
title: Logs & Quarantine
sidebar_position: 6
---

# Logs & Quarantine

Pipe Audit produces **tamper‑evident logs** for every validation run and supports **quarantine destinations** for invalid data.  
This page explains how they work and how to configure them in contracts.

---

## Audit Logs

Audit logs record every validation event in a cryptographically verifiable chain.  
They ensure that results cannot be silently altered.

### In Contracts
[logs] is implicit — logs are always written to the `logs/` directory by default.  
You can configure log verification separately.

### CLI Usage
- Verify logs for a specific date:  
  pipa logs verify --date 2025-09-26

- Verify all logs:  
  pipa logs verify --all

### Notes
- Logs are append‑only and tamper‑evident.  
- Verification checks the integrity of the log chain.  
- Useful for audits, compliance, and historical replay.

---

## Quarantine

Quarantine is where invalid or failed files are moved after validation.  
It ensures bad data is isolated without blocking the pipeline.

### In Contracts
[quarantine]  
type = "gcs"  
location = "https://storage.cloud.google.com/ondoriya/people.csv"  
profile = "gcs_test"

### Notes
- **type**: provider type (local, s3, gcs, azure).  
- **location**: path or URI where quarantined files are stored.  
- **profile**: reference to a profile in `profiles.toml`.  
- Quarantine is optional — if omitted, invalid files remain in place.  

---

## Best Practices

- Always configure a quarantine destination in production to prevent bad data from contaminating downstream systems.  
- Regularly verify logs to maintain compliance and trust in validation results.  
- Use different profiles for source, destination, and quarantine to keep responsibilities clear.  

---

✅ Together, **Logs** provide an immutable record of what happened, and **Quarantine** ensures invalid data is safely contained.  

---

Would you like me to also draft a **Contributing Guide** next (how to add a new rule, provider, or module), so future contributors have a clear path to extend the system?