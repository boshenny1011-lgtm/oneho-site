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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const productId = resolvedParams.id;

    // 检查 WooCommerce API 凭证
    if (!WC_CONSUMER_KEY || !WC_CONSUMER_SECRET) {
      console.error('❌ [API] WooCommerce API credentials not configured');
      return NextResponse.json(
        { error: 'WooCommerce API credentials not configured' },
        { status: 500 }
      );
    }

    const baseUrl = WC_BASE_URL.replace(/\/wp\/?$/, '').replace(/\/$/, '');
    const url = `${baseUrl}/wp/wp-json/wc/v3/products/${productId}`;

    console.log('🔍 [API] Fetching product:', productId);
    console.log('🔍 [API] Full URL:', url);

    // Basic Auth
    const credentials = Buffer.from(`${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`).toString('base64');

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Basic ${credentials}`,
        'User-Agent': 'Next.js Store API',
      },
      cache: 'no-store',
    });

    console.log('📊 [API] Product response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ [API] Failed to fetch product:', response.status);
      console.error('❌ [API] Error response:', errorText.substring(0, 200));
      
      return NextResponse.json(
        { error: `Failed to fetch product: ${response.status} ${response.statusText}` },
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

    const rawProduct = await response.json();
    console.log('✅ [API] Product found:', rawProduct.id, rawProduct.name);

    // 转换为 Store API 格式
    const product = transformProduct(rawProduct);

    return NextResponse.json(product);
  } catch (error) {
    console.error('❌ [API] Error fetching product:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch product' },
      { status: 500 }
    );
  }
}
