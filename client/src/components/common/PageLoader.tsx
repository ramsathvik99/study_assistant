import React from "react";
import { AIGenerationLoader } from "../animations/AIGenerationLoader";

export const PageLoader: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-primary-50/20 to-secondary-50/20 dark:from-slate-900 dark:via-slate-800/20 dark:to-slate-800/20 transition-colors">
      <AIGenerationLoader />
    </div>
  );
};
