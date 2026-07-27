import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Award, Target, BarChart3, Zap } from "lucide-react";

/**
 * Dashboard-specific background
 * Theme: Progress & Productivity
 * Features: Animated graphs, progress rings, floating stats, achievement badges
 */
export const DashboardBackground: React.FC = () => {
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
      {/* Subtle dashboard grid */}
      <div className="fixed inset-0 pointer-events-none z-[1]">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/30 via-blue-50/30 to-transparent dark:from-emerald-950/15 dark:via-blue-950/15 dark:to-transparent" />
      </div>

      {/* Floating achievement badges */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.08, scale: 1, rotate: [0, 5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="fixed top-[15%] left-[8%] pointer-events-none z-[1]"
      >
        <Award className="w-24 h-24 text-emerald-500 dark:text-emerald-600/50" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.1, scale: 1, rotate: [0, -8, 0] }}
        transition={{ duration: 10, delay: 1, repeat: Infinity, ease: "easeInOut" }}
        className="fixed top-[60%] right-[10%] pointer-events-none z-[1]"
      >
        <Target className="w-20 h-20 text-blue-500 dark:text-blue-600/50" />
      </motion.div>

      {/* Animated progress rings */}
      <motion.div
        className="fixed top-[40%] left-[5%] pointer-events-none z-[1]"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="50"
            stroke="rgba(16, 185, 129, 0.1)"
            strokeWidth="4"
            fill="none"
            strokeDasharray="314"
            strokeDashoffset="78.5"
            className="dark:stroke-emerald-600/20"
          />
        </svg>
      </motion.div>

      <motion.div
        className="fixed bottom-[25%] right-[15%] pointer-events-none z-[1]"
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      >
        <svg width="100" height="100" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="rgba(37, 99, 235, 0.12)"
            strokeWidth="5"
            fill="none"
            strokeDasharray="251"
            strokeDashoffset="62.75"
            className="dark:stroke-blue-600/20"
          />
        </svg>
      </motion.div>

      {/* Floating statistics icons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: [0.06, 0.12, 0.06],
          y: [0, -30, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="fixed top-[25%] right-[5%] pointer-events-none z-[1]"
      >
        <TrendingUp className="w-28 h-28 text-emerald-600 dark:text-emerald-700/40" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ 
          opacity: [0.08, 0.14, 0.08],
          y: [0, 25, 0],
        }}
        transition={{ duration: 10, delay: 2, repeat: Infinity, ease: "easeInOut" }}
        className="fixed bottom-[35%] left-[12%] pointer-events-none z-[1]"
      >
        <BarChart3 className="w-24 h-24 text-blue-600 dark:text-blue-700/40" />
      </motion.div>

      {/* Energy particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.4, 0],
            scale: [0, 1, 0],
            x: [0, Math.random() * 100 - 50],
            y: [0, Math.random() * 100 - 50],
          }}
          transition={{
            duration: 5 + i,
            delay: i * 0.6,
            repeat: Infinity,
            ease: "easeOut",
          }}
          style={{
            position: "fixed",
            left: `${15 + i * 10}%`,
            top: `${20 + (i % 4) * 20}%`,
          }}
          className="w-2 h-2 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 dark:from-emerald-600/60 dark:to-blue-600/60 pointer-events-none z-[1]"
        />
      ))}

      {/* Animated progress lines */}
      <motion.div
        className="fixed top-[50%] left-0 right-0 h-px pointer-events-none z-[1]"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: [0, 1, 0], opacity: [0, 0.1, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "left" }}
      >
        <div className="w-full h-full bg-gradient-to-r from-transparent via-emerald-400 dark:via-emerald-600/40 to-transparent" />
      </motion.div>

      {/* Subtle zap icon */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: [0.05, 0.15, 0.05],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 6, delay: 3, repeat: Infinity, ease: "easeInOut" }}
        className="fixed bottom-[15%] right-[25%] pointer-events-none z-[1]"
      >
        <Zap className="w-16 h-16 text-yellow-500 dark:text-yellow-700/40" />
      </motion.div>
    </>
  );
};
