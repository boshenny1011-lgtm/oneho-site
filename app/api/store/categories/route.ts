import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const WC_BASE_URL = process.env.WC_BASE_URL || 'https://linexpv.com';
const WC_CONSUMER_KEY = process.env.WC_CONSUMER_KEY || '';
const WC_CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET || '';

export async function GET() {
  try {
    // 检查 WooCommerce API 凭证
    if (!WC_CONSUMER_KEY || !WC_CONSUMER_SECRET) {
      console.error('❌ [API] WooCommerce API credentials not configured');
      return NextResponse.json(
        { error: 'WooCommerce API credentials not configured' },
        { status: 500 }
      );
    }

    const baseUrl = WC_BASE_URL.replace(/\/wp\/?$/, '').replace(/\/$/, '');
    const url = `${baseUrl}/wp-json/wc/v3/products/categories?per_page=100`;
    const origin = baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`;

    console.log('🔍 [API] Fetching categories from:', url);

    // Basic Auth
    const credentials = Buffer.from(`${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`).toString('base64');

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Basic ${credentials}`,
        'User-Agent': 'Mozilla/5.0 (compatible; LinexPv-Store/1.0)',
        'Referer': `${origin}/`,
        'Origin': origin,
      },
      cache: 'no-store',
    });

    console.log('📊 [API] Categories response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ [API] Failed to fetch categories:', response.status);
      console.error('❌ [API] Error response:', errorText.substring(0, 200));
      
      return NextResponse.json(
        { error: `Failed to fetch categories: ${response.status} ${response.statusText}` },
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

    const categories = await response.json();
    console.log('✅ [API] Fetched categories:', categories.length);

    // Filter categories: only children of parent=19 (ONEHO)
    const filteredCategories = categories.filter((cat: any) => cat.parent === 19);
    console.log('✅ [API] Filtered categories (parent=19):', filteredCategories.length);

    // 转换为 Store API 格式
    const transformedCategories = filteredCategories.map((cat: any) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      parent: cat.parent,
      description: cat.description,
      image: cat.image,
      count: cat.count,
    }));

    return NextResponse.json(transformedCategories);
  } catch (error) {
    console.error('❌ [API] Error fetching categories:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
