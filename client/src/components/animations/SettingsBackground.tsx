import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Settings, Sliders, ToggleLeft, Palette, Wrench } from "lucide-react";

/**
 * Settings page specific background
 * Theme: Customization & Configuration
 * Features: Animated gears, floating sliders, toggles, settings icons, blueprint grid
 */
export const SettingsBackground: React.FC = () => {
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
      {/* Blueprint-style grid */}
      <div className="fixed inset-0 pointer-events-none z-[1]">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50/25 via-slate-50/30 to-transparent" />
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(20, 184, 166, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(20, 184, 166, 0.3) 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }}
        />
      </div>

      {/* Rotating gears */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="fixed top-[20%] right-[12%] pointer-events-none z-[1]"
        style={{ opacity: 0.1 }}
      >
        <Settings className="w-28 h-28 text-teal-600" />
      </motion.div>

      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="fixed bottom-[30%] left-[10%] pointer-events-none z-[1]"
        style={{ opacity: 0.08 }}
      >
        <Settings className="w-24 h-24 text-slate-500" />
      </motion.div>

      {/* Floating sliders */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ 
          opacity: [0.12, 0.2, 0.12],
          x: [-10, 10, -10],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="fixed top-[40%] left-[8%] pointer-events-none z-[1]"
      >
        <Sliders className="w-26 h-26 text-teal-500" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ 
          opacity: [0.1, 0.18, 0.1],
          x: [10, -10, 10],
        }}
        transition={{ duration: 10, delay: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="fixed top-[65%] right-[15%] pointer-events-none z-[1]"
      >
        <Sliders className="w-22 h-22 text-slate-400" />
      </motion.div>

      {/* Toggle animations */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: [0.1, 0.16, 0.1],
          rotate: [0, 180, 360],
        }}
        transition={{ 
          opacity: { duration: 6, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
        }}
        className="fixed top-[25%] left-[15%] pointer-events-none z-[1]"
      >
        <ToggleLeft className="w-20 h-20 text-teal-600" />
      </motion.div>

      {/* Palette icon */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ 
          opacity: [0.08, 0.14, 0.08],
          scale: [0.9, 1.05, 0.9],
          rotate: [0, 5, -5, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="fixed bottom-[20%] right-[8%] pointer-events-none z-[1]"
      >
        <Palette className="w-24 h-24 text-purple-400" />
      </motion.div>

      {/* Wrench tool */}
      <motion.div
        initial={{ opacity: 0, rotate: 0 }}
        animate={{ 
          opacity: [0.1, 0.15, 0.1],
          rotate: [0, -15, 15, 0],
        }}
        transition={{ duration: 10, delay: 2, repeat: Infinity, ease: "easeInOut" }}
        className="fixed top-[55%] right-[20%] pointer-events-none z-[1]"
      >
        <Wrench className="w-18 h-18 text-slate-500" />
      </motion.div>

      {/* Configuration nodes */}
      {[
        { x: 20, y: 30, delay: 0 },
        { x: 35, y: 50, delay: 1 },
        { x: 65, y: 40, delay: 2 },
        { x: 80, y: 60, delay: 3 },
      ].map((node, i) => (
        <React.Fragment key={`node-${i}`}>
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 1.2, 1],
              opacity: [0, 0.25, 0.15],
            }}
            transition={{ 
              duration: 2,
              delay: node.delay,
              repeat: Infinity,
              repeatDelay: 6,
              ease: "easeOut",
            }}
            style={{
              position: "fixed",
              left: `${node.x}%`,
              top: `${node.y}%`,
            }}
            className="w-3 h-3 rounded-full bg-teal-500 pointer-events-none z-[1]"
          />
          {i < 3 && (
            <motion.div
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: [0, 1],
                opacity: [0, 0.15, 0],
              }}
              transition={{ 
                duration: 2,
                delay: node.delay + 0.5,
                repeat: Infinity,
                repeatDelay: 6,
                ease: "easeInOut",
              }}
              style={{
                position: "fixed",
                left: 0,
                top: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                zIndex: 1,
              }}
            >
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <motion.line
                  x1={`${node.x}%`}
                  y1={`${node.y}%`}
                  x2={`${[35, 65, 80][i]}%`}
                  y2={`${[50, 40, 60][i]}%`}
                  stroke="rgba(20, 184, 166, 0.15)"
                  strokeWidth="1"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: [0, 1] }}
                  transition={{
                    duration: 2,
                    delay: node.delay + 0.5,
                    repeat: Infinity,
                    repeatDelay: 6,
                  }}
                />
              </svg>
            </motion.div>
          )}
        </React.Fragment>
      ))}

      {/* Subtle particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`setting-particle-${i}`}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.25, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 5 + i,
            delay: i * 1.2,
            repeat: Infinity,
            ease: "easeOut",
          }}
          style={{
            position: "fixed",
            left: `${20 + i * 12}%`,
            top: `${35 + (i % 2) * 30}%`,
          }}
          className="w-1.5 h-1.5 rounded-full bg-teal-400 pointer-events-none z-[1]"
        />
      ))}

      {/* Corner decorative elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.02, 0.06, 0.02] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="fixed top-[10%] left-[5%] w-16 h-16 border-2 border-teal-300 rounded-lg pointer-events-none z-[1]"
        style={{ transform: "rotate(45deg)" }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.03, 0.08, 0.03] }}
        transition={{ duration: 10, delay: 2, repeat: Infinity, ease: "easeInOut" }}
        className="fixed bottom-[12%] right-[6%] w-20 h-20 border-2 border-slate-300 rounded-full pointer-events-none z-[1]"
      />
    </>
  );
};
