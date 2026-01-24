'use client';

import StoreProductCard from '@/components/StoreProductCard';
import type { WooCommerceStoreProduct } from '@/lib/woocommerce.types';
import { Package } from 'lucide-react';

interface StoreGridProps {
  products: WooCommerceStoreProduct[];
  viewMode: 'grid' | 'list';
}

export default function StoreGrid({ products, viewMode }: StoreGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 border border-gray-200 bg-gray-50">
        <Package className="w-16 h-16 text-gray-300 mb-4" />
        <p className="text-gray-900 text-lg font-medium mb-2">
          No products available
        </p>
        <p className="text-gray-500 text-sm">
          Check back soon for new products in this category
        </p>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-6">
        {products.map((product) => (
          <StoreProductCard key={product.id} product={product} layout="list" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <StoreProductCard key={product.id} product={product} layout="grid" />
      ))}
    </div>
  );
}
