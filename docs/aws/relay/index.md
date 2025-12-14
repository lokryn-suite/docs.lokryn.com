---
id: relay-index
title: Relay Overview
slug: /relay
sidebar_position: 0
---

# Relay

Relay is a lightweight Docker container designed to act like an IoT device inside your infrastructure.  
It enables secure, reliable communication with your fleet of services and applications running behind private networks.

---

## Why Relay?

Modern architectures often need to coordinate workloads across multiple environments, but exposing internal systems directly to the internet introduces risk. Relay solves this by:

- **IoT-style design** — Each container behaves like a managed device, easy to deploy and control.  
- **Fleet communication** — Send and receive events across your distributed services without punching holes in your firewall.  
- **Secure by default** — Operates inside your VPC or private network, using authenticated channels.  
- **Lightweight footprint** — Minimal overhead, deployable in seconds.  

---

## How It Works

1. **Deploy Relay** as a Docker container inside your secure environment.  
2. **Register Relay** with your fleet controller or orchestration layer.  
3. **Send/Receive Events** through authenticated channels (MQTT).  
4. **Scale Out** by running multiple Relay containers across your fleet.  

---

## Use Cases

- **Event Distribution**  
  Broadcast messages across services without exposing internal endpoints.  

- **Secure Fleet Management**  
  Treat each container as a node in your network, with controlled communication paths.  

- **Hybrid Environments**  
  Relay between on‑prem systems and cloud workloads without compromising security.  

- **Compliance‑Ready Messaging**  
  Keep communication inside your VPC for audit and regulatory requirements.  

---

## Features

| Feature              | Description                                                   |
|----------------------|---------------------------------------------------------------|
| IoT-style container  | Each Relay instance acts like a managed device                |
| Secure channels      | Authenticated communication via MQTT                  |
| Fleet orchestration  | Register and coordinate multiple Relay containers             |
| Lightweight deploy   | Minimal Docker image, fast startup                            |
| Private networking   | Runs entirely inside your secure environment                  |

---

Relay makes distributed communication simple, secure, and auditable — treating containers as devices in a fleet rather than just workloads.
