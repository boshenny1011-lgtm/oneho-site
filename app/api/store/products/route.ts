import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const WC_BASE_URL = process.env.WC_BASE_URL || 'https://linexpv.com';
const WC_CONSUMER_KEY = process.env.WC_CONSUMER_KEY || '';
const WC_CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET || '';

/**
 * 将 WooCommerce REST API v3 商品格式转换为 Store API 格式
 */
function transformProduct(product: any) {
  // 价格转换：WC v3 返回字符串格式的价格（如 "150"），需要转换为分（如 "15000"）
  const priceInCents = Math.round(parseFloat(product.price || '0') * 100).toString();
  const regularPriceInCents = Math.round(parseFloat(product.regular_price || product.price || '0') * 100).toString();
  const salePriceInCents = product.sale_price ? Math.round(parseFloat(product.sale_price) * 100).toString() : '';

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    permalink: product.permalink,
    description: product.description,
    short_description: product.short_description,
    sku: product.sku,
    prices: {
      price: priceInCents,
      regular_price: regularPriceInCents,
      sale_price: salePriceInCents,
      price_range: null,
      currency_code: 'EUR',
      currency_symbol: '€',
      currency_minor_unit: 2,
      currency_decimal_separator: '.',
      currency_thousand_separator: ',',
      currency_prefix: '€',
      currency_suffix: '',
    },
    price_html: product.price_html,
    on_sale: product.on_sale,
    images: product.images.map((img: any) => ({
      id: img.id,
      src: img.src,
      name: img.name,
      alt: img.alt || product.name,
      thumbnail: img.thumbnail || img.src,
    })),
    categories: product.categories.map((cat: any) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
    })),
    stock_status: product.stock_status,
    stock_quantity: product.stock_quantity,
  };
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const perPage = searchParams.get('per_page') || '24';
    const page = searchParams.get('page') || '1';

    // 检查 WooCommerce API 凭证
    if (!WC_CONSUMER_KEY || !WC_CONSUMER_SECRET) {
      console.error('❌ [API] WooCommerce API credentials not configured');
      return NextResponse.json(
        { error: 'WooCommerce API credentials not configured' },
        { status: 500 }
      );
    }

    // 构建 WooCommerce REST API v3 URL
    const baseUrl = WC_BASE_URL.replace(/\/wp\/?$/, '').replace(/\/$/, '');
    const url = new URL(`${baseUrl}/wp/wp-json/wc/v3/products`);
    
    if (category) {
      url.searchParams.set('category', category);
    }
    url.searchParams.set('per_page', perPage);
    url.searchParams.set('page', page);
    url.searchParams.set('status', 'publish');

    console.log('🔍 [API] Fetching products from:', url.toString());

    // Basic Auth
    const credentials = Buffer.from(`${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`).toString('base64');

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Basic ${credentials}`,
        'User-Agent': 'Next.js Store API',
      },
      cache: 'no-store',
    });

    console.log('📊 [API] Products response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ [API] Failed to fetch products:', response.status);
      console.error('❌ [API] Error response:', errorText.substring(0, 200));
      
      return NextResponse.json(
        { error: `Failed to fetch products: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('❌ [API] Response is not JSON! Content-Type:', contentType);
      console.error('❌ [API] Response body (first 200 chars):', text.substring(0, 200));
      
      return NextResponse.json(
        { error: `Expected JSON but got ${contentType || 'unknown'}` },
        { status: 500 }
      );
    }

    const rawProducts = await response.json();
    console.log('✅ [API] Fetched products:', rawProducts.length);

    // 转换为 Store API 格式
    const products = rawProducts.map(transformProduct);

    return NextResponse.json(products);
  } catch (error) {
    console.error('❌ [API] Error fetching products:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
