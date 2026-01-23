import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const WORDPRESS_BASE_URL = 'https://linexpv.com/wp';

export async function GET() {
  const results: any = {
    timestamp: new Date().toISOString(),
    baseUrl: WORDPRESS_BASE_URL,
    tests: [],
  };

  // Test 1: Check if WordPress site is reachable
  try {
    const response = await fetch(WORDPRESS_BASE_URL, {
      method: 'HEAD',
      cache: 'no-store',
    });
    results.tests.push({
      name: 'WordPress Site Reachable',
      url: WORDPRESS_BASE_URL,
      status: response.status,
      success: response.ok,
    });
  } catch (error) {
    results.tests.push({
      name: 'WordPress Site Reachable',
      url: WORDPRESS_BASE_URL,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }

  // Test 2: Check if WordPress REST API exists
  try {
    const response = await fetch(`${WORDPRESS_BASE_URL}/wp-json/`, {
      method: 'GET',
      cache: 'no-store',
    });
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');
    
    results.tests.push({
      name: 'WordPress REST API Base',
      url: `${WORDPRESS_BASE_URL}/wp-json/`,
      status: response.status,
      contentType,
      isJson,
      success: response.ok && isJson,
    });
  } catch (error) {
    results.tests.push({
      name: 'WordPress REST API Base',
      url: `${WORDPRESS_BASE_URL}/wp-json/`,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }

  // Test 3: Check WooCommerce Store API Categories
  try {
    const response = await fetch(`${WORDPRESS_BASE_URL}/wp-json/wc/store/v1/products/categories`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');
    let bodyPreview = '';
    
    if (response.ok) {
      try {
        const data = await response.json();
        bodyPreview = `Found ${Array.isArray(data) ? data.length : 'unknown'} items`;
      } catch {
        const text = await response.text();
        bodyPreview = text.substring(0, 200);
      }
    } else {
      const text = await response.text();
      bodyPreview = text.substring(0, 200);
    }
    
    results.tests.push({
      name: 'WooCommerce Store API - Categories',
      url: `${WORDPRESS_BASE_URL}/wp-json/wc/store/v1/products/categories`,
      status: response.status,
      contentType,
      isJson,
      bodyPreview,
      success: response.ok && isJson,
    });
  } catch (error) {
    results.tests.push({
      name: 'WooCommerce Store API - Categories',
      url: `${WORDPRESS_BASE_URL}/wp-json/wc/store/v1/products/categories`,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }

  // Test 4: Check WooCommerce Store API Products
  try {
    const response = await fetch(`${WORDPRESS_BASE_URL}/wp-json/wc/store/v1/products?per_page=1`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');
    let bodyPreview = '';
    
    if (response.ok) {
      try {
        const data = await response.json();
        bodyPreview = `Found ${Array.isArray(data) ? data.length : 'unknown'} items`;
      } catch {
        const text = await response.text();
        bodyPreview = text.substring(0, 200);
      }
    } else {
      const text = await response.text();
      bodyPreview = text.substring(0, 200);
    }
    
    results.tests.push({
      name: 'WooCommerce Store API - Products',
      url: `${WORDPRESS_BASE_URL}/wp-json/wc/store/v1/products`,
      status: response.status,
      contentType,
      isJson,
      bodyPreview,
      success: response.ok && isJson,
    });
  } catch (error) {
    results.tests.push({
      name: 'WooCommerce Store API - Products',
      url: `${WORDPRESS_BASE_URL}/wp-json/wc/store/v1/products`,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }

  // Summary
  const successCount = results.tests.filter((t: any) => t.success).length;
  const totalCount = results.tests.length;
  results.summary = {
    total: totalCount,
    successful: successCount,
    failed: totalCount - successCount,
    allPassed: successCount === totalCount,
  };

  return NextResponse.json(results, { status: 200 });
}
