---
id: ducklake-connecting
sidebar_position: 4
title: Connecting
slug: /modules/ducklake/connecting
description: Connect to DuckLake from Python, Go, and SQL tools
---

# Connecting to DuckLake

Once your DuckLake container is running, you can connect from any DuckDB client.

## Connection String Format

All connections use the DuckLake PostgreSQL connection string:

```
ducklake:postgres:host=YOUR_HOST port=5432 user=USER password=PASSWORD dbname=DATABASE
```

Replace:
- `YOUR_HOST` with your ECS service endpoint or `localhost` for local development
- `USER` with your `POSTGRES_USER` value
- `PASSWORD` with your `POSTGRES_PASSWORD` value
- `DATABASE` with your `POSTGRES_DB` value

## Python

Install the DuckDB package:

```bash
pip install duckdb boto3
```

Connect and query:

```python
import duckdb

# Create a connection
conn = duckdb.connect()

# Install and load extensions
conn.execute("INSTALL ducklake; LOAD ducklake;")
conn.execute("INSTALL postgres; LOAD postgres;")
conn.execute("INSTALL httpfs; LOAD httpfs;")

# Create S3 credentials (required for data access)
conn.execute("""
    CREATE SECRET ducklake_s3 (
        TYPE s3,
        KEY_ID 'your-access-key',
        SECRET 'your-secret-key',
        REGION 'us-east-1'
    );
""")

# Attach your lakehouse
conn.execute("""
    ATTACH 'ducklake:postgres:host=your-ecs-host.amazonaws.com 
    port=5432 user=admin password=your-password dbname=lakehouse' AS lake
""")

conn.execute("USE lake;")

# Create a table
conn.execute("""
    CREATE TABLE customers (
        id INTEGER,
        name VARCHAR,
        email VARCHAR,
        created_at TIMESTAMP
    )
""")

# Insert data
conn.execute("""
    INSERT INTO customers VALUES 
    (1, 'Alice', 'alice@example.com', now()),
    (2, 'Bob', 'bob@example.com', now())
""")

# Query
results = conn.execute("SELECT * FROM customers").fetchall()
for row in results:
    print(row)
```

## Go

Install the DuckDB Go driver:

```bash
go get github.com/marcboeker/go-duckdb
```

Connect and query:

```go
package main

import (
    "database/sql"
    "fmt"
    "log"

    _ "github.com/marcboeker/go-duckdb"
)

func main() {
    db, err := sql.Open("duckdb", "")
    if err != nil {
        log.Fatal(err)
    }
    defer db.Close()

    // Install and load extensions
    _, err = db.Exec("INSTALL ducklake; LOAD ducklake;")
    if err != nil {
        log.Fatal(err)
    }

    // Attach lakehouse
    _, err = db.Exec(`
        ATTACH 'ducklake:postgres:host=your-ecs-host.amazonaws.com 
        port=5432 user=admin password=your-password dbname=lakehouse' AS lake
    `)
    if err != nil {
        log.Fatal(err)
    }

    // Query
    rows, err := db.Query("SELECT * FROM lake.customers")
    if err != nil {
        log.Fatal(err)
    }
    defer rows.Close()

    for rows.Next() {
        var id int
        var name, email string
        rows.Scan(&id, &name, &email)
        fmt.Printf("%d: %s (%s)\n", id, name, email)
    }
}
```

## DuckDB CLI

If you have the DuckDB CLI installed:

```bash
duckdb
```

Then in the CLI:

```sql
INSTALL ducklake;
LOAD ducklake;
INSTALL postgres;
LOAD postgres;
INSTALL httpfs;
LOAD httpfs;

-- Create S3 secret
CREATE SECRET ducklake_s3 (
    TYPE s3,
    KEY_ID 'your-access-key',
    SECRET 'your-secret-key',
    REGION 'us-east-1'
);

ATTACH 'ducklake:postgres:host=your-ecs-host.amazonaws.com port=5432 user=admin password=your-password dbname=lakehouse' AS lake;

USE lake;

SELECT * FROM customers;
```

## Jupyter Notebook

```python
import duckdb

conn = duckdb.connect()
conn.execute("INSTALL ducklake; LOAD ducklake;")
conn.execute("INSTALL postgres; LOAD postgres;")
conn.execute("INSTALL httpfs; LOAD httpfs;")

# Set up S3 credentials
conn.execute("""
    CREATE SECRET ducklake_s3 (
        TYPE s3,
        KEY_ID 'your-access-key',
        SECRET 'your-secret-key',
        REGION 'us-east-1'
    );
""")

conn.execute("""
    ATTACH 'ducklake:postgres:host=your-ecs-host.amazonaws.com 
    port=5432 user=admin password=your-password dbname=lakehouse' AS lake
""")

# Use pandas integration
df = conn.execute("SELECT * FROM lake.customers").fetchdf()
df.head()
```

## Troubleshooting Connections

**"Connection refused"**
- Verify the container is running
- Check security group allows port 5432
- Confirm the host/port are correct

**"Authentication failed"**
- Verify username/password match your configuration
- Check for typos in the connection string

**"Extension not found"**
- Run `INSTALL ducklake` before `LOAD ducklake`
- Ensure your DuckDB version is 1.0 or higher

**"S3 access denied"**
- Verify S3 credentials are created before attaching
- Check the IAM permissions on your credentials

See [Troubleshooting](/docs/modules/ducklake/troubleshooting) for more solutions.
