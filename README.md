# MindMend

MindMend is an AI-supported mental wellness companion for students — mood tracking, journaling, an empathetic chat companion (built on Groq), self-help resources, and crisis support.

The goal is to give students a low-friction, always-available space to check in on how they're doing, whether that's logging a mood, writing a journal entry, or just talking something through with a supportive AI companion — with clear escalation to real crisis resources when it matters.

## Stack

- **Frontend**: React + Vite + TypeScript, shadcn/ui, Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL
- **AI**: Groq (`llama-3.3-70b-versatile`)
- **Auth**: JWT + bcrypt (no third-party auth provider)

## Project layout

```
MindMend/
├── frontend/       # React app (Vite)
├── backend/        # Express API
└── database/
    └── schema.sql  # PostgreSQL schema
```

## Local setup

### 1. Database

```bash
createdb mindmend
psql -d mindmend -f database/schema.sql
```

### 2. Backend

```bash
cd backend
cp .env.example .env   # fill in DB credentials, JWT_SECRET, GROQ_API_KEY
npm install
npm run dev             # http://localhost:3001
```

### 3. Frontend

```bash
cd frontend
cp .env.example .env    # set VITE_API_URL to the backend above
npm install
npm run dev              # http://localhost:8080
```

## API overview

| Area | Routes |
|---|---|
| Auth | `POST /api/auth/signup`, `POST /api/auth/login`, `GET /api/auth/me`, `POST /api/auth/logout` |
| Chat | `POST /api/chat`, `GET /api/chat/conversations`, `GET /api/chat/conversations/:id/messages`, `DELETE /api/chat/conversations/:id` |
| Mood | `POST /api/mood`, `GET /api/mood`, `GET /api/mood/stats`, `PUT /api/mood/:id`, `DELETE /api/mood/:id` |
| Journal | `POST /api/journal`, `GET /api/journal`, `GET /api/journal/:id`, `PUT /api/journal/:id`, `DELETE /api/journal/:id` |
| Profile | `GET /api/profile`, `PUT /api/profile` |
