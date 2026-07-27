import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  AlertCircle,
  Check,
  Search,
  Shuffle,
} from "lucide-react";
import { Flashcard } from "../../types/index";
import { Card } from "../common/Card";
import { Button } from "../common/Button";
import { EmptyState } from "../animations/EmptyState";

interface FlashcardContainerProps {
  flashcards: Flashcard[];
  onUpdate: (flashcards: Flashcard[]) => void;
}

export const FlashcardContainer: React.FC<FlashcardContainerProps> = ({
  flashcards,
  onUpdate,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [filter, setFilter] = useState<"all" | "favorite" | "difficult" | "incomplete">("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCards = flashcards.filter((card) => {
    const matchesSearch =
      card.front.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.back.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "favorite" && card.isFavorite) ||
      (filter === "difficult" && card.isDifficult) ||
      (filter === "incomplete" && !card.completed);

    return matchesSearch && matchesFilter;
  });

  const currentCard = filteredCards[currentIndex];
  const progress = Math.round((currentIndex / Math.max(filteredCards.length - 1, 1)) * 100);
  const completedCount = flashcards.filter((c) => c.completed).length;

  useEffect(() => {
    setIsFlipped(false);
    setCurrentIndex(0);
  }, [filter, searchTerm]);

  const handleNext = () => {
    if (currentIndex < filteredCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleShuffle = () => {
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
    onUpdate(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const toggleProperty = (property: "isFavorite" | "isDifficult" | "completed") => {
    if (!currentCard) return;
    const updated = flashcards.map((card) =>
      card === currentCard ? { ...card, [property]: !card[property] } : card
    );
    onUpdate(updated);
  };

  if (!currentCard) {
    return (
      <EmptyState
        type="session"
        title="No flashcards found"
        description={
          filteredCards.length === 0 && (filter !== "all" || searchTerm)
            ? "Try adjusting your filters or search term to find flashcards."
            : "No flashcards available for this study plan."
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <Card padding="md">
        <div className="flex flex-col gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search flashcards..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 glass-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-primary-500 dark:focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20 dark:focus:ring-primary-900/20 transition-all text-sm min-h-[48px] touch-manipulation"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            {(["all", "favorite", "difficult", "incomplete"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-all min-h-[44px] touch-manipulation ${
                  filter === f
                    ? "bg-primary-600 text-white"
                    : "glass-sm text-slate-600 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-700/80"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {/* Actions */}
          <Button variant="outline" size="md" icon={<Shuffle className="w-4 h-4" />} onClick={handleShuffle} fullWidth>
            Shuffle
          </Button>
        </div>
      </Card>

      {/* Progress Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: "Total Cards", value: flashcards.length },
          { label: "Current", value: `${currentIndex + 1}/${filteredCards.length}` },
          { label: "Completed", value: completedCount },
          { label: "Progress", value: `${progress}%` },
        ].map((stat) => (
          <Card key={stat.label} padding="md" variant="default">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
              {stat.label}
            </p>
            <p className="text-xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
          </Card>
        ))}
      </div>

      {/* Main Flashcard */}
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.2 }}
          >
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="relative cursor-pointer group"
              style={{ perspective: "1000px" }}
            >
              <motion.div
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.4 }}
                style={{ transformStyle: "preserve-3d" }}
                className="relative"
              >
                {/* Front */}
                <div
                  className="min-h-[280px] sm:min-h-[350px] overflow-hidden"
                  style={{
                    backfaceVisibility: "hidden",
                  }}
                >
                  <Card
                    padding="none"
                    variant="elevated"
                    className="min-h-[280px] sm:min-h-[350px] overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-primary-600" />
                    <div className="relative z-10 p-6 sm:p-12 flex flex-col items-center justify-center min-h-[280px] sm:min-h-[350px] text-center">
                      <div className="mb-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mx-auto">
                          <span className="text-lg sm:text-xl font-bold text-white">Q</span>
                        </div>
                      </div>
                      <h3 className="text-lg sm:text-2xl font-semibold text-white mb-3 max-w-2xl">
                        {currentCard.front}
                      </h3>
                      <p className="text-white/80 text-xs sm:text-sm">
                        Click to reveal answer
                      </p>
                    </div>
                  </Card>
                </div>

                {/* Back */}
                <div
                  className="absolute inset-0 min-h-[280px] sm:min-h-[350px] overflow-hidden"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  <Card
                    padding="none"
                    variant="elevated"
                    className="min-h-[280px] sm:min-h-[350px] overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-slate-800" />
                    <div className="relative z-10 p-6 sm:p-12 flex flex-col items-center justify-center min-h-[280px] sm:min-h-[350px] text-center">
                      <div className="mb-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mx-auto">
                          <span className="text-lg sm:text-xl font-bold text-white">A</span>
                        </div>
                      </div>
                      <p className="text-base sm:text-xl font-medium text-white leading-relaxed max-w-2xl whitespace-pre-wrap">
                        {currentCard.back}
                      </p>
                    </div>
                  </Card>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 glass-sm rounded-full flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 transition-transform touch-target"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-slate-700 dark:text-slate-300" />
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex === filteredCards.length - 1}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white dark:bg-slate-800 rounded-full shadow-md dark:shadow-lg flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 transition-transform touch-target"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-slate-700 dark:text-slate-300" />
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 justify-center">
        <Button
          variant={currentCard.completed ? "primary" : "outline"}
          size="lg"
          icon={<Check className="w-4 h-4" />}
          onClick={() => toggleProperty("completed")}
          className="flex-1 sm:flex-none min-w-[140px]"
        >
          {currentCard.completed ? "Completed" : "Mark Complete"}
        </Button>
        <Button
          variant={currentCard.isFavorite ? "secondary" : "outline"}
          size="lg"
          icon={<Star className={currentCard.isFavorite ? "fill-white" : ""} />}
          onClick={() => toggleProperty("isFavorite")}
          className="flex-1 sm:flex-none min-w-[140px]"
        >
          {currentCard.isFavorite ? "Favorited" : "Favorite"}
        </Button>
        <Button
          variant={currentCard.isDifficult ? "danger" : "outline"}
          size="lg"
          icon={<AlertCircle className="w-4 h-4" />}
          onClick={() => toggleProperty("isDifficult")}
          className="flex-1 sm:flex-none min-w-[140px]"
        >
          {currentCard.isDifficult ? "Marked Difficult" : "Mark Difficult"}
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="relative h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
          className="absolute inset-y-0 left-0 bg-primary-600 dark:bg-primary-500 rounded-full"
        />
      </div>
    </div>
  );
};
