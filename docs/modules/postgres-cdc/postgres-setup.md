---
id: postgres-cdc-postgres-setup
title: PostgreSQL Setup
slug: /modules/postgres-cdc/postgres-setup
sidebar_position: 4
---

# PostgreSQL Setup

Configure PostgreSQL for WAL-based CDC.

---

## Enable Logical Replication

### Check current setting

```sql
SHOW wal_level;
```

If the result is `logical`, skip to the next section.

### Change wal_level

This requires a restart. Plan a maintenance window.

**RDS/Aurora:**

1. Go to Parameter Groups in RDS Console
2. Set `rds.logical_replication = 1`
3. Reboot the instance

**Self-hosted:**

```sql
ALTER SYSTEM SET wal_level = 'logical';
```

Verify it's pending:

```sql
SELECT name, setting, pending_restart 
FROM pg_settings 
WHERE name = 'wal_level';
```

Restart PostgreSQL:

```bash
# Docker
docker compose restart postgres

# systemd
sudo systemctl restart postgresql
```

Reconnect and verify:

```sql
SHOW wal_level;
-- Should show: logical
```

---

## Check Replication Settings

```sql
SHOW max_replication_slots;
SHOW max_wal_senders;
```

Both should be at least 1 (modern PostgreSQL defaults to 10). If either is 0, increase in `postgresql.conf` and restart.

---

## Create CDC User

**Self-hosted:**

```sql
CREATE USER cdc_user WITH PASSWORD 'your_secure_password' REPLICATION;
GRANT USAGE ON SCHEMA public TO cdc_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO cdc_user;
```

**RDS/Aurora:**

```sql
CREATE USER cdc_user WITH PASSWORD 'your_secure_password';
GRANT rds_replication TO cdc_user;
GRANT USAGE ON SCHEMA public TO cdc_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO cdc_user;
```

Verify:

```sql
SELECT usename, userepl FROM pg_user WHERE usename = 'cdc_user';
-- Should show: userepl = t
```

---

## Create Publication

Publications define which tables to track.

### Specific tables

```sql
CREATE PUBLICATION cdc_publication FOR TABLE orders, customers, products;
```

### All tables

```sql
CREATE PUBLICATION cdc_publication FOR ALL TABLES;
```

### View current tables

```sql
SELECT * FROM pg_publication_tables WHERE pubname = 'cdc_publication';
```

### Manage tables dynamically

Add or remove tables without redeploying the container:

```sql
-- Add a table
ALTER PUBLICATION cdc_publication ADD TABLE new_table;

-- Remove a table
ALTER PUBLICATION cdc_publication DROP TABLE old_table;
```

---

## Primary Keys

Logical replication requires primary keys to identify rows for UPDATE and DELETE operations.

Find tables missing primary keys:

```sql
SELECT t.table_schema, t.table_name
FROM information_schema.tables t
LEFT JOIN information_schema.table_constraints c
  ON t.table_schema = c.table_schema 
  AND t.table_name = c.table_name 
  AND c.constraint_type = 'PRIMARY KEY'
WHERE t.table_type = 'BASE TABLE'
  AND t.table_schema = 'public'
  AND c.constraint_name IS NULL;
```

For tables without a natural primary key, add one or use `REPLICA IDENTITY FULL`.

---

## Replica Identity (Optional)

Replica identity controls what data PostgreSQL includes in the WAL for UPDATE and DELETE operations.

### Default behavior

Only the primary key is sent:

```
UPDATE: {'id': '5', 'customer_name': 'Eve', 'amount': '100.00'}
DELETE: {'id': '4', 'customer_name': None, 'amount': None}
```

### With REPLICA IDENTITY FULL

Complete before/after images:

```
UPDATE: {'id': '5', 'amount': '75.00'} -> {'id': '5', 'amount': '100.00'}
DELETE: {'id': '4', 'customer_name': 'Dave', 'amount': '50.00'}
```

Enable full row data:

```sql
ALTER TABLE orders REPLICA IDENTITY FULL;
```

Check current setting:

```sql
SELECT relname, relreplident 
FROM pg_class 
WHERE relname = 'orders';
```

| Value | Meaning |
|-------|---------|
| `d` | Default (primary key only) |
| `f` | Full (complete row) |
| `n` | Nothing |
| `i` | Index |

**Trade-offs:**

- `DEFAULT`: Less WAL traffic, sufficient for most CDC use cases
- `FULL`: More WAL traffic, required if you need before-values or tables lack primary keys

---

## Replication Slots

The container automatically creates a replication slot on first run. Slots ensure WAL is retained until consumed.

### View slots

```sql
SELECT slot_name, active, restart_lsn 
FROM pg_replication_slots;
```

### Monitor WAL retention

If the container is stopped for a long time, WAL accumulates:

```sql
SELECT pg_size_pretty(pg_wal_lsn_diff(pg_current_wal_lsn(), restart_lsn)) as wal_retained
FROM pg_replication_slots
WHERE slot_name = 'my_cdc_slot';
```

### Drop a slot (if needed)

```sql
SELECT pg_drop_replication_slot('my_cdc_slot');
```

**Warning:** Dropping a slot loses uncommitted WAL. The container will recreate the slot and start from the current position.

---

## Setup Checklist

| Step | Command | Required |
|------|---------|----------|
| wal_level = logical | `SHOW wal_level;` | Yes |
| max_replication_slots >= 1 | `SHOW max_replication_slots;` | Yes |
| max_wal_senders >= 1 | `SHOW max_wal_senders;` | Yes |
| User with replication | `SELECT userepl FROM pg_user` | Yes |
| SELECT grants | `GRANT SELECT ON ALL TABLES` | Yes |
| Primary keys | Query above | Yes (or REPLICA IDENTITY FULL) |
| Replica identity | `ALTER TABLE ... REPLICA IDENTITY FULL` | Optional |
| Publication | `CREATE PUBLICATION ...` | Yes |

---

## RDS / Aurora Notes

### RDS PostgreSQL

- Use parameter groups to set `rds.logical_replication = 1`
- Reboot required after parameter change
- Use `rds_replication` role instead of `REPLICATION` attribute

### Aurora PostgreSQL

- Same as RDS
- For Aurora Serverless v2, ensure cluster doesn't pause while CDC is running
- Minimum ACU should be sufficient to handle WAL streaming
