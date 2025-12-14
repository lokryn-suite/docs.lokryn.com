---
sidebar_position: 1
title: DuckLake Analytics Overview
---

# DuckLake Analytics Overview

FlightRecorder uses a two-tier storage architecture for compliance logs:

- **Hot Tier (Free)**: CBOR segments for real-time writes and recent data access
- **Cold Tier (Paid)**: DuckLake for long-term storage, analytics, and time travel queries

## Architecture

┌─────────────┐ Daily Rollup ┌──────────────┐ │ CBOR │ ───────────────────────>│ DuckLake │ │ Segments │ (Batch Insert) │ (Parquet) │ │ (Hot Tier) │ │ (Cold Tier) │ └─────────────┘ └──────────────┘ │ │ │ Fast Writes │ Advanced Analytics │ Recent Queries │ Time Travel │ │ SQL Queries

## Key Features

### CBOR Segments (Hot Tier)
- **Fast writes**: Immediate append to current segment
- **Recent access**: Quick reads for debugging and recent events
- **Automatic rotation**: New segment created when size threshold reached

### DuckLake (Cold Tier) - Paid Tier Only
- **Long-term storage**: Parquet files with columnar compression
- **Time travel**: Query logs at any historical snapshot
- **Advanced analytics**: Full SQL capabilities including joins, aggregations
- **ACID compliance**: Full transactional guarantees
- **Retention management**: Expire old snapshots based on policy

## Benefits

1. **Reduced File Count**: Avoids the "million file problem" through batching
2. **Query Performance**: Columnar Parquet format optimized for analytics
3. **Cost Efficiency**: Compressed storage with deduplication
4. **Compliance Ready**: ACID guarantees + time travel for auditing

## Rollup Process

Daily automatic rollup (or on-demand via IoT):
1. Reads CBOR segments older than 24 hours
2. Transforms to DuckLake schema
3. Bulk inserts into DuckLake (single Parquet file per batch)
4. Optionally deletes CBOR segments after successful rollup

## Maintenance

Regular maintenance keeps DuckLake performant:
- **Compaction**: Merge small Parquet files into larger ones
- **Cleanup**: Remove old unreferenced files after compaction
- **Snapshot Expiration**: Delete snapshots older than retention policy

See [Maintenance Operations](./maintenance.md) for details.
2. Rollup Process
File: docs/ducklake-rollup.md
---
sidebar_position: 2
title: Rollup Process
---

# CBOR to DuckLake Rollup

The rollup process moves logs from hot CBOR segments to cold DuckLake storage.

## Automatic Rollup

### Daily Scheduled Task

FlightRecorder runs an automatic rollup every 24 hours:

