import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSettings } from "./useSettings";
import toast from "react-hot-toast";

/**
 * Global keyboard shortcuts management
 */
export const useKeyboardShortcuts = () => {
  const { settings } = useSettings();
  const navigate = useNavigate();

  useEffect(() => {
    if (!settings.keyboardShortcutsEnabled) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle shortcuts if not typing in an input
      const target = event.target as HTMLElement;
      const isInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.contentEditable === "true";

      if (isInput && event.key !== "Escape") {
        return;
      }

      // Ctrl/Cmd + K = Open quick search
      if ((event.ctrlKey || event.metaKey) && event.key === "k") {
        event.preventDefault();
        toast("Quick search (coming soon)", { duration: 2000 });
      }

      // G = Go to dashboard
      if (event.key === "g" && !isInput) {
        event.preventDefault();
        navigate("/dashboard");
        toast("Dashboard opened", { duration: 1500 });
      }

      // H = Go to home
      if (event.key === "h" && !isInput) {
        event.preventDefault();
        navigate("/");
        toast("Home opened", { duration: 1500 });
      }

      // ? = Show help
      if (event.shiftKey && event.key === "?") {
        event.preventDefault();
        toast("Shortcuts: Ctrl+K (search), G (dashboard), H (home)", {
          duration: 4000,
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [settings.keyboardShortcutsEnabled, navigate]);

  return { enabled: settings.keyboardShortcutsEnabled };
};
