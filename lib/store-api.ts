/**
 * 统一的 Store API 层
 * 
 * 功能：
 * - Bolt 环境：返回 mock 数据
 * - 真实环境：调用 WordPress/WooCommerce API
 * - 自动环境检测和切换
 */

import type { WooCommerceStoreProduct, WooCommerceStoreCategory } from './woocommerce.types';

// 环境检测
const isBolt = typeof window !== 'undefined' && (
  window.location.hostname.includes('bolt.new') ||
  window.location.hostname.includes('stackblitz.com') ||
  process.env.NEXT_PUBLIC_USE_MOCK === 'true'
);

// Mock 数据
const mockCategories: WooCommerceStoreCategory[] = [
  {
    id: 20,
    name: 'Microinverters',
    slug: 'microinverters',
    parent: 19,
    description: 'High-efficiency microinverters',
    image: null,
    count: 4,
  },
  {
    id: 21,
    name: 'Accessories',
    slug: 'accessories',
    parent: 19,
    description: 'Solar system accessories',
    image: null,
    count: 7,
  },
];

const mockProducts: WooCommerceStoreProduct[] = [
  {
    id: 109,
    name: 'EQ Microinverter 1T1',
    slug: 'eq-microinverter-1t1',
    permalink: '/product/eq-microinverter-1t1',
    description: 'High-efficiency microinverter with 550VA peak output',
    short_description: '1.25x Higher Density. HW-Class Reliability.',
    sku: 'EQ-1T1',
    prices: {
      price: '55000',
      regular_price: '60000',
      sale_price: '55000',
      price_range: null,
      currency_code: 'EUR',
      currency_symbol: '€',
      currency_minor_unit: 2,
      currency_decimal_separator: '.',
      currency_thousand_separator: ',',
      currency_prefix: '€',
      currency_suffix: '',
    },
    price_html: '<span class="woocommerce-Price-amount amount"><bdi><span class="woocommerce-Price-currencySymbol">€</span>550.00</bdi></span>',
    on_sale: true,
    images: [
      {
        id: 1,
        src: '/11.png',
        name: 'EQ Microinverter 1T1',
        alt: 'EQ Microinverter 1T1',
      },
    ],
    categories: [
      { id: 20, name: 'Microinverters', slug: 'microinverters' },
    ],
    stock_status: 'instock',
    stock_quantity: 10,
  },
  {
    id: 110,
    name: 'EQ Gateway',
    slug: 'eq-gateway',
    permalink: '/product/eq-gateway',
    description: 'Multi-panel orchestration gateway',
    short_description: 'Multi-panel orchestration',
    sku: 'EQ-GW',
    prices: {
      price: '25000',
      regular_price: '25000',
      sale_price: '',
      price_range: null,
      currency_code: 'EUR',
      currency_symbol: '€',
      currency_minor_unit: 2,
      currency_decimal_separator: '.',
      currency_thousand_separator: ',',
      currency_prefix: '€',
      currency_suffix: '',
    },
    price_html: '<span class="woocommerce-Price-amount amount"><bdi><span class="woocommerce-Price-currencySymbol">€</span>250.00</bdi></span>',
    on_sale: false,
    images: [
      {
        id: 2,
        src: '/12.png',
        name: 'EQ Gateway',
        alt: 'EQ Gateway',
      },
    ],
    categories: [
      { id: 20, name: 'Microinverters', slug: 'microinverters' },
    ],
    stock_status: 'instock',
    stock_quantity: 5,
  },
  {
    id: 111,
    name: 'Solar Panel Mounting Kit',
    slug: 'solar-panel-mounting-kit',
    permalink: '/product/solar-panel-mounting-kit',
    description: 'Complete mounting kit for solar panels',
    short_description: 'Complete mounting solution',
    sku: 'SP-MK-001',
    prices: {
      price: '12000',
      regular_price: '12000',
      sale_price: '',
      price_range: null,
      currency_code: 'EUR',
      currency_symbol: '€',
      currency_minor_unit: 2,
      currency_decimal_separator: '.',
      currency_thousand_separator: ',',
      currency_prefix: '€',
      currency_suffix: '',
    },
    price_html: '<span class="woocommerce-Price-amount amount"><bdi><span class="woocommerce-Price-currencySymbol">€</span>120.00</bdi></span>',
    on_sale: false,
    images: [
      {
        id: 3,
        src: '/13.png',
        name: 'Solar Panel Mounting Kit',
        alt: 'Solar Panel Mounting Kit',
      },
    ],
    categories: [
      { id: 21, name: 'Accessories', slug: 'accessories' },
    ],
    stock_status: 'instock',
    stock_quantity: 20,
  },
];

