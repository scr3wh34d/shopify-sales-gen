"use client"; // Error components must be Client Components

import React, { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    // TODO: Replace with actual error reporting service (e.g., Sentry, LogRocket)
    console.error("Global Error Boundary Caught:", error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="container mx-auto p-8 min-h-screen flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong!</h2>
          <p className="text-gray-700 mb-6">An unexpected error occurred. Please try again.</p>
          {/* Optionally display error details during development */} 
          {process.env.NODE_ENV === 'development' && (
              <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto mb-6 w-full max-w-2xl">{
                  `Error: ${error.message}\n${error.stack ? `Stack: ${error.stack}` : ''}${error.digest ? `\nDigest: ${error.digest}` : ''}`
              }</pre>
          )}
          <button
            onClick={reset} // Attempt to recover by re-rendering the segment
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
} 