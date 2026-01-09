---
id: ducklake-troubleshooting
sidebar_position: 6
title: Troubleshooting
slug: /modules/ducklake/troubleshooting
description: Common issues and solutions for DuckLake Container
---

# Troubleshooting

Common issues and their solutions.

## Container Startup Issues

### "CustomerNotSubscribedException"

**Error:** `CustomerNotSubscribedException: Customer is not subscribed to this product`

**Cause:** The container is trying to register with AWS Marketplace, but your AWS account hasn't subscribed to the product.

**Solution:**
1. Go to the DuckLake listing on AWS Marketplace
2. Click "Continue to Subscribe"
3. Accept the terms
4. Wait for subscription to activate (usually instant)
5. Restart the container

### "PlatformNotSupportedException"

**Error:** `PlatformNotSupportedException: This platform is not supported`

**Cause:** You're running the Marketplace container outside of a supported AWS compute environment.

**Solution:** The Marketplace container must run on:
- Amazon ECS (EC2 or Fargate)
- Amazon EKS
- Amazon EC2

It cannot run on your local machine. For local development, build from the Dockerfile without Marketplace metering.

### "Missing required configuration"

**Error:** `Missing required configuration: POSTGRES_USER, S3_BUCKET_URL`

**Cause:** The container couldn't find configuration in Secrets Manager or environment variables.

**Solution:**
1. Verify your Secrets Manager secret exists at `lokryn/ducklake/config`
2. Verify the task role has `secretsmanager:GetSecretValue` permission
3. Or pass configuration via environment variables in your task definition

Check the logs for which method was attempted:

```
Attempting to load config from Secrets Manager...
  Secret not found or not accessible, falling back to environment variables
Attempting to load config from environment variables...
  Missing required configuration: S3_BUCKET_URL
```

## S3 Connection Issues

### "Access Denied" on S3

**Error:** `Access Denied` when container tries to access S3

**Solution:**
1. Verify the task role has S3 permissions (see [IAM Permissions](/docs/modules/ducklake/iam-permissions))
2. Check the bucket name in your policy matches exactly
3. Ensure the bucket is in the same region or cross-region access is allowed
4. Verify the S3 bucket URL format: `s3://bucket-name/path/`

### "NoSuchBucket"

**Error:** `The specified bucket does not exist`

**Solution:**
1. Verify the bucket name is correct (no typos)
2. Verify the bucket exists in the specified region
3. Check for trailing slashes in the bucket URL

## Database Connection Issues

### "Connection refused" from DuckDB client

**Possible causes:**
1. Container isn't running
2. Security group blocking port 5432
3. Wrong host/port in connection string

**Solution:**
1. Check ECS service status—is the task running?
2. Check security group allows inbound on 5432 from your IP/VPC
3. Verify you're using the correct service endpoint

### "Authentication failed"

**Error:** `password authentication failed for user "admin"`

**Solution:**
1. Verify the password in your connection string matches your configuration
2. Check for special characters that might need escaping
3. If using Secrets Manager, verify the secret values are correct

### "Database does not exist"

**Error:** `database "lakehouse" does not exist`

**Cause:** You're trying to connect before the init script has finished.

**Solution:** Wait for the container to fully initialize. Check logs for:
```
✓ DuckLake catalog initialized successfully
```

## Performance Issues

### Slow queries

**Possible causes:**
1. S3 bucket in different region than ECS cluster
2. Large scans without partition pruning
3. Insufficient task memory

**Solutions:**
1. Move S3 bucket to same region as compute
2. Add partitioning to frequently-queried tables
3. Increase task memory allocation

### Container keeps restarting

**Possible causes:**
1. Health check failing
2. Out of memory
3. Configuration error causing crash

**Solution:** Check CloudWatch logs for the specific error. Common fixes:
- Increase memory allocation
- Fix configuration issues
- Verify S3 and Secrets Manager access

## Getting Help

If you've tried the solutions above and still have issues:

1. **Check the logs** in CloudWatch for specific error messages
2. **Email support:** support@lokryn.com

When contacting support, include:
- The specific error message from logs
- Your AWS region
- Whether you're using ECS, EKS, or EC2
- Whether you're using Secrets Manager or environment variables
