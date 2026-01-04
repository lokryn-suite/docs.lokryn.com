---
sidebar_position: 5
title: IAM Permissions
description: Required IAM permissions for DuckLake Container
---

# IAM Permissions

DuckLake Container requires specific IAM permissions for logging, S3 data access, configuration, and AWS Marketplace metering.

## Complete Working Policy

This policy has been tested and verified to work with DuckLake Container on ECS/Fargate:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents",
                "logs:DescribeLogStreams",
                "secretsmanager:ListSecretVersionIds",
                "secretsmanager:GetResourcePolicy",
                "secretsmanager:BatchGetSecretValue",
                "secretsmanager:ListSecrets"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "logs:DescribeLogGroups"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:GetObject",
                "s3:GetObjectVersion",
                "s3:PutObject",
                "s3:PutObjectAcl",
                "s3:DeleteObject"
            ],
            "Resource": [
                "arn:aws:s3:::lokryn-aws-marketplace-testing/*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:ListBucket",
                "s3:GetBucketLocation"
            ],
            "Resource": [
                "arn:aws:s3:::lokryn-aws-marketplace-testing"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "secretsmanager:GetSecretValue",
                "secretsmanager:DescribeSecret"
            ],
            "Resource": [
                "arn:aws:secretsmanager:*:*:secret:secret:lokryn/ducklake/config*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "ecr:GetAuthorizationToken"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "ecr:BatchCheckLayerAvailability",
                "ecr:GetDownloadUrlForLayer",
                "ecr:BatchGetImage"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "aws-marketplace:RegisterUsage",
                "aws-marketplace:MeterUsage"
            ],
            "Resource": "*"
        }
    ]
}
```

Replace `YOUR-BUCKET-NAME` with your actual S3 bucket name.

## Permission Breakdown

| Permission Group | Purpose |
|-----------------|---------|
| CloudWatch Logs | Container logging to CloudWatch |
| S3 Object Access | Read/write Parquet data files |
| S3 Bucket Access | List bucket contents, get bucket location |
| Secrets Manager | Load configuration from Secrets Manager |
| ECR | Pull container image from registry |
| Marketplace | Hourly usage metering and billing |


## Trust Relationship

The IAM role must trust ECS tasks. Use this trust policy:

```json
{
    "Version": "2008-10-17",
    "Statement": [
        {
            "Sid": "",
            "Effect": "Allow",
            "Principal": {
                "Service": "ecs-tasks.amazonaws.com"
            },
            "Action": "sts:AssumeRole"
        }
    ]
}
```

## Creating the IAM Role

### Via AWS Console

1. Go to **IAM > Roles > Create Role**
2. Select **AWS Service** > **Elastic Container Service** > **Elastic Container Service Task**
3. Click **Next**, then **Create policy**
4. Paste the complete policy JSON above
5. Name the policy (e.g., `ducklake-task-policy`)
6. Attach this policy to the role
7. Name the role (e.g., `ducklake-task-role`)
8. Use this role ARN in your ECS task definition's `taskRoleArn`


## S3 Bucket Configuration

Your S3 bucket should:

1. **Be private** - No public access required
2. **Be in the same region** as your ECS cluster for best performance
3. **Have versioning enabled** (recommended for data safety)


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
✓ Configuration loaded from Secrets Manager
✓ AWS Marketplace registration successful
✓ S3 write test passed: your-bucket/data/.keep
✓ DuckLake catalog configured
```

If you see permission errors, verify:

1. The task role ARN is correctly specified in the task definition
2. The policy is attached to the role
3. The S3 bucket name in the policy matches your configuration
4. The Secrets Manager secret name matches `lokryn/ducklake/config`