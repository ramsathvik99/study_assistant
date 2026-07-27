import React from "react";

interface AppLayoutProps {
  children: React.ReactNode;
}

/**
 * Global application layout wrapper
 * 
 * Provides:
 * - Proper spacing below fixed navbar
 *   - Desktop: pt-24 (96px) for h-18 nav (72px) + spacing
 *   - Mobile: pt-20 (80px) for h-16 nav (64px) + spacing
 * - Consistent bottom padding for mobile nav (pb-24 = 96px)
 * - Base background color
 * - Full viewport height
 */
export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 relative">
      {/* Main content area - properly spaced below fixed navbar */}
      <main className="relative z-10 pt-14 sm:pt-16 lg:pt-16 pb-20 lg:pb-0">
        {children}
      </main>
    </div>
  );
};
