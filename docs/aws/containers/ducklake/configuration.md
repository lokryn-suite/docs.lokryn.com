---
sidebar_position: 3
title: Configuration
description: Configure DuckLake Container with environment variables or Secrets Manager
---

# Configuration

DuckLake Container uses a cascading configuration approach: it tries AWS Secrets Manager first, then falls back to environment variables.

## Configuration Methods

### Option 1: AWS Secrets Manager (Recommended for Production)

Store your configuration in a secret named `lokryn/ducklake/config`:

```bash
aws secretsmanager create-secret \
  --name lokryn/ducklake/config \
  --secret-string '{
    "postgres_user": "admin",
    "postgres_password": "your-secure-password",
    "postgres_db": "lakehouse",
    "s3_bucket_url": "s3://your-bucket",
    "aws_region": "us-east-1"
  }'
```

**Important:** Keys must be lowercase. The container automatically detects and uses this secret if it exists and the task has permission to read it.

### Option 2: Environment Variables

Pass configuration directly via environment variables. Useful for local development or simple deployments.

```bash
docker run -d \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=yourpassword \
  -e POSTGRES_DB=lakehouse \
  -e S3_BUCKET_URL=s3://your-bucket \
  -e AWS_REGION=us-east-1 \
  -p 5432:5432 \
  your-container-image
```

## Configuration Reference

### Secrets Manager (lowercase keys)

| Key | Required | Description | Example |
|-----|----------|-------------|---------|
| `postgres_user` | Yes | Username for the catalog database | `admin` |
| `postgres_password` | Yes | Password for the catalog database | `secure-password-here` |
| `postgres_db` | Yes | Database name for the catalog | `lakehouse` |
| `s3_bucket_url` | Yes | S3 path for data storage | `s3://your-bucket` |
| `aws_region` | Yes | AWS region for S3 bucket | `us-east-1` |

### Environment Variables (uppercase)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `POSTGRES_USER` | Yes | Username for the catalog database | `admin` |
| `POSTGRES_PASSWORD` | Yes | Password for the catalog database | `secure-password-here` |
| `POSTGRES_DB` | Yes | Database name for the catalog | `lakehouse` |
| `S3_BUCKET_URL` | Yes | S3 path for data storage | `s3://your-bucket` |
| `AWS_REGION` | Yes | AWS region for S3 bucket | `us-east-1` |

## ECS Task Definition Requirements

When creating your ECS task definition, these settings are required:

### Runtime Platform

You must specify the runtime platform for Fargate:

```json
"runtimePlatform": {
    "cpuArchitecture": "X86_64",
    "operatingSystemFamily": "LINUX"
}
```

### Recommended Settings

| Setting | Recommended Value | Notes |
|---------|-------------------|-------|
| CPU | 512 | Minimum for stable operation |
| Memory | 1024 | Minimum for stable operation |
| Network Mode | awsvpc | Required for Fargate |
| Port | 5432 | PostgreSQL default |

### Health Check

```json
"healthCheck": {
    "command": ["CMD-SHELL", "pg_isready -U admin -d lakehouse || exit 1"],
    "interval": 30,
    "timeout": 10,
    "retries": 3,
    "startPeriod": 60
}
```

Adjust the `-U` and `-d` values to match your `postgres_user` and `postgres_db` settings.

### Logging

Enable CloudWatch logging to troubleshoot issues:

```json
"logConfiguration": {
    "logDriver": "awslogs",
    "options": {
        "awslogs-group": "/ecs/ducklake",
        "awslogs-region": "us-east-1",
        "awslogs-stream-prefix": "ducklake",
        "awslogs-create-group": "true"
    }
}
```

## Data Persistence

The PostgreSQL catalog is stored at `/var/lib/pgsql/data` inside the container. 

**For production use, mount an EFS volume to persist the catalog across container restarts.**

Without a persistent volume, the catalog will be lost when the container stops. Your data in S3 remains intact, but the table metadata (schemas, versions) will need to be recreated.

### EFS Mount Configuration

```json
"mountPoints": [
    {
        "sourceVolume": "postgres-data",
        "containerPath": "/var/lib/pgsql/data",
        "readOnly": false
    }
]
```

You'll also need to define the volume in your task definition and create the EFS file system with appropriate security group rules.

## Local Development

For local development with docker-compose, create a `.env` file:

```env
POSTGRES_USER=admin
POSTGRES_PASSWORD=localdev
POSTGRES_DB=lakehouse
S3_BUCKET_URL=s3://your-dev-bucket
AWS_REGION=us-east-1
AWS_PROFILE=your-sso-profile
```

Then run:

```bash
docker-compose up --build
```

For working examples, see our [examples repository](https://github.com/lokryn-suite/ducklake-examples).