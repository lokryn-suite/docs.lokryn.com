# Installation

## Prerequisites
- [Rust & Cargo](https://www.rust-lang.org/tools/install) (for building from source)
- Linux, macOS, or Windows

## Install via Cargo
```bash
cargo install lokryn-cli
lokryn --version

---

### `docs/cli/usage.md`
```md
# Usage

Run `lokryn` with a subcommand:

```bash
lokryn <command> [options]
lokryn init
lokryn validate --file pipeline.yaml
lokryn audit --export report.json

---

### `docs/cli/commands.md`
```md
# Commands

## `init`
Initialize a new Lokryn project.

## `validate`
Validate configuration or pipeline files.

Options:
- `--file <path>`: Path to the file to validate.

## `audit`
Generate an audit log or report.

Options:
- `--export <file>`: Save output to file.
