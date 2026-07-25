import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "./Button.js";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  resetKey?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary] Uncaught error:", error, info.componentStack);
  }

  componentDidUpdate(prevProps: Props) {
    // Auto-reset when the route changes (resetKey = location.pathname)
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false, error: null });
    }
  }

  handleReset = () => this.setState({ hasError: false, error: null });

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-[60dvh] flex items-center justify-center px-4">
          <div className="flex flex-col items-center gap-5 text-center max-w-sm">
            {/* Icon */}
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/25 flex items-center justify-center">
              <AlertTriangle className="w-7 h-7 text-rose-400" />
            </div>

            {/* Message */}
            <div className="space-y-1.5">
              <h2 className="font-display text-xl font-bold text-void-100">
                Something went wrong
              </h2>
              <p className="text-sm text-void-400 leading-relaxed">
                {this.state.error?.message ?? "An unexpected error occurred in this section."}
              </p>
            </div>

            {/* Retry */}
            <Button
              variant="amber"
              size="md"
              icon={<RotateCcw className="w-4 h-4" />}
              onClick={this.handleReset}
            >
              Try again
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
