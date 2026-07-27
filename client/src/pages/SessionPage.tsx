import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Lightbulb,
  BookOpen,
  Award,
  Map,
  ListChecks,
  Brain,
  Star,
  Printer,
  ChevronLeft,
  Clock,
} from "lucide-react";
import { StudySession } from "../types/index";
import { PageContainer, PageHeader } from "../components/layout/PageContainer";
import { Button } from "../components/common/Button";
import { SummaryCard } from "../components/Summary/SummaryCard";
import { ConceptCard } from "../components/KeyConcepts/ConceptCard";
import { FlashcardContainer } from "../components/Flashcards/FlashcardContainer";
import { QuizContainer } from "../components/Quiz/QuizContainer";
import { RoadmapTimeline } from "../components/Roadmap/RoadmapTimeline";
import { TipsPanel } from "../components/RevisionTips/TipsPanel";
import { MnemonicsGrid } from "../components/Mnemonics/MnemonicsGrid";
import { EmptyState } from "../components/animations/EmptyState";
import { DeveloperPanel } from "../components/common/DeveloperPanel";
import { useSettings } from "../hooks/useSettings";
import { printStudyPlan } from "../utils/pdfGenerator";

interface SessionPageProps {
  activeSession: StudySession | null;
  onUpdateSession: (updated: StudySession) => void;
  onToggleBookmark: (id: string) => void;
}

type TabType = "summary" | "concepts" | "flashcards" | "quiz" | "roadmap" | "tips" | "mnemonics";

interface Tab {
  id: TabType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const TABS: Tab[] = [
  { id: "summary", label: "Summary", icon: FileText, color: "primary" },
  { id: "concepts", label: "Concepts", icon: Lightbulb, color: "emerald" },
  { id: "flashcards", label: "Flashcards", icon: BookOpen, color: "purple" },
  { id: "quiz", label: "Quiz", icon: Award, color: "accent" },
  { id: "roadmap", label: "Roadmap", icon: Map, color: "indigo" },
  { id: "tips", label: "Tips", icon: ListChecks, color: "pink" },
  { id: "mnemonics", label: "Mnemonics", icon: Brain, color: "secondary" },
];

export const SessionPage: React.FC<SessionPageProps> = ({
  activeSession,
  onUpdateSession,
  onToggleBookmark,
}) => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [activeTab, setActiveTab] = useState<TabType>("summary");
  const [showSaveIndicator, setShowSaveIndicator] = useState(false);

  useEffect(() => {
    if (!activeSession) {
      navigate("/");
    }
  }, [activeSession, navigate]);

  if (!activeSession) return null;

  const { studyPlan, topic, isBookmarked } = activeSession;

  const triggerSaveIndicator = () => {
    setShowSaveIndicator(true);
    setTimeout(() => setShowSaveIndicator(false), 2000);
  };

  const updatePlan = <K extends keyof typeof studyPlan>(key: K, value: typeof studyPlan[K]) => {
    const updated = { ...activeSession, studyPlan: { ...studyPlan, [key]: value } };
    onUpdateSession(updated);
    triggerSaveIndicator();
  };

  const handlePrint = () => {
    printStudyPlan(studyPlan);
  };

