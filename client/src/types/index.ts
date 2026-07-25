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
  darkMode: boolean;
  animationsEnabled: boolean;
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

