import { useSettings } from "./useSettings";
import toast from "react-hot-toast";

/**
 * Hook for managing notifications based on settings
 */
export const useNotifications = () => {
  const { settings } = useSettings();

  const notify = (type: "success" | "error" | "info" | "warning", message: string, duration = 3000) => {
    // Check if notifications are globally enabled
    if (!settings.notificationsEnabled) {
      return;
    }

    // Check specific notification type
    switch (type) {
      case "success":
        if (settings.completionNotifications) {
          toast.success(message, { duration });
        }
        break;
      case "error":
        toast.error(message, { duration });
        break;
      case "info":
        toast(message, { duration });
        break;
      case "warning":
        toast(message, { duration });
        break;
    }
  };

  const notifyStudyReminder = () => {
    if (settings.notificationsEnabled && settings.studyReminders) {
      toast("Time to study! 📚", { duration: 5000 });
    }
  };

  const notifyCompletion = (topic: string) => {
    if (settings.notificationsEnabled && settings.completionNotifications) {
      toast.success(`Great job completing ${topic}! 🎉`, { duration: 5000 });
    }
  };

  const notifyAchievement = (achievement: string) => {
    if (settings.notificationsEnabled && settings.achievementAlerts) {
      toast.success(`Achievement Unlocked: ${achievement} 🏆`, { duration: 6000 });
    }
  };

  return {
    notify,
    notifyStudyReminder,
    notifyCompletion,
    notifyAchievement,
  };
};
