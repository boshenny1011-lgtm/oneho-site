'use client';

import { useState, useEffect, useMemo } from 'react';
import StoreSidebar from './StoreSidebar';
import StoreGrid from './StoreGrid';
import StoreHeader from './StoreHeader';
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

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'price-asc' | 'price-desc' | 'name'>('date');
  const [perPage, setPerPage] = useState(16);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        console.log('🔍 [StorePageClient] Fetching data for slug:', slug);

        const filteredCategories = await getCategories();
        console.log('✅ [StorePageClient] Fetched categories:', filteredCategories.length);

        if (!mounted) return;

        const category = filteredCategories.find(c => c.slug === slug);

        if (!category) {
          console.error('❌ [StorePageClient] Category not found:', slug);
          setError(`Category "${slug}" not found`);
          setCategories(filteredCategories);
          setLoading(false);
          return;
        }

        console.log('✅ [StorePageClient] Current category:', category.name, 'ID:', category.id);

        const productsData = await getProducts({
          category: category.id,
          per_page: 100,
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

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = products.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        p.sku?.toLowerCase().includes(query)
      );
    }

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return (a.prices?.price ? parseInt(a.prices.price) : 0) - (b.prices?.price ? parseInt(b.prices.price) : 0);
        case 'price-desc':
          return (b.prices?.price ? parseInt(b.prices.price) : 0) - (a.prices?.price ? parseInt(a.prices.price) : 0);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date':
        default:
          return b.id - a.id;
      }
    });

    return sorted.slice(0, perPage);
  }, [products, searchQuery, sortBy, perPage]);

  const onSaleProducts = useMemo(() => {
    return products.filter(p => p.on_sale);
  }, [products]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 pt-20">
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
      <main className="min-h-screen bg-gray-50 pt-20">
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
      <main className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <h1 className="text-2xl font-medium text-gray-900 mb-4">Category Not Found</h1>
              <p className="text-gray-600">The category &quot;{slug}&quot; does not exist.</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-8 py-12">
        <div className="flex gap-8">
          <StoreSidebar
            categories={categories}
            currentSlug={slug}
            onSaleProducts={onSaleProducts}
          />

          <div className="flex-1">
            <StoreHeader
              categoryName={currentCategory.name}
              productCount={filteredAndSortedProducts.length}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              sortBy={sortBy}
              onSortChange={setSortBy}
              perPage={perPage}
              onPerPageChange={setPerPage}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />

            <div className="mt-8">
              <StoreGrid
                products={filteredAndSortedProducts}
                viewMode={viewMode}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
