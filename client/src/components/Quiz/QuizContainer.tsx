import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  X,
  Trophy,
  Target,
  Clock,
  RotateCw,
  ArrowRight,
  Sparkles,
  Award,
} from "lucide-react";
import { QuizQuestion } from "../../types/index";
import { Card } from "../common/Card";
import { Button } from "../common/Button";
import { EmptyState } from "../animations/EmptyState";
import confetti from "canvas-confetti";

interface QuizContainerProps {
  questions: QuizQuestion[];
  onUpdate: (questions: QuizQuestion[]) => void;
}

export const QuizContainer: React.FC<QuizContainerProps> = ({ questions, onUpdate }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [timeElapsed, setTimeElapsed] = useState(0);

  // Empty state check
  if (!questions || questions.length === 0) {
    return (
      <EmptyState
        type="session"
        title="No quiz questions"
        description="No quiz questions are available for this study plan. Try generating a new plan."
      />
    );
  }

  const currentQuestion = questions[currentIndex];
  const answeredQuestions = questions.filter((q) => q.userAnswerIndex !== null && q.userAnswerIndex !== undefined);
  const correctAnswers = answeredQuestions.filter((q) => q.userAnswerIndex === q.answerIndex).length;
  const score = answeredQuestions.length > 0 ? Math.round((correctAnswers / answeredQuestions.length) * 100) : 0;

  useEffect(() => {
    if (!showResults) {
      const timer = setInterval(() => {
        setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [startTime, showResults]);

  const handleAnswerSelect = (index: number) => {
    if (hasAnswered) return;
    setSelectedAnswer(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    const updated = [...questions];
    updated[currentIndex] = { ...currentQuestion, userAnswerIndex: selectedAnswer };
    onUpdate(updated);
    setHasAnswered(true);

    if (selectedAnswer === currentQuestion.answerIndex) {
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.6 },
      });
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setHasAnswered(false);
    } else {
      setShowResults(true);
    }
  };

  const handleRetry = () => {
    const reset = questions.map((q) => ({ ...q, userAnswerIndex: null }));
    onUpdate(reset);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setHasAnswered(false);
    setShowResults(false);
    setStartTime(Date.now());
    setTimeElapsed(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Results View
  if (showResults) {
    const isPerfect = correctAnswers === questions.length;
    const isPassing = score >= 70;

    return (
      <div className="space-y-6">
        {/* Results Card */}
        <Card variant="elevated" padding="none" className="overflow-hidden">
          <div className={`p-8 sm:p-12 text-center text-white ${isPerfect ? "bg-green-600" : isPassing ? "bg-primary-600" : "bg-slate-600"}`}>
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3">
              {isPerfect ? "Perfect Score!" : isPassing ? "Great Job!" : "Keep Practicing!"}
            </h2>
            <p className="text-base sm:text-lg text-white/90 mb-6 sm:mb-8">
              You scored {score}% on this quiz
            </p>
          </div>

          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {[
                { label: "Score", value: `${score}%`, icon: Award },
                { label: "Correct", value: `${correctAnswers}/${questions.length}`, icon: Check },
                { label: "Time", value: formatTime(timeElapsed), icon: Clock },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <Card key={stat.label} padding="md" variant="default" className="text-center">
                    <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Icon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{stat.value}</p>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                      {stat.label}
                    </p>
                  </Card>
                );
              })}
            </div>

            <div className="flex gap-3 justify-center">
              <Button
                variant="primary"
                size="lg"
                icon={<RotateCw className="w-4 h-4" />}
                onClick={handleRetry}
              >
                Retake Quiz
              </Button>
            </div>
          </div>
        </Card>

        {/* Question Review */}
        <div className="space-y-3 sm:space-y-4">
          <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white">Answer Review</h3>
          {questions.map((q, idx) => {
            const isCorrect = q.userAnswerIndex === q.answerIndex;
            return (
              <Card key={idx} padding="md" variant="default">
                <div className="flex items-start gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isCorrect ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"}`}>
                    {isCorrect ? (
                      <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                    ) : (
                      <X className="w-4 h-4 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900 dark:text-white mb-2">{q.question}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      <span className="font-medium">Correct Answer:</span> {q.options[q.answerIndex]}
                    </p>
                    {!isCorrect && q.userAnswerIndex !== null && (
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                        <span className="font-medium">Your Answer:</span> {q.options[q.userAnswerIndex]}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  // Quiz Question View
  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card padding="md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-primary-600" />
              <span className="font-medium text-slate-900 dark:text-white text-sm sm:text-base">
                Question {currentIndex + 1} of {questions.length}
              </span>
            </div>
            <div className="h-6 w-px bg-slate-300 dark:bg-slate-700 hidden sm:block" />
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <span className="font-medium text-slate-900 dark:text-white text-sm sm:text-base">{formatTime(timeElapsed)}</span>
            </div>
          </div>
          <div className="text-right sm:text-left">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Current Score</p>
            <p className="text-xl font-bold text-primary-600 dark:text-primary-400">{score}%</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.3 }}
            className="h-full bg-primary-600 dark:bg-primary-500 rounded-full"
          />
        </div>
      </Card>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.2 }}
        >
          <Card variant="elevated" padding="lg">
            {/* Question */}
            <div className="mb-6 sm:mb-8">
              <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs sm:text-sm font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wide mb-2">
                    Multiple Choice
                  </p>
                  <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white">
                    {currentQuestion.question}
                  </h3>
                </div>
              </div>
            </div>

            {/* Options */}
            <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedAnswer === idx;
                const isCorrect = idx === currentQuestion.answerIndex;
                const showCorrect = hasAnswered && isCorrect;
                const showIncorrect = hasAnswered && isSelected && !isCorrect;

                return (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: hasAnswered ? 1 : 1.01 }}
                    whileTap={{ scale: hasAnswered ? 1 : 0.99 }}
                    onClick={() => handleAnswerSelect(idx)}
                    disabled={hasAnswered}
                    className={`w-full p-3 sm:p-4 rounded-lg border text-left transition-all font-medium min-h-[52px] sm:min-h-[56px] touch-manipulation ${
                      showCorrect
                        ? "bg-green-50 dark:bg-green-900/20 border-green-500 dark:border-green-600"
                        : showIncorrect
                        ? "bg-red-50 dark:bg-red-900/20 border-red-500 dark:border-red-600"
                        : isSelected
                        ? "bg-primary-50 dark:bg-primary-900/20 border-primary-500 dark:border-primary-600"
                        : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                    } ${hasAnswered ? "cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      {/* Letter Badge */}
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-bold text-sm ${
                          showCorrect
                            ? "bg-green-500 text-white"
                            : showIncorrect
                            ? "bg-red-500 text-white"
                            : isSelected
                            ? "bg-primary-500 text-white"
                            : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                        }`}
                      >
                        {String.fromCharCode(65 + idx)}
                      </div>

                      {/* Option Text */}
                      <span className="flex-1 text-sm sm:text-base text-slate-700 dark:text-slate-200">{option}</span>

                      {/* Check/X Icon */}
                      {showCorrect && <Check className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />}
                      {showIncorrect && <X className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Explanation (after answering) */}
            <AnimatePresence>
              {hasAnswered && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6"
                >
                  <Card
                    padding="md"
                    variant="default"
                    className={`${
                      selectedAnswer === currentQuestion.answerIndex
                        ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700"
                        : "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          selectedAnswer === currentQuestion.answerIndex
                            ? "bg-green-500"
                            : "bg-blue-500"
                        }`}
                      >
                        {selectedAnswer === currentQuestion.answerIndex ? (
                          <Check className="w-4 h-4 text-white" />
                        ) : (
                          <Sparkles className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white mb-1">Explanation</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                          {currentQuestion.explanation}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="flex gap-3">
              {!hasAnswered ? (
                <Button
                  variant="primary"
                  size="lg"
                  icon={<Check className="w-4 h-4" />}
                  onClick={handleSubmitAnswer}
                  disabled={selectedAnswer === null}
                  className="flex-1"
                >
                  Submit Answer
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="lg"
                  icon={<ArrowRight className="w-4 h-4" />}
                  onClick={handleNext}
                  className="flex-1"
                >
                  {currentIndex < questions.length - 1 ? "Next Question" : "View Results"}
                </Button>
              )}
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
