import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { AppSettings } from "../types/index";

const DEFAULT_SETTINGS: AppSettings = {
  // Appearance
  darkMode: false,
  accentColor: "primary",
  animationsEnabled: true,
  reducedMotion: false,
  fontSize: "medium",
  highContrast: false,

  // AI Settings
  aiModel: "gemini-2.5-flash",
  responseLength: "medium",
  temperature: 0.3,
  streamingEnabled: false,
  defaultDifficulty: "Medium",
  autoGenerateQuiz: true,
  includeMnemonics: true,
  defaultOutputSections: {
    summary: true,
    keyConcepts: true,
    flashcards: true,
    quiz: true,
    checklist: false,
    roadmap: true,
    importantTerms: false,
    tips: true,
  },

  // Document Settings
  maxChunkSize: 5000,
  autoSummarization: true,
  ocrEnabled: false,
  rememberLastFolder: true,

  // Notifications
  notificationsEnabled: true,
  studyReminders: true,
  completionNotifications: true,
  achievementAlerts: true,

  // Privacy
  saveStudyHistory: true,
  analyticsEnabled: false,

  // Account
  displayName: "Student",

  // Keyboard
  keyboardShortcutsEnabled: true,

  // Language
  language: "en",

  // Accessibility
  largeText: false,
  keyboardNavigation: true,
  screenReaderEnhancements: false,

  // Developer
  developerMode: false,
};

const SETTINGS_STORAGE_KEY = "study-assistant-settings";

interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;
  resetSettings: () => void;
  resetCategory: (category: "appearance" | "ai" | "document" | "notifications" | "privacy" | "account" | "accessibility" | "keyboard" | "language" | "developer") => void;
  isLoading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

interface SettingsProviderProps {
  children: ReactNode;
}

/**
 * Load settings from localStorage or return defaults
 */
function loadSettings(): AppSettings {
  try {
    const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Merge with defaults to handle missing keys in older versions
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
  } catch (error) {
    console.warn("Failed to load settings from localStorage:", error);
  }
  return DEFAULT_SETTINGS;
}

/**
 * Save settings to localStorage
 */
function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.warn("Failed to save settings to localStorage:", error);
  }
}

/**
 * Get default settings for a specific category
 */
function getDefaultsForCategory(category: string): Partial<AppSettings> {
  const categoryDefaults: Record<string, Partial<AppSettings>> = {
    appearance: {
      darkMode: DEFAULT_SETTINGS.darkMode,
      accentColor: DEFAULT_SETTINGS.accentColor,
      animationsEnabled: DEFAULT_SETTINGS.animationsEnabled,
      reducedMotion: DEFAULT_SETTINGS.reducedMotion,
      fontSize: DEFAULT_SETTINGS.fontSize,
      highContrast: DEFAULT_SETTINGS.highContrast,
    },
    ai: {
      aiModel: DEFAULT_SETTINGS.aiModel,
      responseLength: DEFAULT_SETTINGS.responseLength,
      temperature: DEFAULT_SETTINGS.temperature,
      streamingEnabled: DEFAULT_SETTINGS.streamingEnabled,
      defaultDifficulty: DEFAULT_SETTINGS.defaultDifficulty,
      autoGenerateQuiz: DEFAULT_SETTINGS.autoGenerateQuiz,
      includeMnemonics: DEFAULT_SETTINGS.includeMnemonics,
      defaultOutputSections: DEFAULT_SETTINGS.defaultOutputSections,
    },
    document: {
      maxChunkSize: DEFAULT_SETTINGS.maxChunkSize,
      autoSummarization: DEFAULT_SETTINGS.autoSummarization,
      ocrEnabled: DEFAULT_SETTINGS.ocrEnabled,
      rememberLastFolder: DEFAULT_SETTINGS.rememberLastFolder,
    },
    notifications: {
      notificationsEnabled: DEFAULT_SETTINGS.notificationsEnabled,
      studyReminders: DEFAULT_SETTINGS.studyReminders,
      completionNotifications: DEFAULT_SETTINGS.completionNotifications,
      achievementAlerts: DEFAULT_SETTINGS.achievementAlerts,
    },
    privacy: {
      saveStudyHistory: DEFAULT_SETTINGS.saveStudyHistory,
      analyticsEnabled: DEFAULT_SETTINGS.analyticsEnabled,
    },
    account: {
      displayName: DEFAULT_SETTINGS.displayName,
    },
    accessibility: {
      largeText: DEFAULT_SETTINGS.largeText,
      keyboardNavigation: DEFAULT_SETTINGS.keyboardNavigation,
      screenReaderEnhancements: DEFAULT_SETTINGS.screenReaderEnhancements,
    },
    keyboard: {
      keyboardShortcutsEnabled: DEFAULT_SETTINGS.keyboardShortcutsEnabled,
    },
    language: {
      language: DEFAULT_SETTINGS.language,
    },
    developer: {
      developerMode: DEFAULT_SETTINGS.developerMode,
    },
  };
  return categoryDefaults[category] || {};
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings on mount
  useEffect(() => {
    const loaded = loadSettings();
    setSettings(loaded);
    setIsLoading(false);
  }, []);

  const updateSettings = useCallback((newSettings: Partial<AppSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      saveSettings(updated);
      // Dispatch custom event for external listeners
      window.dispatchEvent(
        new CustomEvent("settings-changed", { detail: updated })
      );
      return updated;
    });
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    saveSettings(DEFAULT_SETTINGS);
    window.dispatchEvent(
      new CustomEvent("settings-changed", { detail: DEFAULT_SETTINGS })
    );
  }, []);

  const resetCategory = useCallback(
    (
      category:
        | "appearance"
        | "ai"
        | "document"
        | "notifications"
        | "privacy"
        | "account"
        | "accessibility"
        | "keyboard"
        | "language"
        | "developer"
    ) => {
      const defaults = getDefaultsForCategory(category);
      updateSettings(defaults);
    },
    [updateSettings]
  );

  return React.createElement(
    SettingsContext.Provider,
    { value: { settings, updateSettings, resetSettings, resetCategory, isLoading } },
    children
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
