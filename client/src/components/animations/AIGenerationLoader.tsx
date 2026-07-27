import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Search, Brain, BookOpen, Award, Map, CheckCircle } from "lucide-react";

interface Step {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  color: string;
}

const steps: Step[] = [
  { icon: FileText, label: "Notes", color: "from-primary-500 to-primary-600" },
  { icon: Search, label: "Analyzing", color: "from-primary-600 to-secondary-500" },
  { icon: Brain, label: "Understanding", color: "from-secondary-500 to-secondary-600" },
  { icon: BookOpen, label: "Creating Flashcards", color: "from-secondary-600 to-accent-500" },
  { icon: Award, label: "Creating Quiz", color: "from-accent-500 to-accent-600" },
  { icon: Map, label: "Building Roadmap", color: "from-accent-600 to-primary-500" },
  { icon: CheckCircle, label: "Complete", color: "from-primary-500 to-secondary-500" },
];

export const AIGenerationLoader: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      setCurrentStep(steps.length - 1); // Show complete state immediately
      return;
    }

    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 1500);

    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  const current = steps[currentStep];
  const Icon = current.icon;

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-6">
      {/* Animated Icon */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ scale: 0, rotate: -180, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          exit={{ scale: 0, rotate: 180, opacity: 0 }}
          transition={{ duration: 0.5, type: "spring" }}
          className={`w-24 h-24 bg-gradient-to-br ${current.color} rounded-3xl flex items-center justify-center shadow-neon`}
        >
          <Icon className="w-12 h-12 text-white" />
        </motion.div>
      </AnimatePresence>

      {/* Step Label */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="text-center space-y-2"
        >
          <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
            {current.label}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 font-medium">
            AI is crafting your personalized study plan...
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Progress Bar */}
      <div className="w-full max-w-md">
        <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            className={`h-full bg-gradient-to-r ${current.color} rounded-full`}
            initial={{ width: "0%" }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs font-bold text-slate-500 dark:text-slate-400">
          <span>Step {currentStep + 1}</span>
          <span>{steps.length} Steps</span>
        </div>
      </div>

      {/* Step Indicators */}
      <div className="flex gap-2">
        {steps.map((_, index) => (
          <motion.div
            key={index}
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              index <= currentStep ? "bg-primary-500" : "bg-slate-300 dark:bg-slate-600"
            }`}
            animate={{
              scale: index === currentStep ? [1, 1.5, 1] : 1,
            }}
            transition={{
              duration: 0.5,
              repeat: index === currentStep ? Infinity : 0,
            }}
          />
        ))}
      </div>

      {/* Animated Waves */}
      <div className="relative w-full h-16 overflow-hidden opacity-30">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute inset-0 border-2 border-primary-400 dark:border-primary-600 rounded-full`}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 3, opacity: 0 }}
            transition={{
              duration: 2,
              delay: i * 0.6,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        ))}
      </div>
    </div>
  );
};
