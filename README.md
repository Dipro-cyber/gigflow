# GigFlow – Smart Leads Dashboard

> Full-stack MERN internship assignment for ServiceHive  
> Built with React + TypeScript · Node.js + Express + TypeScript · MongoDB · Docker

---

## Quick Start (Docker)

```bash
# 1. Clone the repo
git clone <repo-url>
cd gigflow

# 2. Copy and fill in environment variables
cp .env.example .env

# 3. Spin up everything with one command
docker-compose up --build
```

- Frontend: http://localhost:3000  
- Backend API: http://localhost:5000  
- MongoDB: localhost:27017

---

## Local Development (without Docker)

### Backend
```bash
cd server
cp .env.example .env   # fill in values
npm install
npm run dev            # ts-node-dev with hot reload
```

### Frontend
```bash
cd client
cp .env.example .env   # fill in VITE_API_URL
npm install
npm run dev            # Vite dev server on :3000
```

---

## Features

| Feature | Status |
|---------|--------|
| JWT Authentication (register + login) | ✅ |
| Role-Based Access Control (admin / sales_user) | ✅ |
| Leads CRUD | ✅ |
| Advanced filtering (status, source, search, sort) | ✅ |
| Backend pagination (10/page) | ✅ |
| Debounced search (300ms custom hook) | ✅ |
| CSV export (filtered results) | ✅ |
| Responsive UI with loading/empty/error states | ✅ |
| Docker (single `docker-compose up`) | ✅ |
| Dark mode | ✅ (bonus) |

---

## API Documentation

See [API.md](./API.md) for full endpoint reference.

---

## Environment Variables

See `.env.example` at the root for all required variables.

---

## Tech Stack

**Frontend:** React 18 · TypeScript · TailwindCSS · Vite · React Router v6 · Axios  
**Backend:** Node.js · Express · TypeScript · MongoDB · Mongoose · JWT · bcryptjs  
**DevOps:** Docker · Docker Compose · nginx (frontend serving)

---

## Live Demo

- Frontend: _TBD after deployment_  
- Backend API: _TBD after deployment_

---

## Submission

**Email:** ritik.yadav@servicehive.tech  
**CC:** hr.recruitment@servicehive.tech  
**Subject:** MERN Internship Assignment Submission - Diptesh Roy
