import Link from 'next/link';
import Header from '@/components/Header';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white pt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary mb-6">
              <FileQuestion className="w-8 h-8 text-muted-foreground" />
            </div>

            <h1 className="text-4xl md:text-5xl font-medium text-foreground mb-4">
              Page Not Found
            </h1>

            <p className="text-lg text-muted-foreground mb-8 max-w-md">
              The page you are looking for does not exist or has been moved.
            </p>

            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 border border-foreground text-base font-medium text-foreground hover:bg-foreground hover:text-background transition-colors duration-200"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
