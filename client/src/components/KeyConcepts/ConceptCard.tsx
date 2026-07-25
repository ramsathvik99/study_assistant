import React, { useState } from "react";
import { KeyConcept } from "../../types/index.js";
import { Lightbulb, X, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { staggerContainer, fadeUp } from "../../animations/variants.js";

interface ConceptCardProps {
  concepts: KeyConcept[];
  animationsEnabled?: boolean;
}

export const ConceptCard: React.FC<ConceptCardProps> = ({
  concepts,
  animationsEnabled = true,
}) => {
  const [selected, setSelected] = useState<KeyConcept | null>(null);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-jade-500/12 border border-jade-500/20 flex items-center justify-center">
          <Lightbulb className="w-4 h-4 text-jade-400" />
        </div>
        <div>
          <h2 className="font-display font-bold text-void-100 text-base">Key Concepts</h2>
          <p className="text-[11px] text-void-500 mt-0.5">Click any concept to see the full explanation</p>
        </div>
      </div>

      {/* Grid */}
      <motion.div
        variants={staggerContainer(animationsEnabled)}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 gap-3"
      >
        {concepts.map((item, idx) => (
          <motion.button
            key={idx}
            variants={fadeUp(animationsEnabled)}
            onClick={() => setSelected(item)}
            className={[
              "group text-left rounded-xl border p-5 transition-all duration-200 focus-ring",
              "bg-void-900/60 border-[rgba(255,255,255,0.07)]",
              "hover:border-jade-500/30 hover:bg-jade-500/5",
            ].join(" ")}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-semibold text-void-200 text-[13px] group-hover:text-jade-300 transition-colors leading-snug">
                {item.concept}
              </h3>
              <span className="font-mono text-[10px] text-void-600 shrink-0 mt-0.5">#{idx + 1}</span>
            </div>
            <p className="text-void-500 text-[12px] line-clamp-3 leading-relaxed">
              {item.explanation}
            </p>
            <div className="flex items-center gap-1 mt-3 text-[11px] text-jade-500/70 group-hover:text-jade-400 transition-colors">
              Expand <ArrowUpRight className="w-3 h-3" />
            </div>
          </motion.button>
        ))}
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="absolute inset-0 bg-void-950/80 backdrop-blur-sm"
              onClick={() => setSelected(null)}
            />

            {/* Panel */}
            <motion.div
              initial={animationsEnabled ? { scale: 0.94, y: 16, opacity: 0 } : { opacity: 0 }}
              animate={animationsEnabled ? { scale: 1,    y: 0,  opacity: 1 } : { opacity: 1 }}
              exit={animationsEnabled    ? { scale: 0.94, y: 16, opacity: 0 } : { opacity: 0 }}
              transition={{ type: "spring", stiffness: 360, damping: 30 }}
              className="relative z-10 w-full max-w-lg card-raised rounded-2xl overflow-hidden"
            >
              {/* Top accent */}
              <div className="h-0.5 bg-gradient-to-r from-jade-500 to-amber-400" />

              <div className="p-6">
                {/* Modal header */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-jade-400" />
                    <span className="label text-jade-500">Concept</span>
                  </div>
                  <button
                    onClick={() => setSelected(null)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg border border-[rgba(255,255,255,0.08)] text-void-500 hover:text-void-200 hover:bg-white/5 transition-all focus-ring"
                    aria-label="Close"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h3 className="font-display text-xl font-bold text-void-50 mb-4">
                  {selected.concept}
                </h3>

                <div className="max-h-[55vh] overflow-y-auto pr-1">
                  <p className="text-void-300 text-sm leading-relaxed whitespace-pre-wrap">
                    {selected.explanation}
                  </p>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setSelected(null)}
                    className="px-4 py-2 rounded-lg border border-[rgba(255,255,255,0.1)] text-void-400 hover:text-void-100 hover:bg-white/5 text-sm transition-all focus-ring"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ConceptCard;
