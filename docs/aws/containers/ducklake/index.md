---
id: ducklake-index
title: DuckLake Container Overview
slug: /ducklake
sidebar_position: 0
---

# DuckLake Container

A data lakehouse in a box. Spin up a fully functional lakehouse on S3 in 5 minutes.

---

## Why DuckLake?

DuckLake Container gives you lakehouse capabilities without the typical infrastructure overhead:

- **PostgreSQL 17** stores your catalog (table schemas, snapshots, partitions)
- **S3** stores your data as Parquet files
- **DuckDB** provides the query engine

You connect from any DuckDB client—Python, Go, or any SQL tool—and start querying.

---

## How It Works

1. **Deploy DuckLake** as a container in your environment (ECS/Fargate).
2. **Connect** using any DuckDB client.
3. **Query and Analyze** your data directly on S3 with ACID transactions.

---

## Features

| Feature | Description |
| :--- | :--- |
| **ACID transactions** | Safe concurrent writes and reads on S3 |
| **Time travel queries** | Query data as of any snapshot |
| **Schema evolution** | Add columns without rewriting data |
| **Partition pruning** | Fast queries on large datasets |
| **Multi-client support** | Multiple connections to the same catalog |

---

## Pricing

**$0.05 per hour**, billed per second.

| Usage | Monthly Pricing |
| :--- | :--- |
| 4 hours/day | ~$6/month |
| 8 hours/day | ~$12/month |
| 24/7 | ~$36/month |

Plus standard AWS costs for compute (ECS/Fargate), S3 storage, and data transfer.

---

## Support

For support, please join our [Discord community](https://discord.gg/4JJT9qEfCA).

---

## Next Steps

- [Getting Started](/docs/aws/containers/ducklake/getting-started) - Deploy in 5 minutes
- [Configuration](/docs/aws/containers/ducklake/configuration) - Environment variables and Secrets Manager
- [Connecting](/docs/aws/containers/ducklake/connecting) - Connect from Python, Go, and SQL tools
