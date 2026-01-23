import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const WORDPRESS_BASE_URL = 'https://linexpv.com/wp';

export async function GET() {
  try {
    const url = `${WORDPRESS_BASE_URL}/wp-json/wc/store/v1/products/categories?per_page=100`;
    
    console.log('🔍 [API] Fetching categories from:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Next.js Store API',
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

    // Filter categories: only children of parent=19
    const filteredCategories = categories.filter((cat: any) => cat.parent === 19);
    console.log('✅ [API] Filtered categories (parent=19):', filteredCategories.length);

    return NextResponse.json(filteredCategories);
  } catch (error) {
    console.error('❌ [API] Error fetching categories:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
