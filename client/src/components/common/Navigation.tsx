import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  BookOpen,
  BarChart3,
  Clock,
  Menu,
  X,
  Flame,
  Sparkles,
  Moon,
  Sun,
} from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";
import { useSettings } from "../../hooks/useSettings";

interface NavigationProps {
  hasActiveSession: boolean;
  streak: number;
  displayName?: string;
}

export const Navigation: React.FC<NavigationProps> = ({ hasActiveSession, streak, displayName = "Student" }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const t = useTranslation();
  const { settings, updateSettings } = useSettings();

  const handleThemeToggle = () => {
    const newMode = settings.darkMode ? false : true;
    updateSettings({ darkMode: newMode });
  };

  const navItems = [
    { path: "/", label: t.nav.home, icon: Home },
    ...(hasActiveSession ? [{ path: "/session", label: t.nav.session, icon: BookOpen }] : []),
    { path: "/dashboard", label: t.nav.dashboard, icon: BarChart3 },
    { path: "/history", label: t.nav.history, icon: Clock },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Desktop Navigation - Premium Design */}
      <nav className="hidden lg:block fixed top-0 left-0 right-0 z-50">
        {/* Subtle background with glassmorphism */}
        <div className="absolute inset-0 backdrop-blur-md bg-white/40 dark:bg-slate-900/30 border-b border-white/30 dark:border-slate-700/20 shadow-sm" />
        
        <div className="relative max-w-7xl mx-auto px-8">
          <div className="flex items-center justify-between h-16 gap-8">
            {/* LEFT: Logo Section */}
            <NavLink to="/" className="flex items-center gap-2.5 group shrink-0">
              <motion.div
                whileHover={{ y: -2 }}
                className="w-9 h-9 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow"
              >
                <Sparkles className="w-5 h-5 text-white" />
              </motion.div>
              <div className="flex flex-col gap-0.5">
                <span className="text-base font-display font-black text-slate-900 dark:text-white">
                  StudyFlow
                </span>
                <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-tight">AI</span>
              </div>
            </NavLink>

            {/* CENTER: Navigation Links */}
            <div className="flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <NavLink key={item.path} to={item.path} className="relative">
                    <motion.div
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      className="relative px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
                    >
                      {/* Active indicator - sliding background */}
                      {active && (
                        <motion.div
                          layoutId="navIndicator"
                          className="absolute inset-0 bg-white/50 dark:bg-white/10 rounded-lg -z-10 backdrop-blur-sm"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                        />
                      )}
                      
                      <div className={`w-4 h-4 flex items-center justify-center transition-colors ${
                        active ? "text-primary-600 dark:text-primary-400" : "text-slate-500 dark:text-slate-400"
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      
                      <span className={`text-xs font-semibold transition-colors ${
                        active 
                          ? "text-slate-900 dark:text-white" 
                          : "text-slate-600 dark:text-slate-400"
                      }`}>
                        {item.label}
                      </span>

                      {/* Glow effect on active */}
                      {active && (
                        <motion.div
                          className="absolute -inset-2 bg-primary-500/5 rounded-lg -z-20 blur-md"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </motion.div>
                  </NavLink>
                );
              })}
            </div>

            {/* RIGHT: Streak & Theme */}
            <div className="flex items-center gap-2 shrink-0 ml-auto">
              {/* Streak Widget */}
              {streak > 0 && (
                <motion.div
                  whileHover={{ y: -2, scale: 1.02 }}
                  className="px-3 py-2 rounded-lg flex items-center gap-2 bg-gradient-to-r from-amber-500/10 to-orange-500/10 dark:from-amber-500/5 dark:to-orange-500/5 border border-amber-300/30 dark:border-orange-700/20 backdrop-blur-sm"
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-4 h-4 flex items-center justify-center"
                  >
                    <Flame className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  </motion.div>
                  <div className="flex flex-col gap-0">
                    <span className="text-[9px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-tight leading-tight">Streak</span>
                    <span className="text-xs font-bold text-amber-900 dark:text-amber-200">{streak}d</span>
                  </div>
                </motion.div>
              )}

              {/* Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.05, rotate: 10 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleThemeToggle}
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/40 dark:bg-white/5 border border-white/50 dark:border-white/10 backdrop-blur-sm hover:bg-white/60 dark:hover:bg-white/10 transition-colors shadow-sm"
                aria-label="Toggle theme"
                title={settings.darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {settings.darkMode ? (
                  <motion.div
                    key="sun"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Sun className="w-4 h-4 text-amber-500" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ opacity: 0, rotate: 90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: -90 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Moon className="w-4 h-4 text-slate-600" />
                  </motion.div>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation - Premium Compact */}
      <nav className="lg:hidden fixed top-0 left-0 right-0 z-50">
        <div className="absolute inset-0 backdrop-blur-md bg-white/40 dark:bg-slate-900/30 border-b border-white/30 dark:border-slate-700/20 shadow-sm" />
        
        <div className="relative flex items-center justify-between h-14 px-4">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ y: -1 }}
              className="w-8 h-8 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow"
            >
              <Sparkles className="w-4 h-4 text-white" />
            </motion.div>
            <span className="text-sm font-display font-black text-slate-900 dark:text-white">
              StudyFlow
            </span>
          </NavLink>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {streak > 0 && (
              <motion.div
                whileHover={{ y: -1 }}
                className="px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 bg-gradient-to-r from-amber-500/10 to-orange-500/10 dark:from-amber-500/5 dark:to-orange-500/5 border border-amber-300/30 dark:border-orange-700/20 backdrop-blur-sm"
              >
                <Flame className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                <span className="text-xs font-bold text-amber-900 dark:text-amber-200">{streak}d</span>
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.05, rotate: 10 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleThemeToggle}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/40 dark:bg-white/5 border border-white/50 dark:border-white/10 backdrop-blur-sm hover:bg-white/60 dark:hover:bg-white/10 transition-colors"
              aria-label="Toggle theme"
            >
              {settings.darkMode ? (
                <Sun className="w-4 h-4 text-amber-500" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/40 dark:hover:bg-white/5 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              ) : (
                <Menu className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-white/30 dark:border-slate-700/20 backdrop-blur-md bg-white/40 dark:bg-slate-900/30"
            >
              <div className="px-4 py-3 space-y-1.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <motion.div
                        whileTap={{ scale: 0.98 }}
                        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                          active
                            ? "bg-white/50 dark:bg-white/10 text-slate-900 dark:text-white"
                            : "text-slate-600 dark:text-slate-400 hover:bg-white/30 dark:hover:bg-white/5"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </motion.div>
                    </NavLink>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Spacer */}
      <div className="h-14 lg:h-16" />
    </>
  );
};
