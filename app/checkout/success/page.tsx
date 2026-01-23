'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import { CheckCircle } from 'lucide-react';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order') || 'N/A';

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white pt-20">
        <div className="max-w-2xl mx-auto px-6 py-20">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-medium mb-4">Order Confirmed!</h1>
            <p className="text-gray-600 mb-2">
              Thank you for your purchase. Your order has been received.
            </p>
            <p className="text-sm text-gray-500 mb-8">
              Order ID: <span className="font-mono">{orderId}</span>
            </p>

            <div className="space-y-4">
              <Link
                href="/store"
                className="inline-block px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
              >
                Continue Shopping
              </Link>
              <div>
                <Link
                  href="/"
                  className="text-sm text-gray-600 hover:text-gray-900 underline"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