  const currentTab = TABS.find((t) => t.id === activeTab)!;
  const Icon = currentTab.icon;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700";
      case "Medium":
        return "bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300 border-accent-200 dark:border-accent-700";
      case "Hard":
        return "bg-error-100 dark:bg-error-900/30 text-error-700 dark:text-error-300 border-error-200 dark:border-error-700";
      default:
        return "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700";
    }
  };

  return (
    <PageContainer>
      {/* Page Header */}
      <div className="mb-6 sm:mb-8">
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 px-3 py-2 text-small font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all mb-3 sm:mb-4 min-h-[44px] touch-manipulation"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back to Home</span>
          <span className="sm:hidden">Back</span>
        </button>

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3 sm:gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-h1 font-display text-slate-900 dark:text-white mb-2">
              {studyPlan.title}
            </h1>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className={`px-2 sm:px-3 py-1 rounded-lg text-[10px] sm:text-xs font-bold border ${getDifficultyColor(studyPlan.difficulty)}`}>
                {studyPlan.difficulty}
              </span>
              <span className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-700 rounded-lg text-[10px] sm:text-xs font-bold text-primary-700 dark:text-primary-300">
                <Clock className="w-3 h-3" />
                {studyPlan.estimatedStudyTime}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <AnimatePresence>
              {showSaveIndicator && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="px-2.5 sm:px-3 py-1.5 sm:py-2 bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 rounded-lg text-[10px] sm:text-xs font-bold"
                >
                  ✓ Saved
                </motion.div>
              )}
            </AnimatePresence>

            <Button
              variant="outline"
              size="md"
              onClick={() => onToggleBookmark(activeSession.id)}
              icon={
                <Star
                  className={`w-4 h-4 ${
                    isBookmarked ? "fill-accent-500 text-accent-500" : "text-slate-400"
                  }`}
                />
              }
              className="hidden sm:flex"
            >
              {isBookmarked ? "Saved" : "Save"}
            </Button>

            <Button
              variant="outline"
              size="md"
              onClick={() => onToggleBookmark(activeSession.id)}
              icon={
                <Star
                  className={`w-4 h-4 ${
                    isBookmarked ? "fill-accent-500 text-accent-500" : "text-slate-400"
                  }`}
                />
              }
              className="sm:hidden"
            >
              <span className="sr-only">{isBookmarked ? "Saved" : "Save"}</span>
            </Button>

            <Button
              variant="outline"
              size="md"
              onClick={handlePrint}
              icon={<Printer className="w-4 h-4" />}
              className="hidden sm:flex"
            >
              Export
            </Button>

            <Button
              variant="outline"
              size="md"
              onClick={handlePrint}
              icon={<Printer className="w-4 h-4" />}
              className="sm:hidden"
            >
              <span className="sr-only">Export</span>
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 sm:mx-0 px-4 sm:px-0">
          {TABS.map((tab) => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap border min-h-[44px] touch-manipulation ${
                  isActive
                    ? `bg-${tab.color}-50 dark:bg-${tab.color}-900/30 border-${tab.color}-200 dark:border-${tab.color}-700 text-${tab.color}-700 dark:text-${tab.color}-300`
                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <TabIcon className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.slice(0, 4)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "summary" && (
            <SummaryCard summary={studyPlan.summary} title={studyPlan.title} />
          )}

          {activeTab === "concepts" && (
            <div className="space-y-3">
              {studyPlan.keyConcepts && studyPlan.keyConcepts.length > 0 ? (
                studyPlan.keyConcepts.map((concept, index) => (
                  <ConceptCard key={index} concept={concept} index={index} />
                ))
              ) : (
                <EmptyState
                  type="session"
                  title="No concepts available"
                  description="No key concepts are available for this study plan."
                />
              )}
            </div>
          )}

          {activeTab === "flashcards" && (
            <FlashcardContainer
              flashcards={studyPlan.flashcards}
              onUpdate={(updated) => updatePlan("flashcards", updated)}
            />
          )}

          {activeTab === "quiz" && (
            <QuizContainer
              questions={studyPlan.quiz}
              onUpdate={(updated) => updatePlan("quiz", updated)}
            />
          )}

          {activeTab === "roadmap" && (
            <RoadmapTimeline
              roadmap={studyPlan.roadmap}
              onUpdate={(updated) => updatePlan("roadmap", updated)}
            />
          )}

          {activeTab === "tips" && (
            <TipsPanel
              tips={studyPlan.revisionTips}
              onUpdate={(updated) => updatePlan("revisionTips", updated)}
            />
          )}

          {activeTab === "mnemonics" && (
            <MnemonicsGrid
              mnemonics={studyPlan.mnemonics}
              onUpdate={(updated) => updatePlan("mnemonics", updated)}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Developer Panel */}
      {settings.developerMode && (
        <div className="mt-8">
          <DeveloperPanel />
        </div>
      )}
    </PageContainer>
  );
};

export default SessionPage;