```python
# Runs daily at startup + 24h intervals
# Processes segments older than 24 hours
# Deletes CBOR segments after successful rollup
What happens:
Waits 24 hours after startup
Finds CBOR segments older than 24 hours
Reads and transforms logs to DuckLake schema
Bulk inserts into DuckLake (efficient batching)
Deletes source CBOR segments
Manual Rollup (Testing Only)
:::warning The REST endpoint is for testing only and will be removed in production. In production, rollup is triggered via IoT commands. :::
REST Endpoint (Development)
POST /v1/analytics/rollup?delete_after_rollup=false
Authorization: Bearer <paid-tier-token>
Query Parameters:
delete_after_rollup (boolean, default: false) - Delete CBOR segments after rollup
Response:
{
  "status": "ok",
  "result": {
    "segments_processed": 5,
    "logs_inserted": 1247,
    "segments_deleted": 5,
    "errors": [],
    "timestamp": "2025-11-10T17:30:00.000000"
  }
}
IoT Command (Production)
Rollup should be triggered via AWS IoT Core command:
{
  "action": "rollup",
  "delete_after_rollup": true
}
Published to: flightrecorder/{device-id}/commands
Rollup Behavior
Age Filtering
Scheduled Rollup:
Only processes segments older than 24 hours
Ensures segments are fully written and closed
Manual Rollup:
Processes ALL segments immediately (older_than_hours=0)
Use with caution in production
Batch Insertion
Rollup uses efficient bulk INSERT:
Reads all logs from a segment
Transforms to DuckLake schema
Single INSERT statement with all rows
Creates one Parquet file per segment
This avoids the million file problem that would occur with individual inserts.
Data Transformation
CBOR logs are transformed to DuckLake schema:
{
  "log_id": "uuid-or-request-id",
  "timestamp": "2025-11-10T12:00:00Z",
  "event_type": "AUTH_LOGIN",
  "outcome": "SUCCESS",
  "severity": "INFO",
  "sensitivity": "CONFIDENTIAL",
  "actor_id": "user@example.com",
  "component": "auth-service",
  "environment": "production",
  "resource": "/api/login",
  "message": "User logged in successfully",
  "payload": "{\"user_agent\":\"Mozilla/5.0\", ...}",  # JSON string
  "policy_tags": ["pci-dss", "gdpr"],
  "session_id": "sess-123",
  "request_id": "req-456",
  "source_ip": "192.168.1.1",
  "retention_until": "2025-12-10T12:00:00Z",
  "archived_at": "2025-11-10T17:30:00Z"
}
Payload Handling
The payload field requires special handling:
Bytes: Decoded to UTF-8 and validated as JSON
Dict: Serialized to JSON string
Other: Converted to string representation
Error Handling
Rollup continues on individual segment errors:
Failed segments are logged but don't stop the process
Errors returned in the errors array
Successfully processed segments are still inserted
Example error:
{
  "errors": [
    "Failed to rollup /app/data/segments/segment-000042.log: Invalid timestamp format"
  ]
}
Monitoring
Monitor rollup via IoT status messages: Success:
{
  "event": "rollup_completed",
  "data": {
    "segments_processed": 5,
    "logs_inserted": 1247,
    "timestamp": "2025-11-10T17:30:00"
  }
}
Failure:
{
  "event": "rollup_failed",
  "data": {
    "error": "Failed to initialize DuckLake: ..."
  }
}
Published to: flightrecorder/{device-id}/status

## 3. Analytics Endpoints

**File: `docs/ducklake-analytics.md`**

```markdown
---
sidebar_position: 3
title: Analytics Endpoints
---

# DuckLake Analytics Endpoints

All analytics endpoints require a **paid tier license**.

## Query Logs

Query compliance logs from DuckLake with advanced filtering.

