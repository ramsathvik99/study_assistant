import React, { useState, useEffect } from "react";
import { Button } from "../common/Button.js";
import { getPercentWidthClass } from "../../utils/styleHelper.js";
import { QuizQuestion } from "../../types/index.js";
import { downloadQuizTxt } from "../../utils/pdfGenerator.js";
import { fireQuizCompleteConfetti, firePerfectScoreConfetti } from "../common/Confetti.js";
import {
  HelpCircle, Clock, RotateCcw, CheckCircle2, XCircle,
  Award, ArrowRight, Download, AlertTriangle, Lightbulb
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface QuizContainerProps {
  quiz: QuizQuestion[];
  topicTitle: string;
  onUpdateQuiz: (updated: QuizQuestion[]) => void;
  animationsEnabled?: boolean;
}

const OPTION_LETTERS = ["A", "B", "C", "D", "E"];

export const QuizContainer: React.FC<QuizContainerProps> = ({
  quiz,
  topicTitle,
  onUpdateQuiz,
  animationsEnabled = true,
}) => {
  const [currentIdx,           setCurrentIdx]           = useState(0);
  const [selectedOption,       setSelectedOption]       = useState<number | null>(null);
  const [isSubmitted,          setIsSubmitted]          = useState(false);
  const [timeLeft,             setTimeLeft]             = useState(30);
  const [isQuizOver,           setIsQuizOver]           = useState(false);
  const [retryMode,            setRetryMode]            = useState(false);
  const [incorrectIndices,     setIncorrectIndices]     = useState<number[]>([]);
  const [activeQuestionIndices, setActiveQuestionIndices] = useState<number[]>(
    quiz.map((_, i) => i)
  );

  const activeQuestionIndex = activeQuestionIndices[currentIdx];
  const question            = quiz[activeQuestionIndex];

  // ── Reset on question change ──
  useEffect(() => {
    if (!isQuizOver && question) {
      setSelectedOption(question.userAnswerIndex !== undefined ? question.userAnswerIndex : null);
      setIsSubmitted(question.userAnswerIndex !== null && question.userAnswerIndex !== undefined);
      setTimeLeft(30);
    }
  }, [currentIdx, isQuizOver, question, activeQuestionIndex]);

  // ── Timer ──
  useEffect(() => {
    if (isQuizOver || isSubmitted || !question) return;
    if (timeLeft === 0) { handleSubmit(true); return; }
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timeLeft, isSubmitted, isQuizOver, question]);

  const handleSubmit = (forceTimeout = false) => {
    if (isSubmitted) return;
    const answer = forceTimeout ? -1 : selectedOption;
    setIsSubmitted(true);
    const updated = [...quiz];
    updated[activeQuestionIndex] = { ...updated[activeQuestionIndex], userAnswerIndex: answer };
    onUpdateQuiz(updated);
    if (answer !== question.answerIndex && !incorrectIndices.includes(activeQuestionIndex)) {
      setIncorrectIndices((p) => [...p, activeQuestionIndex]);
    }
  };

  const handleNext = () => {
    if (currentIdx < activeQuestionIndices.length - 1) {
      setCurrentIdx((p) => p + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      setIsQuizOver(true);
      const correct = activeQuestionIndices.filter((i) => quiz[i].userAnswerIndex === quiz[i].answerIndex).length;
      correct === activeQuestionIndices.length ? firePerfectScoreConfetti() : fireQuizCompleteConfetti();
    }
  };

  const handleRestart = () => {
    onUpdateQuiz(quiz.map((q) => ({ ...q, userAnswerIndex: null })));
    setActiveQuestionIndices(quiz.map((_, i) => i));
    setCurrentIdx(0); setSelectedOption(null); setIsSubmitted(false);
    setIsQuizOver(false); setIncorrectIndices([]); setRetryMode(false);
  };

  const handleRetryIncorrect = () => {
    if (!incorrectIndices.length) return;
    const updated = [...quiz];
    incorrectIndices.forEach((i) => { updated[i] = { ...updated[i], userAnswerIndex: null }; });
    onUpdateQuiz(updated);
    setActiveQuestionIndices([...incorrectIndices]);
    setIncorrectIndices([]); setCurrentIdx(0); setSelectedOption(null);
    setIsSubmitted(false); setIsQuizOver(false); setRetryMode(true);
  };

  // ─── Results screen ───────────────────────────────────────────────────────
  if (isQuizOver) {
    const total   = activeQuestionIndices.length;
    const correct = activeQuestionIndices.filter(
      (i) => quiz[i].userAnswerIndex === quiz[i].answerIndex
    ).length;
    const pct = total > 0 ? Math.round((correct / total) * 100) : 0;

    return (
      <div className="max-w-lg mx-auto py-8 flex flex-col items-center gap-8 text-center">
        {/* Score ring */}
        <div className="relative w-32 h-32">
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 128 128">
            <circle cx="64" cy="64" r="54" stroke="rgba(255,255,255,0.06)" strokeWidth="10" fill="none" />
            <circle
              cx="64" cy="64" r="54"
              stroke={pct >= 80 ? "#10B981" : pct >= 50 ? "#F59E0B" : "#F43F5E"}
              strokeWidth="10" fill="none"
              strokeLinecap="round"
              strokeDasharray={`${(pct / 100) * 339.3} 339.3`}
              style={{ transition: "stroke-dasharray 1s ease" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-3xl font-bold text-void-50">{pct}%</span>
          </div>
        </div>

        <div>
          <h3 className="font-display text-2xl font-bold text-void-50 mb-1">
            {retryMode ? "Retry Complete" : "Quiz Complete"}
          </h3>
          <p className="text-void-400 text-sm">
            {correct} of {total} correct
            {pct === 100 && " — Perfect score! 🎉"}
          </p>
        </div>

        <div className="flex gap-2 justify-center flex-wrap">
          {incorrectIndices.length > 0 && (
            <Button variant="amber" size="md" onClick={handleRetryIncorrect}>
              Retry wrong ({incorrectIndices.length})
            </Button>
          )}
          <Button variant="secondary" size="md" icon={<RotateCcw className="w-3.5 h-3.5" />} onClick={handleRestart}>
            Restart quiz
          </Button>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-void-500">
        <AlertTriangle className="w-8 h-8" />
        <p>No quiz questions available.</p>
      </div>
    );
  }

  const progressPct = Math.round((currentIdx / activeQuestionIndices.length) * 100);
  const timerCritical = timeLeft <= 10 && !isSubmitted;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-violet-500/12 border border-violet-500/20 flex items-center justify-center">
            <HelpCircle className="w-4 h-4 text-violet-400" />
          </div>
          <div>
            <h2 className="font-display font-bold text-void-100 text-base">
              {retryMode ? "Retry Mode" : "Interactive Quiz"}
            </h2>
            <p className="text-[11px] text-void-500 mt-0.5">
              {retryMode ? "Retrying missed questions" : "Answer each question before time runs out"}
            </p>
          </div>
        </div>
        <Button
          variant="ghost" size="sm"
          icon={<Download className="w-3.5 h-3.5" />}
          onClick={() => downloadQuizTxt(quiz, topicTitle)}
        >
          Export
        </Button>
      </div>

      {/* Progress + timer row */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px] font-mono text-void-500">
          <span>Question {currentIdx + 1} / {activeQuestionIndices.length}</span>
          <span className={`flex items-center gap-1.5 ${timerCritical ? "text-rose-400" : ""}`}>
            <Clock className={`w-3.5 h-3.5 ${timerCritical ? "animate-pulse" : ""}`} />
            {isSubmitted ? "paused" : `${timeLeft}s`}
          </span>
        </div>
        <div className="h-1 rounded-full bg-void-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-violet-500 transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        {/* Timer bar */}
        {!isSubmitted && (
          <div className="h-0.5 rounded-full bg-void-800 overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${timerCritical ? "bg-rose-500" : "bg-amber-500"}`}
              style={{ width: `${(timeLeft / 30) * 100}%` }}
              transition={{ duration: 1, ease: "linear" }}
            />
          </div>
        )}
      </div>

      {/* Question card */}
      <div className="card-raised rounded-2xl p-6 sm:p-8 space-y-6">
        <h3 className="font-display text-lg sm:text-xl font-bold text-void-50 leading-snug">
          {question.question}
        </h3>

        {/* Options */}
        <div className="space-y-2.5">
          {question.options.map((opt, idx) => {
            const isSelected  = selectedOption === idx;
            const showCorrect = isSubmitted && idx === question.answerIndex;
            const showWrong   = isSubmitted && isSelected && idx !== question.answerIndex;

            let cls = "w-full text-left flex items-start gap-3.5 px-4 py-3.5 rounded-xl border text-[13px] font-medium transition-all duration-200 ";

            if (isSubmitted) {
              cls += showCorrect
                ? "bg-jade-500/10 border-jade-500/35 text-jade-300"
                : showWrong
                ? "bg-rose-500/10 border-rose-500/35 text-rose-300 opacity-80"
                : "border-[rgba(255,255,255,0.05)] text-void-600 opacity-40";
            } else {
              cls += isSelected
                ? "bg-amber-500/10 border-amber-500/35 text-amber-200"
                : "border-[rgba(255,255,255,0.08)] text-void-300 hover:border-[rgba(255,255,255,0.16)] hover:text-void-100 hover:bg-white/[0.03] cursor-pointer";
            }

            return (
              <button
                key={idx}
                onClick={() => !isSubmitted && setSelectedOption(idx)}
                disabled={isSubmitted}
                className={cls}
              >
                <span className={[
                  "w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5 border",
                  isSubmitted
                    ? showCorrect
                      ? "bg-jade-500 border-jade-500 text-void-950"
                      : showWrong
                      ? "bg-rose-500 border-rose-500 text-white"
                      : "border-void-700 text-void-600"
                    : isSelected
                    ? "bg-amber-500 border-amber-500 text-void-950"
                    : "border-void-700 text-void-500",
                ].join(" ")}>
                  {isSubmitted ? (
                    showCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> :
                    showWrong   ? <XCircle      className="w-3.5 h-3.5" /> :
                    OPTION_LETTERS[idx]
                  ) : OPTION_LETTERS[idx]}
                </span>
                <span className="flex-1">{opt}</span>
              </button>
            );
          })}
        </div>

        {/* Submit / explanation / next */}
        <div className="pt-2">
          {!isSubmitted ? (
            <Button
              variant="amber"
              size="md"
              disabled={selectedOption === null}
              onClick={() => handleSubmit()}
            >
              Submit answer
            </Button>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                <motion.div
                  initial={animationsEnabled ? { opacity: 0, y: 10 } : false}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-amber-500/6 border border-amber-500/20 space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-400" />
                    <span className="label text-amber-500">Explanation</span>
                  </div>
                  <p className="text-void-300 text-[13px] leading-relaxed">{question.explanation}</p>
                </motion.div>
              </AnimatePresence>
              <div className="flex justify-end">
                <Button
                  variant="amber"
                  size="md"
                  iconEnd={<ArrowRight className="w-3.5 h-3.5" />}
                  onClick={handleNext}
                >
                  {currentIdx < activeQuestionIndices.length - 1 ? "Next question" : "Finish quiz"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizContainer;
