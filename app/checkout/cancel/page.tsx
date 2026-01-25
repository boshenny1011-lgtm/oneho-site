'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import { XCircle, ArrowLeft, ShoppingCart } from 'lucide-react';

export default function CheckoutCancelPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white pt-20">
        <div className="max-w-2xl mx-auto px-6 py-20">
          <div className="text-center">
            <XCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Payment Cancelled</h1>
            <p className="text-lg text-gray-600 mb-8">
              Your payment was not completed. Don't worry, no charges were made to your account.
            </p>

            {/* Info Box */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-bold text-gray-900 mb-3">What happened?</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5">•</span>
                  <span>Your payment session was cancelled or expired</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5">•</span>
                  <span>Your cart items have been saved and are waiting for you</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5">•</span>
                  <span>No payment was processed</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/checkout"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-black text-white font-bold rounded-full hover:bg-gray-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Return to Checkout
              </Link>
              <Link
                href="/cart"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-full hover:border-gray-400 transition-colors"
              >
                <ShoppingCart className="w-4 h-4" />
                View Cart
              </Link>
            </div>

            <div className="mt-8">
              <Link
                href="/store"
                className="text-sm text-gray-600 hover:text-gray-900 underline"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