```bash
GET /v1/analytics/logs
Authorization: Bearer <paid-tier-token>
Query Parameters
Parameter	Type	Description	Default
since	timestamp	Start timestamp (ISO 8601)	None
until	timestamp	End timestamp (ISO 8601)	None
severity	string	Filter by severity	None
component	string	Filter by component	None
event_type	string	Filter by event type	None
actor_id	string	Filter by actor	None
limit	integer	Maximum results (1-10000)	1000
offset	integer	Pagination offset	0
Example Request
curl -X GET "https://api.example.com/v1/analytics/logs?\
since=2025-11-01T00:00:00Z&\
until=2025-11-10T23:59:59Z&\
severity=ERROR&\
component=auth-service&\
limit=100" \
  -H "Authorization: Bearer <token>"
Response
{
  "logs": [
    {
      "log_id": "550e8400-e29b-41d4-a716-446655440000",
      "timestamp": "2025-11-10T12:00:00Z",
      "event_type": "AUTH_FAILED",
      "outcome": "FAILURE",
      "severity": "ERROR",
      "sensitivity": "CONFIDENTIAL",
      "actor_id": "user@example.com",
      "component": "auth-service",
      "environment": "production",
      "resource": "/api/login",
      "message": "Invalid credentials",
      "payload": "{\"attempts\": 3, \"locked\": false}",
      "policy_tags": ["pci-dss"],
      "session_id": "sess-123",
      "request_id": "req-456",
      "source_ip": "192.168.1.1",
      "retention_until": "2025-12-10T12:00:00Z",
      "archived_at": "2025-11-10T17:30:00Z"
    }
  ],
  "count": 1,
  "limit": 100,
  "offset": 0
}
Time Travel Queries
Query logs at a specific historical snapshot.
GET /v1/analytics/logs/snapshot/{snapshot_id}
Authorization: Bearer <paid-tier-token>
Path Parameters
Parameter	Type	Description
snapshot_id	integer	Snapshot version to query
Query Parameters
Parameter	Type	Description	Default
limit	integer	Maximum results (1-1000)	100
Example Request
curl -X GET "https://api.example.com/v1/analytics/logs/snapshot/42?limit=100" \
  -H "Authorization: Bearer <token>"
Response
{
  "snapshot_id": 42,
  "logs": [...],
  "count": 100
}
List Snapshots
Get all DuckLake snapshots for compliance auditing.
GET /v1/analytics/snapshots
Authorization: Bearer <paid-tier-token>
Response
{
  "snapshots": [
    {
      "snapshot_id": 5,
      "snapshot_time": "2025-11-10T17:30:00Z",
      "commit_message": "Daily rollup",
      "schema_version": 1
    },
    {
      "snapshot_id": 4,
      "snapshot_time": "2025-11-09T17:30:00Z",
      "commit_message": "Daily rollup",
      "schema_version": 1
    }
  ],
  "count": 2
}
Table Metadata
Get metadata about the DuckLake logs table.
GET /v1/analytics/info
Authorization: Bearer <paid-tier-token>
Response
{
  "table": "logs",
  "info": {
    "table_name": "logs",
    "file_count": 15,
    "total_size_bytes": 524288000,
    "row_count": 1000000
  }
}
Custom SQL Queries
Execute arbitrary SQL queries against DuckLake. :::danger Use with extreme caution. Ensure proper parameter binding to prevent SQL injection. :::
POST /v1/analytics/query
Authorization: Bearer <paid-tier-token>
Content-Type: application/json
Request Body
{
  "query": "SELECT component, COUNT(*) as error_count FROM compliance_lake.logs WHERE severity = $severity GROUP BY component ORDER BY error_count DESC",
  "params": {
    "severity": "ERROR"
  }
}
Response
{
  "results": [
    {
      "component": "auth-service",
      "error_count": 42
    },
    {
      "component": "api-gateway",
      "error_count": 15
    }
  ],
  "count": 2
}
Error Responses
All endpoints return standard error responses:
{
  "detail": "Query failed: Invalid timestamp format"
}
Status Codes:
401: Unauthorized (no license or invalid token)
403: Forbidden (free tier attempting paid endpoint)
500: Internal server error

## 4. Maintenance Operations

**File: `docs/ducklake-maintenance.md`**

```markdown
---
sidebar_position: 4
title: Maintenance Operations
---

# DuckLake Maintenance

Regular maintenance operations keep DuckLake performant and storage-efficient.

## File Compaction

Merge small Parquet files into larger ones to reduce file count and improve query performance.

