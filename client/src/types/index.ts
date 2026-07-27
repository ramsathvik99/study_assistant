export interface KeyConcept {
  concept: string;
  explanation: string;
}

export interface Flashcard {
  front: string;
  back: string;
  isFavorite?: boolean;
  isDifficult?: boolean;
  completed?: boolean;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
  userAnswerIndex?: number | null; // Null or number representing selected answer
}

export interface RoadmapTask {
  id: string;
  task: string;
  description: string;
  completed: boolean;
}

export interface RoadmapPhase {
  phase: string;
  tasks: RoadmapTask[];
}

export interface RevisionTip {
  id: string;
  text: string;
  completed: boolean;
  pinned: boolean;
}

export interface Mnemonic {
  concept: string;
  phrase: string;
  isFavorite?: boolean;
}

export interface StudyPlan {
  title: string;
  summary: string;
  difficulty: "Easy" | "Medium" | "Hard";
  estimatedStudyTime: string;
  keyConcepts: KeyConcept[];
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
  roadmap: RoadmapPhase[];
  revisionTips: RevisionTip[];
  mnemonics: Mnemonic[];
}

export interface DebugMetadata {
  responseTime?: number;
  requestTime?: number;
  timestamp?: number;
  model?: string;
  tokenUsage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
  validationStatus?: "valid" | "invalid" | "pending";
  validationError?: string;
  validationTime?: number;
  jsonParseTime?: number;
  payloadSize?: number;
  warnings?: string[];
}

export interface StudySession {
  id: string;
  topic: string;
  timestamp: number;
  studyPlan: StudyPlan;
  isBookmarked?: boolean;
  debugMetadata?: DebugMetadata;
  rawJson?: string;
}

export interface UserStats {
  topicsCount: number;
  flashcardsCompleted: number;
  quizAccuracy: number; // Percent, e.g., 85
  quizzesTaken: number;
  revisionProgress: number; // Percentage of tasks/tips checked off
  averageScore: number; // Percentage score
  streak: number;
  lastActiveDate: string | null; // YYYY-MM-DD
  dailyGoalProgress: number; // 0 to 100
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlockedAt: number | null; // Timestamp, null if locked
  icon: string;
}

export interface AppSettings {
  // Appearance
  darkMode: boolean;
  accentColor: "primary" | "emerald" | "purple" | "blue" | "pink" | "orange";
  animationsEnabled: boolean;
  reducedMotion: boolean;
  fontSize: "small" | "medium" | "large";
  highContrast: boolean;
  
  // AI Settings
  aiModel: string;
  responseLength: "short" | "medium" | "detailed";
  temperature: number;
  streamingEnabled: boolean;
  defaultDifficulty: "Easy" | "Medium" | "Hard";
  autoGenerateQuiz: boolean;
  includeMnemonics: boolean;
  defaultOutputSections: {
    summary: boolean;
    keyConcepts: boolean;
    flashcards: boolean;
    quiz: boolean;
    checklist: boolean;
    roadmap: boolean;
    importantTerms: boolean;
    tips: boolean;
  };
  
  // Document Settings
  maxChunkSize: number;
  autoSummarization: boolean;
  ocrEnabled: boolean;
  rememberLastFolder: boolean;
  
  // Notifications
  notificationsEnabled: boolean;
  studyReminders: boolean;
  completionNotifications: boolean;
  achievementAlerts: boolean;
  
  // Privacy
  saveStudyHistory: boolean;
  analyticsEnabled: boolean;
  
  // Account
  displayName: string;
  
  // Keyboard
  keyboardShortcutsEnabled: boolean;
  
  // Language
  language: "en" | "es" | "fr" | "de" | "zh" | "ja";
  
  // Accessibility
  largeText: boolean;
  keyboardNavigation: boolean;
  screenReaderEnhancements: boolean;
  
  // Developer
  developerMode: boolean;
}

export interface StudyGoal {
  id: string;
  userId: string;
  topic: string;
  targetDate: string; // YYYY-MM-DD
  dailyHours: number;
  priority: "Low" | "Medium" | "High";
  status: "To Do" | "In Progress" | "Completed";
  description?: string;
  createdAt: number;
}

