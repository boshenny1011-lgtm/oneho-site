'use client';

import Link from 'next/link';
import type { WooCommerceStoreCategory } from '@/lib/woocommerce.types';
import { ChevronRight } from 'lucide-react';

interface StoreSidebarProps {
  categories: WooCommerceStoreCategory[];
  currentSlug: string;
}

export default function StoreSidebar({ categories, currentSlug }: StoreSidebarProps) {
  return (
    <aside className="w-64 flex-shrink-0 hidden lg:block">
      <div className="sticky top-24">
        <div className="border-r border-gray-200 pr-8">
          <h2 className="text-sm font-medium text-gray-900 mb-4 uppercase tracking-wider">
            Product Categories
          </h2>

          <nav className="space-y-1">
            {categories.map((category) => {
              const isActive = currentSlug === category.slug;

              return (
                <Link
                  key={category.id}
                  href={`/store/${category.slug}`}
                  className={`
                    group flex items-center justify-between px-3 py-2.5 text-sm font-medium
                    transition-colors duration-200
                    ${isActive
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <span>{category.name}</span>
                  <ChevronRight
                    className={`
                      w-4 h-4 transition-transform duration-200
                      ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}
                      ${isActive ? 'translate-x-1' : ''}
                    `}
                  />
                </Link>
              );
            })}
          </nav>

          {categories.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                {categories.reduce((sum, cat) => sum + (cat.count || 0), 0)} total products
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
