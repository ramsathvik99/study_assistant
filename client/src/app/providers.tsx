import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import React from "react";

// Create QueryClient with sensible defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: "12px",
            fontWeight: "600",
            fontSize: "13px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          },
          success: {
            iconTheme: { primary: "#6366f1", secondary: "#fff" },
            style: {
              background: "#f0f9ff",
              color: "#1e1b4b",
              border: "1px solid #c7d2fe",
            },
          },
          error: {
            iconTheme: { primary: "#ef4444", secondary: "#fff" },
            style: {
              background: "#fef2f2",
              color: "#7f1d1d",
              border: "1px solid #fecaca",
            },
          },
        }}
      />
    </QueryClientProvider>
  );
};

export { queryClient };
