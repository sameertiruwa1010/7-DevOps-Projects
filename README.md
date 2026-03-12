<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&height=200&color=gradient&customColorList=0,2,2,5,30&fontColor=ffffff&text=7%20DevOps%20Projects&fontSize=48&fontAlign=50&fontAlignY=38&desc=Production-grade%20DevOps%20systems%20built%20from%20scratch&descAlign=50&descAlignY=60&descSize=15&animation=fadeIn" width="100%"/>

<br/>

![GitHub Stars](https://img.shields.io/github/stars/sameertiruwa1010/7-devops-projects?style=flat-square&color=0d1117&labelColor=2F81F7&label=Stars)
![GitHub Forks](https://img.shields.io/github/forks/sameertiruwa1010/7-devops-projects?style=flat-square&color=0d1117&labelColor=58A6FF&label=Forks)
![GitHub Issues](https://img.shields.io/github/issues/sameertiruwa1010/7-devops-projects?style=flat-square&color=0d1117&labelColor=FF6B6B&label=Issues)
![License](https://img.shields.io/badge/License-MIT-2F81F7?style=flat-square&labelColor=0d1117)
![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-58A6FF?style=flat-square&labelColor=0d1117)

<br/>

> **A hands-on DevOps engineering lab** — 7 real-world projects covering the complete software delivery lifecycle.
> Built to simulate production environments, not just tutorials.

<br/>

[![CI/CD](https://img.shields.io/badge/CI/CD-GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)](#)
[![Containers](https://img.shields.io/badge/Containers-Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](#)
[![Orchestration](https://img.shields.io/badge/Orchestration-Kubernetes-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white)](#)
[![IaC](https://img.shields.io/badge/IaC-Terraform-7B42BC?style=for-the-badge&logo=terraform&logoColor=white)](#)
[![Monitoring](https://img.shields.io/badge/Monitoring-Prometheus_·_Grafana-E6522C?style=for-the-badge&logo=prometheus&logoColor=white)](#)
[![Logging](https://img.shields.io/badge/Logging-ELK_Stack-005571?style=for-the-badge&logo=elastic&logoColor=white)](#)

</div>

<br/>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Projects](#-projects)
  - [01 — CI/CD Pipeline](#1--cicd-pipeline)
  - [02 — Infrastructure as Code](#2--infrastructure-as-code)
  - [03 — Kubernetes Microservices](#3--kubernetes-microservices)
  - [04 — Monitoring & Observability](#4--monitoring--observability)
  - [05 — DevOps Automation CLI](#5--devops-automation-cli)
  - [06 — Centralized Logging System](#6--centralized-logging-system)
  - [07 — Automated Deployment Platform](#7--automated-deployment-platform)
- [Tech Stack](#-tech-stack)
- [Repository Structure](#-repository-structure)
- [Getting Started](#-getting-started)
- [Author](#-author)

---

## 🎯 Overview

Modern DevOps engineers are expected to own the **entire software delivery lifecycle** — from writing infrastructure code to keeping production systems observable and reliable.

This repository demonstrates that ownership through **7 complete, production-style implementations**:

```
CI/CD  →  IaC  →  Kubernetes  →  Monitoring  →  Automation  →  Logging  →  Deployment
```

Each project is self-contained, documented, and built using tools actively used in the industry today. This is not a tutorial repo — it is a **working DevOps engineering portfolio**.

---

## 📦 Projects

### 1 · CI/CD Pipeline

> **Automate everything from code commit to container deployment.**

A complete end-to-end pipeline that automatically runs tests, builds container images, and deploys to Kubernetes on every push. Designed to mirror pipelines found in production engineering teams.

**Pipeline stages:**
```
Code Push → Lint & Test → Build Docker Image → Push to Registry → Deploy to Kubernetes → Health Check
```

| Component | Tool |
|:---|:---|
| Pipeline orchestration | GitHub Actions |
| Containerization | Docker |
| Deployment target | Kubernetes |

**Key concepts:** multi-stage pipelines, environment-specific deployments, rollback strategies, image tagging conventions.

---

### 2 · Infrastructure as Code

> **Provision cloud infrastructure reproducibly — no clicking, no drift.**

Cloud infrastructure provisioned entirely through Terraform. Defines the network, compute, security, and load balancing layers as versioned, reusable code.

**Infrastructure components:**

| Resource | Purpose |
|:---|:---|
| Virtual Network (VPC) | Isolated cloud network with public/private subnets |
| Compute Instances | Application servers with auto-scaling |
| Security Groups | Least-privilege firewall rules |
| Load Balancer | Traffic distribution across instances |

**Key concepts:** remote state management, modular Terraform design, resource dependencies, infrastructure versioning.

---

### 3 · Kubernetes Microservices

> **Deploy distributed services the cloud-native way.**

A microservices application broken into independent, containerized services — each deployed, scaled, and managed separately by Kubernetes.

**Services architecture:**

```
                    ┌─────────────────────────────────────┐
                    │          Kubernetes Cluster          │
                    │                                      │
  Ingress  ──────►  │  [User Service]   [Order Service]   │
                    │         ↕                ↕           │
                    │         └── [Payment Service] ──┘   │
                    └─────────────────────────────────────┘
```

**Key concepts:** Deployments, Services, ConfigMaps, Secrets, Ingress controllers, horizontal pod autoscaling, health probes.

---

### 4 · Monitoring & Observability

> **If you can't measure it, you can't manage it.**

A full observability stack that monitors both infrastructure and application-level metrics, visualizes system health in real time, and alerts on anomalies before users notice.

**Observability pillars implemented:**

| Pillar | Implementation |
|:---|:---|
| **Metrics** | Prometheus scraping app and node exporters |
| **Visualization** | Grafana dashboards for CPU, memory, request rate, error rate |
| **Alerting** | Alertmanager rules with notification routing |
| **Dashboards** | Infrastructure overview + per-service panels |

**Key concepts:** PromQL queries, alert thresholds, dashboard-as-code, exporter patterns, RED method metrics.

---

### 5 · DevOps Automation CLI

> **Automate the repetitive. Focus on the important.**

A custom command-line tool that wraps common DevOps workflows into simple, repeatable commands. Reduces human error on deployment and operational tasks.

**Supported operations:**
- Application deployment across environments
- Build pipeline triggering and status monitoring
- Service health checks and restart workflows
- Environment diff and rollback utilities

**Key concepts:** CLI design, subprocess orchestration, config-driven automation, idempotency.

---

### 6 · Centralized Logging System

> **Aggregate logs from everywhere. Find answers fast.**

A distributed log aggregation pipeline built on the ELK stack. Collects logs from multiple services, parses and enriches them, and surfaces them in a searchable dashboard.

**Log pipeline architecture:**

```
App Containers
      │
      ▼
  Logstash ──── parse, filter, enrich
      │
      ▼
Elasticsearch ── index and store
      │
      ▼
   Kibana ────── search, visualize, alert
```

**Key concepts:** log parsing pipelines, index templates, Kibana dashboards, log retention policies, structured logging.

---

### 7 · Automated Deployment Platform

> **From code push to live container — fully automated.**

A lightweight internal deployment platform that watches for code changes, builds container images automatically, and deploys updated workloads to Kubernetes without manual intervention.

**Deployment workflow:**

```
Developer Push
      │
      ▼
  Image Build ──── Docker multi-stage build
      │
      ▼
Registry Push ──── Tagged with commit SHA
      │
      ▼
 K8s Rollout ───── Rolling update, zero downtime
      │
      ▼
Health Check ───── Readiness probe validation
```

**Key concepts:** GitOps principles, image tagging strategies, Kubernetes rolling updates, deployment automation.

---

## 🛠 Tech Stack

<div align="center">

| Category | Technologies |
|:---|:---|
| **Containerization** | Docker, Docker Compose |
| **Orchestration** | Kubernetes (kubectl, Helm) |
| **Infrastructure as Code** | Terraform |
| **Configuration Management** | Ansible |
| **CI/CD** | GitHub Actions, Jenkins |
| **Monitoring** | Prometheus, Grafana, Alertmanager |
| **Logging** | Elasticsearch, Logstash, Kibana (ELK) |
| **Scripting & Automation** | Python, Bash |
| **Web Server / Proxy** | Nginx |

</div>

<div align="center">

<br/>

[![Docker](https://skillicons.dev/icons?i=docker)](https://docker.com)
[![Kubernetes](https://skillicons.dev/icons?i=kubernetes)](https://kubernetes.io)
[![Terraform](https://skillicons.dev/icons?i=terraform)](https://terraform.io)
[![Ansible](https://skillicons.dev/icons?i=ansible)](https://ansible.com)
[![GitHub Actions](https://skillicons.dev/icons?i=githubactions)](https://github.com/features/actions)
[![Jenkins](https://skillicons.dev/icons?i=jenkins)](https://jenkins.io)
[![Grafana](https://skillicons.dev/icons?i=grafana)](https://grafana.com)
[![Prometheus](https://skillicons.dev/icons?i=prometheus)](https://prometheus.io)
[![Python](https://skillicons.dev/icons?i=python)](https://python.org)
[![Bash](https://skillicons.dev/icons?i=bash)](https://gnu.org/software/bash)
[![Nginx](https://skillicons.dev/icons?i=nginx)](https://nginx.org)
[![Linux](https://skillicons.dev/icons?i=linux)](https://kernel.org)

</div>

---

## 📂 Repository Structure

```
7-DevOps-Projects/
│
├── 01-ci-cd-pipeline/
│   ├── .github/workflows/        # GitHub Actions pipeline definitions
│   ├── Dockerfile
│   ├── k8s/                      # Kubernetes manifests
│   └── README.md
│
├── 02-terraform-infrastructure/
│   ├── modules/                  # Reusable Terraform modules
│   ├── environments/             # Dev / staging / prod configs
│   ├── main.tf
│   ├── variables.tf
│   └── README.md
│
├── 03-kubernetes-microservices/
│   ├── services/                 # User, order, payment service code
│   ├── k8s/                      # Deployments, services, ingress
│   ├── helm/                     # Helm charts
│   └── README.md
│
├── 04-monitoring-observability/
│   ├── prometheus/               # Scrape configs, alert rules
│   ├── grafana/                  # Dashboard JSONs
│   ├── alertmanager/             # Alert routing config
│   └── README.md
│
├── 05-devops-automation-cli/
│   ├── cli/                      # CLI source code (Python)
│   ├── commands/                 # deploy, build, monitor, rollback
│   ├── config/
│   └── README.md
│
├── 06-centralized-logging/
│   ├── logstash/                 # Pipeline configs
│   ├── elasticsearch/            # Index templates
│   ├── kibana/                   # Dashboard exports
│   └── README.md
│
└── 07-auto-deployment-platform/
    ├── builder/                  # Image build scripts
    ├── deployer/                 # K8s rollout automation
    ├── watcher/                  # Git webhook listener
    └── README.md
```

Each project directory contains:

- ✅ Full implementation code
- ✅ Configuration files (YAML, HCL, JSON)
- ✅ Architecture documentation
- ✅ Step-by-step setup instructions

---

## 🚀 Getting Started

### Prerequisites

Ensure the following are installed on your system:

```bash
# Verify installations
docker --version          # Docker 24.x+
kubectl version           # Kubernetes 1.28+
terraform --version       # Terraform 1.6+
python3 --version         # Python 3.10+
```

### Clone the Repository

```bash
git clone https://github.com/sameertiruwa1010/7-DevOps-Projects.git
cd 7-DevOps-Projects
```

### Run a Specific Project

Each project has its own `README.md` with detailed setup steps. Navigate to any project directory to get started:

```bash
cd 01-ci-cd-pipeline
cat README.md
```

---

## 💡 Design Principles

These projects were built following the same principles expected in real engineering environments:

- **Infrastructure as Code** — Nothing is provisioned manually
- **Idempotency** — Every script and config can be safely re-run
- **Separation of concerns** — Each service/component owns its own config
- **Observability-first** — Metrics, logs, and alerts are not afterthoughts
- **Documentation** — Every project is documented as if a new engineer is onboarding

---

## 👨‍💻 Author

<div align="center">

**Sameer Tiruwa** — DevOps Engineer · Kathmandu, Nepal 🇳🇵

[![Portfolio](https://img.shields.io/badge/Portfolio-sameertiruwa.online-0d1117?style=for-the-badge&logo=vercel&logoColor=white)](https://sameertiruwa.online)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/sameer-tiruwa-8149b3228/)
[![GitHub](https://img.shields.io/badge/GitHub-sameertiruwa1010-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/sameertiruwa1010)
[![Email](https://img.shields.io/badge/Email-hi@sameertiruwa.com-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:hi@sameertiruwa.com)

</div>

---

## 📌 Disclaimer

These projects are built for **portfolio and learning purposes** but intentionally follow patterns, conventions, and architecture decisions used in real production DevOps environments. The goal is not just to make things work — but to make them work the way they would in a real engineering team.

---

<div align="center">

**If this repository helped you, consider giving it a ⭐**

<img src="https://capsule-render.vercel.app/api?type=waving&height=120&color=gradient&customColorList=0,2,2,5,30&section=footer" width="100%"/>

<sub>Built with 🔧 by <a href="https://sameertiruwa.online">Sameer Tiruwa</a> · Kathmandu, Nepal 🇳🇵</sub>

</div>
