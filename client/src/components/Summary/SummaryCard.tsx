import React, { useState, useEffect } from "react";
import { Button } from "../common/Button.js";
import { tts } from "../../utils/textToSpeech.js";
import {
  FileText, Copy, Check, ChevronUp, ChevronDown,
  Volume2, VolumeX, Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SummaryCardProps {
  summary: string;
  animationsEnabled?: boolean;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  summary,
  animationsEnabled = true,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [copied,    setCopied]    = useState(false);
  const [speaking,  setSpeaking]  = useState(false);

  useEffect(() => () => tts.stop(), []);

  const wordCount   = summary.split(/\s+/).filter(Boolean).length;
  const readingMins = Math.max(1, Math.ceil(wordCount / 200));

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (_) {}
  };

  const handleSpeak = () => {
    if (speaking) {
      tts.stop();
      setSpeaking(false);
    } else {
      tts.speak(summary, setSpeaking);
    }
  };

  return (
    <div className="space-y-0">
      {/* Header row */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-violet-500/12 border border-violet-500/20 flex items-center justify-center">
            <FileText className="w-4 h-4 text-violet-400" />
          </div>
          <div>
            <h2 className="font-display font-bold text-void-100 text-base">AI Summary</h2>
            <div className="flex items-center gap-3 mt-0.5">
              <span className="flex items-center gap-1 text-[11px] text-void-500">
                <Clock className="w-3 h-3" /> {readingMins} min read
              </span>
              <span className="text-[11px] text-void-600">{wordCount} words</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {tts.isSupported() && (
            <button
              onClick={handleSpeak}
              className={[
                "w-8 h-8 flex items-center justify-center rounded-lg border transition-all focus-ring",
                speaking
                  ? "bg-rose-500/10 border-rose-500/25 text-rose-400"
                  : "border-[rgba(255,255,255,0.08)] text-void-500 hover:text-void-200 hover:bg-white/5",
              ].join(" ")}
              title={speaking ? "Stop" : "Read aloud"}
            >
              {speaking
                ? <VolumeX className="w-3.5 h-3.5 animate-pulse" />
                : <Volume2 className="w-3.5 h-3.5" />}
            </button>
          )}
          <button
            onClick={handleCopy}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-[rgba(255,255,255,0.08)] text-void-500 hover:text-void-200 hover:bg-white/5 transition-all focus-ring"
            title="Copy summary"
          >
            {copied
              ? <Check className="w-3.5 h-3.5 text-jade-400" />
              : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-[rgba(255,255,255,0.08)] text-void-500 hover:text-void-200 hover:bg-white/5 transition-all focus-ring"
            title={collapsed ? "Expand" : "Collapse"}
          >
            {collapsed
              ? <ChevronDown className="w-3.5 h-3.5" />
              : <ChevronUp   className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Card body */}
      <div className="card-raised rounded-xl overflow-hidden">
        {/* Top accent bar */}
        <div className="h-0.5 bg-gradient-to-r from-violet-500 via-amber-400 to-violet-500 opacity-60" />

        <AnimatePresence initial={false}>
          {!collapsed ? (
            <motion.div
              key="expanded"
              initial={animationsEnabled ? { height: 0, opacity: 0 } : undefined}
              animate={animationsEnabled ? { height: "auto", opacity: 1 } : undefined}
              exit={animationsEnabled    ? { height: 0, opacity: 0  } : undefined}
              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <p className="px-6 py-5 text-void-300 leading-relaxed text-[14px] whitespace-pre-line">
                {summary}
              </p>
            </motion.div>
          ) : (
            <button
              key="collapsed"
              onClick={() => setCollapsed(false)}
              className="w-full px-6 py-3 text-left text-xs text-violet-400 hover:text-violet-300 transition-colors"
            >
              Read full summary…
            </button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SummaryCard;
