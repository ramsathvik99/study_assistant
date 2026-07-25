# Mosaic — AI Study Platform

Turn any topic, notes, or document into a complete study system in seconds.
Mosaic uses the Groq API (Llama 3.3 70B) to generate flashcards, quizzes, roadmaps, mnemonics, and revision tips from any study material.

**Live demo:**
- Frontend → https://study-assistant-468n-murex.vercel.app
- Backend API → https://study-assistant-mg5l.onrender.com/health

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express, TypeScript |
| AI | Groq SDK — Llama 3.3 70B Versatile |
| Deployment | Vercel (frontend) · Render (backend) |

---

## Local Development

### Prerequisites

- Node.js 20+
- A [Groq API key](https://console.groq.com/keys) (free tier available)

### 1 — Clone

```bash
git clone https://github.com/your-username/study-assistant.git
cd study-assistant
```

### 2 — Backend setup

```bash
cd backend
cp .env.example .env
```

Open `backend/.env` and fill in:

```env
PORT=5000
GROQ_API_KEY=gsk_your_key_here
FRONTEND_URL=http://localhost:5173
```

Install and start:

```bash
npm install
npm run dev
```

The backend starts on **http://localhost:5000**.
Verify it's healthy: http://localhost:5000/health

### 3 — Frontend setup

```bash
cd ../client
cp .env.example .env.local
```

`client/.env.local` MUST contain the backend URL:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

**Important:** `VITE_API_BASE_URL` is required. The app will not work without it.

Install and start:

```bash
npm install
npm run dev
```

The frontend starts on **http://localhost:5173**.

---

## Production Deployment

### Backend → Render

1. Create a new **Web Service** on [Render](https://render.com).
2. Connect your GitHub repository.
3. Set **Root Directory** to `backend`.
4. Render auto-detects the `render.yaml` — build and start commands are pre-configured.
5. In **Environment → Environment Variables**, add:

| Key | Value |
|---|---|
| `GROQ_API_KEY` | your Groq API key |
| `FRONTEND_URL` | `https://study-assistant-468n-murex.vercel.app` |
| `NODE_ENV` | `production` |

> `PORT` is injected automatically by Render — do not set it manually.

6. Deploy. The health endpoint will be at `https://<your-render-url>/health`.

### Frontend → Vercel

1. Import the repository on [Vercel](https://vercel.com).
2. Set **Root Directory** to `client`.
3. Framework preset: **Vite** (auto-detected).
4. In **Settings → Environment Variables**, add:

| Key | Value |
|---|---|
| `VITE_API_BASE_URL` | `https://study-assistant-mg5l.onrender.com/api` |

5. Deploy. Vercel reads `client/vercel.json` to handle SPA routing — all routes rewrite to `index.html` so direct URL access works correctly.

---

## Environment Variables Reference

### Backend (`backend/.env`)

| Variable | Required | Description |
|---|---|---|
| `GROQ_API_KEY` | ✅ | Groq API key for AI generation |
| `FRONTEND_URL` | ✅ | Comma-separated list of allowed frontend origins |
| `PORT` | auto | Injected by Render in production; defaults to 5000 locally |
| `NODE_ENV` | recommended | Set to `production` on Render |

### Frontend (`client/.env.local`)

| Variable | Required | Description |
|---|---|---|
| `VITE_API_BASE_URL` | ✅ | Full backend API base URL including `/api` suffix |

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Health check — returns status and CORS config |
| `POST` | `/api/generate` | Generate a complete study plan from topic/notes |
| `POST` | `/api/upload` | Parse a PDF, TXT, or MD file into plain text |

### POST `/api/generate`

**Request body:**
```json
{
  "topic": "your study material or topic name",
  "difficulty": "Easy | Medium | Hard"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "title": "...",
    "summary": "...",
    "difficulty": "Medium",
    "estimatedStudyTime": "2 hours",
    "keyConcepts": [...],
    "flashcards": [...],
    "quiz": [...],
    "roadmap": [...],
    "revisionTips": [...],
    "mnemonics": [...]
  }
}
```

### POST `/api/upload`

**Request:** `multipart/form-data` with field `file` (PDF / TXT / MD, max 15 MB).

**Response:**
```json
{
  "success": true,
  "data": {
    "text": "extracted plain text...",
    "wordCount": 1234,
    "charCount": 7890,
    "fileType": "pdf",
    "fileName": "notes.pdf",
    "wasTruncated": false
  }
}
```

---

## Project Structure

```
study-assistant/
├── backend/                  Express + TypeScript API
│   ├── src/
│   │   ├── controllers/      Request handlers
│   │   ├── middleware/       CORS, error handling, rate limiting
│   │   ├── routes/           Route definitions
│   │   ├── services/         Groq AI integration
│   │   ├── utils/            File store utility
│   │   └── validators/       Zod request validation
│   ├── .env.example
│   ├── render.yaml           Render deployment config
│   └── tsconfig.json
│
└── client/                   React + Vite frontend
    ├── src/
    │   ├── components/       UI components
    │   ├── features/         Feature modules (file upload)
    │   ├── hooks/            Custom React hooks
    │   ├── pages/            Route-level page components
    │   ├── services/         API client layer (Axios)
    │   ├── types/            TypeScript interfaces
    │   └── utils/            Helpers (validation, PDF, TTS)
    ├── .env.example
    ├── vercel.json           Vercel SPA routing config
    └── vite.config.ts
```

---

## Build Verification

Both projects build with zero TypeScript errors:

```bash
# Backend
cd backend && npm run build   # tsc — compiles to dist/

# Frontend
cd client && npm run build    # tsc -b && vite build — outputs to dist/
```

---

## CORS Configuration

The backend allows requests from:

- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (alternative local port)
- `http://localhost:4173` (Vite preview)
- Any origin matching `*.vercel.app` (covers all Vercel preview deployments)
- Any origin listed in the `FRONTEND_URL` environment variable

---

## Known Limitations

- **Render free tier cold starts** — the backend may take 30–60 seconds to respond after a period of inactivity. The frontend has a 90-second request timeout to accommodate this.
- **Rate limiting** — the `/api/generate` endpoint is limited to 20 requests per IP per hour to protect Groq API quota.
- **File uploads** — files are processed in memory and not persisted. Maximum size is 15 MB.
- **No authentication** — the application is guest-only. All data is stored in the browser's `localStorage`.
