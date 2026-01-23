import type {
  WooCommerceStoreProduct,
  WooCommerceStoreCategory,
  WooCommerceApiError,
} from './woocommerce.types';

export type {
  WooCommerceStoreProduct,
  WooCommerceStoreCategory,
  WooCommerceApiError,
};

class WooCommerceClient {
  private baseUrl: string;
  private storeApiBase: string;

  constructor() {
    // Client-side only: hardcoded to linexpv.com/wp
    this.baseUrl = "https://linexpv.com/wp";
    this.storeApiBase = `${this.baseUrl}/wp-json/wc/store/v1`;

    console.log('🏠 WooCommerce Client initialized (client-side)');
    console.log('🌐 Base URL:', this.baseUrl);
    console.log('📡 Store API Base:', this.storeApiBase);
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    // Check content-type first to avoid parsing HTML as JSON
    const contentType = response.headers.get('content-type');

    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('❌ [handleResponse] Response is NOT JSON! Content-Type:', contentType);
      console.error('❌ [handleResponse] URL:', response.url);
      console.error('❌ [handleResponse] Status:', response.status);
      console.error('❌ [handleResponse] Response body (first 200 chars):', text.substring(0, 200));
      throw new Error(`Expected JSON but got ${contentType || 'unknown content-type'}. Body: ${text.substring(0, 200)}`);
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        code: 'network_error',
        message: `Failed to fetch from ${response.url}. Status: ${response.status}`,
      }));

      console.error('❌ [handleResponse] API Error:', {
        url: response.url,
        status: response.status,
        statusText: response.statusText,
        errorData,
      });

      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    return response.json();
  }

  async getProducts(params?: {
    per_page?: number;
    page?: number;
    category?: number | string;
    search?: string;
  }): Promise<WooCommerceStoreProduct[]> {
    console.log('⚠️ [getProducts] Redirecting to Store API (getStoreProducts)');
    return this.getStoreProducts({
      per_page: params?.per_page,
      category: params?.category,
      page: params?.page,
    });
  }

  async getCategories(): Promise<WooCommerceStoreCategory[]> {
    console.log('⚠️ [getCategories] Redirecting to Store API (getStoreCategories)');
    return this.getStoreCategories();
  }

  async getProduct(id: number): Promise<WooCommerceStoreProduct> {
    console.log('⚠️ [getProduct] Deprecated method called, redirecting to Store API (getProductById)');
    const storeProduct = await this.getProductById(id);
    if (!storeProduct) {
      throw new Error(`Product ${id} not found`);
    }
    return storeProduct;
  }

  async getProductById(id: number): Promise<WooCommerceStoreProduct | null> {
    if (typeof window === 'undefined') {
      console.error('🚫 [getProductById] CALLED ON SERVER!');
      console.error('📋 [getProductById] Params:', { id });
      console.error('📍 [getProductById] Stack trace:', new Error().stack);
      throw new Error('getProductById called on server - Store API requests MUST happen in browser only!');
    }

    try {
      // Use Next.js API route as proxy to avoid CORS issues
      const url = `/api/store/products/${id}`;

      console.log('🔍 [getProductById] Fetching product:', id);
      console.log('🌐 [getProductById] Full URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        cache: 'no-store',
      });

      console.log('📊 [getProductById] Response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ [getProductById] Failed to fetch product');
        console.error('❌ [getProductById] Status:', response.status);
        console.error('❌ [getProductById] Error:', errorData);
        throw new Error(errorData.error || `Failed to fetch product ${id}: ${response.status} ${response.statusText}`);
      }

      const product = await response.json();
      console.log('✅ [getProductById] Product found:', product.id, product.name);
      return product;
    } catch (error) {
      console.error(`❌ [getProductById] Error fetching product ${id}:`, error);
      throw error;
    }
  }

  async getStoreProducts(params?: {
    per_page?: number;
    category?: number | string;
    page?: number;
  }): Promise<WooCommerceStoreProduct[]> {
    if (typeof window === 'undefined') {
      console.error('🚫 [getStoreProducts] CALLED ON SERVER!');
      console.error('📋 [getStoreProducts] Params:', params);
      console.error('📍 [getStoreProducts] Stack trace:', new Error().stack);
      throw new Error('getStoreProducts called on server - Store API requests MUST happen in browser only!');
    }

    try {
      // Use Next.js API route as proxy to avoid CORS issues
      const url = new URL('/api/store/products', window.location.origin);

      if (params?.per_page) {
        url.searchParams.set('per_page', String(params.per_page));
      }
      if (params?.category) {
        url.searchParams.set('category', String(params.category));
      }
      if (params?.page) {
        url.searchParams.set('page', String(params.page));
      }

      console.log('🔍 [getStoreProducts] Fetching products:', url.toString());
      console.log('🔍 [getStoreProducts] Params:', params);

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        cache: 'no-store',
      });

      console.log('📊 [getStoreProducts] Response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ [getStoreProducts] Failed to fetch products');
        console.error('❌ [getStoreProducts] Status:', response.status);
        console.error('❌ [getStoreProducts] Error:', errorData);
        throw new Error(errorData.error || `Failed to fetch products: ${response.status} ${response.statusText}`);
      }

      const products = await response.json();
      console.log('✅ [getStoreProducts] Products found:', products.length);
      return products;
    } catch (error) {
      console.error('❌ [getStoreProducts] Error fetching products:', error);
      throw error;
    }
  }

  async getStoreCategories(): Promise<WooCommerceStoreCategory[]> {
    if (typeof window === 'undefined') {
      console.error('🚫 [getStoreCategories] CALLED ON SERVER!');
      console.error('📍 [getStoreCategories] Stack trace:', new Error().stack);
      throw new Error('getStoreCategories called on server - Store API requests MUST happen in browser only!');
    }

    try {
      // Use Next.js API route as proxy to avoid CORS issues
      const url = '/api/store/categories';

      console.log('🔍 [getStoreCategories] Fetching categories from Next.js API:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        cache: 'no-store',
      });

      console.log('📊 [getStoreCategories] Response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ [getStoreCategories] Failed to fetch categories');
        console.error('❌ [getStoreCategories] Status:', response.status);
        console.error('❌ [getStoreCategories] Error:', errorData);
        throw new Error(errorData.error || `Failed to fetch categories: ${response.status} ${response.statusText}`);
      }

      const categories = await response.json();
      console.log('✅ [getStoreCategories] Categories found:', categories.length);
      console.log('✅ [getStoreCategories] Categories:', categories.map((c: any) => ({ id: c.id, name: c.name, slug: c.slug })));
      return categories;
    } catch (error) {
      console.error('❌ [getStoreCategories] Error fetching categories:', error);
      throw error;
    }
  }

  async getProductsByCategoryId(categoryId: number, pageSize: number = 24): Promise<WooCommerceStoreProduct[]> {
    console.log('🔍 [getProductsByCategoryId] Fetching products for category:', categoryId);
    return this.getStoreProducts({
      category: categoryId,
      per_page: pageSize,
    });
  }

  async getStoreProductsByCategorySlug(slug: string): Promise<WooCommerceStoreProduct[]> {
    try {
      console.log('🔍 [getStoreProductsByCategorySlug] Looking up category slug:', slug);

      const categories = await this.getStoreCategories();
      const category = categories.find(cat => cat.slug === slug);

      if (!category) {
        console.error('❌ [getStoreProductsByCategorySlug] Category not found:', slug);
        console.error('❌ [getStoreProductsByCategorySlug] Available categories:', categories.map(c => c.slug));
        throw new Error(`Category with slug "${slug}" not found`);
      }

      console.log('✅ [getStoreProductsByCategorySlug] Found category:', category.name, 'ID:', category.id);

      return this.getProductsByCategoryId(category.id, 24);
    } catch (error) {
      console.error('❌ [getStoreProductsByCategorySlug] Error:', error);
      throw error;
    }
  }

  getCategoryBySlug(categories: WooCommerceStoreCategory[], slug: string): WooCommerceStoreCategory | undefined {
    return categories.find(cat => cat.slug === slug);
  }

  isConfigured(): boolean {
    return !!this.baseUrl;
  }
}

export const woocommerce = new WooCommerceClient();

// Category ID constants for reference
export const CATEGORY_ID = {
  ONEHO: 19,
  MICROINVERTERS: 20,
  ACCESSORIES: 21,
} as const;

export function formatStorePrice(product: WooCommerceStoreProduct): string {
  try {
    if (product.prices?.price) {
      const priceValue = parseInt(product.prices.price) / Math.pow(10, product.prices.currency_minor_unit);
      const prefix = product.prices.currency_prefix || '';
      const suffix = product.prices.currency_suffix || '';
      return `${prefix}${priceValue.toFixed(product.prices.currency_minor_unit)}${suffix}`;
    }

    if (product.price_html) {
      return product.price_html.replace(/<[^>]*>/g, '');
    }
  } catch (error) {
    console.error('Error formatting price:', error);
  }

  return 'Contact us';
}
