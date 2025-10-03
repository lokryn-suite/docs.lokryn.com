---
id: core-profiles
title: Profiles
sidebar_position: 3
slug: /core/profiles
---

# Profiles

Profiles define how Pipe Audit connects to different storage backends.  
They are declared in `profiles.toml` at the project root, and referenced by name in contracts.

---

## MinIO / S3-Compatible

[minio_raw]  
provider   = "s3"  
endpoint   = "http://developyr.local:9000"  
region     = "us-east-1"  
access_key = "$ \{ MINIO_ACCESS_KEY \}"  
secret_key = "$ \{ MINIO_SECRET_KEY \}"  
path_style = true  
use_ssl    = false  

**Notes**  
- `endpoint` points to your MinIO or S3-compatible service.  
- `region` is required even for MinIO.  
- `access_key` and `secret_key` are injected from environment variables.  
- `path_style = true` is recommended for MinIO/localstack.  
- `use_ssl` toggles HTTPS.  

---

## Azure Blob Storage

[azure_test]  
provider = "azure"  
connection_string = "$ \{ AZURE_STORAGE_CONNECTION_STRING \}"  

**Notes**  
- `connection_string` is pulled from the environment.  
- This is the simplest way to authenticate against Azure Blob Storage. This is set to use the account key connection string.   

---

## Google Cloud Storage

[gcs_test]  
provider = "gcs"  
service_account_json = "$ \{ GCP_SERVICE_ACCOUNT_KEY \}"  

**Notes**  
- `service_account_json` should point to a service account key file, or inline JSON.  
- Typically set in `.env` as a path, e.g. `GCP_SERVICE_ACCOUNT_KEY=/path/to/key.json`.  

---

## Best Practices

- Always reference secrets with `$ \{VAR_NAME \}` so they can be injected from `.env`.  
- Use `pipa profile list` to see available profiles.  
- Use `pipa profile test \< PROFILE_NAME \>` to verify connectivity.  
- Contracts reference profiles by name, e.g. `profile = "minio_raw"`.  
