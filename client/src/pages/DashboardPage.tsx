import React from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Brain,
  Target,
  Flame,
  TrendingUp,
  Zap,
  Clock,
  Award,
  Calendar,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { UserStats } from "../types/index";
import { PageContainer, PageHeader, SectionHeader } from "../components/layout/PageContainer";
import { ContentCard } from "../components/layout/ContentCard";
import { ContentGrid } from "../components/layout/ContentGrid";
import { Button } from "../components/common/Button";
import { premiumAnimations } from "../animations/premiumAnimations";

interface DashboardPageProps {
  stats: UserStats;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ stats }) => {
  const navigate = useNavigate();

  // Calculate additional metrics
  const completionRate = stats.topicsCount > 0
    ? Math.round((stats.flashcardsCompleted / (stats.topicsCount * 10)) * 100)
    : 0;
  const studyMinutesThisWeek = stats.topicsCount * 45;

  return (
    <PageContainer>
      <motion.div {...premiumAnimations.pageEnter}>
        <PageHeader
          title="Dashboard"
          subtitle="Track your learning progress and achievements"
          action={
            <Button
              variant="gradient"
              size="md"
              icon={<Zap className="w-4 h-4" />}
              onClick={() => navigate("/")}
            >
              New Study Plan
            </Button>
          }
        />

        {/* Stats Grid - 4 columns with staggered animation */}
        <motion.div
          variants={premiumAnimations.containerStagger}
          initial="initial"
          animate="animate"
        >
          <ContentGrid columns={4} gap={4} className="mb-6 sm:mb-8">
            {[
              { icon: BookOpen, label: "Topics Studied", value: stats.topicsCount, color: "from-primary-500 to-primary-600" },
              { icon: Flame, label: "Day Streak", value: stats.streak, color: "from-accent-500 to-accent-600" },
              { icon: Target, label: "Quiz Accuracy", value: `${stats.quizAccuracy}%`, color: "from-emerald-500 to-emerald-600" },
              { icon: Brain, label: "Flashcards Done", value: stats.flashcardsCompleted, color: "from-purple-500 to-purple-600" },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div key={idx} variants={premiumAnimations.staggerItem} whileHover={premiumAnimations.cardHover}>
                  <ContentCard hover>
                    <div className="flex flex-col items-start gap-3 sm:gap-4">
                      <motion.div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${stat.color} rounded-xl sm:rounded-2xl flex items-center justify-center shadow-soft shrink-0`}>
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </motion.div>
                      <div className="flex-1 w-full">
                        <p className="text-[10px] sm:text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                          {stat.label}
                        </p>
                        <motion.p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white" {...premiumAnimations.numberCounter}>
                          {stat.value}
                        </motion.p>
                      </div>
                    </div>
                  </ContentCard>
                </motion.div>
              );
            })}
          </ContentGrid>
        </motion.div>

        {/* Two Column Layout */}
        <motion.div
          variants={premiumAnimations.containerStagger}
          initial="initial"
          animate="animate"
        >
          <ContentGrid columns={2} gap={4} className="mb-6 sm:mb-8">
            {/* Study Progress */}
            <motion.div variants={premiumAnimations.staggerItem} whileHover={premiumAnimations.cardHover}>
              <ContentCard hover>
                <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-soft shrink-0">
                    <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Study Progress</h3>
                </div>

                <div className="space-y-5 sm:space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2.5 sm:mb-3">
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Completion Rate</span>
                      <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{completionRate}%</span>
                    </div>
                    <div className="w-full h-2.5 sm:h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${completionRate}%` }}
                        transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-soft"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-2 sm:pt-4">
                    <motion.div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-700 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-600" whileHover={{ scale: 1.02 }}>
                      <p className="text-[11px] sm:text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2 sm:mb-2.5">
                        Quizzes Taken
                      </p>
                      <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{stats.quizzesTaken}</p>
                    </motion.div>
                    <motion.div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-700 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-600" whileHover={{ scale: 1.02 }}>
                      <p className="text-[11px] sm:text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2 sm:mb-2.5">
                        Avg Score
                      </p>
                      <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{stats.averageScore}%</p>
                    </motion.div>
                  </div>
                </div>
              </ContentCard>
            </motion.div>

            {/* Weekly Activity */}
            <motion.div variants={premiumAnimations.staggerItem} whileHover={premiumAnimations.cardHover}>
              <ContentCard hover>
                <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-soft shrink-0">
                    <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Weekly Activity</h3>
                </div>

                <div className="space-y-5 sm:space-y-6">
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <motion.div className="p-4 sm:p-5 bg-primary-50 dark:bg-primary-900/20 rounded-xl sm:rounded-2xl border border-primary-100 dark:border-primary-900/30" whileHover={{ scale: 1.02 }}>
                      <p className="text-[11px] sm:text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-2 sm:mb-2.5">
                        Study Time
                      </p>
                      <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{studyMinutesThisWeek} min</p>
                    </motion.div>
                    <motion.div className="p-4 sm:p-5 bg-accent-50 dark:bg-accent-900/20 rounded-xl sm:rounded-2xl border border-accent-100 dark:border-accent-900/30" whileHover={{ scale: 1.02 }}>
                      <p className="text-[11px] sm:text-xs font-bold text-accent-600 dark:text-accent-400 uppercase tracking-wider mb-2 sm:mb-2.5">
                        Sessions
                      </p>
                      <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{stats.topicsCount}</p>
                    </motion.div>
                  </div>

                  <div className="pt-2 sm:pt-4 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                      {stats.streak > 0
                        ? `🔥 You're on a ${stats.streak}-day streak! Keep it up!`
                        : "Start studying today to begin your streak!"}
                    </p>
                  </div>
                </div>
              </ContentCard>
            </motion.div>
          </ContentGrid>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={premiumAnimations.staggerItem} initial="initial" animate="animate" className="mt-8 sm:mt-10">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Quick Actions</h2>
          </div>
          <motion.div
            variants={premiumAnimations.containerStagger}
            initial="initial"
            animate="animate"
          >
            <ContentGrid columns={3} gap={4}>
              {[
                { icon: Zap, label: "New Study Plan", description: "Generate AI study materials", path: "/", color: "from-primary-500 to-primary-600" },
                { icon: Clock, label: "Study History", description: "Review past sessions", path: "/history", color: "from-purple-500 to-purple-600" },
                { icon: Award, label: "Achievements", description: "View your badges", path: "/dashboard", color: "from-teal-500 to-teal-600" },
              ].map((action, idx) => {
                const Icon = action.icon;
                return (
                  <motion.div key={idx} variants={premiumAnimations.staggerItem} whileHover={premiumAnimations.cardHover}>
                    <ContentCard hover onClick={() => navigate(action.path)} className="cursor-pointer h-full">
                      <div className="flex flex-col items-center justify-center gap-4 sm:gap-5 py-6 sm:py-8">
                        <motion.div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${action.color} rounded-2xl flex items-center justify-center shadow-soft`} whileHover={{ scale: 1.1, rotate: 5 }}>
                          <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                        </motion.div>
                        <div className="text-center">
                          <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-1.5">{action.label}</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{action.description}</p>
                        </div>
                      </div>
                    </ContentCard>
                  </motion.div>
                );
              })}
            </ContentGrid>
          </motion.div>
        </motion.div>
      </motion.div>
    </PageContainer>
  );
};

export default DashboardPage;
