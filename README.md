# Silid

> Silid (room) — a multi-tenant workspace and project management platform built with MERN + TypeScript.

![CI](https://github.com/warren-wacko/Silid/actions/workflows/ci.yml/badge.svg)

## Live Demo

🚧 Coming soon — deploying to Render + Vercel

## Features

### Core

- Multi-tenant workspace system with data isolation
- Role-based access control (Owner, Admin, Member)
- Project and Task management with status tracking
- Activity logging on all workspace events

### Technical

- JWT authentication with bcrypt password hashing
- Real-time collaboration with Socket.io WebSockets
- Background job processing with BullMQ + Redis
- Guest sharing links (read-only, no login required)
- Workspace analytics dashboard
- RESTful API with Swagger/OpenAPI documentation
- Automated CI/CD pipeline with GitHub Actions
- Dockerized local development environment

## Tech Stack

### Backend

- Node.js + Express + TypeScript
- MongoDB + Mongoose
- Redis + BullMQ
- Socket.io
- JWT + bcrypt
- Jest + Supertest

### Frontend (Coming Soon)

- React + TypeScript
- TailwindCSS
- React Query
- Socket.io Client
- Recharts

### DevOps

- Docker + Docker Compose
- GitHub Actions CI/CD
- Render (Backend)
- Vercel (Frontend)
- MongoDB Atlas

## Architecture

```
┌─────────────────────────────────────────────┐
│                  Frontend                    │
│         React + TypeScript + TailwindCSS     │
└──────────────────┬──────────────────────────┘
                   │ HTTP + WebSocket
┌──────────────────▼──────────────────────────┐
│               Express API                    │
│         Node.js + TypeScript                 │
│  ┌─────────────┐  ┌────────────────────┐    │
│  │   REST API   │  │    Socket.io       │    │
│  │   Routes     │  │    Real-time       │    │
│  └──────┬──────┘  └────────────────────┘    │
│         │                                    │
│  ┌──────▼──────────────────────────────┐    │
│  │           Services Layer             │    │
│  │  Auth | Workspace | Project | Task  │    │
│  └──────┬──────────────────────────────┘    │
└─────────┼───────────────────────────────────┘
          │
┌─────────▼───────────┐  ┌────────────────────┐
│      MongoDB         │  │       Redis         │
│   Data Persistence   │  │   Job Queue Cache   │
└─────────────────────┘  └────────────────────┘
```

## Getting Started

### Prerequisites

- Node.js 20+
- Docker Desktop
- Git

### Installation

1. Clone the repository:

```bash
git clone https://github.com/warren-wacko/Silid.git
cd Silid
```

2. Start databases with Docker:

```bash
docker compose up -d
```

3. Install backend dependencies:

```bash
cd backend
npm install
```

4. Create environment file:

```bash
cp .env.example .env
```

5. Start the development server:

```bash
npm run dev
```

6. Start the background workers (new terminal):

```bash
npm run dev:workers
```

7. Visit API documentation:

```
http://localhost:5000/api-docs
```

## API Documentation

Full interactive API documentation available at `/api-docs` when running locally.

### Key Endpoints

```
POST /api/auth/register     → Register new user
POST /api/auth/login        → Login
GET  /api/auth/profile      → Get current user

POST /api/workspaces        → Create workspace
GET  /api/workspaces        → List workspaces
POST /api/workspaces/join   → Join via invite token

POST /api/workspaces/:id/projects          → Create project
POST /api/workspaces/:id/projects/:id/tasks → Create task

GET  /api/workspaces/:id/analytics         → Dashboard analytics
GET  /api/share/:token                     → Public share link
```

## Project Structure

```
Silid/
├── backend/
│   ├── src/
│   │   ├── config/         # Database, Redis, Swagger config
│   │   ├── controllers/    # HTTP request handlers
│   │   ├── jobs/           # BullMQ queues and workers
│   │   ├── middleware/      # Auth middleware
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # Express routes
│   │   ├── services/       # Business logic
│   │   ├── sockets/        # Socket.io events
│   │   └── utils/          # Shared utilities
│   └── __tests__/          # Integration tests
├── frontend/               # Coming soon
├── docker-compose.yml
└── .github/
    └── workflows/
        └── ci.yml
```

## Environment Variables

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/silid
JWT_SECRET=your_secret_here
REDIS_HOST=localhost
REDIS_PORT=6379
```

## Running Tests

```bash
cd backend
npm test
```

## License

MIT License

```

Save it — then also create a `.env.example` file in the `backend` folder:
```

PORT=5000
MONGODB_URI=mongodb://localhost:27017/silid
JWT_SECRET=your_jwt_secret_here
REDIS_HOST=localhost
REDIS_PORT=6379
