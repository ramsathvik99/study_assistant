import React, { lazy, Suspense, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes, Route, Navigate, useLocation,
} from "react-router-dom";
import { useLocalStorage }     from "./hooks/useLocalStorage.js";
import { SettingsProvider, useSettings } from "./hooks/useSettings.js";
import { Providers }           from "./app/providers.js";
import { calculateStats }      from "./utils/statsHelper.js";
import { StudySession, UserStats } from "./types/index.js";
import { Navigation, Footer }  from "./components/common/Navigation.js";
import { ErrorBoundary }       from "./components/common/ErrorBoundary.js";
import { PageLoader }          from "./components/common/PageLoader.js";

// ─── Lazy pages ───────────────────────────────────────────────────────────────

const Home         = lazy(() => import("./pages/Home.js"));
const SessionPage  = lazy(() => import("./pages/SessionPage.js"));
const DashboardPage = lazy(() => import("./pages/DashboardPage.js"));
const HistoryPage  = lazy(() => import("./pages/HistoryPage.js"));
const SettingsPage = lazy(() => import("./pages/SettingsPage.js"));

// ─── Default stats ────────────────────────────────────────────────────────────

const DEFAULT_STATS: UserStats = {
  topicsCount:        0,
  flashcardsCompleted: 0,
  quizAccuracy:       0,
  quizzesTaken:       0,
  revisionProgress:   0,
  averageScore:       0,
  streak:             0,
  lastActiveDate:     null,
  dailyGoalProgress:  0,
  achievements:       [],
};

// ─── Inner app (needs Router context) ────────────────────────────────────────

export const AppContent: React.FC = () => {
  const { settings } = useSettings();
  const location = useLocation();

  const [history,       setHistory]       = useLocalStorage<StudySession[]>("study-history", []);
  const [activeSession, setActiveSession] = useLocalStorage<StudySession | null>("study-active-session", null);
  const [stats,         setStats]         = useLocalStorage<UserStats>("study-stats", DEFAULT_STATS);

  // Recompute stats whenever history changes
  useEffect(() => {
    const computed = calculateStats(history, stats);
    const changed =
      computed.topicsCount          !== stats.topicsCount          ||
      computed.flashcardsCompleted  !== stats.flashcardsCompleted  ||
      computed.quizAccuracy         !== stats.quizAccuracy         ||
      computed.streak               !== stats.streak               ||
      computed.achievements.filter((a) => a.unlockedAt).length !==
        stats.achievements.filter((a) => a.unlockedAt).length;
    if (changed) setStats(computed);
  }, [history]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Session handlers ──

  const handleStartSession = (session: StudySession) => {
    setHistory((prev) => [session, ...prev]);
    setActiveSession(session);
  };

  const handleUpdateSession = (updated: StudySession) => {
    setActiveSession(updated);
    setHistory((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const handleDeleteSession = (id: string) => {
    setHistory((prev) => prev.filter((s) => s.id !== id));
    if (activeSession?.id === id) setActiveSession(null);
  };

  const handleToggleBookmark = (id: string) => {
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
    <div className={[
      "app-shell min-h-dvh flex flex-col transition-colors duration-300",
      settings.darkMode ? "dark" : "",
    ].join(" ")}>

      <Navigation hasActiveSession={!!activeSession} streak={stats.streak} />

      {/* Main content — offset by the sidebar width on xl */}
      <main className="relative flex-1 xl:ml-56">
        <Suspense fallback={<PageLoader />}>
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
                <ErrorBoundary resetKey={errorResetKey}>
                  <SessionPage
                    activeSession={activeSession}
                    onUpdateSession={handleUpdateSession}
                    onToggleBookmark={handleToggleBookmark}
                  />
                </ErrorBoundary>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ErrorBoundary resetKey={errorResetKey}>
                  <DashboardPage stats={stats} />
                </ErrorBoundary>
              }
            />
            <Route
              path="/history"
              element={
                <ErrorBoundary resetKey={errorResetKey}>
                  <HistoryPage
                    sessions={history}
                    onSelectSession={setActiveSession}
                    onDeleteSession={handleDeleteSession}
                    onToggleBookmark={handleToggleBookmark}
                  />
                </ErrorBoundary>
              }
            />
            <Route
              path="/settings"
              element={
                <ErrorBoundary resetKey={errorResetKey}>
                  <SettingsPage />
                </ErrorBoundary>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
    </div>
  );
};

// ─── Root ─────────────────────────────────────────────────────────────────────

export const App: React.FC = () => (
  <Providers>
    <SettingsProvider>
      <Router>
        <AppContent />
      </Router>
    </SettingsProvider>
  </Providers>
);

export default App;
