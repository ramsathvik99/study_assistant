# StudyFlow - AI-Powered Study Assistant

![StudyFlow](https://img.shields.io/badge/version-1.0.0-blue) ![License](https://img.shields.io/badge/license-MIT-green)

StudyFlow is a modern, full-stack web application that transforms study materials into interactive learning experiences using AI. Generate personalized study plans, flashcards, quizzes, and learning roadmaps from any topic or document in seconds.

## 🎯 Key Features

### Core AI Features
- **Smart Study Plan Generation** - AI-powered creation of comprehensive study materials from topics or notes
- **Interactive Flashcards** - Flip-card learning with favorites, difficulty tracking, and shuffle functionality
- **Adaptive Quizzes** - Multiple-choice questions with instant feedback and performance tracking
- **Learning Roadmaps** - Phase-based study progression with task checklists and completion tracking
- **Revision Tips & Mnemonics** - Memory aids and study strategies for better retention
- **Key Concepts** - Organized concept breakdowns with detailed explanations

### User Experience
- **Beautiful Glass-morphism UI** - Modern, responsive design with smooth animations
- **Dark Mode Support** - Eye-friendly theme customization
- **Session Management** - Save and organize study sessions with bookmarking
- **Study History** - Track all generated study materials
- **Real-time Progress** - Visual indicators for study completion and accuracy
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile

### Reliability & Performance
- **Race Condition Prevention** - Request sequence tracking prevents stale responses
- **Automatic Request Cancellation** - On navigation, unmount, and resubmit
- **Timeout Handling** - Graceful error messages with retry functionality
- **Malformed JSON Recovery** - Safe parsing with fallback values
- **Network Resilience** - Offline detection and connection error handling
- **Loading State Management** - Consistent, non-blocking progress indicators

## 🛠 Tech Stack

### Frontend
- **React 18** - UI component library with hooks
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **React Router** - Client-side routing
- **Framer Motion** - Advanced animations and transitions
- **TailwindCSS** - Utility-first styling
- **React Hook Form** - Form state management
- **React Hot Toast** - Toast notifications
- **TanStack React Query** - Server state management
- **Axios** - HTTP client with request cancellation
- **Zod** - TypeScript-first schema validation

### Backend
- **Node.js + Express** - Server runtime and framework
- **TypeScript** - Type-safe backend code
- **Google Generative AI (Gemini)** - AI model integration
- **Zod** - Input validation
- **CORS** - Cross-origin resource sharing
- **Environment variables** - Secure configuration

### Infrastructure
- **Render** - Deployment platform (configured)
- **JSON Storage** - File-based data persistence (dev/demo)

## 📋 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Google Gemini API key (free at [Google AI Studio](https://aistudio.google.com/))

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create environment file:**
```bash
cp .env.example .env
```

4. **Add your Gemini API key:**
```
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-2.5-flash
```

5. **Start the backend server:**
```bash
npm run dev
```

The server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to client directory:**
```bash
cd client
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create environment file:**
```bash
cp .env.example .env.local
```

4. **Configure API endpoint (optional):**
```
VITE_API_BASE_URL=http://localhost:5000/api
```

5. **Start the development server:**
```bash
npm run dev
```

The application will run on `http://localhost:5173`

## 📁 Project Structure

```
study_assistant/
├── backend/                      # Express server
│   ├── src/
│   │   ├── controllers/         # Request handlers
│   │   │   └── studyController.ts
│   │   ├── middleware/          # Express middleware
│   │   │   ├── errorHandler.ts
│   │   │   └── rateLimiter.ts
│   │   ├── routes/              # API routes
│   │   │   └── study.ts
│   │   ├── services/            # Business logic
│   │   │   └── geminiService.ts  # AI integration
│   │   ├── server.ts            # Express app setup
│   │   └── utils/               # Helpers
│   ├── data/                    # Local data storage
│   ├── dist/                    # Compiled output
│   ├── package.json
│   ├── tsconfig.json
│   └── render.yaml              # Render deployment config
│
├── client/                       # React application
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── animations/      # Animation components
│   │   │   ├── common/          # Reusable components
│   │   │   ├── layout/          # Layout components
│   │   │   ├── Flashcards/      # Flashcard UI
│   │   │   ├── KeyConcepts/     # Concepts display
│   │   │   ├── Mnemonics/       # Memory aids
│   │   │   ├── Quiz/            # Quiz interface
│   │   │   ├── Roadmap/         # Learning paths
│   │   │   ├── RevisionTips/    # Study tips
│   │   │   └── Summary/         # Content summary
│   │   ├── hooks/               # Custom React hooks
│   │   │   ├── useGenerateStudyPlan.ts
│   │   │   ├── useSettings.ts
│   │   │   └── useCancelOnNavigate.ts
│   │   ├── pages/               # Page components
│   │   │   ├── Home.tsx         # Landing/generation page
│   │   │   ├── SessionPage.tsx  # Study session view
│   │   │   ├── DashboardPage.tsx
│   │   │   └── HistoryPage.tsx
│   │   ├── services/            # API client
│   │   │   └── api.ts
│   │   ├── types/               # TypeScript interfaces
│   │   │   └── index.ts
│   │   ├── utils/               # Utilities
│   │   │   ├── errorHandler.ts
│   │   │   └── jsonValidator.ts
│   │   ├── contexts/            # React contexts
│   │   ├── App.tsx              # Main app component
│   │   └── main.tsx
│   ├── public/                  # Static assets
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── .git/
├── .gitignore
└── README.md
```

## 🤖 AI Provider & Architecture

### Google Gemini Integration

StudyFlow uses **Google Generative AI (Gemini 2.5 Flash)** for intelligent content generation.

**Why Gemini?**
- Fast response times (ideal for user experience)
- Structured JSON output with `responseMimeType: "application/json"`
- Cost-effective for educational use
- Supports large context windows (up to 1M tokens)
- Excellent for multi-turn conversations

### Backend AI Architecture

The backend implements a robust multi-layer validation approach:

1. **Request Validation** (Zod Schema)
   - Topic length validation (max 5MB)
   - Difficulty level enum validation
   - Request body type checking

2. **Gemini Service** (`geminiService.ts`)
   - Chunk-based text processing for large inputs
   - Retry logic with exponential backoff (max 3 retries)
   - Request timeout: 120 seconds
   - Automatic JSON extraction and parsing
   - Self-healing response validation

3. **JSON Recovery**
   - Handles markdown code blocks
   - Fixes trailing commas and unquoted properties
   - Extracts partial JSON from malformed responses
   - Attempts multiple parsing strategies

4. **Schema Validation** (Zod)
   ```typescript
   - title: string (1-200 chars)
   - summary: string (100+ chars)
   - difficulty: "Easy" | "Medium" | "Hard"
   - keyConcepts: array of {concept, explanation}
   - flashcards: array of {front, back}
   - quiz: array of {question, options, answerIndex, explanation}
   - roadmap: array of phases with tasks
   - revisionTips: array of tips
   - mnemonics: array of memory aids
   ```

### Frontend AI Handling

The frontend implements sophisticated request lifecycle management:

1. **Request Sequencing** - Prevent stale response overwrites
2. **Automatic Cancellation** - Cancel on navigation, unmount, or new request
3. **Client-side Validation** - Defense-in-depth validation layer
4. **Timeout Management** - User-friendly timeout messages with retry
5. **Error Recovery** - Graceful degradation with fallback values

## 🔒 Security

### Environment Variables
- `GEMINI_API_KEY` stored in `.env` (never committed to git)
- `.env` files included in `.gitignore`
- Use `.env.example` as template

### Data Privacy
- No user data sent to third parties (except Gemini API)
- Study sessions stored locally in browser (localStorage)
- Optional privacy mode to disable history saving
- No analytics/tracking by default

### API Security
- Request validation on all endpoints
- Rate limiting middleware
- CORS configuration
- Input sanitization

## 📊 Study Plan JSON Structure

```json
{
  "title": "Study material title",
  "summary": "Comprehensive summary with sections...",
  "difficulty": "Medium",
  "estimatedStudyTime": "2-3 hours",
  "keyConcepts": [
    {
      "concept": "Concept name",
      "explanation": "Detailed explanation..."
    }
  ],
  "flashcards": [
    {
      "front": "Question",
      "back": "Answer"
    }
  ],
  "quiz": [
    {
      "question": "Question text",
      "options": ["A", "B", "C", "D"],
      "answerIndex": 0,
      "explanation": "Why this is correct..."
    }
  ],
  "roadmap": [
    {
      "phase": "Phase name",
      "tasks": [
        {
          "id": "task-1",
          "task": "Task name",
          "description": "Task details"
        }
      ]
    }
  ],
  "revisionTips": [
    {
      "id": "tip-1",
      "text": "Study tip..."
    }
  ],
  "mnemonics": [
    {
      "concept": "Term",
      "phrase": "Memory device..."
    }
  ]
}
```

## 🚀 Deployment

### Render Deployment (Backend)

The backend is configured for Render with `render.yaml`:

1. Connect GitHub repository to Render
2. Set environment variables in Render dashboard
3. Deploy automatically on push to main branch

### Frontend Deployment

Deploy to Vercel, Netlify, or any static host:

```bash
cd client
npm run build
# Upload dist/ folder to hosting platform
```

## 📈 Performance Features

### Race Condition Prevention
- Request sequence tracking prevents newer responses from being overwritten
- `isResponseStale()` checks before updating UI
- Automatic request cancellation on new submissions

### Request Lifecycle
1. User submits → Generate new sequence number
2. Fetch starts → Previous requests cancelled
3. Response arrives → Check if stale
4. If stale → Discard silently
5. If fresh → Update UI and navigation

### Timeout Handling
- 120-second request timeout
- Graceful degradation with retry option
- Exponential backoff for retries (1s, 2s, 4s)
- No UI freezing during long operations

### Error Recovery
- Network offline detection
- Automatic retry for transient errors
- User-friendly error messages
- Preserve form data during errors

## 📝 Usage Examples

### Generate a Study Plan

1. Navigate to home page
2. Enter topic or paste notes
3. Select difficulty level (Easy/Medium/Hard)
4. Click "Generate Study Plan"
5. Review and interact with materials

### Study Workflow

1. **Review Summary** - Get an overview
2. **Learn Concepts** - Understand key ideas
3. **Practice Flashcards** - Test recall
4. **Take Quiz** - Assess understanding
5. **Follow Roadmap** - Track progress
6. **Memorize Mnemonics** - Lock in learning

## 🐛 Known Limitations

1. **API Rate Limits** - Gemini API has usage limits (check Google documentation)
2. **Text-Only Input** - Currently doesn't support document uploads (implementation ready)
3. **No Offline Mode** - Requires internet connection for AI generation
4. **Local Storage Only** - No cloud sync (can be added with backend database)
5. **Single User** - Multi-user support requires authentication system

## 🎓 AI Usage Note

This application was developed with AI assistance from Claude AI for:
- Code architecture and structure
- React component patterns
- TypeScript type definitions
- Error handling strategies
- UI/UX implementation
- Documentation writing

Core business logic, data structures, and deployment configuration were designed to be maintainable and production-ready.

## ⏱️ Development Time

**Approximate time spent:** 40-50 hours

- Frontend UI/UX design & implementation: 20 hours
- Backend API & AI integration: 15 hours
- Error handling & reliability features: 10 hours
- Testing, documentation & deployment: 5-10 hours

## 🤝 Contributing

Contributions welcome! Areas for improvement:
- Multi-language support
- Document upload functionality
- Custom AI model selection
- Advanced analytics dashboard
- Social sharing features

## 📄 License

MIT License - Feel free to use and modify

## 💬 Support

For issues or questions:
1. Check existing GitHub issues
2. Review error messages (usually informative)
3. Check console logs for debugging info
4. Verify `.env` variables are set correctly

## 🌟 Future Roadmap

- [ ] Document/PDF upload support
- [ ] Collaborative study sessions
- [ ] Speech-to-text input
- [ ] Custom AI model selection
- [ ] Study groups feature
- [ ] Achievement badges system
- [ ] Mobile native app
- [ ] Offline study materials

---

**StudyFlow** - Making learning smarter, one study plan at a time. 📚✨
