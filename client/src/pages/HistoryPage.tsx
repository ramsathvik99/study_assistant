import React from "react";
import { StudySession } from "../types/index.js";
import { HistoryList } from "../components/History/HistoryList.js";
import { useSettings } from "../hooks/useSettings.js";

interface HistoryPageProps {
  sessions: StudySession[];
  onSelectSession: (s: StudySession) => void;
  onDeleteSession: (id: string) => void;
  onToggleBookmark: (id: string) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  sessions,
  onSelectSession,
  onDeleteSession,
  onToggleBookmark,
}) => {
  const { settings } = useSettings();

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 py-10 space-y-8">
      {/* Page header */}
      <div className="space-y-2">
        <span className="label">Library</span>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-void-50">
          Study sessions
        </h1>
        <p className="text-void-500 text-sm max-w-md">
          Every generated study plan, organized as a reusable personal knowledge base.
        </p>
      </div>

      <HistoryList
        sessions={sessions}
        onSelectSession={onSelectSession}
        onDeleteSession={onDeleteSession}
        onToggleBookmark={onToggleBookmark}
        animationsEnabled={settings.animationsEnabled}
      />
    </div>
  );
};

export default HistoryPage;
