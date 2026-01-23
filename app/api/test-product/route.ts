import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id') || '109';

  try {
    const url = `https://linexpv.com/wp-json/wc/store/v1/products/${id}`;
    console.log('Testing URL:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      cache: 'no-store',
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({
        success: false,
        status: response.status,
        error: errorText,
      }, { status: 500 });
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      status: response.status,
      product: {
        id: data.id,
        name: data.name,
        slug: data.slug,
      },
      full_response: data,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
