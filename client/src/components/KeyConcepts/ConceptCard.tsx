import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, ChevronDown, ChevronUp } from "lucide-react";
import { KeyConcept } from "../../types/index";
import { Card } from "../common/Card";

interface ConceptCardProps {
  concept: KeyConcept;
  index: number;
}

export const ConceptCard: React.FC<ConceptCardProps> = ({ concept, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card
        padding="none"
        variant="default"
        hover
        className="overflow-hidden group cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Header */}
        <div className="p-6 flex items-start gap-4">
          {/* Number Badge */}
          <div className="w-10 h-10 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center shrink-0 shadow-elevation-1 group-hover:shadow-elevation-2 transition-all">
            <span className="text-white font-bold text-lg">{index + 1}</span>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-2">
              <h3 className="text-xl font-display font-bold text-neutral-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                {concept.concept}
              </h3>
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="shrink-0"
              >
                <ChevronDown className="w-5 h-5 text-neutral-400 dark:text-slate-500" />
              </motion.div>
            </div>

            {/* Preview Text (when collapsed) */}
            {!isExpanded && (
              <p className="text-neutral-600 dark:text-slate-400 line-clamp-2">
                {concept.explanation}
              </p>
            )}
          </div>
        </div>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 pl-20">
                <div className="p-4 bg-gradient-to-br from-accent-50 dark:from-accent-900/20 to-white dark:to-slate-800 rounded-xl border border-accent-200 dark:border-accent-800">
                  <div className="flex items-start gap-3 mb-3">
                    <Lightbulb className="w-5 h-5 text-accent-600 dark:text-accent-400 shrink-0 mt-0.5" />
                    <p className="text-sm font-semibold text-accent-900 dark:text-accent-300 uppercase tracking-wide">
                      Explanation
                    </p>
                  </div>
                  <p className="text-neutral-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {concept.explanation}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};
