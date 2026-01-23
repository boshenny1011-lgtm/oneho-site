'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import { useCart } from '@/contexts/CartContext';
import { getBestProductImage } from '@/lib/image-matcher';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, getSubtotal, getTotal, clearCart } = useCart();

  const subtotal = getSubtotal();
  const tax = subtotal * 0.21;
  const shipping = subtotal > 100 ? 0 : 10;
  const total = getTotal();

  if (items.length === 0) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-white pt-20">
          <div className="max-w-4xl mx-auto px-6 py-12">
            <div className="text-center py-20">
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h1 className="text-2xl font-medium mb-4">Your cart is empty</h1>
              <Link
                href="/store"
                className="inline-block px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
              >
                Continue Shopping
              </Link>
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
        <div className="max-w-6xl mx-auto px-6 py-12">
          <h1 className="text-3xl font-medium mb-8">Shopping Cart</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* 左侧：商品列表 */}
            <div className="lg:col-span-2 space-y-4">
              {items.map(item => {
                const imageUrl = item.product?.image 
                  ? getBestProductImage({ images: [{ src: item.product.image, id: 0, name: '', alt: '' }] } as any)
                  : `/${item.productId}.png`;

                return (
                  <div
                    key={item.productId}
                    className="flex gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <Link href={`/product/${item.productId}`} className="flex-shrink-0">
                      <div className="w-24 h-24 relative bg-gray-100 rounded-md overflow-hidden">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={item.product?.name || 'Product'}
                            fill
                            className="object-cover"
                            sizes="96px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                            No image
                          </div>
                        )}
                      </div>
                    </Link>

                    <div className="flex-1">
                      <Link href={`/product/${item.productId}`}>
                        <h3 className="font-medium hover:text-gray-600 transition-colors">
                          {item.product?.name || `Product ${item.productId}`}
                        </h3>
                      </Link>
                      {item.product?.sku && (
                        <p className="text-sm text-gray-500">SKU: {item.product.sku}</p>
                      )}
                      <p className="text-lg font-medium mt-2">
                        €{item.product?.price?.toFixed(2) || '0.00'}
                      </p>
                    </div>

                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>

                      <div className="flex items-center gap-2 border rounded-md">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="p-2 hover:bg-gray-100 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-2 min-w-[3rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="p-2 hover:bg-gray-100 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-lg font-medium mt-2">
                        €{((item.product?.price || 0) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })}

              <div className="pt-4">
                <button
                  onClick={clearCart}
                  className="text-sm text-gray-600 hover:text-gray-900 underline"
                >
                  Clear cart
                </button>
              </div>
            </div>

            {/* 右侧：订单摘要 */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-medium mb-4">Order Summary</h2>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>€{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>VAT (21%)</span>
                    <span>€{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `€${shipping.toFixed(2)}`}</span>
                  </div>
                </div>

                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between font-medium text-lg">
                    <span>Total</span>
                    <span>€{total.toFixed(2)}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="block w-full text-center px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                >
                  Proceed to Checkout
                </Link>

                <Link
                  href="/store"
                  className="block w-full text-center mt-4 text-sm text-gray-600 hover:text-gray-900 underline"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
