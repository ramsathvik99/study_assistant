import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertOctagon, RotateCcw } from "lucide-react";
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
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false, error: null });
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-[60vh] flex items-center justify-center px-4">
          <div className="text-center space-y-6 max-w-md animate-scale-reveal">
            <div className="mx-auto inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-danger-50 dark:bg-danger-950/40 border border-danger-200 dark:border-danger-800">
              <AlertOctagon className="h-8 w-8 text-danger-500" />
            </div>
            <div className="space-y-2">
              <h2 className="font-display text-2xl text-surface-900 dark:text-surface-50">
                Something went wrong
              </h2>
              <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">
                {this.state.error?.message ?? "An unexpected error occurred in this section."}
              </p>
            </div>
            <Button variant="primary" onClick={this.handleReset} icon={<RotateCcw className="h-4 w-4" />}>
              Try again
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
