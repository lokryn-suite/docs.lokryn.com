---
sidebar_position: 4
title: Connecting
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
pip install duckdb
```

Connect and query:

```python
import duckdb

# Create a connection
conn = duckdb.connect()

# Install and load the ducklake extension
conn.execute("INSTALL ducklake; LOAD ducklake;")

# Attach your lakehouse
conn.execute("""
    ATTACH 'ducklake:postgres:host=your-ecs-host.amazonaws.com 
    port=5432 user=admin password=your-password dbname=lakehouse' AS lake
""")

# Create a table
conn.execute("""
    CREATE TABLE lake.customers (
        id INTEGER,
        name VARCHAR,
        email VARCHAR,
        created_at TIMESTAMP
    )
""")

# Insert data
conn.execute("""
    INSERT INTO lake.customers VALUES 
    (1, 'Alice', 'alice@example.com', now()),
    (2, 'Bob', 'bob@example.com', now())
""")

# Query
results = conn.execute("SELECT * FROM lake.customers").fetchall()
for row in results:
    print(row)

# Time travel - query a previous snapshot
snapshots = conn.execute("SELECT * FROM ducklake_snapshots('lake')").fetchall()
print(f"Available snapshots: {snapshots}")
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

    // Install and load extension
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

## DataGrip / DBeaver

DuckDB doesn't have a native JDBC driver for these tools, but you can:

1. Use the DuckDB CLI to connect
2. Use a Python script with your IDE
3. Query via a Jupyter notebook

## DuckDB CLI

If you have the DuckDB CLI installed:

```bash
duckdb
```

Then in the CLI:

```sql
INSTALL ducklake;
LOAD ducklake;

ATTACH 'ducklake:postgres:host=your-ecs-host.amazonaws.com port=5432 user=admin password=your-password dbname=lakehouse' AS lake;

SELECT * FROM lake.customers;
```

## Jupyter Notebook

```python
import duckdb

conn = duckdb.connect()
conn.execute("INSTALL ducklake; LOAD ducklake;")
conn.execute("""
    ATTACH 'ducklake:postgres:host=your-ecs-host.amazonaws.com 
    port=5432 user=admin password=your-password dbname=lakehouse' AS lake
""")

# Use magic commands if using jupysql
%load_ext sql
%sql conn --alias lake

# Or use pandas integration
df = conn.execute("SELECT * FROM lake.customers").fetchdf()
df.head()
```

## Connection Pooling

For applications with multiple concurrent queries, create a connection pool:

```python
from queue import Queue
import duckdb

class DuckLakePool:
    def __init__(self, connection_string, size=5):
        self.pool = Queue(maxsize=size)
        for _ in range(size):
            conn = duckdb.connect()
            conn.execute("INSTALL ducklake; LOAD ducklake;")
            conn.execute(f"ATTACH '{connection_string}' AS lake")
            self.pool.put(conn)
    
    def get_connection(self):
        return self.pool.get()
    
    def return_connection(self, conn):
        self.pool.put(conn)

# Usage
pool = DuckLakePool("ducklake:postgres:host=... user=... password=... dbname=...")
conn = pool.get_connection()
try:
    result = conn.execute("SELECT * FROM lake.customers").fetchall()
finally:
    pool.return_connection(conn)
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

See [Troubleshooting](/docs/aws/containers/ducklake/troubleshooting) for more solutions.