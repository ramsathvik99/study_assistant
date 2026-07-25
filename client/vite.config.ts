import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // Ensure environment variables prefixed with VITE_ are exposed to the client.
  // (Vite does this by default, but being explicit documents the intent.)
  envPrefix: "VITE_",

  build: {
    // Emit to dist/ (Vercel's default output directory for Vite projects).
    outDir: "dist",

    // Produce a separate chunk for large dependencies so the initial bundle
    // stays small and Vercel's CDN can cache them independently.
    rollupOptions: {
      output: {
        manualChunks: {
          vendor:        ["react", "react-dom", "react-router-dom"],
          ui:            ["framer-motion", "lucide-react"],
          query:         ["@tanstack/react-query"],
          http:          ["axios"],
        },
      },
    },
  },

  server: {
    port: 5173,
  },
});
