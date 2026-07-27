import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Clock, BarChart3, FileText } from "lucide-react";

interface EmptyStateProps {
  type: "history" | "dashboard" | "session" | "generic";
  title: string;
  description: string;
  action?: React.ReactNode;
}

const illustrations = {
  history: Clock,
  dashboard: BarChart3,
  session: FileText,
  generic: BookOpen,
};

export const EmptyState: React.FC<EmptyStateProps> = ({ type, title, description, action }) => {
  const Icon = illustrations[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      {/* Animated Icon Container */}
      <motion.div
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative mb-8"
      >
        {/* Pulsing circles */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 border-2 border-primary-300 dark:border-primary-700 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              delay: i * 0.6,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        ))}

        {/* Main Icon */}
        <motion.div
          animate={{
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-32 h-32 bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900 dark:to-secondary-900 rounded-3xl flex items-center justify-center shadow-glass relative z-10"
        >
          <Icon className="w-16 h-16 text-primary-600 dark:text-primary-400" />
        </motion.div>
      </motion.div>

      {/* Text Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="space-y-3 max-w-md"
      >
        <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white">{title}</h3>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{description}</p>
      </motion.div>

      {/* Action Button */}
      {action && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-8"
        >
          {action}
        </motion.div>
      )}

      {/* Decorative dots */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 3 + i,
              delay: i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute w-2 h-2 bg-primary-400 rounded-full"
            style={{
              left: `${20 + i * 12}%`,
              top: `${30 + (i % 2) * 40}%`,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};
