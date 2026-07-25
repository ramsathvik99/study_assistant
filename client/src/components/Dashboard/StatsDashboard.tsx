import React from "react";
import { UserStats } from "../../types/index.js";
import { Flame, BookOpen, Brain, Award, Target, Map, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { staggerContainer, fadeUp } from "../../animations/variants.js";

interface StatsDashboardProps {
  stats: UserStats;
  animationsEnabled?: boolean;
}

// ─── Stat card data ───────────────────────────────────────────────────────────

const buildItems = (stats: UserStats) => [
  {
    label: "Current Streak",
    value: `${stats.streak}`,
    unit:  "days",
    desc:  "Consecutive study days",
    icon:  Flame,
    color: "text-fire-400",
    bg:    "bg-fire-500/10 border-fire-500/20",
  },
  {
    label: "Topics Studied",
    value: `${stats.topicsCount}`,
    unit:  "topics",
    desc:  "Study plans generated",
    icon:  BookOpen,
    color: "text-amber-400",
    bg:    "bg-amber-500/10 border-amber-500/20",
  },
  {
    label: "Flashcards Mastered",
    value: `${stats.flashcardsCompleted}`,
    unit:  "cards",
    desc:  "Completed across all sessions",
    icon:  Brain,
    color: "text-violet-400",
    bg:    "bg-violet-500/10 border-violet-500/20",
  },
  {
    label: "Quiz Accuracy",
    value: `${stats.quizAccuracy}`,
    unit:  "%",
    desc:  `Over ${stats.quizzesTaken} quizzes taken`,
    icon:  Award,
    color: "text-jade-400",
    bg:    "bg-jade-500/10 border-jade-500/20",
  },
  {
    label: "Average Score",
    value: `${stats.averageScore}`,
    unit:  "%",
    desc:  "Average quiz performance",
    icon:  Target,
    color: "text-rose-400",
    bg:    "bg-rose-500/10 border-rose-500/20",
  },
  {
    label: "Revision Progress",
    value: `${stats.revisionProgress}`,
    unit:  "%",
    desc:  "Roadmap tasks completed",
    icon:  Map,
    color: "text-jade-400",
    bg:    "bg-jade-500/10 border-jade-500/20",
  },
];

// ─── Mini progress ring ───────────────────────────────────────────────────────

const Ring: React.FC<{ pct: number; color: string; size?: number }> = ({
  pct, color, size = 44,
}) => {
  const r   = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="-rotate-90" viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.06)" strokeWidth="3" fill="none" />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        stroke="currentColor"
        className={color}
        strokeWidth="3" fill="none"
        strokeLinecap="round"
        strokeDasharray={`${(pct / 100) * circ} ${circ}`}
        style={{ transition: "stroke-dasharray 0.8s ease" }}
      />
    </svg>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────

export const StatsDashboard: React.FC<StatsDashboardProps> = ({
  stats,
  animationsEnabled = true,
}) => {
  const items = buildItems(stats);

  return (
    <div className="space-y-8">

      {/* ── Daily goal banner ─────────────────────────────────────────── */}
      <div className="rounded-xl border border-[rgba(255,255,255,0.07)] bg-void-900/80 overflow-hidden">
        {/* Progress bar stripe at top */}
        <div className="h-0.5 bg-void-800">
          <motion.div
            className="h-full bg-amber-500"
            initial={{ width: 0 }}
            animate={{ width: `${stats.dailyGoalProgress}%` }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          />
        </div>

        <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/12 border border-amber-500/20 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="font-display font-bold text-void-100 text-base">Daily Study Goal</p>
              <p className="text-[11px] text-void-500 mt-0.5">
                Generate a session, review flashcards, and score on quizzes
              </p>
            </div>
          </div>

          <div className="sm:ml-auto flex items-center gap-4 shrink-0">
            <div className="flex-1 sm:w-48">
              <div className="flex justify-between text-[11px] font-mono text-void-500 mb-1.5">
                <span>Today</span>
                <span>{stats.dailyGoalProgress}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-void-800 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-amber-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.dailyGoalProgress}%` }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                />
              </div>
            </div>
            <div className={[
              "w-12 h-12 rounded-xl flex items-center justify-center font-mono text-sm font-bold shrink-0 border",
              stats.dailyGoalProgress === 100
                ? "bg-jade-500/15 border-jade-500/30 text-jade-400"
                : "bg-void-800 border-[rgba(255,255,255,0.08)] text-void-400",
            ].join(" ")}>
              {stats.dailyGoalProgress === 100 ? "✓" : `${stats.dailyGoalProgress}%`}
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats grid ────────────────────────────────────────────────── */}
      <motion.div
        variants={staggerContainer(animationsEnabled)}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {items.map((item, idx) => {
          const Icon   = item.icon;
          const isPercent = item.unit === "%";
          const numVal    = Number(item.value);

          return (
            <motion.div
              key={idx}
              variants={fadeUp(animationsEnabled)}
              className="rounded-xl border border-[rgba(255,255,255,0.07)] bg-void-900/60 hover:border-[rgba(255,255,255,0.12)] transition-colors p-5 flex items-center gap-4"
            >
              {/* Icon or ring */}
              <div className="shrink-0">
                {isPercent ? (
                  <div className={`relative w-11 h-11 rounded-xl ${item.bg} border flex items-center justify-center`}>
                    <Ring pct={numVal} color={item.color} size={44} />
                    <span className={`absolute font-mono text-[9px] font-bold ${item.color}`}>
                      {numVal}%
                    </span>
                  </div>
                ) : (
                  <div className={`w-11 h-11 rounded-xl ${item.bg} border flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-2xl font-bold text-void-50">{item.value}</span>
                  {!isPercent && (
                    <span className="text-[11px] text-void-500 font-mono">{item.unit}</span>
                  )}
                </div>
                <p className="text-[12px] font-medium text-void-300 truncate">{item.label}</p>
                <p className="text-[11px] text-void-600 truncate mt-0.5">{item.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ── Achievements ──────────────────────────────────────────────── */}
      {stats.achievements.length > 0 && (
        <div className="space-y-3">
          <p className="label">Achievements</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {stats.achievements.map((a) => (
              <div
                key={a.id}
                className={[
                  "rounded-xl border p-4 text-center space-y-2 transition-all",
                  a.unlockedAt
                    ? "border-amber-500/25 bg-amber-500/6 hover:border-amber-500/40"
                    : "border-[rgba(255,255,255,0.05)] bg-void-950/40 opacity-40 grayscale",
                ].join(" ")}
              >
                <div className="text-2xl">{a.icon}</div>
                <p className={`text-[12px] font-semibold leading-snug ${a.unlockedAt ? "text-void-200" : "text-void-600"}`}>
                  {a.title}
                </p>
                <p className="text-[10px] text-void-600 leading-snug">{a.description}</p>
                {a.unlockedAt && (
                  <p className="text-[9px] font-mono text-amber-500/60">
                    {new Date(a.unlockedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsDashboard;
