import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import React from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
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
        position="top-center"
        toastOptions={{
          duration: 3800,
          style: {
            borderRadius: "16px",
            fontWeight: "500",
            fontSize: "13px",
            fontFamily: "Sora, system-ui, sans-serif",
            padding: "12px 20px",
            boxShadow: "0 12px 40px rgba(15, 14, 12, 0.18)",
            background: "#1A1814",
            color: "#FAF9F6",
            border: "1px solid #3D3935",
          },
          success: {
            iconTheme: { primary: "#10B981", secondary: "#1A1814" },
            style: {
              background: "#064E3B",
              color: "#D1FAF0",
              border: "1px solid #047857",
            },
          },
          error: {
            iconTheme: { primary: "#F87171", secondary: "#1A1814" },
            style: {
              background: "#450A0A",
              color: "#FEE2E2",
              border: "1px solid #991B1B",
            },
          },
        }}
      />
    </QueryClientProvider>
  );
};

export { queryClient };
