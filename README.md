# Study Assistant

An AI-powered Study Assistant that converts user input (notes or topics) into structured AI-generated study materials. Unlike traditional chatbot applications, this tool focuses on generating structured JSON output that is parsed and displayed as interactive learning components including flashcards, quizzes, summaries, and roadmaps.

## Features

**Core Features:**
- **AI-Generated Study Plans**: Enter any topic or paste notes to generate comprehensive study materials
- **Structured Output**: AI returns validated JSON containing multiple study components
- **Summary**: AI-generated comprehensive study overview with markdown rendering
- **Key Concepts**: Extracted core concepts with explanations
- **Interactive Flashcards**: Flip cards with navigation, mark favorites/difficult/completed, shuffle, search, and filter
- **Multiple-Choice Quizzes**: Interactive quiz with explanations, progress tracking, results view, and retry functionality
- **Learning Roadmap**: Phase-based timeline with trackable tasks and progress indicators
- **Revision Tips**: Curated study tips with completion tracking and pinning
- **Mnemonics**: Memory aids with search and favorite functionality

**User Interface:**
- **Dashboard**: Statistics tracking (topics studied, streak, quiz accuracy, flashcards completed)
- **Study History**: Save, search, sort, filter, bookmark, and delete study sessions
- **Session Page**: Tabbed interface to access all study components
- **Dark Mode**: Theme support with customizable settings
- **Responsive Design**: Optimized for desktop and mobile devices
- **Animations**: Smooth transitions and loading states

**Technical Features:**
- **Local Storage**: Study history and stats persisted in browser
- **Error Handling**: Comprehensive error handling with retry mechanisms
- **Request Cancellation**: Prevents stale responses when navigating away
- **Loading States**: Visual feedback during AI generation
- **Client-Side Validation**: Defense-in-depth validation of AI responses

## Tech Stack

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Framer Motion** - Animation library
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Axios** - HTTP client
- **TanStack React Query** - Data fetching and caching
- **React Hot Toast** - Toast notifications
- **Lucide React** - Icon library
- **Canvas Confetti** - Celebration animations
- **React Markdown** - Markdown rendering
- **Remark GFM** - GitHub Flavored Markdown support

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **TypeScript** - Type safety
- **OpenRouter API** (via OpenAI SDK) - AI model provider
- **Zod** - Request validation
- **CORS** - Cross-origin resource sharing
- **Express Rate Limit** - API rate limiting
- **Mammoth** - DOCX document parsing
- **PDF Parse** - PDF document parsing
- **Tesseract.js** - OCR for image-based documents
- **Sharp** - Image processing
- **Multer** - File upload handling
- **Dotenv** - Environment variable management

## Project Structure

```
study_assistant/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── studyController.ts    # Request handling and validation
│   │   ├── middleware/
│   │   │   ├── errorHandler.ts       # Global error handling
│   │   │   └── rateLimiter.ts         # API rate limiting
│   │   ├── routes/
│   │   │   └── study.ts              # API route definitions
│   │   ├── services/
│   │   │   ├── geminiService.ts      # AI integration and prompt engineering
│   │   │   └── document-parser/      # Document parsing services
│   │   │       ├── chunker.ts        # Text chunking
│   │   │       ├── docxParser.ts     # DOCX parsing
│   │   │       ├── ocrService.ts     # OCR for images
│   │   │       ├── pdfParser.ts      # PDF parsing
│   │   │       ├── pptxParser.ts     # PPTX parsing
│   │   │       └── textCleaner.ts    # Text cleaning utilities
│   │   └── server.ts                 # Express server setup
│   ├── data/
│   │   └── users.json                # User data storage
│   ├── .env.example                  # Environment variables template
│   ├── package.json                  # Backend dependencies
│   └── tsconfig.json                 # TypeScript configuration
│
├── client/
│   ├── public/                       # Static assets
│   ├── src/
│   │   ├── animations/               # Animation components
│   │   ├── app/                      # App providers
│   │   ├── components/
│   │   │   ├── common/               # Shared UI components
│   │   │   ├── Dashboard/            # Dashboard components
│   │   │   ├── Flashcards/           # Flashcard components
│   │   │   ├── KeyConcepts/          # Key concept components
│   │   │   ├── Mnemonics/            # Mnemonic components
│   │   │   ├── Quiz/                 # Quiz components
│   │   │   ├── Roadmap/              # Roadmap components
│   │   │   ├── RevisionTips/         # Revision tip components
│   │   │   ├── Summary/              # Summary components
│   │   │   └── layout/               # Layout components
│   │   ├── contexts/                 # React contexts
│   │   ├── features/                 # Feature modules
│   │   ├── hooks/                    # Custom React hooks
│   │   ├── pages/                    # Page components
│   │   │   ├── Home.tsx              # Landing page
│   │   │   ├── SessionPage.tsx       # Study session page
│   │   │   ├── DashboardPage.tsx     # Dashboard page
│   │   │   └── HistoryPage.tsx      # Study history page
│   │   ├── schemas/                  # Zod validation schemas
│   │   ├── services/                 # API services
│   │   ├── types/                    # TypeScript type definitions
│   │   ├── utils/                    # Utility functions
│   │   ├── App.tsx                   # Main app component
│   │   ├── main.tsx                  # Entry point
│   │   └── index.css                 # Global styles
│   ├── .env.example                  # Environment variables template
│   ├── package.json                  # Frontend dependencies
│   ├── tailwind.config.js            # Tailwind configuration
│   └── tsconfig.json                 # TypeScript configuration
│
├── .gitignore                        # Git ignore rules
├── package.json                      # Root package.json
└── README.md                         # This file
```

