'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { WooCommerceStoreCategory, WooCommerceStoreProduct } from '@/lib/woocommerce.types';
import { ChevronRight } from 'lucide-react';

interface StoreSidebarProps {
  categories: WooCommerceStoreCategory[];
  currentSlug: string;
  onSaleProducts?: WooCommerceStoreProduct[];
}

export default function StoreSidebar({ categories, currentSlug, onSaleProducts = [] }: StoreSidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());

  const toggleCategory = (categoryId: number) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  return (
    <aside className="w-72 flex-shrink-0 hidden lg:block">
      <div className="sticky top-24 space-y-8">
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Product Categories
          </h2>

          <nav className="space-y-1 border border-gray-200 bg-white">
            {categories.map((category) => {
              const isActive = currentSlug === category.slug;
              const isExpanded = expandedCategories.has(category.id);

              return (
                <div key={category.id}>
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className={`
                      w-full flex items-center justify-between px-4 py-3 text-sm font-medium
                      transition-all duration-200 border-b border-gray-200
                      ${isActive ? 'bg-gray-50 text-gray-900' : 'text-gray-700 hover:bg-gray-50'}
                    `}
                  >
                    <Link href={`/store/${category.slug}`} className="flex-1 text-left">
                      <ChevronRight className="inline-block w-4 h-4 mr-2" />
                      {category.name}
                    </Link>
                  </button>
                </div>
              );
            })}
          </nav>
        </div>

        {onSaleProducts.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              On-Sale Products
            </h2>

            <div className="space-y-4 border border-gray-200 bg-white p-4">
              {onSaleProducts.slice(0, 3).map((product) => (
                <Link
                  key={product.id}
                  href={`/store/${currentSlug}#product-${product.id}`}
                  className="flex items-center gap-3 group"
                >
                  {product.images && product.images[0] && (
                    <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden relative">
                      <Image
                        src={product.images[0].src}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      {product.on_sale && product.prices?.sale_price && (
                        <>
                          <span className="text-xs text-gray-400 line-through">
                            {product.prices.currency_prefix}
                            {(parseInt(product.prices.regular_price) / Math.pow(10, product.prices.currency_minor_unit)).toFixed(product.prices.currency_minor_unit)}
                            {product.prices.currency_suffix}
                          </span>
                          <span className="text-sm font-bold text-red-600">
                            {product.prices.currency_prefix}
                            {(parseInt(product.prices.sale_price) / Math.pow(10, product.prices.currency_minor_unit)).toFixed(product.prices.currency_minor_unit)}
                            {product.prices.currency_suffix}
                          </span>
                        </>
                      )}
                      {(!product.on_sale || !product.prices?.sale_price) && product.prices && (
                        <span className="text-sm font-medium text-gray-900">
                          {product.prices.currency_prefix}
                          {(parseInt(product.prices.price) / Math.pow(10, product.prices.currency_minor_unit)).toFixed(product.prices.currency_minor_unit)}
                          {product.prices.currency_suffix}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
