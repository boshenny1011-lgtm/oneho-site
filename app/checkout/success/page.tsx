'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import { CheckCircle, Package, MapPin, Mail, Phone } from 'lucide-react';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order') || `EQ-${Date.now().toString().slice(-8)}`;

  // Mock order data - in real app, fetch from API/database
  const orderData = {
    email: searchParams.get('email') || 'customer@example.com',
    firstName: searchParams.get('firstName') || 'John',
    lastName: searchParams.get('lastName') || 'Doe',
    phone: searchParams.get('phone') || '+31 20 123 4567',
    shippingAddress: searchParams.get('address') || '123 Main Street',
    city: searchParams.get('city') || 'Amsterdam',
    postcode: searchParams.get('postcode') || '1012 AB',
    country: searchParams.get('country') || 'Netherlands',
    items: searchParams.get('items') || '2',
    total: searchParams.get('total') || '299.00',
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white pt-20">
        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Success Header */}
          <div className="text-center mb-12">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
            <p className="text-lg text-gray-600 mb-2">
              Thank you for your purchase. Your order has been successfully placed.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full mt-4">
              <span className="text-sm text-gray-600">Order Number:</span>
              <span className="font-mono font-bold text-gray-900">{orderId}</span>
            </div>
          </div>

          {/* Order Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Shipping Information */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-5 h-5 text-gray-700" />
                <h2 className="text-xl font-bold text-gray-900">Shipping Address</h2>
              </div>
              <div className="space-y-2 text-gray-700">
                <p className="font-medium">{orderData.firstName} {orderData.lastName}</p>
                <p>{orderData.shippingAddress}</p>
                <p>{orderData.postcode} {orderData.city}</p>
                <p>{orderData.country}</p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Package className="w-5 h-5 text-gray-700" />
                <h2 className="text-xl font-bold text-gray-900">Contact Details</h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-700">
                  <Mail className="w-4 h-4" />
                  <span>{orderData.email}</span>
                </div>
                {orderData.phone && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Phone className="w-4 h-4" />
                    <span>{orderData.phone}</span>
                  </div>
                )}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Items:</span>
                  <span className="font-medium">{orderData.items}</span>
                </div>
                <div className="flex justify-between text-lg font-bold mt-2">
                  <span>Total Paid:</span>
                  <span className="text-green-600">€{orderData.total}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="font-bold text-gray-900 mb-2">What happens next?</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>You will receive a confirmation email at <strong>{orderData.email}</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Your order will be processed within 1-2 business days</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Shipping updates will be sent to your email</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/store"
              className="w-full sm:w-auto px-8 py-3 bg-black text-white font-bold rounded-full hover:bg-gray-800 transition-colors text-center"
            >
              Continue Shopping
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto px-8 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-full hover:border-gray-400 transition-colors text-center"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
