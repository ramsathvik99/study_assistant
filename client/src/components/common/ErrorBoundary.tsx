import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Card } from "./Card";
import { Button } from "./Button";

interface Props {
  children: ReactNode;
  resetKey?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false, error: null });
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-danger-50 dark:from-slate-900 via-white dark:via-slate-900 to-warning-50 dark:to-slate-900 flex items-center justify-center p-6">
          <Card variant="elevated" padding="xl" className="max-w-2xl w-full text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-danger-500 to-warning-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-white" />
            </div>

            <h1 className="text-3xl font-display font-bold text-neutral-900 dark:text-white mb-3">
              Oops! Something went wrong
            </h1>

            <p className="text-lg text-neutral-600 dark:text-slate-400 mb-6">
              We encountered an unexpected error. Don't worry, your data is safe.
            </p>

            {this.state.error && (
              <Card padding="md" variant="glass" className="bg-danger-50 dark:bg-danger-900/20 border-danger-200 dark:border-danger-800 mb-6 text-left">
                <p className="text-sm font-mono text-danger-900 dark:text-danger-300 break-words">
                  {this.state.error.message}
                </p>
              </Card>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="primary"
                size="lg"
                icon={<RefreshCw className="w-5 h-5" />}
                onClick={this.handleReset}
              >
                Try Again
              </Button>
              <Button
                variant="outline"
                size="lg"
                icon={<Home className="w-5 h-5" />}
                onClick={this.handleGoHome}
              >
                Go Home
              </Button>
            </div>

            <p className="text-sm text-neutral-500 dark:text-slate-500 mt-6">
              If this problem persists, please refresh the page or contact support.
            </p>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
