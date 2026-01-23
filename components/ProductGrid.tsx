'use client';

import { useEffect, useState } from 'react';
import type { WooCommerceStoreProduct } from '@/lib/woocommerce.types';
import StoreProductCard from './StoreProductCard';
import { AlertCircle, Loader2 } from 'lucide-react';

export default function ProductGrid() {
  const [products, setProducts] = useState<WooCommerceStoreProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch(
          '/api/store/products?per_page=12'
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
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to connect to WordPress. Please check your configuration and network connection.'
        );
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="border border-red-200 bg-red-50 p-6 rounded-sm">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-900 mb-2">Connection Error</h3>
              <p className="text-sm text-red-700 leading-relaxed">{error}</p>
              <div className="mt-4 text-sm text-red-600 space-y-1">
                <p className="font-medium">Troubleshooting tips:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Verify your WordPress Live Link is active and accessible</li>
                  <li>Check that WooCommerce REST API is enabled</li>
                  <li>Ensure your Consumer Key and Secret are correct</li>
                  <li>Check for any CORS or firewall issues</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">No products found. Add some products to your WooCommerce store.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-12">
      {products.map((product) => (
        <StoreProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
