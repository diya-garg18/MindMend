# MindMend

MindMend is a mental wellness web app built for students. It gives them one place to check in on how they're doing — track mood, write in a journal, talk to an AI companion, or use guided self-help tools — and makes sure real crisis support is never more than a click away.

## Why

Students often don't reach for help until things are already hard, partly because it's inconvenient: no easy way to track how you've been feeling over time, no low-pressure way to talk something through, no single place that has both self-help tools and real crisis resources. MindMend is built around lowering that friction — quick to open, judgment-free, available at 3am, and honest about what it is (a supportive companion, not a therapist).

## Features

**Mood tracking** — Log a mood entry with a level and label, add notes, and see trends over time via mood statistics on the dashboard.

**Journaling** — Free-write, or answer a daily writing prompt. Entries are saved and browsable later.

**AI chat companion** — A conversational companion (powered by Groq's Llama 3.3 70B) that responds with empathy, keeps replies short and conversational rather than clinical, and is specifically tuned to recognize distress or crisis language and respond appropriately — including surfacing crisis hotlines directly in the conversation when needed. Chat history is saved per conversation for signed-in users.

**Guest mode** — The chat companion also works without an account, for anyone who wants to talk without signing up. Guest conversations are session-only (not saved), and get the same crisis-detection safety net.

**Self-help tools** — Guided breathing exercises, yoga poses with reference images, and an ambient sound player (rain, ocean waves, forest birds, piano, crickets) for grounding and relaxation. The ambient player floats persistently across the app so it keeps playing while you navigate.

**Crisis resources** — A dedicated crisis page with hotlines and campus/international resources. Emergency help is also one click away from anywhere in the app via a persistent emergency button, and guest users get location-aware crisis contacts based on their country.

**Mental health resource library** — A plain-language FAQ-style library covering topics like stress, anxiety, and depression basics — what they are, coping strategies, and when to seek professional help.

**Profile & accounts** — Email/password accounts with a profile (display name, username, avatar, location) and a daily reminder popup to nudge check-ins.

## Architecture

MindMend is a standard three-tier web app:

```
React frontend  →  Express API  →  PostgreSQL
                        ↓
                    Groq API (chat completions)
```

- **Frontend** (`frontend/`): a React + Vite single-page app (shadcn/ui + Tailwind CSS). Talks to the backend exclusively through a typed API client (`src/lib/apiClient.ts`); holds no direct database or third-party service credentials itself.
- **Backend** (`backend/`): an Express + TypeScript REST API. Owns all business logic — authentication, mood/journal/chat data, and the call out to Groq for AI responses. Auth is JWT-based (signed on login/signup, verified on every protected route) with bcrypt password hashing; there's no third-party auth provider in the loop.
- **Database** (`database/schema.sql`): PostgreSQL. Users, profiles, mood entries, journal entries, conversations, and messages, each scoped to a user via foreign keys.
- **AI**: chat requests go from the backend to Groq's API (not called directly from the browser), so the API key never reaches the client. The system prompt is tuned specifically for supportive, non-clinical mental-health conversation, with built-in crisis-keyword detection that overrides the AI response with verified crisis resources when needed.

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
| Chat | `POST /api/chat`, `POST /api/chat/guest`, `GET /api/chat/conversations`, `GET /api/chat/conversations/:id/messages`, `DELETE /api/chat/conversations/:id` |
| Mood | `POST /api/mood`, `GET /api/mood`, `GET /api/mood/stats`, `PUT /api/mood/:id`, `DELETE /api/mood/:id` |
| Journal | `POST /api/journal`, `GET /api/journal`, `GET /api/journal/:id`, `PUT /api/journal/:id`, `DELETE /api/journal/:id` |
| Profile | `GET /api/profile`, `PUT /api/profile` |