```bash
POST /v1/analytics/maintenance/compact
Authorization: Bearer <paid-tier-token>
What It Does
Merges multiple small Parquet files from different snapshots
Creates larger, more efficient files
Preserves all data and snapshots (no data loss)
Improves query performance by reducing I/O overhead
Response
{
  "status": "ok",
  "files_before": 50,
  "files_after": 12,
  "files_merged": 38
}
When to Run
After multiple rollups: When file count grows high
Weekly maintenance: Regular schedule to keep optimal performance
Before long queries: Reduce query latency for analytics
:::info Compaction marks old files for deletion but doesn't remove them immediately. Run cleanup after compaction to reclaim storage. :::
File Cleanup
Remove old Parquet files that are no longer referenced after compaction.
POST /v1/analytics/maintenance/cleanup?\
older_than_hours=168&\
dry_run=false
Authorization: Bearer <paid-tier-token>
Query Parameters
Parameter	Type	Description	Default
older_than_hours	integer	Only cleanup files scheduled for deletion older than N hours (1-8760)	168 (7 days)
dry_run	boolean	If true, only report what would be deleted	true
Safety Threshold
:::warning Only deletes files scheduled for deletion longer than the threshold. Recommended: Wait at least 7 days (168 hours) after compaction. ::: This ensures no long-running read transactions are affected.
Dry Run (Preview)
Always run with dry_run=true first to preview changes:
POST /v1/analytics/maintenance/cleanup?older_than_hours=168&dry_run=true
Response:
{
  "status": "ok",
  "files_cleaned": 38,
  "older_than_hours": 168,
  "dry_run": true
}
Actual Cleanup
After verifying the dry run results:
POST /v1/analytics/maintenance/cleanup?older_than_hours=168&dry_run=false
Response:
{
  "status": "ok",
  "files_cleaned": 38,
  "older_than_hours": 168,
  "dry_run": false
}
Snapshot Expiration
Expire old snapshots for retention compliance.
POST /v1/analytics/maintenance/expire-snapshots?\
older_than_days=90
Authorization: Bearer <paid-tier-token>
Query Parameters
Parameter	Type	Description	Default
older_than_days	integer	Delete snapshots older than N days (1-3650)	90
What It Does
Deletes snapshot metadata older than threshold
Does NOT delete the underlying Parquet files (use cleanup for that)
Disables time travel to expired snapshots
Response
{
  "status": "ok",
  "expired_count": 12,
  "older_than_days": 90
}
Retention Policy Example
For a 90-day retention policy:
Day 90: Expire snapshots older than 90 days
Day 97: Run compaction to merge files
Day 104: Run cleanup to remove old files (7 days after compaction)
Maintenance Workflow
Recommended Schedule
Weekly:
# 1. Compact files
POST /v1/analytics/maintenance/compact

# 2. Wait 7 days, then cleanup
# (schedule for next week)
Monthly:
# Expire old snapshots per retention policy
POST /v1/analytics/maintenance/expire-snapshots?older_than_days=90
Complete Maintenance Script
#!/bin/bash
set -e

TOKEN="<paid-tier-token>"
BASE_URL="https://api.example.com/v1/analytics"

echo "=== Weekly Maintenance ==="

# 1. Compact files
echo "1. Compacting files..."
curl -X POST "$BASE_URL/maintenance/compact" \
  -H "Authorization: Bearer $TOKEN" \
  | jq .

# 2. Cleanup old files (7 days after last compaction)
echo "2. Cleaning up old files (dry run)..."
curl -X POST "$BASE_URL/maintenance/cleanup?older_than_hours=168&dry_run=true" \
  -H "Authorization: Bearer $TOKEN" \
  | jq .

read -p "Proceed with actual cleanup? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "3. Cleaning up old files (actual)..."
  curl -X POST "$BASE_URL/maintenance/cleanup?older_than_hours=168&dry_run=false" \
    -H "Authorization: Bearer $TOKEN" \
    | jq .
fi

echo "=== Maintenance Complete ==="
Monitoring
Check table info to monitor file count and size:
GET /v1/analytics/info
Response:
{
  "table": "logs",
  "info": {
    "table_name": "logs",
    "file_count": 12,
    "total_size_bytes": 2147483648,
    "row_count": 5000000
  }
}
Health Indicators
File count: Should stay low after regular compaction (< 100 files)
Average file size: Larger is better (> 100 MB per file)
Growth rate: Monitor total size over time
Alerts
Set up alerts for:
File count > 200 (needs compaction)
Total size growing faster than expected (check retention)
Cleanup failures (storage issues)

## 5. Testing Guide

**File: `docs/ducklake-testing.md`**

```markdown
---
sidebar_position: 5
title: Testing Guide
---

# Testing DuckLake Integration

This guide covers testing the DuckLake integration in development.

## Test License

Enable paid tier features for testing without a real license:

