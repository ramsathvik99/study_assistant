import React from "react";
import { motion } from "framer-motion";
import {
  Flame,
  BookOpen,
  Award,
  Compass,
  Target,
  Brain,
  Zap,
  Trophy,
  TrendingUp,
  LucideIcon,
} from "lucide-react";
import { UserStats } from "../../types/index";
import { Card } from "../common/Card";
import { IconContainer } from "../common/IconContainer";
import { useCountUp } from "../../hooks/useCountUp";

interface StatCardProps {
  title: string;
  value: number;
  suffix: string;
  icon: LucideIcon;
  description: string;
  index: number;
  color: "primary" | "secondary" | "accent" | "emerald" | "purple" | "pink" | "indigo";
  bgColor: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  suffix,
  icon,
  description,
  index,
  color,
  bgColor,
}) => {
  const { count, ref } = useCountUp({
    end: value,
    duration: 2000,
    decimals: suffix === "%" ? 1 : 0,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -2, scale: 1.01 }}
    >
      <div className={`glass ${bgColor === "bg-primary-50" ? "" : bgColor} rounded-2xl p-5 hover:shadow-lg transition-all h-full`}>
        <div className="flex items-start justify-between mb-4">
          <IconContainer icon={icon} color={color} size="md" variant="gradient" />
          <div className="text-right">
            <p className="text-h1 font-black text-slate-900 dark:text-white">
              {count}
              <span className="text-body text-slate-500 dark:text-slate-400 ml-1 font-bold">{suffix}</span>
            </p>
          </div>
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1 uppercase tracking-wider">
            {title}
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">{description}</p>
        </div>
      </div>
    </motion.div>
  );
};

interface StatsDashboardProps {
  stats: UserStats;
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({ stats }) => {
  const statCards = [
    {
      title: "Study Streak",
      value: stats.streak,
      suffix: "days",
      icon: Flame,
      description: "Consecutive study days",
      color: "accent" as const,
      bgColor: "bg-gradient-to-br from-accent-50 to-accent-100",
    },
    {
      title: "Topics Mastered",
      value: stats.topicsCount,
      suffix: "",
      icon: BookOpen,
      description: "Total study sessions",
      color: "primary" as const,
      bgColor: "bg-gradient-to-br from-primary-50 to-primary-100",
    },
    {
      title: "Flashcards Done",
      value: stats.flashcardsCompleted,
      suffix: "",
      icon: Brain,
      description: "Cards completed",
      color: "purple" as const,
      bgColor: "bg-gradient-to-br from-purple-50 to-purple-100",
    },
    {
      title: "Quiz Accuracy",
      value: stats.quizAccuracy,
      suffix: "%",
      icon: Target,
      description: `${stats.quizzesTaken} quizzes taken`,
      color: "emerald" as const,
      bgColor: "bg-gradient-to-br from-emerald-50 to-emerald-100",
    },
    {
      title: "Average Score",
      value: stats.averageScore,
      suffix: "%",
      icon: Award,
      description: "Overall performance",
      color: "indigo" as const,
      bgColor: "bg-gradient-to-br from-indigo-50 to-indigo-100",
    },
    {
      title: "Progress",
      value: stats.revisionProgress,
      suffix: "%",
      icon: Compass,
      description: "Tasks completed",
      color: "secondary" as const,
      bgColor: "bg-gradient-to-br from-secondary-50 to-secondary-100",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Daily Goal Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border border-primary-200 dark:border-primary-700 rounded-2xl p-6 shadow-soft-lg dark:shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <IconContainer icon={Zap} color="primary" size="md" variant="gradient" />
              <div>
                <h3 className="text-h3 font-display font-black text-slate-900 dark:text-white mb-1">
                  Daily Study Goal
                </h3>
                <p className="text-small text-slate-600 dark:text-slate-400 font-medium">
                  Track your daily learning activities and stay consistent
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1 md:min-w-[200px]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Progress</span>
                  <span className="text-h3 font-black text-slate-900 dark:text-white">
                    {stats.dailyGoalProgress}%
                  </span>
                </div>
                <div className="h-2 bg-white/60 dark:bg-slate-700 rounded-full overflow-hidden shadow-soft">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.dailyGoalProgress}%` }}
                    transition={{ duration: 1.5, delay: 0.3 }}
                    className="h-full bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-400 dark:to-primary-500 rounded-full"
                  />
                </div>
              </div>

              {stats.dailyGoalProgress === 100 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 1 }}
                >
                  <IconContainer icon={Trophy} color="emerald" size="md" variant="gradient" animate />
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat, index) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            suffix={stat.suffix}
            icon={stat.icon}
            description={stat.description}
            index={index}
            color={stat.color}
            bgColor={stat.bgColor}
          />
        ))}
      </div>

      {/* Achievements Section */}
      {stats.achievements && stats.achievements.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="bg-surface-elevated dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-soft-lg dark:shadow-md">
            <div className="flex items-center gap-3 mb-6">
              <IconContainer icon={Trophy} color="accent" size="md" variant="gradient" />
              <div>
                <h3 className="text-h3 font-display font-black text-slate-900 dark:text-white">
                  Achievements
                </h3>
                <p className="text-small text-slate-600 dark:text-slate-400 font-medium">
                  {stats.achievements.filter((a) => a.unlockedAt).length} of{" "}
                  {stats.achievements.length} unlocked
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {stats.achievements.map((achievement, idx) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + idx * 0.05 }}
                  className={`p-4 rounded-xl border transition-all ${
                    achievement.unlockedAt
                      ? "bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border-emerald-300 dark:border-emerald-700 shadow-soft dark:shadow-md"
                      : "bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 opacity-60"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg shadow-soft ${
                        achievement.unlockedAt ? "bg-gradient-to-br from-emerald-500 to-emerald-600" : "bg-slate-300 dark:bg-slate-500"
                      }`}
                    >
                      {achievement.unlockedAt ? "🏆" : "🔒"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-900 dark:text-white text-xs mb-0.5">
                        {achievement.title}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug">
                        {achievement.description}
                      </p>
                      {achievement.unlockedAt && (
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-1 flex items-center gap-1">
                          <span>✓</span> Unlocked
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {stats.topicsCount === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-10 text-center shadow-soft dark:shadow-md">
            <IconContainer icon={TrendingUp} color="slate" size="lg" variant="light" className="mx-auto mb-4" />
            <h3 className="text-h3 font-display font-black text-slate-900 dark:text-white mb-2">
              Start Your Journey
            </h3>
            <p className="text-small text-slate-600 dark:text-slate-400 max-w-md mx-auto font-medium">
              Generate your first study plan to see your progress and achievements here
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default StatsDashboard;
