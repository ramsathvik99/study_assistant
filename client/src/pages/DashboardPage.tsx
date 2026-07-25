import React from "react";
import { UserStats } from "../types/index.js";
import { StatsDashboard } from "../components/Dashboard/StatsDashboard.js";
import { useSettings } from "../hooks/useSettings.js";
import { BarChart2 } from "lucide-react";

export const DashboardPage: React.FC<{ stats: UserStats }> = ({ stats }) => {
  const { settings } = useSettings();

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 py-10 space-y-8">
      {/* Page header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-void-800 border border-[rgba(255,255,255,0.08)] flex items-center justify-center">
            <BarChart2 className="w-4 h-4 text-void-400" />
          </div>
          <span className="label">Progress</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-void-50">
          Learning analytics
        </h1>
        <p className="text-void-500 text-sm max-w-md">
          A clear view of your effort, recall, and consistency over time.
        </p>
      </div>

      <StatsDashboard stats={stats} animationsEnabled={settings.animationsEnabled} />
    </div>
  );
};

export default DashboardPage;
