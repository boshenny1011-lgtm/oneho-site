'use client';

import { useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error caught by global-error.tsx:', error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <main className="min-h-screen bg-white flex items-center justify-center px-6">
          <div className="flex flex-col items-center justify-center text-center max-w-2xl">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-6">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>

            <h1 className="text-4xl md:text-5xl font-medium text-gray-900 mb-4">
              Application Error
            </h1>

            <p className="text-lg text-gray-600 mb-8">
              A critical error occurred. Please try refreshing the page.
            </p>

            {process.env.NODE_ENV === 'development' && error.message && (
              <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded text-left w-full">
                <p className="text-sm text-red-800 font-mono break-all">
                  {error.message}
                </p>
              </div>
            )}

            <button
              onClick={reset}
              className="inline-flex items-center px-6 py-3 border-2 border-gray-900 text-base font-medium text-gray-900 hover:bg-gray-900 hover:text-white transition-colors duration-200"
            >
              Try again
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
