'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import StoreProductCard from '@/components/StoreProductCard';
import type { WooCommerceStoreProduct } from '@/lib/woocommerce.types';

export default function ShopPageClient() {
  const [products, setProducts] = useState<WooCommerceStoreProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch(
          '/api/store/products?per_page=20'
        );

        const contentType = response.headers.get('content-type');
        if (!contentType?.includes('application/json')) {
          throw new Error('Expected JSON but got ' + contentType);
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error('Shop page error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return (
    <main className="flex-1">
      <section className="py-20 px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium text-foreground mb-4">
              All Products
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Explore our complete range of premium hardware solutions
            </p>
          </div>

          {loading && (
            <div className="text-center py-16 max-w-xl mx-auto">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </div>
              <p className="text-muted-foreground mt-4">Loading products...</p>
            </div>
          )}

          {error && (
            <div className="mb-12 p-6 border border-destructive/30 bg-destructive/5 max-w-2xl">
              <p className="font-medium text-destructive mb-2">Error connecting to store:</p>
              <p className="text-sm text-destructive/80">{error}</p>
            </div>
          )}

          {!loading && !error && products.length === 0 && (
            <div className="text-center py-16 max-w-xl mx-auto">
              <p className="text-muted-foreground">No products found</p>
            </div>
          )}

          {!loading && !error && products.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {products.map((product) => (
                <StoreProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
