import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  StudySession, StudyPlan, Flashcard, QuizQuestion,
  RoadmapPhase, RevisionTip, Mnemonic
} from "../types/index.js";
import { printStudyPlan } from "../utils/pdfGenerator.js";
import { Button } from "../components/common/Button.js";
import { SummaryCard }      from "../components/Summary/SummaryCard.js";
import { ConceptCard }      from "../components/KeyConcepts/ConceptCard.js";
import { FlashcardContainer } from "../components/Flashcards/FlashcardContainer.js";
import { QuizContainer }    from "../components/Quiz/QuizContainer.js";
import { RoadmapTimeline }  from "../components/Roadmap/RoadmapTimeline.js";
import { TipsPanel }        from "../components/RevisionTips/TipsPanel.js";
import { MnemonicsGrid }    from "../components/Mnemonics/MnemonicsGrid.js";
import { DeveloperPanel }   from "../components/common/DeveloperPanel.js";
import { useSettings }      from "../hooks/useSettings.js";
import {
  FileText, Lightbulb, CreditCard, HelpCircle,
  Map, ClipboardList, Brain, Printer, Star,
  ChevronLeft, Clock, CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SessionPageProps {
  activeSession: StudySession | null;
  onUpdateSession: (updated: StudySession) => void;
  onToggleBookmark: (id: string) => void;
}

type TabId = "summary" | "concepts" | "flashcards" | "quiz" | "roadmap" | "tips" | "mnemonics";

// ─── Tab definitions ──────────────────────────────────────────────────────────

const TABS: Array<{ id: TabId; label: string; icon: React.ElementType; shortLabel: string }> = [
  { id: "summary",    label: "Summary",       shortLabel: "Summary",   icon: FileText     },
  { id: "concepts",   label: "Key Concepts",  shortLabel: "Concepts",  icon: Lightbulb    },
  { id: "flashcards", label: "Flashcards",    shortLabel: "Cards",     icon: CreditCard   },
  { id: "quiz",       label: "Quiz",          shortLabel: "Quiz",      icon: HelpCircle   },
  { id: "roadmap",    label: "Roadmap",       shortLabel: "Roadmap",   icon: Map          },
  { id: "tips",       label: "Revision Tips", shortLabel: "Tips",      icon: ClipboardList},
  { id: "mnemonics",  label: "Mnemonics",     shortLabel: "Memory",    icon: Brain        },
];

const DIFF_BADGE: Record<string, string> = {
  Easy:   "badge-jade",
  Medium: "badge-amber",
  Hard:   "badge-rose",
};

// ─── Component ────────────────────────────────────────────────────────────────

export const SessionPage: React.FC<SessionPageProps> = ({
  activeSession,
  onUpdateSession,
  onToggleBookmark,
}) => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [activeTab, setActiveTab]     = useState<TabId>("summary");
  const [savedFlash, setSavedFlash]   = useState(false);

  useEffect(() => {
    if (!activeSession) navigate("/");
  }, [activeSession, navigate]);

  if (!activeSession) return null;

  const { studyPlan, topic, isBookmarked } = activeSession;

  // ── Autosave flash ──
  const triggerSaveFlash = () => {
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1800);
  };

  // ── Update a single plan section and persist ──
  const updateSection = (key: keyof StudyPlan, value: unknown) => {
    const updatedPlan    = { ...studyPlan, [key]: value };
    const updatedSession = { ...activeSession, studyPlan: updatedPlan };
    onUpdateSession(updatedSession);
    triggerSaveFlash();
  };

  return (
    <div className="min-h-[calc(100dvh-48px)] flex flex-col">
      {/* ── Session header ───────────────────────────────────────────── */}
      <div className="border-b border-[rgba(255,255,255,0.07)] bg-void-950/80 backdrop-blur sticky top-12 z-20">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 py-4">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">

            {/* Left: breadcrumb + title */}
            <div className="space-y-2 min-w-0">
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-1.5 text-xs text-void-500 hover:text-void-200 transition-colors focus-ring rounded"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                New session
              </button>

              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="font-display text-xl sm:text-2xl font-bold text-void-50 leading-tight truncate">
                  {studyPlan.title}
                </h1>
                <span className={DIFF_BADGE[studyPlan.difficulty] ?? "badge-amber"}>
                  {studyPlan.difficulty}
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs text-void-500">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {studyPlan.estimatedStudyTime}
                </span>
                <span className="hidden sm:block truncate max-w-xs opacity-60">
                  "{topic}"
                </span>
              </div>
            </div>

            {/* Right: toolbar */}
            <div className="flex items-center gap-2 shrink-0">
              <AnimatePresence>
                {savedFlash && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex items-center gap-1.5 text-xs text-jade-400 px-3 py-1.5 rounded-lg bg-jade-500/10 border border-jade-500/20"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Saved
                  </motion.span>
                )}
              </AnimatePresence>

              <button
                onClick={() => onToggleBookmark(activeSession.id)}
                title="Bookmark session"
                className={[
                  "w-8 h-8 flex items-center justify-center rounded-lg border transition-all focus-ring",
                  isBookmarked
                    ? "bg-amber-500/12 border-amber-500/30 text-amber-400"
                    : "border-[rgba(255,255,255,0.08)] text-void-500 hover:text-void-200 hover:bg-white/5",
                ].join(" ")}
              >
                <Star className={`w-4 h-4 ${isBookmarked ? "fill-amber-400" : ""}`} />
              </button>

              <Button
                variant="ghost"
                size="sm"
                icon={<Printer className="w-3.5 h-3.5" />}
                onClick={() => printStudyPlan(studyPlan)}
              >
                Print
              </Button>
            </div>
          </div>

          {/* ── Tab bar ────────────────────────────────────────────────── */}
          <div className="mt-4 flex items-center gap-1 overflow-x-auto no-scrollbar">
            {TABS.map((tab) => {
              const Icon     = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={[
                    "flex items-center gap-2 px-3.5 py-2 rounded-lg text-[12px] font-medium whitespace-nowrap transition-all focus-ring shrink-0",
                    isActive
                      ? "bg-amber-500/12 text-amber-400 border border-amber-500/25"
                      : "text-void-500 hover:text-void-200 hover:bg-white/5 border border-transparent",
                  ].join(" ")}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-amber-400" : "text-void-600"}`} />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.shortLabel}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Tab content ──────────────────────────────────────────────── */}
      <div className="flex-1 max-w-screen-xl mx-auto w-full px-4 sm:px-6 lg:px-10 py-8">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeTab}
            initial={settings.animationsEnabled ? { opacity: 0, y: 10 } : { opacity: 1 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: settings.animationsEnabled ? 0 : 1 }}
            transition={settings.animationsEnabled
              ? { duration: 0.22, ease: [0.22, 1, 0.36, 1] }
              : { duration: 0 }}
          >
            {activeTab === "summary" && (
              <SummaryCard
                summary={studyPlan.summary}
                animationsEnabled={settings.animationsEnabled}
              />
            )}
            {activeTab === "concepts" && (
              <ConceptCard
                concepts={studyPlan.keyConcepts}
                animationsEnabled={settings.animationsEnabled}
              />
            )}
            {activeTab === "flashcards" && (
              <FlashcardContainer
                flashcards={studyPlan.flashcards}
                topicTitle={studyPlan.title}
                onUpdateFlashcards={(u) => updateSection("flashcards", u)}
                animationsEnabled={settings.animationsEnabled}
              />
            )}
            {activeTab === "quiz" && (
              <QuizContainer
                quiz={studyPlan.quiz}
                topicTitle={studyPlan.title}
                onUpdateQuiz={(u) => updateSection("quiz", u)}
                animationsEnabled={settings.animationsEnabled}
              />
            )}
            {activeTab === "roadmap" && (
              <RoadmapTimeline
                roadmap={studyPlan.roadmap}
                onUpdateRoadmap={(u) => updateSection("roadmap", u)}
                animationsEnabled={settings.animationsEnabled}
              />
            )}
            {activeTab === "tips" && (
              <TipsPanel
                tips={studyPlan.revisionTips}
                onUpdateTips={(u) => updateSection("revisionTips", u)}
                animationsEnabled={settings.animationsEnabled}
              />
            )}
            {activeTab === "mnemonics" && (
              <MnemonicsGrid
                mnemonics={studyPlan.mnemonics}
                onUpdateMnemonics={(u) => updateSection("mnemonics", u)}
                animationsEnabled={settings.animationsEnabled}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Developer panel */}
        {settings.developerMode && activeSession.rawJson && (
          <div className="mt-10">
            <DeveloperPanel
              rawJson={activeSession.rawJson}
              metadata={activeSession.debugMetadata}
              studyPlan={studyPlan}
              animationsEnabled={settings.animationsEnabled}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionPage;
