---
id: pipe-audit-container
title: Pipe Audit Container
slug: /pipe-audit/container
sidebar_position: 10
---

# Pipe Audit Container

Deploy Pipe Audit into your own AWS environment via AWS Marketplace. Your VPC, your data, complete control.

---

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Your Files │────▶│  Pipe Audit │────▶│   Valid     │
│             │     │  Container  │     │   Output    │
└─────────────┘     └──────┬──────┘     └─────────────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
       ┌───────────┐ ┌───────────┐ ┌───────────┐
       │    S3     │ │ DynamoDB  │ │Quarantine │
       │ (files)   │ │(contracts)│ │   (S3)    │
       └───────────┘ └───────────┘ └───────────┘
```

**Key components:**
- **S3** — Input files, validated output, quarantine storage
- **DynamoDB** — Contract definitions, validation results
- **Container** — Runs in your VPC

---

## Prerequisites

- AWS account
- VPC with private subnets
- S3 buckets for input, output, quarantine
- DynamoDB tables
- ECS Fargate or EC2 for container hosting

---

## Deployment

### AWS Marketplace

1. Subscribe to Pipe Audit on AWS Marketplace
2. Launch CloudFormation stack
3. Deploy container to ECS
4. Configure environment variables

### Environment Variables

```bash
# Required
PIPE_AUDIT_S3_INPUT_BUCKET=pipe-audit-input
PIPE_AUDIT_S3_OUTPUT_BUCKET=pipe-audit-output
PIPE_AUDIT_S3_QUARANTINE_BUCKET=pipe-audit-quarantine
PIPE_AUDIT_DYNAMODB_CONTRACTS=pipe-audit-contracts
PIPE_AUDIT_DYNAMODB_RESULTS=pipe-audit-results

# Optional
PIPE_AUDIT_HMAC_SECRET=your-secret
PIPE_AUDIT_LOG_LEVEL=INFO
```

---

## Authentication

### None (Default)
No authentication. Suitable when only accessible within your VPC.

### HMAC
Request signing for API access:

```python
import hmac
import hashlib

signature = hmac.new(
    secret.encode(),
    body,
    hashlib.sha256
).hexdigest()

headers = {"X-Signature": signature}
```

---

## API Reference

### Submit File for Validation

```bash
POST /v1/validate
Content-Type: multipart/form-data

contract_id=vendor-sales
file=@sales.csv
```

### Create Contract

```bash
POST /v1/contracts
Content-Type: application/toml

[contract]
name = "vendor-sales"
...
```

### List Contracts

```bash
GET /v1/contracts
```

### Get Validation Results

```bash
GET /v1/results?since=2026-01-01T00:00:00Z
```

### Get Quarantined Files

```bash
GET /v1/quarantine
```

---

## S3 Integration

### Event-Driven Validation

Configure S3 event notifications to trigger validation automatically:

1. Configure S3 bucket notification to invoke Lambda
2. Lambda calls Pipe Audit API with file reference
3. Results written to DynamoDB
4. Valid files copied to output bucket
5. Invalid files moved to quarantine

---

## Pricing

AWS Marketplace pricing:

| Model | Price |
|-------|-------|
| Hourly | $X.XX/hour |
| Annual | $X,XXX/year |

Plus your AWS costs for S3, DynamoDB, and compute.

---

## Monitoring

### Health Check

```bash
GET /health
```

### Metrics

Prometheus metrics at `/metrics`:

- `pipe_audit_validations_total`
- `pipe_audit_validations_passed_total`
- `pipe_audit_validations_failed_total`
- `pipe_audit_quarantine_files_total`

---

## Related

- [Pipe Audit Overview](/docs/pipe-audit) — Product overview
- [Pipe Audit SaaS](/docs/pipe-audit/saas) — Managed service option
- [CLI Reference](/docs/pipe-audit/cli) — Command-line interface
