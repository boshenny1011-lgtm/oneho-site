'use client';

import { useEffect } from 'react';
import Header from '@/components/Header';
import { AlertCircle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Error caught by error.tsx:', error);
  }, [error]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white pt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-6">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>

            <h1 className="text-4xl md:text-5xl font-medium text-foreground mb-4">
              Something went wrong
            </h1>

            <p className="text-lg text-muted-foreground mb-8 max-w-md">
              An error occurred while loading this page. Please try again.
            </p>

            {process.env.NODE_ENV === 'development' && error.message && (
              <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-sm max-w-2xl">
                <p className="text-sm text-red-800 font-mono text-left break-all">
                  {error.message}
                </p>
              </div>
            )}

            <button
              onClick={reset}
              className="inline-flex items-center px-6 py-3 border border-foreground text-base font-medium text-foreground hover:bg-foreground hover:text-background transition-colors duration-200"
            >
              Try again
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