## Setup

### Clone Repository

```bash
git clone <repository-url>
cd study_assistant
```

### Install Dependencies

**Frontend:**
```bash
cd client
npm install
```

**Backend:**
```bash
cd backend
npm install
```

### Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cd backend
```

Create a `.env` file with the following content:

```env
OPENROUTER_API_KEY=your_api_key_here
OPENROUTER_MODEL=openai/gpt-4o-mini
PORT=5000
```

**Important:** Never commit your `.env` file or API keys to GitHub. The `.env` file is already included in `.gitignore`.

To get an OpenRouter API key:
1. Visit [OpenRouter.ai](https://openrouter.ai/)
2. Sign up for an account
3. Navigate to API Keys section
4. Generate a new API key
5. Copy the key and add it to your `.env` file

### Running the Project

**Backend (Terminal 1):**
```bash
cd backend
npm run dev
```
The backend will start on `http://localhost:5000`

**Frontend (Terminal 2):**
```bash
cd client
npm run dev
```
The frontend will start on `http://localhost:5173`

**Development Mode:**
Both servers run in watch mode and will automatically reload on file changes.

**Production Build:**
```bash
# Build frontend
cd client
npm run build

# Build backend
cd ../backend
npm run build

# Start production backend
npm start
```

## Usage

1. **Start the Backend**: Navigate to the `backend` directory and run `npm run dev`. Ensure your `.env` file is configured with a valid OpenRouter API key.

2. **Start the Frontend**: Navigate to the `client` directory and run `npm run dev`.

3. **Open the Application**: Open your browser and navigate to `http://localhost:5173`

4. **Enter Study Material**: On the home page, enter your study topic or paste your notes in the text area. Select a difficulty level (Easy, Medium, or Hard).

5. **Generate Study Plan**: Click the "Generate Study Plan" button. The AI will process your input and create a comprehensive study plan.

6. **Practice Interactively**: 
   - **Summary**: Read the AI-generated summary for quick overview
   - **Key Concepts**: Review core concepts with explanations
   - **Flashcards**: Flip through flashcards to test your knowledge
   - **Quiz**: Take multiple-choice quizzes with explanations
   - **Roadmap**: Follow the learning timeline and track progress
   - **Tips**: Review revision tips and mark them as complete
   - **Mnemonics**: Use memory aids to remember complex information

7. **Track Progress**: Visit the Dashboard to view your learning statistics, streak, and achievements.

8. **View History**: Access the History page to revisit previous study sessions.

## AI Usage Note

### AI Provider and Model
This application uses **OpenRouter API** as the AI provider, which gives access to multiple language models. The default model is **OpenAI GPT-4o-mini** (`openai/gpt-4o-mini`), chosen for its balance of speed, cost, and quality for educational content generation.

### Why AI is Used
AI is used to transform unstructured text (notes, topics) into structured, pedagogically-sound study materials. The AI analyzes the input content and generates:
- Comprehensive summaries
- Key concept explanations
- Flashcard pairs
- Multiple-choice quizzes with explanations
- Learning roadmaps
- Revision tips
- Memory aids (mnemonics)

### Prompt Construction
The application uses carefully engineered system and user prompts to ensure high-quality, structured output:

- **System Prompt**: Defines the AI's role as an expert educational content creator and specifies the exact JSON schema required
- **User Prompt**: Provides the study material and difficulty context
- **Response Format**: Uses OpenAI's `response_format: { type: "json_object" }` to enforce JSON output
- **Temperature**: Set to 0.3 for consistent, focused responses

### Structured JSON Output
The application expects and validates structured JSON output matching a strict Zod schema. This ensures:
- All required fields are present
- Data types are correct
- Arrays have minimum required elements
- String fields meet length requirements

### Handling Malformed AI Responses
The application implements multiple layers of error recovery:

1. **Direct JSON Parse**: Attempts to parse the response as pure JSON first
2. **Markdown Extraction**: If direct parse fails, extracts JSON from markdown code blocks
3. **JSON Cleaning**: Removes common issues (trailing commas, single quotes, undefined values)
4. **Syntax Fixes**: Attempts to fix common JSON syntax errors
5. **Recovery Truncation**: Truncates to the last valid JSON structure if needed
6. **Retry Mechanism**: Retries with stricter prompts if initial attempts fail
7. **Self-Healing**: Adds default values for missing fields
8. **Schema Validation**: Final validation with Zod to ensure structure integrity

