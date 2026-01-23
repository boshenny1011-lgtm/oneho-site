import StoreProductCard from '@/components/StoreProductCard';
import type { WooCommerceStoreProduct } from '@/lib/woocommerce.types';
import { Package } from 'lucide-react';

interface StoreGridProps {
  products: WooCommerceStoreProduct[];
  categoryName: string;
}

export default function StoreGrid({ products, categoryName }: StoreGridProps) {
  return (
    <div className="flex-1">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-medium text-gray-900 mb-3 capitalize">
          {categoryName}
        </h1>
        <p className="text-sm text-gray-600">
          {products.length} {products.length === 1 ? 'Product' : 'Products'}
        </p>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border border-gray-200 bg-gray-50">
          <Package className="w-16 h-16 text-gray-300 mb-4" />
          <p className="text-gray-900 text-lg font-medium mb-2">
            No products available
          </p>
          <p className="text-gray-500 text-sm">
            Check back soon for new products in this category
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <StoreProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
