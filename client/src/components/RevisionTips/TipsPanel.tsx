import React from "react";
import { motion } from "framer-motion";
import { Check, Pin, ListChecks, Lightbulb } from "lucide-react";
import { RevisionTip } from "../../types/index";
import { Card } from "../common/Card";
import { EmptyState } from "../animations/EmptyState";

interface TipsPanelProps {
  tips: RevisionTip[];
  onUpdate: (tips: RevisionTip[]) => void;
}

export const TipsPanel: React.FC<TipsPanelProps> = ({ tips, onUpdate }) => {
  // Empty state check
  if (!tips || tips.length === 0) {
    return (
      <EmptyState
        type="session"
        title="No revision tips"
        description="No revision tips are available for this study plan."
      />
    );
  }

  const toggleCompleted = (id: string) => {
    const updated = tips.map((tip) =>
      tip.id === id ? { ...tip, completed: !tip.completed } : tip
    );
    onUpdate(updated);
  };

  const togglePinned = (id: string) => {
    const updated = tips.map((tip) =>
      tip.id === id ? { ...tip, pinned: !tip.pinned } : tip
    );
    onUpdate(updated);
  };

  const completedCount = tips.filter((t) => t.completed).length;
  const progress = Math.round((completedCount / tips.length) * 100);
  const pinnedTips = tips.filter((t) => t.pinned);
  const regularTips = tips.filter((t) => !t.pinned);

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card variant="glass" padding="lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-danger-500 to-danger-600 rounded-2xl flex items-center justify-center shadow-elevation-2">
              <ListChecks className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-display font-bold text-neutral-900 dark:text-white">Revision Tips</h3>
              <p className="text-neutral-600 dark:text-slate-400 font-medium">
                {completedCount} of {tips.length} completed
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-5xl font-bold text-danger-600 dark:text-danger-400">{progress}%</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 h-3 bg-neutral-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8 }}
            className="h-full bg-gradient-to-r from-danger-500 to-danger-600 rounded-full"
          />
        </div>
      </Card>

      {/* Pinned Tips */}
      {pinnedTips.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-2">
            <Pin className="w-4 h-4 text-accent-600 dark:text-accent-400" />
            <h4 className="text-sm font-bold text-neutral-700 dark:text-slate-300 uppercase tracking-wide">
              Pinned Tips
            </h4>
          </div>
          {pinnedTips.map((tip, index) => (
            <TipCard
              key={tip.id}
              tip={tip}
              index={index}
              onToggleCompleted={toggleCompleted}
              onTogglePinned={togglePinned}
            />
          ))}
        </div>
      )}

      {/* Regular Tips */}
      <div className="space-y-3">
        {pinnedTips.length > 0 && (
          <div className="flex items-center gap-2 px-2">
            <ListChecks className="w-4 h-4 text-neutral-600 dark:text-slate-400" />
            <h4 className="text-sm font-bold text-neutral-700 dark:text-slate-300 uppercase tracking-wide">
              All Tips
            </h4>
          </div>
        )}
        {regularTips.map((tip, index) => (
          <TipCard
            key={tip.id}
            tip={tip}
            index={pinnedTips.length + index}
            onToggleCompleted={toggleCompleted}
            onTogglePinned={togglePinned}
          />
        ))}
      </div>
    </div>
  );
};

interface TipCardProps {
  tip: RevisionTip;
  index: number;
  onToggleCompleted: (id: string) => void;
  onTogglePinned: (id: string) => void;
}

const TipCard: React.FC<TipCardProps> = ({ tip, index, onToggleCompleted, onTogglePinned }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card
        padding="md"
        variant="default"
        hover
        className={`group ${tip.completed ? "bg-success-50 dark:bg-success-900/20 border-success-200 dark:border-success-800" : ""} ${
          tip.pinned ? "ring-2 ring-accent-500 dark:ring-accent-400" : ""
        }`}
      >
        <div className="flex items-start gap-4">
          {/* Checkbox */}
          <button
            onClick={() => onToggleCompleted(tip.id)}
            className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${
              tip.completed
                ? "bg-success-500 border-success-500"
                : "bg-white dark:bg-slate-800 border-neutral-300 dark:border-slate-600 hover:border-success-500 dark:hover:border-success-400"
            }`}
          >
            {tip.completed && <Check className="w-5 h-5 text-white" />}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex items-start gap-3">
                <Lightbulb
                  className={`w-5 h-5 shrink-0 mt-0.5 ${
                    tip.completed ? "text-success-600 dark:text-success-400" : "text-accent-600 dark:text-accent-400"
                  }`}
                />
                <p
                  className={`font-semibold leading-relaxed ${
                    tip.completed
                      ? "text-success-900 dark:text-success-300 line-through"
                      : "text-neutral-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400"
                  } transition-colors`}
                >
                  {tip.text}
                </p>
              </div>

              {/* Pin Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTogglePinned(tip.id);
                }}
                className={`p-2 rounded-lg transition-all ${
                  tip.pinned
                    ? "bg-accent-100 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400"
                    : "text-neutral-400 dark:text-slate-500 hover:bg-neutral-100 dark:hover:bg-slate-700 hover:text-accent-600 dark:hover:text-accent-400"
                }`}
              >
                <Pin className={`w-4 h-4 ${tip.pinned ? "fill-accent-600 dark:fill-accent-400" : ""}`} />
              </button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
