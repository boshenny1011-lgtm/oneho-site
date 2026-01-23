import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const WORDPRESS_BASE_URL = 'https://linexpv.com/wp';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const perPage = searchParams.get('per_page') || '24';
    const page = searchParams.get('page') || '1';

    const url = new URL(`${WORDPRESS_BASE_URL}/wp-json/wc/store/v1/products`);
    if (category) {
      url.searchParams.set('category', category);
    }
    url.searchParams.set('per_page', perPage);
    url.searchParams.set('page', page);

    console.log('🔍 [API] Fetching products from:', url.toString());

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
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

    const products = await response.json();
    console.log('✅ [API] Fetched products:', products.length);

    return NextResponse.json(products);
  } catch (error) {
    console.error('❌ [API] Error fetching products:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
