# Taskboard — Professional Task Manager

A production-ready full-stack task management application built with Node.js, React, MongoDB, Docker, and Kubernetes.

## ✨ Features:

- **CRUD Tasks** — Create, read, update, delete with validation
- **Priorities** — Low / Medium / High with visual indicators
- **Categories** — General, Work, Personal, Shopping, Health
- **Due Dates** — With overdue detection and warnings
- **Tags** — Up to 10 tags per task
- **Smart Filtering** — Filter by status, priority, category, or free-text search
- **Stats Dashboard** — Live completion rate and task counts
- **Optimistic Updates** — Instant UI feedback with rollback on error
- **Responsive** — Mobile-first design
- **Dark Mode UI** — Clean dark theme with polished design system

## 🏗 Tech Stack

| Layer      | Technology              |
|------------|-------------------------|
| Frontend   | React 18, TypeScript    |
| Backend    | Node.js, Express        |
| Database   | MongoDB + Mongoose      |
| Containers | Docker, Docker Compose  |
| Orchestration | Kubernetes (Minikube) |
| CI/CD      | GitHub Actions          |

---

## 🚀 Quick Start

### Option 1: Local Development (no Docker)

**Prerequisites:** Node.js 18+, MongoDB running locally

```bash
# 1. MongoDB (via Docker)
docker run -d -p 27017:27017 --name mongo mongo:7.0

# 2. Backend
cd backend
npm install
npm run dev     # runs on http://localhost:5000

# 3. Frontend (new terminal)
cd frontend
npm install
npm start       # runs on http://localhost:3000
```

### Option 2: Docker Compose (recommended)

```bash
# Build & start all services
docker-compose up --build

# In background
docker-compose up -d --build

# View logs
docker-compose logs -f backend

# Stop
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

Visit **http://localhost:3000**

### Option 3: Kubernetes (Minikube)

```bash
# Start Minikube
minikube start

# Point Docker to Minikube's daemon
eval $(minikube docker-env)

# Build images inside Minikube
docker build -t task-manager-backend:latest ./backend
docker build -t task-manager-frontend:latest ./frontend

# Deploy
kubectl apply -f k8s/

# Wait for pods
kubectl rollout status deployment/backend -n taskboard
kubectl rollout status deployment/frontend -n taskboard

# Open in browser
minikube service frontend-service -n taskboard --url

# Check status
kubectl get all -n taskboard
```

---

## 🌐 API Reference

Base URL: `http://localhost:5000/api`

| Method | Endpoint              | Description              |
|--------|-----------------------|--------------------------|
| GET    | `/health`             | Health check             |
| GET    | `/tasks`              | List tasks (with filters)|
| GET    | `/tasks/stats`        | Task statistics          |
| GET    | `/tasks/:id`          | Get single task          |
| POST   | `/tasks`              | Create task              |
| PUT    | `/tasks/:id`          | Update task              |
| PATCH  | `/tasks/:id/toggle`   | Toggle completed         |
| DELETE | `/tasks/:id`          | Delete task              |
| DELETE | `/tasks/completed`    | Delete all completed     |

### Query Parameters (GET /tasks)
- `completed` — `true` / `false`
- `priority` — `low` / `medium` / `high`
- `category` — `general` / `work` / `personal` / `shopping` / `health`
- `search` — text search on title/description
- `sortBy` — `createdAt` / `updatedAt` / `title` / `priority` / `dueDate`
- `sortOrder` — `asc` / `desc`
- `page` — page number (default: 1)
- `limit` — per page (default: 50, max: 100)

### Create Task Body
```json
{
  "title": "Finish project",
  "description": "Complete the final report",
  "priority": "high",
  "category": "work",
  "dueDate": "2025-12-31",
  "tags": ["urgent", "report"]
}
```

---

## 📁 Project Structure

```
task-manager/
├── backend/
│   ├── controllers/      # Route handlers
│   ├── middleware/        # Error handling, validation
│   ├── models/            # Mongoose schemas
│   ├── routes/            # Express routers
│   ├── utils/             # Logger
│   ├── server.js          # Entry point
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom hooks
│   │   ├── services/      # API client
│   │   ├── styles/        # Global CSS
│   │   └── types/         # TypeScript types
│   ├── public/
│   ├── nginx.conf
│   └── Dockerfile
├── k8s/                   # Kubernetes manifests
├── .github/workflows/     # CI/CD pipeline
└── docker-compose.yml
```

---

## ⚙️ Environment Variables

### Backend
| Variable      | Default                                  | Description          |
|---------------|------------------------------------------|----------------------|
| `NODE_ENV`    | `development`                            | Environment          |
| `PORT`        | `5000`                                   | Server port          |
| `MONGO_URI`   | `mongodb://localhost:27017/taskmanager`  | MongoDB connection   |
| `FRONTEND_URL`| `http://localhost:3000`                  | CORS allowed origin  |
| `LOG_LEVEL`   | `info`                                   | Winston log level    |

### Frontend
| Variable             | Default                       |
|----------------------|-------------------------------|
| `REACT_APP_API_URL`  | `http://localhost:5000/api`   |

---

## 🔒 Security Features

- Helmet.js security headers
- CORS restricted to configured origin
- Rate limiting (200 req / 15 min)
- Input validation with express-validator
- MongoDB query sanitization via Mongoose
- Non-root Docker user
- Read-only container filesystem flag

---

## 🧪 Testing the API

```bash
# Health check
curl http://localhost:5000/api/health

# Create task
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Learn Kubernetes","priority":"high","category":"work"}'

# List all tasks
curl http://localhost:5000/api/tasks

# Filter pending high-priority tasks
curl "http://localhost:5000/api/tasks?completed=false&priority=high"

# Get stats
curl http://localhost:5000/api/tasks/stats
```

---

## 📦 CI/CD

GitHub Actions runs on push to `main`:
1. Runs backend unit tests
2. Runs frontend tests
3. Builds Docker images
4. Pushes to GitHub Container Registry (ghcr.io)

---

## 📝 License

MIT