### Development AI Usage
This project was primarily developed by me with assistance from AI coding tools:

- **Windsurf** - Used as the primary AI coding assistant for implementation, debugging, refactoring, and improving code throughout the development process
- **ChatGPT** - Used for brainstorming ideas, debugging assistance, explaining technical concepts, reviewing architecture decisions, and generating documentation ideas

All AI-generated code was reviewed, tested, modified where necessary, and integrated by me. I understand the entire codebase and can explain the design decisions, implementation details, and architectural choices made during development.

## Error Handling

The application implements error handling at multiple levels:

### Invalid JSON
- Multiple JSON parsing strategies (direct parse, markdown extraction, cleaning, syntax fixes)
- Retry mechanism with stricter prompts (up to 2 retries)
- Self-healing with default values for missing fields
- Detailed logging for debugging

### Empty Responses
- Validation that response content is non-empty before parsing
- Clear error message if AI returns empty response

### API Failures
- Rate limit detection (HTTP 429) with user-friendly message
- Connection error handling with network diagnostics
- Timeout handling (120-second timeout with clear error message)
- Exponential backoff with jitter for transient errors (up to 3 retries)

### Timeout Handling
- 120-second timeout for AI requests
- Clear timeout error messages
- Automatic retry for timeout errors

### Preventing Stale Responses
- Request cancellation when navigating away from generation page
- Loading state management to prevent duplicate submissions
- Request sequence tracking to ignore outdated responses

### User-Friendly Error Messages
- Contextual error messages based on error type
- Retry buttons for recoverable errors
- Toast notifications for non-blocking errors
- Error boundaries to prevent app crashes

## Known Limitations

- **AI Content Quality**: AI may occasionally generate imperfect or inaccurate content. Always verify important information.
- **Response Quality Dependency**: Quality of generated materials depends on the quality and clarity of input text.
- **Internet Connection Required**: Requires active internet connection to access the AI API.
- **Third-Party API Dependency**: Depends on OpenRouter API availability and uptime.
- **Large Input Processing**: Very large inputs (over 5MB) may take longer to process or hit API limits.
- **API Rate Limits**: Free API tiers may have rate limits that affect usage frequency.
- **Language Support**: Primarily optimized for English content; other languages may have reduced quality.
- **Browser Compatibility**: Modern browsers with ES6+ support required for optimal performance.
- **Local Storage**: Study history and settings are stored in browser local storage (clearing browser data will lose this information).

## Time Spent

### Development Timeline (Assignment Implementation)

**Planning**: 2 hours
- Project architecture design
- Tech stack selection
- Feature specification

**Frontend UI Development**: 2 hours
- Component architecture setup
- Home page with input form
- Session page with tabbed interface
- Flashcard component with flip animation
- Quiz component with validation
- Dashboard with statistics
- History page with session management
- Navigation and layout components
- Responsive design implementation
- Animation integration (Framer Motion)

**Backend API Development**: 2 hours
- Express server setup
- API route configuration
- Request validation with Zod
- CORS configuration
- Rate limiting implementation
- Error handling middleware

**AI Integration**: 2 hours
- OpenRouter API integration
- Prompt engineering and optimization
- JSON schema design with Zod
- Response parsing and validation
- Error recovery mechanisms
- Retry logic implementation

**Testing**: 0.5 hours
- Component testing
- API endpoint testing
- Error scenario testing
- Mobile responsiveness testing

**Bug Fixing**: 1.5 hours
- JSON parsing edge cases
- Timeout handling
- State management issues
- Error boundary improvements

**Total Development Time**: 10 hours (approximately) 

## Future Improvements

- **User Authentication**: Add user accounts with cloud sync for study history and settings
- **Multiple Quiz Types**: Add fill-in-the-blank, true/false, and matching questions
- **AI Explanations**: Request AI explanations for specific concepts or quiz answers
- **Document Upload**: Direct PDF/DOCX upload with automatic text extraction
- **Streaming Responses**: Implement streaming for real-time content generation
- **Spaced Repetition**: Algorithmic review scheduling based on forgetting curves
- **Offline Mode**: Progressive Web App (PWA) with offline capabilities

## Screenshots

### Home Page
![Home Page](screenshots/study-assistant-kw9o.vercel.app_.png)
*Main landing page with topic input and difficulty selection*
### Flashcards
![Flashcards](screenshots/study-assistant-kw9o.vercel.app_session (1).png)
*Interactive flashcard interface with flip animation*
### Dashboard
![Dashboard](screenshots/study-assistant-kw9o.vercel.app_dashboard (1).png)
*Statistics dashboard showing learning progress and achievements*
### Study Session
![Study Session](screenshots/study-assistant-kw9o.vercel.app_session.png)
*Complete study session with all learning components*


## Author

**Ram Sathvik**

- GitHub: [@ramsathvik99](https://github.com/ramsathvik99)
- Project: Study Assistant
- Version: 1.0.0
