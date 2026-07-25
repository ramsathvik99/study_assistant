# AI Study Assistant (Phase 1 Complete)

An enterprise-scale, production-quality study platform that converts any topic, notes, or uploaded documents into an interactive, structured learning experience. 

Instead of showing conversational raw chat outputs, the AI generates strictly validated JSON study materials which the frontend parses into premium UI tabs: collapsible Summaries with Text-to-Speech, Key Concept cards, 3D Flipping Flashcards, Quizzes with timers and performance history tracking, and Study Roadmap timelines.

---

## 🛠️ Phase 1 Features Implemented

1. **Authentication**: JWT-based secure session management (bcrypt password hashing, file-based user store).
2. **Dashboard**: Live analytics of topics studied, flashcards completed, average quiz scores, active study streaks, and unlockable achievements.
3. **Paste Notes & File Upload**: Drag-and-drop file uploader supporting `.pdf`, `.txt`, and `.md` formats (max 15MB) with automated text parsing and context optimization.
4. **Groq Integration**: Powered by Groq's high-speed `llama-3.3-70b-versatile` engine with Zod schema validation.
5. **Study Planner**: Add, edit, prioritize, and monitor custom study goals, hourly commitments, and target deadlines.
6. **Error Handling**: Complete client-side and backend recovery covering offline states, rate limiting (HTTP 429), timeouts, and validation failures.
7. **Responsive & Dark Mode**: Modern layout that scales down to mobile bottom bars and supports seamless dark/light modes.

---

## 🗄️ Technical Architecture & Directory Structure

```
study_assistant/
├── backend/
│   ├── data/                 # JSON file-based database for users/metadata
│   ├── src/
│   │   ├── controllers/      # Auth, Study, and File Upload controllers
│   │   ├── middleware/       # JWT Auth verification & custom rate limiters
│   │   ├── routes/           # REST endpoints (/api/auth, /api/upload, /api/generate)
│   │   ├── services/         # Groq SDK handler with Zod enforcement
│   │   ├── utils/            # User file storage wrapper
│   │   └── validators/       # Zod schemas for request parameters
│   └── package.json
└── client/
    ├── src/
    │   ├── components/       # Component library (Summary, Cards, Quiz, Nav)
    │   ├── contexts/         # Global state managers (Auth, App Settings)
    │   ├── features/         # Upload and Study Planner modules
    │   ├── pages/            # View pages (Home, Login, Register, Planner, Dashboard)
    │   └── services/         # API HTTP Client with AbortController
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- A Groq API Key. You can get one from the [Groq Console](https://console.groq.com/).

### Installation

1. Clone or copy the project workspace.
2. Install dependencies for both frontend and backend concurrently:
   ```bash
   npm run install-all
   ```

### Configuration

Create a `.env` file in the `backend/` directory:
```env
PORT=5000
GROQ_API_KEY=gsk_your_actual_groq_api_key_here
JWT_SECRET=use_a_strong_random_secret_phrase
JWT_EXPIRES_IN=7d
```

### Running Locally

To run both the Vite frontend and Express backend concurrently:
```bash
npm run dev
```

The application will launch:
- **Frontend client**: [http://localhost:5173](http://localhost:5173)
- **Backend server**: [http://localhost:5000](http://localhost:5000)

---

## 💡 Robust Engineering Details

1. **AI Output Safety & Zod Guards**: All incoming data from the Groq SDK is run through a strict Zod parser. If the JSON is missing arrays or subfields, the backend falls back gracefully or reports an API validation error.
2. **Double Submission Prevention**: In-flight generation blocks UI interactions, and starting a new request automatically aborts any existing network requests via `AbortController` to avoid race conditions.
3. **User-Scoped Local Storage**: Local storage states (active study session, bookmarks, history, goals) are keyed by the active user's ID (`study-history-${user.id}`), keeping multiple account sessions isolated.
4. **JWT Security**: Login incorporates a constant-time hashing comparison using a dummy value when the target user doesn't exist, preventing timing side-channel attacks for username enumeration.
