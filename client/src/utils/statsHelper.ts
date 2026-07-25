import { StudySession, UserStats, Achievement } from "../types/index.js";

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_session",
    title: "Curious Mind",
    description: "Generate your first study session plan.",
    unlockedAt: null,
    icon: "BookOpen",
  },
  {
    id: "quiz_taken",
    title: "Knowledge Tester",
    description: "Complete your first study topic quiz.",
    unlockedAt: null,
    icon: "Award",
  },
  {
    id: "perfect_quiz",
    title: "Subject Master",
    description: "Achieve a perfect 100% score on a quiz.",
    unlockedAt: null,
    icon: "Flame",
  },
  {
    id: "flashcard_master",
    title: "Memory Whiz",
    description: "Mark 5 or more flashcards as completed.",
    unlockedAt: null,
    icon: "Brain",
  },
  {
    id: "roadmap_complete",
    title: "Pathfinder",
    description: "Mark a study roadmap task as complete.",
    unlockedAt: null,
    icon: "Compass",
  },
  {
    id: "streak_2",
    title: "Double Spark",
    description: "Achieve a 2-day study streak.",
    unlockedAt: null,
    icon: "Zap",
  },
];

/**
 * Calculates updated user statistics based on the full study history.
 */
export function calculateStats(
  sessions: StudySession[],
  currentStats: UserStats | null
): UserStats {
  const totalTopics = sessions.length;

  // Compile flashcard stats from sessions
  let flashcardsCompleted = 0;
  sessions.forEach((s) => {
    s.studyPlan.flashcards.forEach((f) => {
      if (f.completed) flashcardsCompleted++;
    });
  });

  // Calculate quiz averages
  let totalScore = 0;
  let quizCounts = 0;
  let totalQuestionsCount = 0;
  let totalCorrectAnswersCount = 0;

  sessions.forEach((s) => {
    let answeredInSession = 0;
    let correctInSession = 0;

    s.studyPlan.quiz.forEach((q) => {
      if (q.userAnswerIndex !== null && q.userAnswerIndex !== undefined) {
        answeredInSession++;
        totalQuestionsCount++;
        if (q.userAnswerIndex === q.answerIndex) {
          correctInSession++;
          totalCorrectAnswersCount++;
        }
      }
    });

    if (answeredInSession > 0) {
      quizCounts++;
      totalScore += (correctInSession / answeredInSession) * 100;
    }
  });

  const averageScore = quizCounts > 0 ? Math.round(totalScore / quizCounts) : 0;
  const quizAccuracy =
    totalQuestionsCount > 0 ? Math.round((totalCorrectAnswersCount / totalQuestionsCount) * 100) : 0;

  // Calculate roadmap completion percentage
  let totalTasks = 0;
  let completedTasks = 0;
  sessions.forEach((s) => {
    s.studyPlan.roadmap.forEach((phase) => {
      phase.tasks.forEach((t) => {
        totalTasks++;
        if (t.completed) completedTasks++;
      });
    });
  });
  const revisionProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Calculate study streak and active date
  let streak = currentStats?.streak || 0;
  const lastActiveDate = currentStats?.lastActiveDate || null;
  const todayStr = new Date().toISOString().split("T")[0];

  if (totalTopics > 0) {
    if (lastActiveDate === null) {
      streak = 1;
    } else if (lastActiveDate !== todayStr) {
      const lastActive = new Date(lastActiveDate);
      const today = new Date(todayStr);
      const diffTime = Math.abs(today.getTime() - lastActive.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        streak += 1;
      } else if (diffDays > 1) {
        streak = 1; // Streak broken, restart
      }
    }
  }

  // Set achievements
  const achievements = currentStats?.achievements
    ? [...currentStats.achievements]
    : DEFAULT_ACHIEVEMENTS.map((a) => ({ ...a }));

  // Check achievement triggers
  const unlock = (id: string) => {
    const ach = achievements.find((a) => a.id === id);
    if (ach && !ach.unlockedAt) {
      ach.unlockedAt = Date.now();
    }
  };

  if (totalTopics >= 1) unlock("first_session");
  if (quizCounts >= 1) unlock("quiz_taken");
  if (completedTasks >= 1) unlock("roadmap_complete");
  if (flashcardsCompleted >= 5) unlock("flashcard_master");
  if (streak >= 2) unlock("streak_2");

  // Check if there was any 100% quiz score
  sessions.forEach((s) => {
    const answered = s.studyPlan.quiz.filter((q) => q.userAnswerIndex !== null);
    if (answered.length > 0) {
      const correct = answered.filter((q) => q.userAnswerIndex === q.answerIndex);
      if (correct.length === answered.length) {
        unlock("perfect_quiz");
      }
    }
  });

  // Calculate daily goal progress (completed tasks + quiz ratio)
  // Let's say daily goal is to do 2 flashcards, 1 quiz, or 1 topic
  let dailyGoalVal = 0;
  if (sessions.some((s) => new Date(s.timestamp).toISOString().split("T")[0] === todayStr)) {
    dailyGoalVal += 40; // Created a session today
  }
  const quizzesToday = sessions.filter(
    (s) =>
      new Date(s.timestamp).toISOString().split("T")[0] === todayStr &&
      s.studyPlan.quiz.some((q) => q.userAnswerIndex !== null)
  ).length;
  if (quizzesToday > 0) {
    dailyGoalVal += 40; // Took a quiz today
  }
  if (flashcardsCompleted > (currentStats?.flashcardsCompleted || 0)) {
    dailyGoalVal += 20; // Completed some flashcards
  }
  const dailyGoalProgress = Math.min(dailyGoalVal, 100);

  return {
    topicsCount: totalTopics,
    flashcardsCompleted,
    quizAccuracy,
    quizzesTaken: quizCounts,
    revisionProgress,
    averageScore,
    streak,
    lastActiveDate: todayStr,
    dailyGoalProgress,
    achievements,
  };
}
