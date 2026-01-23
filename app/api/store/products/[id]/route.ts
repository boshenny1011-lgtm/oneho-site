import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const WORDPRESS_BASE_URL = 'https://linexpv.com/wp';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const productId = resolvedParams.id;

    const url = `${WORDPRESS_BASE_URL}/wp-json/wc/store/v1/products/${productId}`;

    console.log('🔍 [API] Fetching product:', productId);
    console.log('🔍 [API] Full URL:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
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

    const product = await response.json();
    console.log('✅ [API] Product found:', product.id, product.name);

    return NextResponse.json(product);
  } catch (error) {
    console.error('❌ [API] Error fetching product:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch product' },
      { status: 500 }
    );
  }
}
