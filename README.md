# Backend Intern Assignment

A scalable REST API with authentication, role-based access control, and a Next.js frontend for testing.

## Features

- User registration and login with JWT authentication
- Role-based access (user/admin)
- CRUD operations for tasks
- API versioning, validation, and error handling
- Swagger documentation
- PostgreSQL database with Sequelize ORM
- Next.js frontend with TypeScript and Tailwind CSS

## Tech Stack

- **Backend**: Node.js, TypeScript, Express, Prisma ORM, PostgreSQL, JWT, bcrypt
- **Frontend**: Next.js, TypeScript, Tailwind CSS, Axios

## Setup

### Prerequisites

- Node.js (v16+)
- PostgreSQL
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Update `.env` with your PostgreSQL connection string:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/backend_assignment
   JWT_SECRET=your_secret_key
   ```

4. Generate Prisma client and sync database:
   ```bash
   npm run db:generate
   npm run db:push
   ```

5. Start the server:
   ```bash
   npm run dev
   ```

   Server runs on http://localhost:3000

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   Frontend runs on http://localhost:3001

## Usage

1. Register a new user or login
2. Access the dashboard to manage tasks
3. Admins can manage all tasks, users can only manage their own

## Security

- Password hashing with bcrypt
- JWT token authentication
- Input validation with Joi
- Rate limiting
- CORS enabled
- Helmet for security headers

## Deployment

Optional: Add Docker configuration for containerization.
