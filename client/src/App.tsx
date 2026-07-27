import React, { lazy, Suspense, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { SettingsProvider, useSettings } from "./hooks/useSettings";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ToastProvider } from "./components/common/Toast";
import { Providers } from "./app/providers";
import { calculateStats } from "./utils/statsHelper";
import { StudySession, UserStats } from "./types/index";
import { Navigation } from "./components/common/Navigation";
import { ErrorBoundary } from "./components/common/ErrorBoundary";
import { PageLoader } from "./components/common/PageLoader";
import { PageContainer } from "./components/layout/PageContainer";
import { AnimatedBackground } from "./components/layout/AnimatedBackground";
import { PageTransition } from "./components/animations/PageTransition";
import { DeveloperPanel } from "./components/common/DeveloperPanel";

// Lazy-loaded routes
const Home = lazy(() => import("./pages/Home"));
const SessionPage = lazy(() => import("./pages/SessionPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const HistoryPage = lazy(() => import("./pages/HistoryPage"));

const DEFAULT_STATS: UserStats = {
  topicsCount: 0,
  flashcardsCompleted: 0,
  quizAccuracy: 0,
  quizzesTaken: 0,
  revisionProgress: 0,
  averageScore: 0,
  streak: 0,
  lastActiveDate: null,
  dailyGoalProgress: 0,
  achievements: [],
};

export const AppContent: React.FC = () => {
  const { settings } = useSettings();
  const location = useLocation();
  useKeyboardShortcuts();

  const [history, setHistory] = useLocalStorage<StudySession[]>("study-history", []);
  const [activeSession, setActiveSession] = useLocalStorage<StudySession | null>(
    "study-active-session",
    null
  );
  const [stats, setStats] = useLocalStorage<UserStats>("study-stats", DEFAULT_STATS);

  // Sync stats whenever session history changes
  useEffect(() => {
    const computed = calculateStats(history, stats);
    const changed =
      computed.topicsCount !== stats.topicsCount ||
      computed.flashcardsCompleted !== stats.flashcardsCompleted ||
      computed.quizAccuracy !== stats.quizAccuracy ||
      computed.streak !== stats.streak ||
      computed.achievements.filter((a) => a.unlockedAt).length !==
        stats.achievements.filter((a) => a.unlockedAt).length;
    if (changed) setStats(computed);
  }, [history]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleStartSession = (session: StudySession) => {
    console.log("[App] handleStartSession called with session:", session);
    console.log("[App] Session study plan keys:", Object.keys(session.studyPlan));
    setHistory((prev) => {
      const newHistory = [session, ...prev];
      console.log("[App] History updated, length:", newHistory.length);
      return newHistory;
    });
    setActiveSession(session);
    console.log("[App] Active session set");
  };

  const handleUpdateSession = (updated: StudySession) => {
    setActiveSession(updated);
    setHistory((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const handleDeleteSession = (id: string) => {
    if (!settings.saveStudyHistory) return; // Privacy setting
    setHistory((prev) => prev.filter((s) => s.id !== id));
    if (activeSession?.id === id) setActiveSession(null);
  };

  const handleToggleBookmark = (id: string) => {
    if (!settings.saveStudyHistory) return; // Privacy setting
    setHistory((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const updated = { ...s, isBookmarked: !s.isBookmarked };
        if (activeSession?.id === id) setActiveSession(updated);
        return updated;
      })
    );
  };

  const errorResetKey = location.pathname;

  return (
    <>
      {/* Global animated background - visible on all pages */}
      <AnimatedBackground />

      {/* Developer Panel */}
      <DeveloperPanel />

      {/* Fixed Navigation on top */}
      <Navigation hasActiveSession={!!activeSession} streak={stats.streak} displayName={settings.displayName} />

      {/* Routes */}
      <Suspense fallback={<PageLoader />}>
        <PageTransition>
          <Routes>
            <Route
              path="/"
              element={
                <ErrorBoundary resetKey={errorResetKey}>
                  <Home onStartSession={handleStartSession} activeSession={activeSession} />
                </ErrorBoundary>
              }
            />
            <Route
              path="/session"
              element={
                <PageContainer>
                  <ErrorBoundary resetKey={errorResetKey}>
                    <SessionPage
                      activeSession={activeSession}
                      onUpdateSession={handleUpdateSession}
                      onToggleBookmark={handleToggleBookmark}
                    />
                  </ErrorBoundary>
                </PageContainer>
              }
            />
            <Route
              path="/dashboard"
              element={
                <PageContainer>
                  <ErrorBoundary resetKey={errorResetKey}>
                    <DashboardPage stats={stats} />
                  </ErrorBoundary>
                </PageContainer>
              }
            />
            <Route
              path="/history"
              element={
                <PageContainer>
                  <ErrorBoundary resetKey={errorResetKey}>
                    <HistoryPage
                      sessions={history}
                      onSelectSession={setActiveSession}
                      onDeleteSession={handleDeleteSession}
                      onToggleBookmark={handleToggleBookmark}
                    />
                  </ErrorBoundary>
                </PageContainer>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </PageTransition>
      </Suspense>
    </>
  );
};

export const App: React.FC = () => (
  <Providers>
    <ToastProvider>
      <SettingsProvider>
        <ThemeProvider>
          <Router>
            <AppContent />
          </Router>
        </ThemeProvider>
      </SettingsProvider>
    </ToastProvider>
  </Providers>
);

export default App;
