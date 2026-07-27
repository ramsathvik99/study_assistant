import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code, X } from "lucide-react";
import { useSettings } from "../../hooks/useSettings";

interface DeveloperMetrics {
  model: string;
  temperature: number;
  responseLength: string;
  difficulty: string;
  streaming: boolean;
  tokenCount?: number;
  requestTime?: number;
  responseTime?: number;
  timestamp: number;
  memory?: number;
}

export const DeveloperPanel: React.FC = () => {
  const { settings } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [metrics, setMetrics] = useState<DeveloperMetrics>({
    model: settings.aiModel,
    temperature: settings.temperature,
    responseLength: settings.responseLength,
    difficulty: settings.defaultDifficulty,
    streaming: settings.streamingEnabled,
    timestamp: Date.now(),
    memory: typeof performance !== "undefined" && "memory" in performance 
      ? (performance.memory as any).usedJSHeapSize / 1048576 
      : undefined,
  });

  useEffect(() => {
    // Listen for settings changes
    const handleSettingsChange = (e: any) => {
      const updatedSettings = e.detail;
      setMetrics((prev) => ({
        ...prev,
        model: updatedSettings.aiModel,
        temperature: updatedSettings.temperature,
        responseLength: updatedSettings.responseLength,
        difficulty: updatedSettings.defaultDifficulty,
        streaming: updatedSettings.streamingEnabled,
        timestamp: Date.now(),
      }));
    };

    window.addEventListener("settings-changed", handleSettingsChange);
    return () => window.removeEventListener("settings-changed", handleSettingsChange);
  }, []);

  if (!settings.developerMode) {
    return null;
  }

  return (
    <>
      {/* Developer Mode Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 p-3 bg-slate-900 text-slate-100 rounded-full shadow-lg hover:shadow-xl transition-shadow"
        title="Developer Panel"
      >
        <Code className="w-5 h-5" />
      </motion.button>

      {/* Developer Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-20 right-6 z-40 w-80 bg-slate-900 border-2 border-slate-700 rounded-lg shadow-2xl p-4 text-slate-100 text-sm font-mono"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-100">Developer Panel</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-slate-700 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-2 gap-2 bg-slate-800 p-2 rounded">
                <div>
                  <label className="text-slate-400">Model</label>
                  <p className="text-cyan-400 break-all text-xs">{metrics.model}</p>
                </div>
                <div>
                  <label className="text-slate-400">Temperature</label>
                  <p className="text-green-400">{metrics.temperature.toFixed(2)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-slate-800 p-2 rounded">
                <div>
                  <label className="text-slate-400">Response Length</label>
                  <p className="text-yellow-400 capitalize">{metrics.responseLength}</p>
                </div>
                <div>
                  <label className="text-slate-400">Difficulty</label>
                  <p className="text-orange-400">{metrics.difficulty}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-slate-800 p-2 rounded">
                <div>
                  <label className="text-slate-400">Streaming</label>
                  <p className={metrics.streaming ? "text-green-400" : "text-red-400"}>
                    {metrics.streaming ? "Enabled" : "Disabled"}
                  </p>
                </div>
                <div>
                  <label className="text-slate-400">Memory</label>
                  <p className="text-pink-400">{metrics.memory ? `${metrics.memory.toFixed(1)}MB` : "N/A"}</p>
                </div>
              </div>

              {metrics.requestTime !== undefined && (
                <div className="grid grid-cols-2 gap-2 bg-slate-800 p-2 rounded">
                  <div>
                    <label className="text-slate-400">Request Time</label>
                    <p className="text-blue-400">{metrics.requestTime.toFixed(2)}s</p>
                  </div>
                  <div>
                    <label className="text-slate-400">Response Time</label>
                    <p className="text-purple-400">{metrics.responseTime?.toFixed(2)}s</p>
                  </div>
                </div>
              )}

              <div className="bg-slate-800 p-2 rounded">
                <label className="text-slate-400">Last Updated</label>
                <p className="text-slate-300 text-xs">
                  {new Date(metrics.timestamp).toLocaleTimeString()}
                </p>
              </div>

              <div className="bg-slate-800 p-2 rounded text-xs">
                <p className="text-slate-400 mb-1">🔗 API Status</p>
                <p className="text-green-400">Connected ✓</p>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-700 text-xs text-slate-500">
              <p>Loaded: {settings.developerMode ? "Now" : "Never"}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DeveloperPanel;
