import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

interface ErrorToastProps {
  isVisible: boolean;
  title: string;
  message: string;
  icon: 'error' | 'warning' | 'info';
  onClose: () => void;
  onRetry?: () => void;
  showRetry?: boolean;
}

export const ErrorToast: React.FC<ErrorToastProps> = ({
  isVisible,
  title,
  message,
  icon,
  onClose,
  onRetry,
  showRetry = true,
}) => {
  const getIcon = () => {
    switch (icon) {
      case 'error':
        return <AlertCircle className="w-6 h-6 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-amber-500" />;
      case 'info':
        return <Info className="w-6 h-6 text-blue-500" />;
    }
  };

  const getBgColor = () => {
    switch (icon) {
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/30';
      case 'warning':
        return 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/30';
      case 'info':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/30';
    }
  };

  const getTextColor = () => {
    switch (icon) {
      case 'error':
        return 'text-red-900 dark:text-red-100';
      case 'warning':
        return 'text-amber-900 dark:text-amber-100';
      case 'info':
        return 'text-blue-900 dark:text-blue-100';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={`fixed top-20 right-4 max-w-md rounded-2xl border backdrop-blur-md ${getBgColor()} shadow-lg z-50`}
        >
          <div className="p-4">
            <div className="flex items-start gap-3">
              <div className="shrink-0 mt-0.5">{getIcon()}</div>

              <div className="flex-1">
                <h3 className={`font-bold text-sm mb-1 ${getTextColor()}`}>
                  {title}
                </h3>
                <p className={`text-xs leading-relaxed ${getTextColor()} opacity-90`}>
                  {message}
                </p>

                {(showRetry && onRetry) || true ? (
                  <div className="flex gap-2 mt-3">
                    {showRetry && onRetry && (
                      <button
                        onClick={onRetry}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          icon === 'error'
                            ? 'bg-red-200 dark:bg-red-800 text-red-900 dark:text-red-100 hover:bg-red-300 dark:hover:bg-red-700'
                            : icon === 'warning'
                              ? 'bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100 hover:bg-amber-300 dark:hover:bg-amber-700'
                              : 'bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-100 hover:bg-blue-300 dark:hover:bg-blue-700'
                        }`}
                      >
                        Retry
                      </button>
                    )}
                    <button
                      onClick={onClose}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        icon === 'error'
                          ? 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-800'
                          : icon === 'warning'
                            ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 hover:bg-amber-200 dark:hover:bg-amber-800'
                            : 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800'
                      }`}
                    >
                      Close
                    </button>
                  </div>
                ) : null}
              </div>

              <button
                onClick={onClose}
                className="shrink-0 p-1 hover:bg-white/30 dark:hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 opacity-60" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