```bash
# docker-compose.yml or .env
TEST_PAID_LICENSE=true
:::danger Production Warning The TEST_PAID_LICENSE flag MUST be removed before production deployment. Search for TODO: REMOVE BEFORE PRODUCTION in the codebase. :::
Test Workflow
1. Generate Test Data
Create some CBOR log segments:
# Submit logs via API
curl -X POST "http://localhost:8000/v1/log" \
  -H "Content-Type: application/json" \
  -H "X-Signature: <hmac-signature>" \
  -d '{
    "timestamp": "2025-11-10T12:00:00Z",
    "event_type": "AUTH_LOGIN",
    "outcome": "SUCCESS",
    "severity": "INFO",
    "sensitivity": "CONFIDENTIAL",
    "actor_id": "test@example.com",
    "component": "test-client",
    "environment": "development",
    "message": "Test log entry",
    "payload": {"test": true}
  }'
Repeat to create multiple segments.
2. Trigger Rollup
Roll up CBOR segments to DuckLake:
curl -X POST "http://localhost:8000/v1/analytics/rollup?delete_after_rollup=false" \
  -H "Authorization: Bearer test-token"
Response:
{
  "status": "ok",
  "result": {
    "segments_processed": 3,
    "logs_inserted": 150,
    "segments_deleted": 0,
    "errors": [],
    "timestamp": "2025-11-10T17:30:00.000000"
  }
}
3. Query Logs
Query the rolled-up logs:
curl -X GET "http://localhost:8000/v1/analytics/logs?limit=10" \
  -H "Authorization: Bearer test-token"
4. Check Snapshots
View available snapshots:
curl -X GET "http://localhost:8000/v1/analytics/snapshots" \
  -H "Authorization: Bearer test-token"
5. Test Time Travel
Query at a specific snapshot:
curl -X GET "http://localhost:8000/v1/analytics/logs/snapshot/1?limit=10" \
  -H "Authorization: Bearer test-token"
6. Test Compaction
Create multiple rollups to generate multiple files, then compact:
# Trigger multiple rollups
for i in {1..5}; do
  curl -X POST "http://localhost:8000/v1/analytics/rollup"
  sleep 2
done

# Compact files
curl -X POST "http://localhost:8000/v1/analytics/maintenance/compact" \
  -H "Authorization: Bearer test-token"
7. Test Cleanup
Preview and execute cleanup:
# Dry run
curl -X POST "http://localhost:8000/v1/analytics/maintenance/cleanup?older_than_hours=0&dry_run=true" \
  -H "Authorization: Bearer test-token"

# Actual cleanup
curl -X POST "http://localhost:8000/v1/analytics/maintenance/cleanup?older_than_hours=0&dry_run=false" \
  -H "Authorization: Bearer test-token"
Inspect DuckLake Data
Using DuckDB CLI
Connect to the DuckLake catalog:
docker exec -it flightrecorder duckdb

# In DuckDB
.open /app/data/lakehouse/catalog.duckdb

INSTALL ducklake;
LOAD ducklake;

ATTACH 'ducklake:/app/data/lakehouse/catalog.duckdb' AS compliance_lake 
  (DATA_PATH '/app/data/lakehouse/data');

-- Query logs
SELECT * FROM compliance_lake.logs LIMIT 10;

-- Check snapshots
SELECT * FROM ducklake_snapshots('compliance_lake');

-- Check files
SELECT * FROM ducklake_table_info('compliance_lake') WHERE table_name = 'logs';
Check Physical Files
# Count Parquet files
docker exec flightrecorder find /app/data/lakehouse/data -name "*.parquet" | wc -l

# List files with sizes
docker exec flightrecorder ls -lh /app/data/lakehouse/data/
Common Test Scenarios
Scenario 1: Bulk Data Ingestion
import requests
import time

for i in range(1000):
    requests.post("http://localhost:8000/v1/log", 
        json={
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ"),
            "event_type": "TEST_EVENT",
            "outcome": "SUCCESS",
            "severity": "INFO",
            "actor_id": f"user-{i}",
            "component": "test",
            "environment": "dev",
            "message": f"Test log {i}"
        },
        headers={"X-Signature": "<hmac>"})
Scenario 2: Query Performance
# Large result set
time curl "http://localhost:8000/v1/analytics/logs?limit=10000"

# Filtered query
time curl "http://localhost:8000/v1/analytics/logs?component=test&severity=ERROR&limit=1000"
Scenario 3: Storage Growth
# Check storage before rollup
du -sh docker-volumes/lakehouse

# Rollup
curl -X POST "http://localhost:8000/v1/analytics/rollup"

# Check storage after rollup
du -sh docker-volumes/lakehouse

# Compact
curl -X POST "http://localhost:8000/v1/analytics/maintenance/compact"

# Check storage after compaction
du -sh docker-volumes/lakehouse
Cleanup Test Data
# Stop container
docker-compose down

# Remove DuckLake data
rm -rf ./lakehouse

# Remove CBOR segments
rm -rf ./segments

# Restart
docker-compose up -d
Troubleshooting
Issue: No logs after rollup
Check:
# Check rollup logs
docker logs flightrecorder | grep -i rollup

# Check if segments exist
ls -la ./segments/

# Check DuckLake catalog
docker exec flightrecorder ls -la /app/data/lakehouse/
Issue: Compaction doesn't merge files
Reason: Need multiple rollups to create multiple files to merge. Solution: Run rollup multiple times before compacting.
Issue: Cleanup doesn't delete files
Reason: Files must be scheduled for deletion for at least older_than_hours. Solution: Use older_than_hours=0 for testing (not recommended in production).

