import React from "react";
import { useLocation } from "react-router-dom";
import { FloatingIllustrations } from "../animations/FloatingIllustrations";
import { FloatingParticles } from "../animations/FloatingParticles";
import { DashboardBackground } from "../animations/DashboardBackground";
import { SessionBackground } from "../animations/SessionBackground";
import { HistoryBackground } from "../animations/HistoryBackground";
import { SettingsBackground } from "../animations/SettingsBackground";

/**
 * Global animated background component
 * Provides consistent base gradient with page-specific personality overlays
 * 
 * Base Layers (all pages):
 * 1. Mesh gradient background
 * 2. Animated gradient blobs
 * 
 * Page-Specific Layers:
 * - Home: Study illustrations + particles
 * - Dashboard: Progress elements + stats
 * - Session: Timeline + bookmarks
 * - History: Archive + timeline
 * - Settings: Gears + configuration
 */
export const AnimatedBackground: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Determine which page-specific background to show
  const getPageBackground = () => {
    if (currentPath === "/dashboard") return <DashboardBackground />;
    if (currentPath === "/session") return <SessionBackground />;
    if (currentPath === "/history") return <HistoryBackground />;
    if (currentPath === "/settings") return <SettingsBackground />;
    
    // Home page gets the original study-themed background
    return (
      <>
        {/* Home: Blue + Cyan theme / Dark theme */}
        <div className="fixed inset-0 bg-gradient-to-br from-blue-50/20 via-cyan-50/15 to-transparent dark:from-blue-950/10 dark:via-cyan-950/5 dark:to-transparent pointer-events-none z-0" />
        <FloatingIllustrations />
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <FloatingParticles />
        </div>
      </>
    );
  };

  return (
    <>
      {/* Base Layer 1: Mesh gradient background (all pages) */}
      <div className="fixed inset-0 bg-mesh-gradient pointer-events-none z-0" />
      
      {/* Base Layer 2: Animated gradient blobs (all pages) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-48 h-48 bg-primary-200 dark:bg-primary-900/40 rounded-full mix-blend-multiply filter blur-xl opacity-70 dark:opacity-50 animate-blob" />
        <div className="absolute top-0 right-0 w-48 h-48 bg-secondary-200 dark:bg-secondary-900/40 rounded-full mix-blend-multiply filter blur-xl opacity-70 dark:opacity-50 animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-accent-200 dark:bg-accent-900/40 rounded-full mix-blend-multiply filter blur-xl opacity-70 dark:opacity-50 animate-blob animation-delay-4000" />
      </div>

      {/* Page-Specific Layers */}
      {getPageBackground()}
    </>
  );
};
