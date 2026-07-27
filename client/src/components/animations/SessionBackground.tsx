import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bookmark, FileText, MapPin, BookMarked } from "lucide-react";

/**
 * Session/Study workspace specific background
 * Theme: Learning Journey
 * Features: Timeline, bookmarks, documents, connecting paths, milestones
 */
export const SessionBackground: React.FC = () => {
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
      {/* Soft gradient overlay */}
      <div className="fixed inset-0 pointer-events-none z-[1]">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/40 via-blue-50/30 to-transparent dark:from-indigo-950/20 dark:via-blue-950/15 dark:to-transparent" />
      </div>

      {/* Floating bookmarks */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ 
          opacity: [0.1, 0.18, 0.1],
          x: [0, 15, 0],
          rotate: [0, 8, 0],
        }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="fixed top-[20%] left-[10%] pointer-events-none z-[1]"
      >
        <Bookmark className="w-20 h-20 text-indigo-500 dark:text-indigo-600/50" fill="rgba(99, 102, 241, 0.1)" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ 
          opacity: [0.12, 0.2, 0.12],
          x: [0, -12, 0],
          rotate: [0, -6, 0],
        }}
        transition={{ duration: 11, delay: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="fixed top-[55%] right-[8%] pointer-events-none z-[1]"
      >
        <BookMarked className="w-24 h-24 text-blue-600 dark:text-blue-700/50" />
      </motion.div>

      {/* Floating documents */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ 
          opacity: [0.08, 0.15, 0.08],
          y: [0, -20, 0],
          rotate: [2, -2, 2],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="fixed top-[40%] left-[7%] pointer-events-none z-[1]"
      >
        <FileText className="w-28 h-28 text-indigo-400 dark:text-indigo-600/40" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ 
          opacity: [0.1, 0.16, 0.1],
          y: [0, 18, 0],
          rotate: [-3, 3, -3],
        }}
        transition={{ duration: 12, delay: 2, repeat: Infinity, ease: "easeInOut" }}
        className="fixed bottom-[30%] right-[12%] pointer-events-none z-[1]"
      >
        <FileText className="w-22 h-22 text-blue-500 dark:text-blue-600/40" />
      </motion.div>

      {/* Study milestones */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 7, delay: 1, repeat: Infinity, ease: "easeInOut" }}
        className="fixed bottom-[20%] left-[15%] pointer-events-none z-[1]"
      >
        <MapPin className="w-16 h-16 text-indigo-600 dark:text-indigo-700/50" />
      </motion.div>

      {/* Connecting path animations */}
      <svg className="fixed inset-0 w-full h-full pointer-events-none z-[1]" xmlns="http://www.w3.org/2000/svg">
        <motion.path
          d="M 10,80 Q 40,20 80,50 T 150,80"
          stroke="rgba(99, 102, 241, 0.06)"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: [0, 1, 0], opacity: [0, 0.3, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="dark:stroke-indigo-600/10"
        />
        <motion.path
          d="M 90,20 Q 120,60 180,40 T 250,70"
          stroke="rgba(37, 99, 235, 0.05)"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: [0, 1, 0], opacity: [0, 0.25, 0] }}
          transition={{ duration: 12, delay: 2, repeat: Infinity, ease: "easeInOut" }}
          className="dark:stroke-blue-600/10"
        />
      </svg>

      {/* Soft pulse particles */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={`pulse-${i}`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, 2, 0],
            opacity: [0, 0.3, 0],
          }}
          transition={{
            duration: 6 + i * 0.5,
            delay: i * 0.8,
            repeat: Infinity,
            ease: "easeOut",
          }}
          style={{
            position: "fixed",
            left: `${10 + i * 8}%`,
            top: `${30 + (i % 3) * 20}%`,
          }}
          className="w-3 h-3 rounded-full bg-indigo-400/20 dark:bg-indigo-600/15 pointer-events-none z-[1]"
        />
      ))}

      {/* Timeline indicator */}
      <motion.div
        className="fixed left-[5%] top-[10%] bottom-[10%] w-1 pointer-events-none z-[1]"
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ scaleY: [0, 1, 1, 0], opacity: [0, 0.15, 0.15, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "top" }}
      >
        <div className="w-full h-full bg-gradient-to-b from-transparent via-indigo-400 dark:via-indigo-600/30 to-transparent rounded-full" />
      </motion.div>
    </>
  );
};
