'use client';

import { useState, useEffect } from 'react';
import StoreSidebar from './StoreSidebar';
import StoreGrid from './StoreGrid';
import EnhancedStoreGrid from './EnhancedStoreGrid';
import type { WooCommerceStoreCategory, WooCommerceStoreProduct } from '@/lib/woocommerce.types';
import { getCategories, getProducts } from '@/lib/store-api';

interface StorePageClientProps {
  slug: string;
}

export default function StorePageClient({ slug }: StorePageClientProps) {
  const [categories, setCategories] = useState<WooCommerceStoreCategory[]>([]);
  const [products, setProducts] = useState<WooCommerceStoreProduct[]>([]);
  const [currentCategory, setCurrentCategory] = useState<WooCommerceStoreCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        console.log('🔍 [StorePageClient] Fetching data for slug:', slug);

        // Fetch categories using unified store-api
        const filteredCategories = await getCategories();
        console.log('✅ [StorePageClient] Fetched categories:', filteredCategories.length);
        console.log('📋 [StorePageClient] Available category slugs:', filteredCategories.map(c => c.slug));

        if (!mounted) return;

        // Find current category by slug
        const category = filteredCategories.find(c => c.slug === slug);

        if (!category) {
          console.error('❌ [StorePageClient] Category not found:', slug);
          console.error('❌ [StorePageClient] Available categories:', filteredCategories.map(c => c.slug));
          setError(`Category "${slug}" not found`);
          setCategories(filteredCategories);
          setLoading(false);
          return;
        }

        console.log('✅ [StorePageClient] Current category:', category.name, 'ID:', category.id);

        // Fetch products using unified store-api
        const productsData = await getProducts({
          category: category.id,
          per_page: 24,
        });
        console.log('✅ [StorePageClient] Fetched products:', productsData.length);

        if (!mounted) return;

        setCategories(filteredCategories);
        setCurrentCategory(category);
        setProducts(productsData);
        setLoading(false);

      } catch (err) {
        console.error('❌ [StorePageClient] Error fetching data:', err);
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load store data');
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      mounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-white pt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
              <p className="text-gray-600">Loading products...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-white pt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <h1 className="text-2xl font-medium text-gray-900 mb-4">Error Loading Category</h1>
              <p className="text-gray-600 mb-6">{error}</p>
              {categories.length > 0 && (
                <div className="mt-8">
                  <p className="text-sm text-gray-500 mb-4">Available categories:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {categories.map(cat => (
                      <a
                        key={cat.id}
                        href={`/store/${cat.slug}`}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded transition-colors"
                      >
                        {cat.name}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!currentCategory) {
    return (
      <main className="min-h-screen bg-white pt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <h1 className="text-2xl font-medium text-gray-900 mb-4">Category Not Found</h1>
              <p className="text-gray-600">The category "{slug}" does not exist.</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // 使用增强版 UI（黑色背景、渐变效果、滚动动画）
  const useEnhancedUI = true;

  if (useEnhancedUI) {
    return (
      <main className="min-h-screen bg-black">
        <EnhancedStoreGrid
          products={products}
          categoryName={currentCategory.name}
        />
      </main>
    );
  }

  // 原始 UI（白色背景、简单布局）
  return (
    <main className="min-h-screen bg-white pt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="flex gap-12">
          <StoreSidebar
            categories={categories}
            currentSlug={slug}
          />
          <StoreGrid
            products={products}
            categoryName={currentCategory.name}
          />
        </div>
      </div>
    </main>
  );
}
