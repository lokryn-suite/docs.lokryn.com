---
id: postgres-cdc-events
title: Event Notifications
slug: /modules/postgres-cdc/events
sidebar_position: 6
---

# Event Notifications

Trigger downstream processing when CDC data arrives.

---

## Overview

Use **S3 Event Notifications** to trigger downstream processing when new data is written to S3 Tables. This is a native AWS feature that requires no application code.

Benefits:
- Guaranteed delivery for every object created
- Filter by prefix or suffix
- Fan-out to multiple destinations
- No additional infrastructure in the container

---

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ postgres-cdc│────▶│  S3 Tables  │────▶│  S3 Event   │────▶│   Lambda    │
│  Container  │     │  (Iceberg)  │     │ Notification│     │ Step Func.  │
└─────────────┘     └─────────────┘     └─────────────┘     │   SQS/SNS   │
                                                            └─────────────┘
```

---

## Configure S3 Event Notifications

### Console

1. Go to S3 → your bucket → Properties
2. Scroll to Event notifications → Create event notification
3. Configure:
   - Event types: `s3:ObjectCreated:*`
   - Destination: Lambda, SQS, or SNS

### Terraform

```hcl
resource "aws_s3_bucket_notification" "cdc_events" {
  bucket = aws_s3_bucket.cdc_bucket.id

  lambda_function {
    lambda_function_arn = aws_lambda_function.cdc_processor.arn
    events              = ["s3:ObjectCreated:*"]
  }
}

resource "aws_lambda_permission" "allow_s3" {
  statement_id  = "AllowS3Invoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.cdc_processor.function_name
  principal     = "s3.amazonaws.com"
  source_arn    = aws_s3_bucket.cdc_bucket.arn
}
```

### CloudFormation

```yaml
S3BucketNotification:
  Type: AWS::S3::BucketNotification
  Properties:
    Bucket: !Ref CDCBucket
    LambdaConfigurations:
      - Event: s3:ObjectCreated:*
        Function: !GetAtt CDCProcessorLambda.Arn
```

---

## Destinations

### Lambda

Directly invoke a Lambda function:

```python
import json

def handler(event, context):
    for record in event['Records']:
        bucket = record['s3']['bucket']['name']
        key = record['s3']['object']['key']
        
        # Process the new Iceberg data file
        process_cdc_file(bucket, key)
```

### SQS

Queue events for processing:

```python
import boto3
import json

sqs = boto3.client('sqs')

def process_cdc_queue():
    while True:
        response = sqs.receive_message(
            QueueUrl='https://sqs.us-east-2.amazonaws.com/123456789012/cdc-events',
            MaxNumberOfMessages=10,
            WaitTimeSeconds=20
        )
        
        for message in response.get('Messages', []):
            event = json.loads(message['Body'])
            for record in event['Records']:
                process_file(record['s3']['bucket']['name'], record['s3']['object']['key'])
            
            sqs.delete_message(
                QueueUrl='https://sqs.us-east-2.amazonaws.com/123456789012/cdc-events',
                ReceiptHandle=message['ReceiptHandle']
            )
```

### SNS

Fan-out to multiple subscribers:

```bash
# Create topic
aws sns create-topic --name cdc-events

# Subscribe Lambda
aws sns subscribe \
  --topic-arn arn:aws:sns:us-east-2:123456789012:cdc-events \
  --protocol lambda \
  --notification-endpoint arn:aws:lambda:us-east-2:123456789012:function:cdc-processor

# Subscribe SQS
aws sns subscribe \
  --topic-arn arn:aws:sns:us-east-2:123456789012:cdc-events \
  --protocol sqs \
  --notification-endpoint arn:aws:sqs:us-east-2:123456789012:cdc-queue
```

### EventBridge

For complex routing rules:

```hcl
resource "aws_s3_bucket_notification" "cdc_events" {
  bucket      = aws_s3_bucket.cdc_bucket.id
  eventbridge = true
}

resource "aws_cloudwatch_event_rule" "cdc_rule" {
  name = "cdc-events"
  
  event_pattern = jsonencode({
    source      = ["aws.s3"]
    detail-type = ["Object Created"]
    detail = {
      bucket = { name = [aws_s3_bucket.cdc_bucket.id] }
    }
  })
}

resource "aws_cloudwatch_event_target" "cdc_target" {
  rule = aws_cloudwatch_event_rule.cdc_rule.name
  arn  = aws_lambda_function.cdc_processor.arn
}
```

---

## Event Payload

S3 event notifications include:

```json
{
  "Records": [
    {
      "eventSource": "aws:s3",
      "eventTime": "2025-01-09T15:30:00.000Z",
      "eventName": "ObjectCreated:Put",
      "s3": {
        "bucket": {
          "name": "my-cdc-bucket",
          "arn": "arn:aws:s3:::my-cdc-bucket"
        },
        "object": {
          "key": "cdc/public_orders/data/00001-0-abc123.parquet",
          "size": 102400,
          "eTag": "abc123def456"
        }
      }
    }
  ]
}
```

---

## Use Cases

### Real-time analytics

Trigger a Lambda that updates a real-time dashboard:

```python
def handler(event, context):
    # Read new CDC data
    df = read_parquet_from_s3(event)
    
    # Update metrics
    update_dashboard_metrics(df)
```

### Data quality checks

Validate new data before downstream processing:

```python
def handler(event, context):
    df = read_parquet_from_s3(event)
    
    # Check for anomalies
    if df['amount'].max() > 1000000:
        send_alert("Unusually large order detected")
```

### Cross-region replication

Replicate CDC data to another region:

```python
def handler(event, context):
    for record in event['Records']:
        copy_to_region(
            source_bucket=record['s3']['bucket']['name'],
            source_key=record['s3']['object']['key'],
            target_region='eu-west-1'
        )
```

### Incremental ETL

Process only new data in your data warehouse:

```python
def handler(event, context):
    # Read new CDC records
    df = read_parquet_from_s3(event)
    
    # Merge into target table
    merge_into_warehouse(df, target_table='orders')
```

---

## Best Practices

1. **Use SQS for durability** — If your processor can fail, use SQS with a dead-letter queue
2. **Filter events** — Use prefix/suffix filters to reduce unnecessary invocations
3. **Batch processing** — For high-volume tables, aggregate events before processing
4. **Idempotency** — Design processors to handle duplicate events gracefully
