import React, { createContext, useContext, useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage.js";
import { AppSettings } from "../types/index.js";

interface SettingsContextProps {
  settings: AppSettings;
  toggleDarkMode: () => void;
  toggleAnimations: () => void;
  toggleDeveloperMode: () => void;
}

const SettingsContext = createContext<SettingsContextProps | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useLocalStorage<AppSettings>("study-settings", {
    darkMode: true, // Default to dark mode for modern aesthetics
    animationsEnabled: true,
    developerMode: false, // Developer mode disabled by default for normal users
  });

  // Effect to apply/remove "dark" class from <html> element
  useEffect(() => {
    const root = window.document.documentElement;
    if (settings.darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [settings.darkMode]);

  const toggleDarkMode = () => {
    setSettings((prev) => ({ ...prev, darkMode: !prev.darkMode }));
  };

  const toggleAnimations = () => {
    setSettings((prev) => ({ ...prev, animationsEnabled: !prev.animationsEnabled }));
  };

  const toggleDeveloperMode = () => {
    setSettings((prev) => ({ ...prev, developerMode: !prev.developerMode }));
  };

  return (
    <SettingsContext.Provider value={{ settings, toggleDarkMode, toggleAnimations, toggleDeveloperMode }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextProps => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
