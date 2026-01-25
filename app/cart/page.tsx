'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import { useCart } from '@/contexts/CartContext';
import { getBestProductImage } from '@/lib/image-matcher';
import { ShoppingBag, X, Minus, Plus } from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, getSubtotal, clearCart } = useCart();
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const subtotal = getSubtotal();
  const shippingRate = 22.00;
  const tax = 0;
  const total = subtotal + shippingRate + tax;

  // Loading skeleton
  if (isLoading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-white pt-20">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-12">
            <div className="h-10 bg-gray-200 rounded w-1/3 mb-12 animate-pulse" />

            <div className="overflow-x-auto mb-12">
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4 border-b border-gray-200 pb-6">
                    <div className="w-20 h-20 bg-gray-200 rounded animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-5 bg-gray-200 rounded w-1/3 animate-pulse" />
                      <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-100 h-64 rounded animate-pulse" />
              <div className="bg-gray-100 h-64 rounded animate-pulse" />
            </div>
          </div>
        </main>
      </>
    );
  }

  if (items.length === 0) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-white pt-20">
          <div className="max-w-4xl mx-auto px-6 py-12">
            <div className="text-center py-20">
              <div className="bg-gray-100 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-16 h-16 text-gray-400" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">Your cart is empty</h1>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Looks like you haven't added any products to your cart yet. Start shopping to fill it up!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/store"
                  className="inline-block px-8 py-3 bg-black text-white font-bold rounded-full hover:bg-gray-800 transition-colors"
                >
                  Browse Products
                </Link>
                <Link
                  href="/"
                  className="inline-block px-8 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-full hover:border-gray-400 transition-colors"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white pt-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">
            You Have {items.length} {items.length === 1 ? 'Item' : 'Items'} In Your Cart
          </h1>

          <div className="overflow-x-auto mb-12">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left py-4 px-4 font-bold text-gray-900">Product</th>
                  <th className="text-left py-4 px-4 font-bold text-gray-900">Price</th>
                  <th className="text-left py-4 px-4 font-bold text-gray-900">Quantity</th>
                  <th className="text-left py-4 px-4 font-bold text-gray-900">Subtotal</th>
                  <th className="w-12"></th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => {
                  const imageUrl = item.product?.image
                    ? getBestProductImage({ images: [{ src: item.product.image, id: 0, name: '', alt: '' }] } as any)
                    : `/${item.productId}.png`;
                  const itemTotal = (item.product?.price || 0) * item.quantity;

                  return (
                    <tr key={item.productId} className="border-b border-gray-200">
                      <td className="py-6 px-4">
                        <div className="flex items-center gap-4">
                          <Link href={`/product/${item.productId}`} className="flex-shrink-0">
                            <div className="w-20 h-20 relative bg-gray-100 overflow-hidden">
                              {imageUrl ? (
                                <Image
                                  src={imageUrl}
                                  alt={item.product?.name || 'Product'}
                                  fill
                                  className="object-cover"
                                  sizes="80px"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                  No image
                                </div>
                              )}
                            </div>
                          </Link>
                          <Link href={`/product/${item.productId}`} className="hover:text-gray-600 transition-colors">
                            <h3 className="font-medium text-gray-900">
                              {item.product?.name || `Product ${item.productId}`}
                            </h3>
                          </Link>
                        </div>
                      </td>
                      <td className="py-6 px-4">
                        <span className="text-gray-900">{item.product?.price?.toFixed(2) || '0.00'} €</span>
                      </td>
                      <td className="py-6 px-4">
                        <div className="flex items-center border border-gray-300 w-fit">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="px-3 py-2 hover:bg-gray-100 transition-colors border-r border-gray-300"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-6 py-2 min-w-[3rem] text-center font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="px-3 py-2 hover:bg-gray-100 transition-colors border-l border-gray-300"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                      <td className="py-6 px-4">
                        <span className="text-red-600 font-bold text-lg">{itemTotal.toFixed(2)} €</span>
                      </td>
                      <td className="py-6 px-4">
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                          aria-label="Remove item"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
            <div className="bg-white border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Calculate shipping</h2>

              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 placeholder:text-gray-400"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Washington"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Town / City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="ZIP Code"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 placeholder:text-gray-400"
                  />
                </div>

                <button className="px-8 py-3 bg-red-600 text-white font-bold hover:bg-red-700 transition-colors rounded-full">
                  UPDATE
                </button>
              </div>
            </div>

            <div className="bg-white border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Cart totals</h2>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="font-bold text-gray-900">Subtotal</span>
                  <span className="text-gray-900">{subtotal.toFixed(2)} €</span>
                </div>

                <div className="py-3 border-b border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-gray-900">Shipping</span>
                    <div className="text-right">
                      <div className="text-gray-900">Flat rate: {shippingRate.toFixed(2)} €</div>
                      <div className="text-sm text-gray-500 mt-1">Shipping to WA.</div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="font-bold text-gray-900">Tax</span>
                  <span className="text-gray-900">{tax.toFixed(2)} €</span>
                </div>

                <div className="flex justify-between items-center py-4">
                  <span className="font-bold text-gray-900 text-lg">Total</span>
                  <span className="text-red-600 font-bold text-2xl">{total.toFixed(2)} € EUR</span>
                </div>

                <div className="space-y-3 mt-6">
                  <button className="w-full px-8 py-3 bg-red-600 text-white font-bold hover:bg-red-700 transition-colors rounded-full">
                    UPDATE CART
                  </button>
                  <Link
                    href="/checkout"
                    className="block w-full text-center px-8 py-3 bg-red-600 text-white font-bold hover:bg-red-700 transition-colors rounded-full"
                  >
                    PROCEED TO CHECKOUT
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-white border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Have A Promotional Code?</h2>
            <div className="flex gap-4 max-w-md">
              <input
                type="text"
                placeholder="Enter code"
                className="flex-1 px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 placeholder:text-gray-400"
              />
              <button className="px-8 py-3 bg-red-600 text-white font-bold hover:bg-red-700 transition-colors rounded-full">
                APPLY
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
