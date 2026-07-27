import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock, Archive, Calendar, FolderOpen } from "lucide-react";

/**
 * History page specific background
 * Theme: Memory & Archive
 * Features: Timeline, archive folders, clocks, calendar particles, timeline lines
 */
export const HistoryBackground: React.FC = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  if (prefersReducedMotion) return null;

  return (
    <>
      {/* Subtle purple-slate gradient */}
      <div className="fixed inset-0 pointer-events-none z-[1]">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 via-slate-50/40 to-transparent dark:from-purple-950/15 dark:via-slate-800/25 dark:to-transparent" />
      </div>

      {/* Floating clocks */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: [0.1, 0.18, 0.1],
          rotate: [0, 360],
        }}
        transition={{ 
          opacity: { duration: 8, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 40, repeat: Infinity, ease: "linear" },
        }}
        className="fixed top-[18%] right-[10%] pointer-events-none z-[1]"
      >
        <Clock className="w-24 h-24 text-purple-500 dark:text-purple-600/50" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: [0.08, 0.15, 0.08],
          rotate: [0, -360],
        }}
        transition={{ 
          opacity: { duration: 10, delay: 2, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 50, repeat: Infinity, ease: "linear" },
        }}
        className="fixed bottom-[25%] left-[8%] pointer-events-none z-[1]"
      >
        <Clock className="w-20 h-20 text-slate-400 dark:text-slate-600/50" />
      </motion.div>

      {/* Floating archive folders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: [0.12, 0.2, 0.12],
          y: [0, -25, 0],
        }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        className="fixed top-[45%] left-[12%] pointer-events-none z-[1]"
      >
        <Archive className="w-26 h-26 text-purple-600 dark:text-purple-700/50" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ 
          opacity: [0.1, 0.16, 0.1],
          y: [0, 20, 0],
        }}
        transition={{ duration: 13, delay: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="fixed top-[65%] right-[15%] pointer-events-none z-[1]"
      >
        <FolderOpen className="w-24 h-24 text-slate-500 dark:text-slate-600/50" />
      </motion.div>

      {/* Calendar particles */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: [0.08, 0.14, 0.08],
          scale: [1, 1.15, 1],
          rotate: [0, 5, 0],
        }}
        transition={{ duration: 9, delay: 1, repeat: Infinity, ease: "easeInOut" }}
        className="fixed top-[30%] right-[20%] pointer-events-none z-[1]"
      >
        <Calendar className="w-22 h-22 text-purple-400 dark:text-purple-600/40" />
      </motion.div>

      {/* Timeline lines slowly moving */}
      <motion.div
        className="fixed left-[8%] top-0 bottom-0 w-px pointer-events-none z-[1]"
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ 
          scaleY: [0, 1, 1, 0], 
          opacity: [0, 0.12, 0.12, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "top" }}
      >
        <div className="w-full h-full bg-gradient-to-b from-transparent via-purple-400 dark:via-purple-600/25 to-transparent" />
      </motion.div>

      <motion.div
        className="fixed right-[10%] top-0 bottom-0 w-px pointer-events-none z-[1]"
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ 
          scaleY: [0, 1, 1, 0], 
          opacity: [0, 0.1, 0.1, 0],
        }}
        transition={{ duration: 22, delay: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "bottom" }}
      >
        <div className="w-full h-full bg-gradient-to-t from-transparent via-slate-400 dark:via-slate-600/20 to-transparent" />
      </motion.div>

      {/* Horizontal timeline indicators */}
      {[25, 50, 75].map((top, i) => (
        <motion.div
          key={`timeline-${i}`}
          className="fixed left-[8%] w-8 h-px pointer-events-none z-[1]"
          style={{ top: `${top}%` }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ 
            scaleX: [0, 1, 1, 0], 
            opacity: [0, 0.3, 0.3, 0],
          }}
          transition={{ 
            duration: 6,
            delay: i * 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="w-full h-full bg-purple-400 dark:bg-purple-600/40" />
        </motion.div>
      ))}

      {/* Fade particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={`fade-${i}`}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.2, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: 8 + i * 0.4,
            delay: i * 0.7,
            repeat: Infinity,
            ease: "easeOut",
          }}
          style={{
            position: "fixed",
            left: `${12 + i * 7}%`,
            top: `${25 + (i % 4) * 18}%`,
          }}
          className="w-2 h-2 rounded-full bg-gradient-to-br from-purple-400 to-slate-400 dark:from-purple-600/50 dark:to-slate-600/40 pointer-events-none z-[1]"
        />
      ))}

      {/* Archive box decoration */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ 
          opacity: [0.05, 0.12, 0.05],
          scale: [0.9, 1, 0.9],
        }}
        transition={{ duration: 14, delay: 2, repeat: Infinity, ease: "easeInOut" }}
        className="fixed bottom-[15%] right-[8%] pointer-events-none z-[1]"
      >
        <div className="w-32 h-32 border-2 border-purple-300/30 dark:border-purple-700/25 rounded-lg" />
      </motion.div>
    </>
  );
};
