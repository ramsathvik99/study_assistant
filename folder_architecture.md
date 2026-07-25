# Complete Folder Architecture Blueprint

This blueprint defines the enterprise-scale folder structure for both the frontend (`client/`) and backend (`backend/`) of the AI Study Assistant. It accommodates all Phase 1, Phase 2, and Phase 3 features without requiring structural refactoring.

---

## 📱 Frontend Architecture (`client/`)

```
client/
├── public/                    # Static assets (favicons, manifest.json)
├── src/
│   ├── app/                   # App-wide providers, routing configuration, global store
│   │   ├── App.tsx            # Main app shell & global routing wrapper
│   │   ├── store.ts           # State store (Zustand/Redux if state scale expands)
│   │   └── providers.tsx      # Combined providers (Auth, Theme, Settings, QueryClient)
│   │
│   ├── pages/                 # Page-level route views
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx
│   │   │   └── RegisterPage.tsx
│   │   ├── DashboardPage.tsx  # Analytics and achievements overview
│   │   ├── HistoryPage.tsx    # List of past study sessions
│   │   ├── Home.tsx           # Entry generator dashboard (Paste/Upload)
│   │   ├── SessionPage.tsx    # Workspace page containing study modules tabs
│   │   ├── SettingsPage.tsx   # Account and display options
│   │   ├── StudyPlannerPage.tsx # Deadlines and hour planner
│   │   └── ChatTutorPage.tsx  # AI Interactive tutor (Phase 3)
│   │
│   ├── components/            # Shared reusable UI & modular domain features
│   │   ├── common/            # Atomic components (buttons, cards, inputs, tabs)
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Dropdown.tsx
│   │   │   ├── Navigation.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   └── Spinner.tsx
│   │   │
│   │   ├── study/             # Core generated study view component assemblies
│   │   │   ├── SummaryTab.tsx # Study plan text/speech view
│   │   │   └── ConceptCard.tsx # Detailed concept drilldowns
│   │   │
│   │   ├── flashcards/        # Flashcards modules (flipping, rating)
│   │   │   ├── FlashcardViewer.tsx
│   │   │   └── SpacedRepetitionList.tsx
│   │   │
│   │   ├── quiz/              # Testing modules (questions, timers, grading)
│   │   │   ├── QuizContainer.tsx
│   │   │   ├── QuizQuestionCard.tsx
│   │   │   └── Timer.tsx
│   │   │
│   │   ├── dashboard/         # Dashboard graphics
│   │   │   ├── StatsDashboard.tsx
│   │   │   └── AchievementsGrid.tsx
│   │   │
│   │   ├── planner/           # Study scheduling widgets
│   │   │   ├── GoalForm.tsx
│   │   │   └── CalendarGrid.tsx (Phase 3)
│   │   │
│   │   ├── notes/             # Note paste fields
│   │   │   └── NoteInputArea.tsx
│   │   │
│   │   ├── upload/            # Upload zones and status reports
│   │   │   └── FileUploadZone.tsx
│   │   │
│   │   ├── ocr/               # Image/camera text parser inputs (Phase 2)
│   │   │   └── CameraScanner.tsx
│   │   │
│   │   ├── mindmap/           # Interactive concept node graphs (Phase 2)
│   │   │   └── MindMapCanvas.tsx
│   │   │
│   │   ├── revision/          # Cheat sheets and quick summary notes (Phase 2)
│   │   │   └── CheatSheetExporter.tsx
│   │   │
│   │   ├── chat/              # Chat window layout with notes context (Phase 3)
│   │   │   └── TutorChatWindow.tsx
│   │   │
│   │   └── settings/          # Custom setting blocks
│   │       ├── ThemeSelector.tsx
│   │       └── VoiceSettings.tsx
│   │
│   ├── hooks/                 # Custom reusable hooks
│   │   ├── useLocalStorage.ts
│   │   ├── useSettings.ts
│   │   ├── useSpeech.ts
│   │   └── useWindowSize.ts
│   │
│   ├── contexts/              # Core React Context providers
│   │   ├── AuthContext.tsx
│   │   └── SettingsContext.tsx
│   │
│   ├── services/              # API interfaces and fetch controllers
│   │   ├── api/
│   │   │   ├── apiClient.ts   # Base fetch configurations (JWT, Abort)
│   │   │   ├── studyApi.ts    # Study-related backend triggers
│   │   │   └── uploadApi.ts   # File-upload parsing routes
│   │   └── ttsService.ts      # Web Speech API wrapper
│   │
│   ├── types/                 # TypeScript interfaces
│   │   ├── index.ts
│   │   └── study.ts
│   │
│   ├── schemas/               # Zod validation schemas (client side)
│   │   └── studyPlanSchema.ts
│   │
│   ├── utils/                 # Pure helper functions
│   │   ├── statsHelper.ts
│   │   ├── jsonValidator.ts
│   │   └── dateHelper.ts
│   │
│   ├── constants/             # Design theme values & default suggestions
│   │   └── suggestions.ts
│   │
│   ├── animations/            # Motion configuration variants
│   │   └── variants.ts
│   │
│   ├── assets/                # Static assets (images, logos)
│   │   └── logo.svg
│   │
│   └── styles/                # Global style sheets
│       └── index.css
│
├── tailwind.config.js
├── vite.config.ts
└── tsconfig.json
```

---

## ⚙️ Backend Architecture (`backend/`)

```
backend/
├── data/                      # Local JSON storage folder
│   ├── users.json             # Hashed accounts list
│   └── activeGoals.json       # Scheduled study plans metadata
│
├── uploads/                   # Temporary directory for uploaded files (PDF/TXT)
│
├── src/
│   ├── config/                # Environment config loaders
│   │   └── env.ts
│   │
│   ├── utils/                 # Utility file database managers
│   │   └── fileStore.ts
│   │
│   ├── validators/            # Zod validation middleware schemas
│   │   ├── authValidator.ts
│   │   └── requestValidator.ts
│   │
│   ├── middleware/            # Core Express middlewares
│   │   ├── authMiddleware.ts  # JWT validation
│   │   ├── errorHandler.ts    # Global error wrapper
│   │   └── rateLimiter.ts     # Request threshold limiters
│   │
│   ├── controllers/           # Route transaction controllers
│   │   ├── authController.ts
│   │   ├── studyController.ts
│   │   └── uploadController.ts
│   │
│   ├── routes/                # Endpoint bindings
│   │   ├── auth.ts            # Route handler for /api/auth
│   │   ├── study.ts           # Route handler for /api/generate
│   │   └── upload.ts          # Route handler for /api/upload
│   │
│   ├── services/              # External service API interfaces
│   │   ├── groq/
│   │   │   ├── groqClient.ts  # Shared Groq Client initialization
│   │   │   └── promptBuilder.ts # Dynamic text model queries
│   │   │
│   │   ├── auth/
│   │   │   └── tokenService.ts # Token generator helpers
│   │   │
│   │   ├── storage/
│   │   │   └── s3Storage.ts   # Placeholder for future cloud scale file stores (Phase 2)
│   │   │
│   │   └── rag/
│   │       ├── vectorDb.ts    # Vector DB interface for Chat with Notes (Phase 3)
│   │       └── chunker.ts     # Document parsing logic
│   │
│   ├── prompts/               # Centralized system and structured response templates
│   │   └── studyPlanPrompt.ts
│   │
│   └── server.ts              # Express App Bootloader
│
├── tsconfig.json
├── package.json
└── .env
```
