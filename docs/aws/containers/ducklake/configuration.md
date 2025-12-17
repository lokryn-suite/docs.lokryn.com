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
    "POSTGRES_USER": "admin",
    "POSTGRES_PASSWORD": "your-secure-password",
    "POSTGRES_DB": "lakehouse",
    "S3_BUCKET_URL": "s3://your-bucket/data/",
    "AWS_REGION": "us-east-1"
  }'
```

The container automatically detects and uses this secret if it exists and the task has permission to read it.

### Option 2: Environment Variables

Pass configuration directly via environment variables. Useful for local development or simple deployments.

```bash
docker run -d \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=yourpassword \
  -e POSTGRES_DB=lakehouse \
  -e S3_BUCKET_URL=s3://your-bucket/data/ \
  -e AWS_REGION=us-east-1 \
  -p 5432:5432 \
  your-container-image
```

## Configuration Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `POSTGRES_USER` | Yes | Username for the catalog database | `admin` |
| `POSTGRES_PASSWORD` | Yes | Password for the catalog database | `secure-password-here` |
| `POSTGRES_DB` | Yes | Database name for the catalog | `lakehouse` |
| `S3_BUCKET_URL` | Yes | S3 path for data storage | `s3://bucket/data/` |
| `AWS_REGION` | Yes | AWS region for S3 bucket | `us-east-1` |

## ECS Task Definition

Here's a complete ECS task definition for production use:

```json
{
  "family": "ducklake",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "taskRoleArn": "arn:aws:iam::ACCOUNT:role/ducklake-task-role",
  "executionRoleArn": "arn:aws:iam::ACCOUNT:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "ducklake",
      "image": "YOUR_MARKETPLACE_IMAGE",
      "essential": true,
      "portMappings": [
        {
          "containerPort": 5432,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {"name": "AWS_REGION", "value": "us-east-1"}
      ],
      "secrets": [
        {
          "name": "POSTGRES_USER",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:ACCOUNT:secret:lokryn/ducklake/config:POSTGRES_USER::"
        },
        {
          "name": "POSTGRES_PASSWORD",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:ACCOUNT:secret:lokryn/ducklake/config:POSTGRES_PASSWORD::"
        },
        {
          "name": "POSTGRES_DB",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:ACCOUNT:secret:lokryn/ducklake/config:POSTGRES_DB::"
        },
        {
          "name": "S3_BUCKET_URL",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:ACCOUNT:secret:lokryn/ducklake/config:S3_BUCKET_URL::"
        }
      ],
      "healthCheck": {
        "command": ["CMD-SHELL", "pg_isready -U admin -d lakehouse || exit 1"],
        "interval": 30,
        "timeout": 5,
        "retries": 3
      },
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/ducklake",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ducklake"
        }
      }
    }
  ]
}
```

## Data Persistence

By default, the PostgreSQL catalog is stored inside the container. For production, mount an EFS volume to persist the catalog across container restarts:

```json
"mountPoints": [
  {
    "sourceVolume": "postgres-data",
    "containerPath": "/var/lib/postgresql/data",
    "readOnly": false
  }
]
```

See the full EFS setup in our [GitHub repository](https://github.com/lokryn-suite/ducklake).

## Local Development

For local development with docker-compose:

```yaml
services:
  ducklake:
    build: .
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=admin
      - POSTGRES_PASSWORD=localdev
      - POSTGRES_DB=lakehouse
      - S3_BUCKET_URL=s3://your-dev-bucket/data/
      - AWS_REGION=us-east-1
    volumes:
      - ~/.aws:/root/.aws:ro  # For local AWS credentials
```

Copy `.env.example` to `.env` and fill in your values, then run:

```bash
docker-compose up --build
```