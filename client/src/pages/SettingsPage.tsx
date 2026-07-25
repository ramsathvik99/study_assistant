import React from "react";
import { SettingsPanel } from "../components/Settings/SettingsPanel.js";
import { Settings } from "lucide-react";

export const SettingsPage: React.FC = () => (
  <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 py-10 space-y-8">
    {/* Page header */}
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-void-800 border border-[rgba(255,255,255,0.08)] flex items-center justify-center">
          <Settings className="w-4 h-4 text-void-400" />
        </div>
        <span className="label">Preferences</span>
      </div>
      <h1 className="font-display text-3xl sm:text-4xl font-bold text-void-50">
        Settings
      </h1>
      <p className="text-void-500 text-sm max-w-md">
        Control presentation, motion, and diagnostic visibility.
      </p>
    </div>

    <div className="max-w-2xl">
      <SettingsPanel />
    </div>
  </div>
);

export default SettingsPage;
