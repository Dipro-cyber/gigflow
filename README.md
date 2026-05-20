# GigFlow – Smart Leads Dashboard

A full-stack MERN application for managing sales leads with role-based access control.

**Stack:** React + TypeScript · Node.js + Express + TypeScript · MongoDB · Docker

---

## Quick Start (Docker)

```bash
git clone https://github.com/Dipro-cyber/gigflow.git
cd gigflow
cp .env.example .env   # fill in JWT_SECRET
docker-compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

---

## Local Development

### Backend
```bash
cd server
cp .env.example .env
npm install
npm run dev
```

### Frontend
```bash
cd client
cp .env.example .env
npm install
npm run dev
```

---

## Features

- JWT authentication with role-based access (admin / sales_user)
- Leads CRUD with ownership enforcement
- Advanced filtering by status, source, search term, sort order
- Backend pagination (10 records/page)
- Debounced search (300ms custom hook)
- CSV export of filtered results
- Responsive UI with loading, empty, and error states
- Dark mode (bonus)
- Docker — single `docker-compose up` spins everything

---

## API Reference

See [API.md](./API.md)

---

## Environment Variables

See `.env.example` at root, `server/.env.example`, and `client/.env.example`.
