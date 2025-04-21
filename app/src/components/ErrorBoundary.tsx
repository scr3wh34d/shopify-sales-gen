"use client";

import React from 'react';

interface ErrorBoundaryProps {
  fallback?: React.ReactNode; // Optional custom fallback UI
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

// Basic Error Fallback Component
function DefaultFallbackUI({ error, resetErrorBoundary }: { error?: Error, resetErrorBoundary?: () => void }) {
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative text-sm" role="alert">
      <strong className="font-bold">Component Error!</strong>
      <p className="block sm:inline">Something went wrong rendering this section.</p>
      {process.env.NODE_ENV === 'development' && error && (
         <pre className="mt-2 text-xs bg-red-100 p-2 rounded overflow-auto">
           {error.message}
         </pre>
      )}
      {/* Reset button might not always be applicable or possible depending on the error */}
      {/* {resetErrorBoundary && (
        <button onClick={resetErrorBoundary} className="mt-2 text-xs font-semibold text-red-800 hover:underline">Try again</button>
      )} */}
    </div>
  );
}


class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error: error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can also log the error to an error reporting service
    // TODO: Replace with actual error reporting service (e.g., Sentry, LogRocket)
    console.error("Component Error Boundary Caught:", error, errorInfo);
  }

  // Example reset function if needed (might need more complex state logic)
  // resetErrorBoundary = () => {
  //   this.setState({ hasError: false, error: undefined });
  // };

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return <DefaultFallbackUI error={this.state.error} /* resetErrorBoundary={this.resetErrorBoundary} */ />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 