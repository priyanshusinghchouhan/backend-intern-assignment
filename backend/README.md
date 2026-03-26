# Backend Intern Assignment - README

Welcome to the backend application for the Backend Intern Assignment.

This repository is built with:

- Node.js + Express
- TypeScript
- Prisma ORM (PostgreSQL)
- JWT authentication
- Role-based access control (user/admin)
- Basic logging, validation, and error handling

---

## 🚀 What this service provides

- User registration: `POST /api/v1/auth/register`
- Login: `POST /api/v1/auth/login`
- Task management CRUD (create, list, update, delete) under `POST/GET/PUT/DELETE /api/v1/tasks`
- Authentication middleware (`Bearer <token>`)
- `user` and `admin` role support
- Task status: `PENDING`, `IN_PROGRESS`, `COMPLETED`

---

## 🧱 Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- A PostgreSQL-compatible database (NeonDB, Supabase, ElephantSQL, etc.)

---

## 🛠️ Setup (Beginner-friendly)

### 1) Clone repository

```bash
git clone <your-repo-url>
cd backend-intern-assignment/backend
```

### 2) Install dependencies

```bash
npm install
# or
# yarn install
```

### 3) Configure environment

Create `.env` in `backend/`:

```env
DATABASE_URL="postgresql://<user>:<password>@<host>:<port>/<database>?schema=public"
JWT_SECRET="your-secret-key"
PORT=3001
```


### 4) Database provider examples (NeonDB + others)

#### NeonDB
- Register at https://neon.tech
- Create a project and copy connection string
- Example:
  - `postgres://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb?schema=public`

#### Supabase
- Register at https://supabase.com
- Create project and use `ConnectionString` (PostgreSQL)

#### ElephantSQL
- Register at https://www.elephantsql.com
- Create plan and use URL from dashboard

`DATABASE_URL` must be a PostgreSQL URL. If you use SSL, add `?sslmode=require`.

---

### 5) Prisma initialization

Generate Prisma client and sync database:

```bash
npx prisma generate
npx prisma db push
```

(You can also use migrations: `npx prisma migrate dev`.)

---

### 6) Run the server

```bash
npm run dev
```

The API should be available at: `http://localhost:3000`

- Health check: `GET /health`

### Port mapping

- Backend: `http://localhost:3000`
- Frontend: `http://localhost:3001`

> Make sure to run backend first, then frontend.

---

## 🧪 API usage (with curl)

### Register user

```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123","role":"user"}'
```

### Login

```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

Save returned `token` for tasks endpoints.

### Create task

```bash
curl -X POST http://localhost:3001/api/v1/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"title":"Test","description":"desc"}'
```

### Get tasks

```bash
curl -H "Authorization: Bearer <token>" http://localhost:3001/api/v1/tasks
```

### Update task

```bash
curl -X PUT http://localhost:3001/api/v1/tasks/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"title":"New title","description":"new",