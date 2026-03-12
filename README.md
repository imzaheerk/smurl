# Smurl - Full-Stack URL Shortener

Smurl is a production-ready URL shortener built with:

- **Frontend**: React, TypeScript, TailwindCSS, Vite
- **Backend**: Node.js, Fastify, TypeScript, TypeORM, Swagger
- **Database**: PostgreSQL
- **Cache**: Redis (for redirect caching)

## Features

- User registration and login (JWT-based)
- Short URL creation with:
  - Base62 short codes (6–8 chars)
  - Custom aliases
  - Optional expiration dates
- Redirect with Redis caching
- Per-user dashboard:
  - Create short URLs
  - List & paginate URLs
  - Click counters
  - Copy short links
  - Delete URLs
- Analytics:
  - Total clicks
  - Country
  - Browser
  - Referrer
  - Timestamp
  - Charts on dashboard
- Swagger API docs at `/docs`

## Monorepo Structure

- `backend/` – Fastify API (TypeScript, TypeORM, Redis, Swagger)
- `frontend/` – React + Vite + Tailwind dashboard

## Getting Started (Local Dev)

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL
- Redis

### 1. Clone and configure

```bash
cd e:\smurl
cp .env.example .env
# Edit .env if needed
```

The backend reads environment variables via `dotenv` (`backend/src/config/env.ts`).

### 2. Install dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 3. Run backend

```bash
cd backend
npm run dev
```

Backend will start on `http://localhost:5000`.

- Swagger docs: `http://localhost:5000/docs`

### 4. Run frontend

```bash
cd frontend
npm run dev
```

Frontend will start on `http://localhost:5173`.

## Docker Setup

Docker Compose provides:

- `postgres` – PostgreSQL database
- `redis` – Redis cache
- `backend` – Node.js API (production mode)

### 1. Build and start

```bash
docker-compose up --build
```

This will:

- Run PostgreSQL on `localhost:5432`
- Run Redis on `localhost:6379`
- Run backend on `http://localhost:5000`

> Note: Frontend is not containerized by default; run it locally with `npm run dev` inside `frontend/`.

## Backend Overview

- **Entry point**: `backend/src/index.ts`
- **Config**:
  - `backend/src/config/env.ts` – environment variables
  - `backend/src/config/data-source.ts` – TypeORM data source
  - `backend/src/config/redis.ts` – Redis client
- **Entities**:
  - `User` – `id`, `email`, `password`, `createdAt`
  - `Url` – `id`, `shortCode`, `originalUrl`, `clickCount`, `userId`, `createdAt`, `expiresAt`
  - `Analytics` – `id`, `urlId`, `ipAddress`, `userAgent`, `country`, `referrer`, `browser`, `createdAt`
- **Routes**:
  - `POST /auth/register`
  - `POST /auth/login`
  - `POST /url/shorten` (JWT, rate limited)
  - `GET /url/my-urls` (JWT, paginated)
  - `GET /url/:id/analytics` (JWT)
  - `DELETE /url/:id` (JWT)
  - `GET /:shortCode` – redirect with Redis caching + analytics

### Short Code Generation

Implemented in `backend/src/utils/base62.ts` using Base62 alphabet:

`abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`

Codes are 6–8 characters long and checked for uniqueness.

### Redis Caching Flow

On redirect (`GET /:shortCode`):

1. Check Redis (`short:{shortCode}`) for original URL.
2. If found → redirect immediately.
3. If not found → look up in PostgreSQL.
4. If found and not expired → store in Redis (TTL 1h) and redirect.

### Rate Limiting

Rate limiting is configured via `@fastify/rate-limit`:

- Global: 100 requests / minute.
- URL creation (`POST /url/shorten`): 20 requests / minute per IP.

## Frontend Overview

- **Entry**: `frontend/src/main.tsx`
- **Routing**: `frontend/src/App.tsx`
- **Pages**:
  - `Login` – `/login`
  - `Register` – `/register`
  - `Dashboard` – `/`
  - `Analytics` – `/analytics/:id`
- **Key components**:
  - `Layout` – responsive sidebar layout
  - `UrlForm` – create short URL (with custom alias and expiration)
  - `UrlTable` – list URLs, copy, delete, open analytics
- **Hooks**:
  - `useAuth` – handles JWT presence and redirects to `/login` when required.
- **Charts**:
  - Implemented with `recharts` in `Analytics` page to show clicks by country and browser.

## Authentication

- `POST /auth/register` – create account.
- `POST /auth/login` – returns JWT token.
- Frontend stores JWT in `localStorage` and sends it via `Authorization: Bearer <token>` for protected routes.

## Scripts

### Backend

- `npm run dev` – start Fastify with `ts-node-dev`.
- `npm run build` – TypeScript compile to `dist/`.
- `npm start` – run compiled server.
- `npm run lint` – run ESLint.

### Frontend

- `npm run dev` – start Vite dev server.
- `npm run build` – build production bundle.
- `npm run preview` – preview production build.
- `npm run lint` – run ESLint.

## Notes

- For a real production deployment, you should:
  - Use proper secrets management instead of `.env`.
  - Configure HTTPS and a reverse proxy (e.g., Nginx).
  - Turn off `synchronize: true` in TypeORM and use migrations.
  - Add stricter validation for request payloads.