/**
 * 安全的 fetch 包装器
 * 确保在 Bolt 环境中不会因为真实 API 调用而报错
 */
async function safeFetch(url: string, options?: RequestInit): Promise<Response> {
  if (isBolt) {
    // Bolt 环境：抛出错误，让调用方使用 mock
    throw new Error('BOLT_ENV_MOCK_REQUIRED');
  }

  try {
    const response = await fetch(url, options);
    
    // 检查 Content-Type
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('❌ [store-api] Response is not JSON:', {
        url,
        status: response.status,
        contentType,
        preview: text.substring(0, 200),
      });
      throw new Error(`Expected JSON but got ${contentType || 'unknown'}`);
    }

    return response;
  } catch (error) {
    console.error('❌ [store-api] Fetch error:', error);
    throw error;
  }
}

/**
 * 获取分类列表
 */
export async function getCategories(): Promise<WooCommerceStoreCategory[]> {
  if (isBolt) {
    console.log('🔵 [store-api] Using mock categories (Bolt environment)');
    return mockCategories;
  }

  try {
    const response = await safeFetch('/api/store/categories');
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn('⚠️ [store-api] Failed to fetch categories, using mock:', error);
    return mockCategories;
  }
}

/**
 * 获取商品列表
 */
export async function getProducts(params?: {
  category?: number | string;
  per_page?: number;
  page?: number;
  search?: string;
}): Promise<WooCommerceStoreProduct[]> {
  if (isBolt) {
    console.log('🔵 [store-api] Using mock products (Bolt environment)', params);
    let filtered = [...mockProducts];
    
    // 按分类过滤
    if (params?.category) {
      const categoryId = typeof params.category === 'string' 
        ? parseInt(params.category) 
        : params.category;
      filtered = filtered.filter(p => 
        p.categories.some(c => c.id === categoryId)
      );
    }
    
    // 搜索过滤
    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.sku.toLowerCase().includes(searchLower)
      );
    }
    
    // 分页
    if (params?.per_page) {
      const page = params.page || 1;
      const start = (page - 1) * params.per_page;
      const end = start + params.per_page;
      filtered = filtered.slice(start, end);
    }
    
    return filtered;
  }

  try {
    const url = new URL('/api/store/products', window.location.origin);
    if (params?.category) url.searchParams.set('category', String(params.category));
    if (params?.per_page) url.searchParams.set('per_page', String(params.per_page));
    if (params?.page) url.searchParams.set('page', String(params.page));
    if (params?.search) url.searchParams.set('search', params.search);

    const response = await safeFetch(url.toString());
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn('⚠️ [store-api] Failed to fetch products, using mock:', error);
    return mockProducts;
  }
}

/**
 * 根据 ID 获取单个商品
 */
export async function getProductById(id: number): Promise<WooCommerceStoreProduct | null> {
  if (isBolt) {
    console.log('🔵 [store-api] Using mock product (Bolt environment)', id);
    return mockProducts.find(p => p.id === id) || null;
  }

  try {
    const response = await safeFetch(`/api/store/products/${id}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch product: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn('⚠️ [store-api] Failed to fetch product, using mock:', error);
    return mockProducts.find(p => p.id === id) || null;
  }
}

/**
 * 创建结账会话（Checkout Session）
 * 
 * Bolt 环境：返回假的 session ID
 * 真实环境：调用 Stripe/Mollie API
 */
export async function createCheckoutSession(cart: {
  items: Array<{ productId: number; quantity: number }>;
  shippingAddress?: any;
  billingAddress?: any;
  shippingMethod?: string;
}): Promise<{ sessionId: string; url: string }> {
  if (isBolt) {
    console.log('🔵 [store-api] Creating mock checkout session (Bolt environment)');
    // 返回假的 session，让 UI 流程能走通
    return {
      sessionId: `mock_session_${Date.now()}`,
      url: `/checkout/success?order=MOCK${Date.now()}`,
    };
  }

  try {
    const response = await safeFetch('/api/checkout/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cart),
    });

    if (!response.ok) {
      throw new Error(`Failed to create checkout session: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('❌ [store-api] Failed to create checkout session:', error);
    throw error;
  }
}

/**
 * 导出环境信息（用于调试）
 */
export function getStoreApiInfo() {
  return {
    isBolt,
    environment: isBolt ? 'Bolt (Mock)' : 'Production (Real API)',
  };
}
