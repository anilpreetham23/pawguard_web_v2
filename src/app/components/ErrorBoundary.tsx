"use client";

import { Component, type ReactNode } from "react";
import { ErrorPage } from "./pawguard/ErrorPage";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background">
          <ErrorPage variant="serverError" />
        </div>
      );
    }
    return this.props.children;
  }
}
