"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

export default class ErrorBoundary extends Component<Props, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("ErrorBoundary caught:", error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="min-h-[40vh] flex items-center justify-center text-center px-4">
          <div>
            <p className="text-stone-700 text-lg font-black">Something went wrong.</p>
            <p className="text-stone-400 text-sm mt-1">Please refresh the page or try again.</p>
            <a href="/" className="mt-4 inline-block text-amber-600 font-bold underline text-sm">
              Go Home
            </a>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
