# Configuration

The CLI reads configuration from:

1. Environment variables (`LOKRYN_*`)
2. A `.lokryn/config.toml` file in your project
3. Command‑line flags

Example `config.toml`:
```toml
[auth]
token = "your-api-token"

[logging]
level = "info"
