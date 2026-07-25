import React, { useState } from "react";
import { Mnemonic } from "../../types/index.js";
import { Brain, Star, Copy, Check } from "lucide-react";
import { motion } from "framer-motion";
import { staggerContainer, fadeUp } from "../../animations/variants.js";

interface MnemonicsGridProps {
  mnemonics: Mnemonic[];
  onUpdateMnemonics: (updated: Mnemonic[]) => void;
  animationsEnabled?: boolean;
}

export const MnemonicsGrid: React.FC<MnemonicsGridProps> = ({
  mnemonics,
  onUpdateMnemonics,
  animationsEnabled = true,
}) => {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleCopy = async (phrase: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(phrase);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    } catch (_) {}
  };

  const toggleFavorite = (idx: number) => {
    const updated = [...mnemonics];
    updated[idx] = { ...updated[idx], isFavorite: !updated[idx].isFavorite };
    onUpdateMnemonics(updated);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-violet-500/12 border border-violet-500/20 flex items-center justify-center">
          <Brain className="w-4 h-4 text-violet-400" />
        </div>
        <div>
          <h2 className="font-display font-bold text-void-100 text-base">Memory Mnemonics</h2>
          <p className="text-[11px] text-void-500 mt-0.5">Clever phrases to lock in key concepts</p>
        </div>
      </div>

      {/* Grid */}
      <motion.div
        variants={staggerContainer(animationsEnabled)}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 gap-3"
      >
        {mnemonics.map((item, idx) => (
          <motion.div
            key={idx}
            variants={fadeUp(animationsEnabled)}
            className="group relative rounded-xl border border-[rgba(255,255,255,0.07)] bg-void-900/60 hover:border-amber-500/20 hover:bg-amber-500/4 transition-all duration-200 overflow-hidden"
          >
            {/* Top bar */}
            <div className="h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />

            <div className="p-4 space-y-3">
              {/* Concept row */}
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-semibold text-void-200 text-[13px] leading-snug">
                  {item.concept}
                </h3>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => toggleFavorite(idx)}
                    className={[
                      "w-7 h-7 flex items-center justify-center rounded-lg border transition-all focus-ring",
                      item.isFavorite
                        ? "bg-amber-500/12 border-amber-500/30 text-amber-400"
                        : "border-[rgba(255,255,255,0.08)] text-void-600 hover:text-void-300",
                    ].join(" ")}
                    title="Star mnemonic"
                  >
                    <Star className={`w-3 h-3 ${item.isFavorite ? "fill-amber-400" : ""}`} />
                  </button>
                  <button
                    onClick={() => handleCopy(item.phrase, idx)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg border border-[rgba(255,255,255,0.08)] text-void-600 hover:text-void-300 transition-all focus-ring"
                    title="Copy phrase"
                  >
                    {copiedIdx === idx
                      ? <Check className="w-3 h-3 text-jade-400" />
                      : <Copy  className="w-3 h-3" />}
                  </button>
                </div>
              </div>

              {/* Phrase */}
              <div className="px-3 py-2.5 rounded-lg bg-void-950/60 border border-[rgba(255,255,255,0.06)]">
                <p className="font-mono text-[13px] text-amber-300/90 italic leading-relaxed">
                  "{item.phrase}"
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default MnemonicsGrid;
