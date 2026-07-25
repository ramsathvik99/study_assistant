import React, { useState } from "react";
import { StudySession } from "../../types/index.js";
import { Button } from "../common/Button.js";
import {
  History, Trash2, BookOpen, ArrowRight,
  Star, Calendar, RotateCcw, Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface HistoryListProps {
  sessions: StudySession[];
  onSelectSession: (session: StudySession) => void;
  onDeleteSession: (id: string) => void;
  onToggleBookmark: (id: string) => void;
  animationsEnabled?: boolean;
}

const DIFF_BADGE: Record<string, string> = {
  Easy:   "badge-jade",
  Medium: "badge-amber",
  Hard:   "badge-rose",
};

export const HistoryList: React.FC<HistoryListProps> = ({
  sessions,
  onSelectSession,
  onDeleteSession,
  onToggleBookmark,
  animationsEnabled = true,
}) => {
  const navigate = useNavigate();
  const [undoSession,    setUndoSession]    = useState<StudySession | null>(null);
  const [showUndo,       setShowUndo]       = useState(false);

  const handleDelete = (session: StudySession) => {
    setUndoSession(session);
    onDeleteSession(session.id);
    setShowUndo(true);
    setTimeout(() => {
      setShowUndo((p) => {
        if (p) setUndoSession(null);
        return false;
      });
    }, 6000);
  };

  const handleUndo = () => {
    if (undoSession) {
      onSelectSession(undoSession);
      setUndoSession(null);
      setShowUndo(false);
    }
  };

  const handleOpen = (session: StudySession) => {
    onSelectSession(session);
    navigate("/session");
  };

  const sorted = [...sessions].sort((a, b) => {
    if (!!a.isBookmarked !== !!b.isBookmarked) return a.isBookmarked ? -1 : 1;
    return b.timestamp - a.timestamp;
  });

  return (
    <div className="space-y-5">

      {/* ── Undo toast ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showUndo && undoSession && (
          <motion.div
            key="undo-toast"
            initial={{ opacity: 0, y: -16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0,   scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed top-16 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border border-[rgba(255,255,255,0.1)] bg-void-900/95 backdrop-blur shadow-surface text-sm"
          >
            <History className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-void-100 font-medium text-[13px]">Session deleted</p>
              <p className="text-void-500 text-[11px] truncate max-w-[180px]">"{undoSession.topic}"</p>
            </div>
            <button
              onClick={handleUndo}
              className="flex items-center gap-1.5 text-[12px] font-semibold text-amber-400 hover:text-amber-300 transition-colors px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 shrink-0"
            >
              <RotateCcw className="w-3 h-3" /> Undo
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-void-800 border border-[rgba(255,255,255,0.08)] flex items-center justify-center">
            <History className="w-4 h-4 text-void-400" />
          </div>
          <div>
            <h2 className="font-display font-bold text-void-100 text-base">Study Library</h2>
            <p className="text-[11px] text-void-500 mt-0.5">{sessions.length} session{sessions.length !== 1 ? "s" : ""}</p>
          </div>
        </div>
      </div>

      {/* ── List ───────────────────────────────────────────────────────── */}
      {sorted.length > 0 ? (
        <div className="space-y-2.5">
          <AnimatePresence initial={false}>
            {sorted.map((session) => {
              const date = new Date(session.timestamp).toLocaleDateString(undefined, {
                month: "short", day: "numeric", year: "numeric",
              });

              return (
                <motion.div
                  key={session.id}
                  initial={animationsEnabled ? { opacity: 0, y: 8 } : undefined}
                  animate={{ opacity: 1, y: 0 }}
                  exit={animationsEnabled ? { opacity: 0, x: 20 } : undefined}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  className={[
                    "group flex flex-col sm:flex-row sm:items-center gap-4 px-5 py-4 rounded-xl border transition-all duration-200",
                    session.isBookmarked
                      ? "border-amber-500/20 bg-amber-500/4 hover:border-amber-500/35"
                      : "border-[rgba(255,255,255,0.07)] bg-void-900/60 hover:border-[rgba(255,255,255,0.13)] hover:bg-void-900/80",
                  ].join(" ")}
                >
                  {/* Info */}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={DIFF_BADGE[session.studyPlan.difficulty] ?? "badge-amber"}>
                        {session.studyPlan.difficulty}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-void-600">
                        <Calendar className="w-3 h-3" /> {date}
                      </span>
                      {session.isBookmarked && (
                        <span className="badge-amber flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-400" /> Saved
                        </span>
                      )}
                      {session.studyPlan.estimatedStudyTime && (
                        <span className="flex items-center gap-1 text-[11px] text-void-600">
                          <Clock className="w-3 h-3" /> {session.studyPlan.estimatedStudyTime}
                        </span>
                      )}
                    </div>

                    <h3 className="font-semibold text-void-100 text-[14px] truncate">
                      {session.studyPlan.title}
                    </h3>
                    <p className="text-[11px] text-void-600 truncate max-w-lg">
                      "{session.topic}"
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 justify-end">
                    {/* Bookmark */}
                    <button
                      onClick={() => onToggleBookmark(session.id)}
                      className={[
                        "w-8 h-8 flex items-center justify-center rounded-lg border transition-all focus-ring",
                        session.isBookmarked
                          ? "bg-amber-500/12 border-amber-500/30 text-amber-400"
                          : "border-[rgba(255,255,255,0.08)] text-void-600 hover:text-void-300 hover:bg-white/5",
                      ].join(" ")}
                      title="Bookmark session"
                    >
                      <Star className={`w-3.5 h-3.5 ${session.isBookmarked ? "fill-amber-400" : ""}`} />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(session)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg border border-[rgba(255,255,255,0.08)] text-void-600 hover:text-rose-400 hover:bg-rose-500/8 hover:border-rose-500/20 transition-all focus-ring"
                      title="Delete session"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Open */}
                    <Button
                      variant="secondary"
                      size="sm"
                      iconEnd={<ArrowRight className="w-3 h-3" />}
                      onClick={() => handleOpen(session)}
                    >
                      Open
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        /* Empty state */
        <div className="flex flex-col items-center justify-center gap-4 py-20 rounded-xl border-2 border-dashed border-[rgba(255,255,255,0.07)]">
          <div className="w-12 h-12 rounded-2xl bg-void-900 border border-[rgba(255,255,255,0.08)] flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-void-600" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-void-400 text-sm">No sessions yet</p>
            <p className="text-void-600 text-[12px] mt-1 max-w-xs">
              Generate a study plan on the home page — it'll appear here for easy access.
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            iconEnd={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Go to generator
          </Button>
        </div>
      )}
    </div>
  );
};

export default HistoryList;
