'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { WooCommerceStoreProduct } from '@/lib/woocommerce.types';
import { ArrowLeft, ShoppingCart, Truck, Shield, Loader2 } from 'lucide-react';

interface ProductDetailClientProps {
  productId: number;
}

export default function ProductDetailClient({ productId }: ProductDetailClientProps) {
  const [product, setProduct] = useState<WooCommerceStoreProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch(
          `/api/store/products/${productId}`
        );

        const contentType = response.headers.get('content-type');
        if (!contentType?.includes('application/json')) {
          throw new Error('Expected JSON but got ' + contentType);
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setProduct(data);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err instanceof Error ? err.message : 'Failed to load product');
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <main className="flex-1">
        <section className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="flex-1">
        <section className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center py-16">
              <h1 className="text-4xl md:text-5xl font-medium text-gray-900 mb-4">
                {error ? 'Error Loading Product' : 'Product Not Found'}
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                {error || 'The product you are looking for could not be found.'}
              </p>
              <Link
                href="/store"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white hover:bg-gray-800 transition-colors duration-200 text-base font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Store
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const imageUrl = product.images?.[0]?.src || 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg';

  const price = product.prices?.price
    ? Number(product.prices.price) / 10 ** (product.prices.currency_minor_unit ?? 2)
    : 0;
  const regularPrice = product.prices?.regular_price
    ? Number(product.prices.regular_price) / 10 ** (product.prices.currency_minor_unit ?? 2)
    : price;
  const currency = product.prices?.currency_code ?? "EUR";
  const isOnSale = product.on_sale && regularPrice > price;

  return (
    <main className="flex-1">
      <section className="bg-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Link
            href="/store"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Store
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            <div className="relative aspect-square bg-secondary border border-border">
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>

            <div className="flex flex-col">
              <div className="mb-6">
                {product.categories && product.categories.length > 0 && (
                  <p className="text-sm text-muted-foreground mb-2">
                    {product.categories[0].name}
                  </p>
                )}
                <h1 className="text-4xl md:text-5xl font-medium text-foreground mb-4">
                  {product.name}
                </h1>

                <div className="flex items-center gap-3 mb-6">
                  {isOnSale && (
                    <span className="text-2xl line-through text-muted-foreground">
                      {currency} {regularPrice.toFixed(2)}
                    </span>
                  )}
                  <span className={`text-3xl font-medium ${isOnSale ? 'text-destructive' : 'text-foreground'}`}>
                    {currency} {price.toFixed(2)}
                  </span>
                  {isOnSale && (
                    <span className="px-3 py-1 bg-destructive/10 text-destructive text-sm font-medium">
                      SALE
                    </span>
                  )}
                </div>
              </div>

              {product.short_description && (
                <div className="mb-8">
                  <h2 className="text-xl font-medium text-foreground mb-4">Overview</h2>
                  <div
                    className="prose prose-sm max-w-none text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: product.short_description }}
                  />
                </div>
              )}

              <div className="space-y-4 mb-8">
                <button className="w-full px-8 py-4 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200 text-base font-medium flex items-center justify-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
              </div>

              <div className="border-t border-border pt-8 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-secondary flex items-center justify-center flex-shrink-0">
                    <Truck className="w-5 h-5 text-foreground" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-1">Free Shipping</h3>
                    <p className="text-sm text-muted-foreground">
                      On orders over €100
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-secondary flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-foreground" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-1">2-Year Warranty</h3>
                    <p className="text-sm text-muted-foreground">
                      Full coverage included
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Availability:</strong>{' '}
                  {product.stock_status === 'instock' ? 'In Stock' : 'Out of Stock'}
                </p>
                {product.stock_quantity && (
                  <p className="text-sm text-muted-foreground mt-2">
                    <strong className="text-foreground">Stock:</strong> {product.stock_quantity} units available
                  </p>
                )}
              </div>
            </div>
          </div>

          {product.description && (
            <div className="mt-16 pt-16 border-t border-border">
              <h2 className="text-3xl font-medium text-foreground mb-8">Product Details</h2>
              <div
                className="prose prose-lg max-w-none text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>
          )}

          {product.images && product.images.length > 1 && (
            <div className="mt-16 pt-16 border-t border-border">
              <h2 className="text-3xl font-medium text-foreground mb-8">More Images</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {product.images.slice(1).map((image) => (
                  <div key={image.id} className="aspect-square relative bg-secondary border border-border overflow-hidden">
                    <Image
                      src={image.src}
                      alt={image.alt || product?.name || 'Product image'}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="bg-secondary py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-medium text-foreground mb-6">
            Need Installation Help?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Check our comprehensive installation guides or contact our support team for assistance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/install"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200 text-sm font-medium"
            >
              View Installation Guides
            </Link>
            <Link
              href="/support"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-border hover:border-foreground/30 bg-white transition-colors duration-200 text-sm font-medium text-foreground"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
