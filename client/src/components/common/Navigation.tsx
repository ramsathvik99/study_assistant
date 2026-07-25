import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Zap, LayoutDashboard, BookOpen, History, Settings,
  X, Menu, Flame, ChevronRight, Sparkles
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface NavigationProps {
  hasActiveSession: boolean;
  streak: number;
}

const NAV_ITEMS = (hasActiveSession: boolean) => [
  { path: "/",         label: "Generate",  icon: Zap,            end: true },
  ...(hasActiveSession
    ? [{ path: "/session", label: "Study Room", icon: BookOpen, end: false }]
    : []
  ),
  { path: "/dashboard", label: "Progress",  icon: LayoutDashboard, end: false },
  { path: "/history",   label: "Library",   icon: History,         end: false },
  { path: "/settings",  label: "Settings",  icon: Settings,        end: false },
];

/* ── Sidebar link ─────────────────────────────────────────────────────────── */
const NavLink: React.FC<{
  path: string; label: string; icon: React.ElementType;
  active: boolean; onClick?: () => void;
}> = ({ path, label, icon: Icon, active, onClick }) => (
  <Link
    to={path}
    onClick={onClick}
    className={[
      "group flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium",
      "transition-all duration-150 focus-ring",
      active
        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
        : "text-void-400 hover:text-void-100 hover:bg-white/5 border border-transparent",
    ].join(" ")}
  >
    <Icon className={`w-4 h-4 shrink-0 ${active ? "text-amber-400" : "text-void-500 group-hover:text-void-300"}`} />
    <span className="flex-1">{label}</span>
    {active && <ChevronRight className="w-3 h-3 text-amber-500/60" />}
  </Link>
);

/* ── Sidebar inner content ───────────────────────────────────────────────── */
const SidebarContent: React.FC<{ hasActiveSession: boolean; streak: number; onNav?: () => void }> = ({
  hasActiveSession, streak, onNav
}) => {
  const location = useLocation();
  const items = NAV_ITEMS(hasActiveSession);

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-5 mb-2">
        <Link to="/" onClick={onNav} className="flex items-center gap-2.5 focus-ring rounded-lg">
          <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center shadow-glow-amber shrink-0">
            <Sparkles className="w-4 h-4 text-void-950" />
          </div>
          <div className="leading-none">
            <p className="font-display font-bold text-void-50 text-sm tracking-tight">Mosaic</p>
            <p className="label mt-0.5">Study OS</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5">
        <p className="label px-3 mb-2">Navigation</p>
        {items.map(({ path, label, icon }) => (
          <NavLink
            key={path}
            path={path}
            label={label}
            icon={icon}
            active={location.pathname === path}
            onClick={onNav}
          />
        ))}
      </nav>

      {/* Streak card */}
      <div className="mx-3 mb-4 mt-3 rounded-xl border border-[rgba(255,255,255,0.07)] bg-void-900/60 p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="label">Learning streak</p>
          <Flame className="w-3.5 h-3.5 text-fire-400" />
        </div>
        <div className="flex items-end gap-2">
          <span className="font-display text-3xl font-bold text-void-50 leading-none">{streak}</span>
          <span className="text-xs text-void-500 mb-0.5">days</span>
        </div>
        <div className="mt-2.5 flex gap-0.5">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-1 rounded-full ${i < Math.min(streak, 7) ? "bg-amber-500" : "bg-void-700"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

/* ── Main component ──────────────────────────────────────────────────────── */
export const Navigation: React.FC<NavigationProps> = ({ hasActiveSession, streak }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* ── Desktop sidebar ──────────────────────────────────────────────── */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden xl:flex xl:flex-col w-56 border-r border-[rgba(255,255,255,0.06)] bg-void-950/90 backdrop-blur-xl">
        <SidebarContent hasActiveSession={hasActiveSession} streak={streak} />
      </aside>

      {/* ── Top bar (shown on all sizes; right-side on desktop) ─────────── */}
      <header className="sticky top-0 z-30 xl:ml-56 glass border-b border-[rgba(255,255,255,0.06)]">
        <div className="flex items-center justify-between h-12 px-4 max-w-screen-2xl mx-auto">
          {/* Mobile hamburger + brand */}
          <div className="flex items-center gap-3 xl:hidden">
            <button
              onClick={() => setMobileOpen(true)}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-[rgba(255,255,255,0.08)] text-void-400 hover:text-void-100 hover:bg-white/5 transition focus-ring"
              aria-label="Open navigation"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-amber-500 flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-void-950" />
              </div>
              <span className="font-display font-bold text-void-100 text-sm">Mosaic</span>
            </div>
          </div>

          {/* Right side status pill */}
          <div className="ml-auto flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[rgba(255,255,255,0.07)] bg-void-900/60">
              <span className="status-dot" />
              <span className="text-[11px] font-medium text-void-400">AI ready</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile drawer ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-void-950/70 backdrop-blur-sm xl:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              key="drawer"
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ type: "spring", stiffness: 380, damping: 36 }}
              className="fixed inset-y-0 left-0 z-[60] w-60 bg-void-950 border-r border-[rgba(255,255,255,0.08)] xl:hidden"
            >
              {/* Close button */}
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-lg border border-[rgba(255,255,255,0.08)] text-void-400 hover:text-void-100 focus-ring"
                aria-label="Close navigation"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <SidebarContent
                hasActiveSession={hasActiveSession}
                streak={streak}
                onNav={() => setMobileOpen(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

/* ── Footer ─────────────────────────────────────────────────────────────── */
export const Footer: React.FC = () => (
  <footer className="xl:ml-56 border-t border-[rgba(255,255,255,0.06)] mt-auto">
    <div className="max-w-screen-2xl mx-auto px-6 py-4 flex items-center justify-between">
      <span className="text-[11px] text-void-600 font-mono">Mosaic · v2.0</span>
      <span className="text-[11px] text-void-600">Built for deliberate practice</span>
    </div>
  </footer>
);

export default Navigation;
