import React, { createContext, useContext, useEffect, ReactNode } from "react";
import { useSettings } from "../hooks/useSettings";

interface ThemeContextType {
  isDarkMode: boolean;
  accentColor: string;
  fontSize: string;
  highContrast: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * Theme Provider: Applies appearance settings globally to the DOM
 * 
 * Handles:
 * - Dark mode (class toggling on html element)
 * - Accent colors (CSS custom properties)
 * - Font sizes (data attribute for CSS scaling)
 * - High contrast mode (special contrast class)
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { settings } = useSettings();

  // Apply dark mode
  useEffect(() => {
    const html = document.documentElement;
    if (settings.darkMode) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, [settings.darkMode]);

  // Apply accent color via CSS custom properties
  useEffect(() => {
    const root = document.documentElement;
    const accentColorMap: Record<string, { primary: string; secondary: string; light: string; lighter: string }> = {
      primary: {
        primary: "#2563EB",
        secondary: "#1D4ED8",
        light: "#BFDBFE",
        lighter: "#EFF6FF",
      },
      emerald: {
        primary: "#059669",
        secondary: "#047857",
        light: "#A7F3D0",
        lighter: "#D1FAE5",
      },
      purple: {
        primary: "#9333EA",
        secondary: "#7E22CE",
        light: "#D8B4FE",
        lighter: "#F3E8FF",
      },
      blue: {
        primary: "#0284C7",
        secondary: "#0369A1",
        light: "#7DD3FC",
        lighter: "#E0F2FE",
      },
      pink: {
        primary: "#DB2777",
        secondary: "#BE185D",
        light: "#F472B6",
        lighter: "#FCE7F3",
      },
      orange: {
        primary: "#EA580C",
        secondary: "#C2410C",
        light: "#FDBA74",
        lighter: "#FFEDD5",
      },
    };

    const colors = accentColorMap[settings.accentColor] || accentColorMap.primary;
    root.style.setProperty("--accent-primary", colors.primary);
    root.style.setProperty("--accent-secondary", colors.secondary);
    root.style.setProperty("--accent-light", colors.light);
    root.style.setProperty("--accent-lighter", colors.lighter);
  }, [settings.accentColor]);

  // Apply font size scaling
  useEffect(() => {
    const html = document.documentElement;
    const fontSizeScaleMap: Record<string, string> = {
      small: "0.875",
      medium: "1",
      large: "1.125",
    };
    const scale = fontSizeScaleMap[settings.fontSize] || "1";
    html.style.fontSize = `${scale}em`;
    html.setAttribute("data-font-size", settings.fontSize);
  }, [settings.fontSize]);

  // Apply high contrast mode
  useEffect(() => {
    const html = document.documentElement;
    if (settings.highContrast) {
      html.classList.add("high-contrast");
    } else {
      html.classList.remove("high-contrast");
    }
  }, [settings.highContrast]);

  // Apply reduced motion
  useEffect(() => {
    const html = document.documentElement;
    if (settings.reducedMotion) {
      html.classList.add("reduce-motion");
    } else {
      html.classList.remove("reduce-motion");
    }
  }, [settings.reducedMotion]);

  // Apply large text (accessibility)
  useEffect(() => {
    const html = document.documentElement;
    if (settings.largeText) {
      html.classList.add("large-text");
    } else {
      html.classList.remove("large-text");
    }
  }, [settings.largeText]);

  // Apply keyboard navigation enhancements
  useEffect(() => {
    const html = document.documentElement;
    if (settings.keyboardNavigation) {
      html.classList.add("keyboard-nav");
    } else {
      html.classList.remove("keyboard-nav");
    }
  }, [settings.keyboardNavigation]);

  const value: ThemeContextType = {
    isDarkMode: settings.darkMode,
    accentColor: settings.accentColor,
    fontSize: settings.fontSize,
    highContrast: settings.highContrast,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
