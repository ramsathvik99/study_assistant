import React, { useState, useEffect, useRef } from "react";
import { Button } from "../common/Button.js";
import { Flashcard } from "../../types/index.js";
import { downloadFlashcardsTxt } from "../../utils/pdfGenerator.js";
import {
  ChevronLeft, ChevronRight, Shuffle, RotateCcw, Star,
  AlertTriangle, Search, Download, SlidersHorizontal, BookmarkCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FlashcardContainerProps {
  flashcards: Flashcard[];
  topicTitle: string;
  onUpdateFlashcards: (updated: Flashcard[]) => void;
  animationsEnabled?: boolean;
}

export const FlashcardContainer: React.FC<FlashcardContainerProps> = ({
  flashcards,
  topicTitle,
  onUpdateFlashcards,
  animationsEnabled = true,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped,    setIsFlipped]    = useState(false);
  const [searchQuery,  setSearchQuery]  = useState("");
  const [filterMode,   setFilterMode]   = useState<"all" | "favorites" | "difficult">("all");
  const cardRef = useRef<HTMLDivElement>(null);

  // ── Filtered deck ──
  const filteredCards = flashcards.filter((c) => {
    const q = searchQuery.toLowerCase();
    if (q && !c.front.toLowerCase().includes(q) && !c.back.toLowerCase().includes(q)) return false;
    if (filterMode === "favorites") return !!c.isFavorite;
    if (filterMode === "difficult") return !!c.isDifficult;
    return true;
  });

  const activeCard = filteredCards[currentIndex];

  useEffect(() => {
    if (currentIndex >= filteredCards.length && filteredCards.length > 0) {
      setCurrentIndex(filteredCards.length - 1);
    } else if (filteredCards.length === 0) {
      setCurrentIndex(0);
    }
    setIsFlipped(false);
  }, [filterMode, searchQuery, filteredCards.length]);

  // ── Keyboard shortcuts ──
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA" ||
        filteredCards.length === 0
      ) return;
      switch (e.code) {
        case "Space":       e.preventDefault(); setIsFlipped((p) => !p); break;
        case "ArrowLeft":   e.preventDefault(); handlePrev();            break;
        case "ArrowRight":  e.preventDefault(); handleNext();            break;
        case "ArrowUp":     e.preventDefault(); handleToggleFavorite();  break;
        case "ArrowDown":   e.preventDefault(); handleToggleDifficult(); break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [currentIndex, filteredCards.length, activeCard]);

  const delay = animationsEnabled ? 150 : 0;

  const handleNext = () => {
    if (!filteredCards.length) return;
    setIsFlipped(false);
    setTimeout(() => setCurrentIndex((p) => (p + 1) % filteredCards.length), delay);
  };

  const handlePrev = () => {
    if (!filteredCards.length) return;
    setIsFlipped(false);
    setTimeout(() => setCurrentIndex((p) => (p - 1 + filteredCards.length) % filteredCards.length), delay);
  };

  const getRealIdx = () => activeCard
    ? flashcards.findIndex((f) => f.front === activeCard.front)
    : -1;

  const handleToggleFavorite = () => {
    const ri = getRealIdx();
    if (ri < 0) return;
    const updated = [...flashcards];
    updated[ri] = { ...updated[ri], isFavorite: !updated[ri].isFavorite };
    onUpdateFlashcards(updated);
  };

  const handleToggleDifficult = () => {
    const ri = getRealIdx();
    if (ri < 0) return;
    const updated = [...flashcards];
    updated[ri] = { ...updated[ri], isDifficult: !updated[ri].isDifficult };
    onUpdateFlashcards(updated);
  };

  const handleToggleCompleted = () => {
    const ri = getRealIdx();
    if (ri < 0) return;
    const updated = [...flashcards];
    updated[ri] = { ...updated[ri], completed: !updated[ri].completed };
    onUpdateFlashcards(updated);
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    setTimeout(() => {
      onUpdateFlashcards([...flashcards].sort(() => Math.random() - 0.5));
      setCurrentIndex(0);
    }, delay);
  };

  const handleReset = () => {
    setIsFlipped(false);
    onUpdateFlashcards(flashcards.map((f) => ({ ...f, completed: false, isDifficult: false, isFavorite: false })));
    setCurrentIndex(0);
  };

  const completedCount   = flashcards.filter((f) => f.completed).length;
  const progressPercent  = flashcards.length > 0 ? Math.round((completedCount / flashcards.length) * 100) : 0;

  const FILTER_BTNS = [
    { id: "all"       as const, label: `All (${flashcards.length})` },
    { id: "favorites" as const, label: `Starred (${flashcards.filter((f) => f.isFavorite).length})` },
    { id: "difficult" as const, label: `Hard (${flashcards.filter((f) => f.isDifficult).length})` },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/12 border border-amber-500/20 flex items-center justify-center">
            <BookmarkCheck className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h2 className="font-display font-bold text-void-100 text-base">Flashcards</h2>
            <p className="text-[11px] text-void-500 mt-0.5">Space · flip · ← → navigate · ↑ star · ↓ mark hard</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          icon={<Download className="w-3.5 h-3.5" />}
          onClick={() => downloadFlashcardsTxt(flashcards, topicTitle)}
        >
          Export
        </Button>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between text-[11px] text-void-500 mb-1.5 font-mono">
          <span>Mastery progress</span>
          <span>{completedCount}/{flashcards.length} mastered</span>
        </div>
        <div className="h-1.5 rounded-full bg-void-800 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-jade-500"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-void-600" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cards…"
            className="input pl-9 h-9 text-[13px]"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <SlidersHorizontal className="w-3.5 h-3.5 text-void-600 shrink-0" />
          {FILTER_BTNS.map((b) => (
            <button
              key={b.id}
              onClick={() => setFilterMode(b.id)}
              className={[
                "px-3 py-1.5 rounded-lg text-[12px] font-medium border transition-all focus-ring",
                filterMode === b.id
                  ? "bg-amber-500/12 text-amber-400 border-amber-500/25"
                  : "border-[rgba(255,255,255,0.08)] text-void-500 hover:text-void-200 hover:bg-white/5",
              ].join(" ")}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {/* Card area */}
      {filteredCards.length > 0 && activeCard ? (
        <div className="flex flex-col items-center gap-6">
          {/* 3D Flip card */}
          <div
            ref={cardRef}
            className="relative w-full max-w-2xl h-72 sm:h-80 cursor-pointer [perspective:1200px] outline-none"
            onClick={() => setIsFlipped((p) => !p)}
            tabIndex={0}
            onKeyDown={(e) => e.code === "Space" && (e.preventDefault(), setIsFlipped((p) => !p))}
            aria-label={`Card ${currentIndex + 1} of ${filteredCards.length}. ${isFlipped ? "Answer side" : "Question side"}. Space to flip.`}
          >
            <motion.div
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={animationsEnabled
                ? { type: "spring", stiffness: 120, damping: 22 }
                : { duration: 0 }}
              className="absolute w-full h-full [transform-style:preserve-3d]"
            >
              {/* Front */}
              <div className="absolute inset-0 [backface-visibility:hidden] rounded-2xl border border-[rgba(255,255,255,0.09)] bg-void-900 flex flex-col justify-between p-7">
                <div className="flex items-center justify-between">
                  <span className="label">Question</span>
                  <div className="flex gap-1.5">
                    {activeCard.isDifficult && (
                      <span className="badge-rose flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Hard
                      </span>
                    )}
                    {activeCard.isFavorite && (
                      <span className="badge-amber flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400" /> Starred
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex-1 flex items-center justify-center text-center px-4">
                  <p className="font-display font-bold text-void-50 text-xl sm:text-2xl leading-snug">
                    {activeCard.front}
                  </p>
                </div>
                <p className="text-center text-[11px] text-void-600 animate-pulse">
                  Click or press Space to flip
                </p>
              </div>

              {/* Back */}
              <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl border border-amber-500/20 bg-void-900 flex flex-col justify-between p-7">
                <div className="flex items-center justify-between">
                  <span className="label">Answer</span>
                  <span className="badge-amber">Revealed</span>
                </div>
                <div className="flex-1 flex items-center justify-center text-center overflow-y-auto px-4">
                  <p className="text-void-200 text-base sm:text-lg leading-relaxed whitespace-pre-wrap">
                    {activeCard.back}
                  </p>
                </div>
                <p className="text-center text-[11px] text-void-600">Click to flip back</p>
              </div>
            </motion.div>
          </div>

          {/* Per-card actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); handleToggleFavorite(); }}
              className={[
                "h-9 px-3.5 rounded-lg border text-[12px] font-medium flex items-center gap-2 transition-all focus-ring",
                activeCard.isFavorite
                  ? "bg-amber-500/12 border-amber-500/30 text-amber-400"
                  : "border-[rgba(255,255,255,0.08)] text-void-500 hover:text-void-200 hover:bg-white/5",
              ].join(" ")}
              title="Star card (↑)"
            >
              <Star className={`w-3.5 h-3.5 ${activeCard.isFavorite ? "fill-amber-400" : ""}`} />
              Star
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); handleToggleDifficult(); }}
              className={[
                "h-9 px-3.5 rounded-lg border text-[12px] font-medium flex items-center gap-2 transition-all focus-ring",
                activeCard.isDifficult
                  ? "bg-rose-500/10 border-rose-500/25 text-rose-400"
                  : "border-[rgba(255,255,255,0.08)] text-void-500 hover:text-void-200 hover:bg-white/5",
              ].join(" ")}
              title="Mark hard (↓)"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              Hard
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); handleToggleCompleted(); }}
              className={[
                "h-9 px-3.5 rounded-lg border text-[12px] font-medium flex items-center gap-2 transition-all focus-ring",
                activeCard.completed
                  ? "bg-jade-500/10 border-jade-500/25 text-jade-400"
                  : "border-[rgba(255,255,255,0.08)] text-void-500 hover:text-void-200 hover:bg-white/5",
              ].join(" ")}
            >
              {activeCard.completed ? "✓ Mastered" : "Mark mastered"}
            </button>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-4">
            <button
              onClick={handlePrev}
              className="w-9 h-9 rounded-full border border-[rgba(255,255,255,0.08)] text-void-400 hover:text-void-100 hover:bg-white/5 flex items-center justify-center transition-all focus-ring"
              title="Previous (←)"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono text-[13px] text-void-400 min-w-[60px] text-center">
              {currentIndex + 1} / {filteredCards.length}
            </span>
            <button
              onClick={handleNext}
              className="w-9 h-9 rounded-full border border-[rgba(255,255,255,0.08)] text-void-400 hover:text-void-100 hover:bg-white/5 flex items-center justify-center transition-all focus-ring"
              title="Next (→)"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border-2 border-dashed border-[rgba(255,255,255,0.08)] py-16 flex flex-col items-center justify-center gap-3 text-center">
          <SlidersHorizontal className="w-8 h-8 text-void-700" />
          <p className="text-void-400 font-medium text-sm">No cards match your filter</p>
          <button
            onClick={() => { setSearchQuery(""); setFilterMode("all"); }}
            className="text-xs text-amber-400 hover:text-amber-300 transition-colors"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Deck actions */}
      <div className="flex justify-center gap-2 pt-4 border-t border-[rgba(255,255,255,0.06)]">
        <Button variant="ghost" size="sm" icon={<Shuffle className="w-3.5 h-3.5" />} onClick={handleShuffle}>
          Shuffle
        </Button>
        <Button variant="ghost" size="sm" icon={<RotateCcw className="w-3.5 h-3.5" />} onClick={handleReset}>
          Reset deck
        </Button>
      </div>
    </div>
  );
};

export default FlashcardContainer;
