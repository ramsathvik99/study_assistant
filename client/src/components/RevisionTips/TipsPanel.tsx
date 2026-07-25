import React from "react";
import { RevisionTip } from "../../types/index.js";
import { ClipboardList, Pin, CheckSquare, Square } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TipsPanelProps {
  tips: RevisionTip[];
  onUpdateTips: (updated: RevisionTip[]) => void;
  animationsEnabled?: boolean;
}

export const TipsPanel: React.FC<TipsPanelProps> = ({
  tips,
  onUpdateTips,
  animationsEnabled = true,
}) => {
  const toggleComplete = (id: string) =>
    onUpdateTips(tips.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));

  const togglePin = (id: string) =>
    onUpdateTips(tips.map((t) => (t.id === id ? { ...t, pinned: !t.pinned } : t)));

  const sorted = [...tips].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    if (a.pinned !== b.pinned)       return a.pinned   ? -1 : 1;
    return 0;
  });

  const doneCount = tips.filter((t) => t.completed).length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-fire-500/12 border border-fire-500/20 flex items-center justify-center">
            <ClipboardList className="w-4 h-4 text-fire-400" />
          </div>
          <div>
            <h2 className="font-display font-bold text-void-100 text-base">Revision Tips</h2>
            <p className="text-[11px] text-void-500 mt-0.5">Pin important tips · check off as you revise</p>
          </div>
        </div>
        <span className="font-mono text-[11px] text-void-500">
          {doneCount}/{tips.length} done
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1 rounded-full bg-void-800 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-fire-500"
          initial={{ width: 0 }}
          animate={{ width: `${tips.length > 0 ? (doneCount / tips.length) * 100 : 0}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      {/* Tips list */}
      <motion.div layout className="space-y-2">
        <AnimatePresence initial={false}>
          {sorted.map((tip) => (
            <motion.div
              key={tip.id}
              layout={animationsEnabled ? "position" : undefined}
              initial={animationsEnabled ? { opacity: 0, y: 8 } : undefined}
              animate={animationsEnabled ? { opacity: 1, y: 0 } : undefined}
              exit={animationsEnabled    ? { opacity: 0       } : undefined}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
            >
              <div className={[
                "flex items-center gap-3 px-4 py-3 rounded-xl border transition-all",
                tip.completed
                  ? "border-[rgba(255,255,255,0.05)] bg-void-950/40 opacity-50"
                  : tip.pinned
                  ? "border-amber-500/25 bg-amber-500/5"
                  : "border-[rgba(255,255,255,0.07)] bg-void-900/60 hover:border-[rgba(255,255,255,0.12)]",
              ].join(" ")}>
                {/* Checkbox */}
                <button
                  onClick={() => toggleComplete(tip.id)}
                  className="shrink-0 focus-ring rounded"
                  title={tip.completed ? "Mark incomplete" : "Mark complete"}
                >
                  {tip.completed
                    ? <CheckSquare className="w-4.5 h-4.5 text-jade-500" style={{ width: 18, height: 18 }} />
                    : <Square      className="w-4.5 h-4.5 text-void-600 hover:text-void-300 transition-colors" style={{ width: 18, height: 18 }} />}
                </button>

                {/* Text */}
                <p className={`flex-1 text-[13px] leading-relaxed ${tip.completed ? "line-through text-void-600" : "text-void-200"}`}>
                  {tip.text}
                </p>

                {/* Pin */}
                <button
                  onClick={() => togglePin(tip.id)}
                  className={[
                    "w-7 h-7 flex items-center justify-center rounded-lg border transition-all focus-ring shrink-0",
                    tip.pinned
                      ? "bg-amber-500/12 border-amber-500/30 text-amber-400"
                      : "border-[rgba(255,255,255,0.07)] text-void-700 hover:text-void-400 hover:border-[rgba(255,255,255,0.12)]",
                  ].join(" ")}
                  title={tip.pinned ? "Unpin" : "Pin tip"}
                >
                  <Pin className={`w-3 h-3 ${tip.pinned ? "fill-amber-400" : ""}`} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default TipsPanel;
