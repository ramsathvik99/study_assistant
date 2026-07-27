import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { cancelActiveRequest } from "../services/api";

/**
 * Hook to cancel active AI requests when navigation changes.
 * Prevents stale requests from completing after user navigates away.
 */
export const useCancelOnNavigate = (): void => {
  const location = useLocation();

  useEffect(() => {
    // Cancel any in-flight requests when route changes
    return () => {
      cancelActiveRequest();
    };
  }, [location.pathname]);
};
