---
id: postgres-cdc-configuration
title: Configuration
slug: /modules/postgres-cdc/configuration
sidebar_position: 3
---

# Configuration

All configuration via environment variables.

---

## Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `POSTGRES_HOST` | PostgreSQL host | `mydb.example.com` |
| `POSTGRES_PORT` | PostgreSQL port | `5432` |
| `POSTGRES_DB` | Database name | `mydb` |
| `POSTGRES_USER` | User with replication permission | `cdc_user` |
| `POSTGRES_PASSWORD` | Database password | `secret` |
| `S3_TABLE_BUCKET_ARN` | S3 Tables bucket ARN | `arn:aws:s3tables:us-east-2:123456789:bucket/my-bucket` |
| `AWS_REGION` | AWS region | `us-east-2` |
| `PUBLICATION_NAME` | PostgreSQL publication name | `cdc_publication` |
| `SLOT_NAME` | Replication slot name | `my_cdc_slot` |

---

## Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `ICEBERG_NAMESPACE` | Iceberg namespace for tables | `cdc` |
| `BUFFER_SIZE` | Rows before flush to S3 | `10000` |
| `FLUSH_INTERVAL_SEC` | Seconds before flush | `60` |
| `LOG_LEVEL` | Logging level (DEBUG, INFO, WARNING, ERROR) | `INFO` |
| `AWS_PROFILE` | AWS profile for SSO (local dev) | (none) |

---

## AWS Credentials

The container uses standard AWS credential resolution:

1. Environment variables (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`)
2. IAM instance profile (EC2/ECS)
3. Mounted credentials file (`~/.aws/credentials`)
4. SSO profile (for local development)

For ECS deployments, use task IAM roles. For local development, mount your `~/.aws` directory.

---

## Example .env File

```bash
# PostgreSQL
POSTGRES_HOST=host.docker.internal
POSTGRES_PORT=5432
POSTGRES_DB=mydb
POSTGRES_USER=cdc_user
POSTGRES_PASSWORD=secret

# S3 Tables
S3_TABLE_BUCKET_ARN=arn:aws:s3tables:us-east-2:123456789012:bucket/my-cdc-bucket
AWS_REGION=us-east-2
AWS_PROFILE=dev
ICEBERG_NAMESPACE=cdc

# CDC Settings
PUBLICATION_NAME=cdc_publication
SLOT_NAME=my_cdc_slot

# Buffering (optional)
# BUFFER_SIZE=10000
# FLUSH_INTERVAL_SEC=60

# Logging (optional)
# LOG_LEVEL=INFO
```

---

## Tuning

### Buffer Size

`BUFFER_SIZE` controls how many rows accumulate before writing to S3.

| Setting | Use Case |
|---------|----------|
| `1-100` | Testing, immediate visibility |
| `1000-5000` | Low-volume tables |
| `10000` | Default, balanced cost/latency |
| `50000+` | High-volume tables, optimize for throughput |

Larger batches mean fewer S3 API calls (lower cost) but higher memory usage and latency.

### Flush Interval

`FLUSH_INTERVAL_SEC` ensures data is written even during quiet periods.

| Setting | Trade-off |
|---------|-----------|
| `10-30 seconds` | Near real-time, more S3 writes |
| `60 seconds` | Default, balanced |
| `300+ seconds` | Lower cost, acceptable latency |

The container flushes when **either** threshold is reached (rows OR time).

### Log Level

| Level | Output |
|-------|--------|
| `DEBUG` | Every change event, LSN acknowledgments |
| `INFO` | Startup, writes, shutdown (default) |
| `WARNING` | Issues that don't stop processing |
| `ERROR` | Failures only |

---

## Docker Compose Example

```yaml
services:
  postgres-cdc:
    image: lokryn/postgres-cdc:latest
    env_file: .env
    volumes:
      - ~/.aws:/root/.aws
    extra_hosts:
      - "host.docker.internal:host-gateway"
    restart: unless-stopped
```

---

## ECS Task Definition

```json
{
  "family": "postgres-cdc",
  "taskRoleArn": "arn:aws:iam::123456789012:role/postgres-cdc-task-role",
  "containerDefinitions": [
    {
      "name": "postgres-cdc",
      "image": "lokryn/postgres-cdc:latest",
      "environment": [
        {"name": "POSTGRES_HOST", "value": "mydb.cluster-xxx.us-east-2.rds.amazonaws.com"},
        {"name": "POSTGRES_PORT", "value": "5432"},
        {"name": "POSTGRES_DB", "value": "mydb"},
        {"name": "S3_TABLE_BUCKET_ARN", "value": "arn:aws:s3tables:us-east-2:123456789012:bucket/my-cdc-bucket"},
        {"name": "AWS_REGION", "value": "us-east-2"},
        {"name": "PUBLICATION_NAME", "value": "cdc_publication"},
        {"name": "SLOT_NAME", "value": "my_cdc_slot"}
      ],
      "secrets": [
        {"name": "POSTGRES_USER", "valueFrom": "arn:aws:secretsmanager:us-east-2:123456789012:secret:cdc-user"},
        {"name": "POSTGRES_PASSWORD", "valueFrom": "arn:aws:secretsmanager:us-east-2:123456789012:secret:cdc-password"}
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/postgres-cdc",
          "awslogs-region": "us-east-2",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```
