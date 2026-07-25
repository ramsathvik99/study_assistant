import React from "react";
import { useSettings } from "../../hooks/useSettings.js";
import { Moon, Sun, Zap, Code2, Accessibility } from "lucide-react";

// ─── Toggle switch ────────────────────────────────────────────────────────────

const Toggle: React.FC<{ on: boolean; onChange: () => void; id: string }> = ({ on, onChange, id }) => (
  <button
    id={id}
    role="switch"
    aria-checked={on}
    onClick={onChange}
    className={[
      "relative h-6 w-11 rounded-full transition-colors duration-200 focus-ring shrink-0",
      on ? "bg-amber-500" : "bg-void-700",
    ].join(" ")}
  >
    <span className={[
      "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all duration-200",
      on ? "left-5" : "left-0.5",
    ].join(" ")} />
  </button>
);

// ─── Setting row ──────────────────────────────────────────────────────────────

const SettingRow: React.FC<{
  id: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}> = ({ id, icon: Icon, iconColor, iconBg, title, description, enabled, onToggle }) => (
  <label
    htmlFor={id}
    className="flex items-center gap-5 px-5 py-5 rounded-xl border border-[rgba(255,255,255,0.07)] bg-void-900/60 hover:border-[rgba(255,255,255,0.13)] transition-all cursor-pointer group"
  >
    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${iconBg}`}>
      <Icon className={`w-5 h-5 ${iconColor}`} />
    </div>

    <div className="flex-1 min-w-0">
      <p className="font-semibold text-void-100 text-[14px]">{title}</p>
      <p className="text-[12px] text-void-500 mt-0.5 leading-relaxed">{description}</p>
    </div>

    <Toggle id={id} on={enabled} onChange={onToggle} />
  </label>
);

// ─── Component ────────────────────────────────────────────────────────────────

export const SettingsPanel: React.FC = () => {
  const { settings, toggleDarkMode, toggleAnimations, toggleDeveloperMode } = useSettings();

  const rows = [
    {
      id:          "toggle-dark",
      icon:        settings.darkMode ? Moon : Sun,
      iconColor:   settings.darkMode ? "text-violet-400" : "text-amber-400",
      iconBg:      settings.darkMode ? "bg-violet-500/10 border-violet-500/20" : "bg-amber-500/10 border-amber-500/20",
      title:       "Dark mode",
      description: "Use the dark interface. Easier on the eyes during long study sessions.",
      enabled:     settings.darkMode,
      onToggle:    toggleDarkMode,
    },
    {
      id:          "toggle-animations",
      icon:        Zap,
      iconColor:   "text-jade-400",
      iconBg:      "bg-jade-500/10 border-jade-500/20",
      title:       "Interface animations",
      description: "Enable transitions, micro-interactions, and motion feedback.",
      enabled:     settings.animationsEnabled,
      onToggle:    toggleAnimations,
    },
    {
      id:          "toggle-devmode",
      icon:        Code2,
      iconColor:   "text-rose-400",
      iconBg:      "bg-rose-500/10 border-rose-500/20",
      title:       "Developer mode",
      description: "Show raw AI response data, token usage, and validation diagnostics in study rooms.",
      enabled:     settings.developerMode,
      onToggle:    toggleDeveloperMode,
    },
  ];

  return (
    <div className="space-y-3">
      {rows.map((row) => (
        <SettingRow key={row.id} {...row} />
      ))}

      {/* Accessibility note */}
      <div className="flex items-start gap-4 px-5 py-5 rounded-xl border border-[rgba(255,255,255,0.07)] bg-void-950/60">
        <div className="w-10 h-10 rounded-xl border border-amber-500/20 bg-amber-500/8 flex items-center justify-center shrink-0">
          <Accessibility className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <p className="font-semibold text-void-200 text-[14px]">Accessibility</p>
          <p className="text-[12px] text-void-500 mt-0.5 leading-relaxed max-w-lg">
            All interactive elements have keyboard focus rings, ARIA labels, and respect the
            system's prefers-reduced-motion setting. Animations are automatically suppressed
            when reduced motion is preferred, regardless of the toggle above.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
