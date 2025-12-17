---
sidebar_position: 5
title: IAM Permissions
description: Required IAM permissions for DuckLake Container
---

# IAM Permissions

DuckLake Container requires specific IAM permissions to read/write data to S3 and register with AWS Marketplace metering.

## Minimum Required Policy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "S3DataAccess",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::YOUR-BUCKET-NAME",
        "arn:aws:s3:::YOUR-BUCKET-NAME/*"
      ]
    },
    {
      "Sid": "MarketplaceMetering",
      "Effect": "Allow",
      "Action": [
        "aws-marketplace:RegisterUsage"
      ],
      "Resource": "*"
    }
  ]
}
```

Replace `YOUR-BUCKET-NAME` with your actual S3 bucket name.

## Optional: Secrets Manager Access

If using Secrets Manager for configuration, add:

```json
{
  "Sid": "SecretsManagerAccess",
  "Effect": "Allow",
  "Action": [
    "secretsmanager:GetSecretValue"
  ],
  "Resource": [
    "arn:aws:secretsmanager:*:*:secret:lokryn/ducklake/*"
  ]
}
```

## Complete Policy Example

Here's a complete policy combining all permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "S3DataAccess",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::your-lakehouse-bucket",
        "arn:aws:s3:::your-lakehouse-bucket/*"
      ]
    },
    {
      "Sid": "MarketplaceMetering",
      "Effect": "Allow",
      "Action": [
        "aws-marketplace:RegisterUsage"
      ],
      "Resource": "*"
    },
    {
      "Sid": "SecretsManagerAccess",
      "Effect": "Allow",
      "Action": [
        "secretsmanager:GetSecretValue"
      ],
      "Resource": [
        "arn:aws:secretsmanager:*:*:secret:lokryn/ducklake/*"
      ]
    }
  ]
}
```

## Creating the IAM Role

### Via AWS Console

1. Go to IAM > Roles > Create Role
2. Select "AWS Service" > "Elastic Container Service" > "Elastic Container Service Task"
3. Attach the policy above (create as a custom policy)
4. Name the role (e.g., `ducklake-task-role`)
5. Use this role ARN in your ECS task definition's `taskRoleArn`

### Via AWS CLI

```bash
# Create the trust policy
cat > trust-policy.json << 'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ecs-tasks.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF

# Create the role
aws iam create-role \
  --role-name ducklake-task-role \
  --assume-role-policy-document file://trust-policy.json

# Create the permissions policy
cat > ducklake-policy.json << 'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "S3DataAccess",
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:PutObject", "s3:DeleteObject", "s3:ListBucket"],
      "Resource": ["arn:aws:s3:::YOUR-BUCKET", "arn:aws:s3:::YOUR-BUCKET/*"]
    },
    {
      "Sid": "MarketplaceMetering",
      "Effect": "Allow",
      "Action": ["aws-marketplace:RegisterUsage"],
      "Resource": "*"
    }
  ]
}
EOF

# Attach the policy
aws iam put-role-policy \
  --role-name ducklake-task-role \
  --policy-name ducklake-permissions \
  --policy-document file://ducklake-policy.json
```

## S3 Bucket Configuration

Your S3 bucket should:

1. **Be private** - No public access required
2. **Be in the same region** as your ECS cluster for best performance
3. **Have versioning enabled** (recommended for data safety)

Example bucket policy (optional, for additional security):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyNonSecureTransport",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:*",
      "Resource": [
        "arn:aws:s3:::your-bucket",
        "arn:aws:s3:::your-bucket/*"
      ],
      "Condition": {
        "Bool": {
          "aws:SecureTransport": "false"
        }
      }
    }
  ]
}
```

## EKS with IRSA

If running on EKS, use IAM Roles for Service Accounts (IRSA):

1. Create an OIDC provider for your EKS cluster
2. Create the IAM role with a trust policy for your service account
3. Annotate your Kubernetes service account with the role ARN

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: ducklake
  annotations:
    eks.amazonaws.com/role-arn: arn:aws:iam::ACCOUNT:role/ducklake-task-role
```

## Verifying Permissions

After deployment, check the container logs for:

```
✓ Successfully registered with AWS Marketplace
✓ Connected to S3: s3://your-bucket/data/
```

If you see permission errors, verify:
1. The task role ARN is correctly specified in the task definition
2. The policy is attached to the role
3. The S3 bucket name in the policy matches your configuration