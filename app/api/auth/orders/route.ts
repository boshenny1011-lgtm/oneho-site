import { NextRequest, NextResponse } from 'next/server';
import { WORDPRESS_BASE_URL, normalizeWordPressUrl } from '@/lib/wp';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const WC_CONSUMER_KEY = process.env.WC_CONSUMER_KEY || '';
const WC_CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET || '';

/**
 * 获取用户订单历史
 */
export async function GET(request: NextRequest) {
  try {
    // 从 header 获取 token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // 解析 token
    let tokenData;
    try {
      tokenData = JSON.parse(Buffer.from(token, 'base64').toString());
    } catch {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    if (!tokenData.id) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // 验证 token 时效（24小时）
    const tokenAge = Date.now() - (tokenData.timestamp || 0);
    if (tokenAge > 24 * 60 * 60 * 1000) {
      return NextResponse.json(
        { error: 'Token expired' },
        { status: 401 }
      );
    }

    // 获取分页参数
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get('page') || '1';
    const perPage = searchParams.get('per_page') || '10';

    const baseUrl = normalizeWordPressUrl(WORDPRESS_BASE_URL);
    const url = `${baseUrl}/wp-json/wc/v3/orders?customer=${tokenData.id}&page=${page}&per_page=${perPage}&orderby=date&order=desc`;
    
    const credentials = Buffer.from(`${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`).toString('base64');

    console.log('🔍 [auth/orders] Fetching orders for customer:', tokenData.id);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${credentials}`,
      },
    });

    if (!response.ok) {
      console.error('❌ [auth/orders] Failed to fetch orders:', response.status);
      return NextResponse.json(
        { error: 'Failed to fetch orders' },
        { status: response.status }
      );
    }

    const orders = await response.json();
    
    // 获取总数（从 header）
    const totalOrders = response.headers.get('X-WP-Total') || '0';
    const totalPages = response.headers.get('X-WP-TotalPages') || '1';

    console.log('✅ [auth/orders] Fetched orders:', orders.length);

    // 简化订单数据
    const simplifiedOrders = orders.map((order: any) => ({
      id: order.id,
      number: order.number,
      status: order.status,
      dateCreated: order.date_created,
      total: order.total,
      currency: order.currency,
      paymentMethod: order.payment_method_title,
      lineItems: order.line_items.map((item: any) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        total: item.total,
        image: item.image?.src,
      })),
      billing: {
        firstName: order.billing.first_name,
        lastName: order.billing.last_name,
        email: order.billing.email,
        address: order.billing.address_1,
        city: order.billing.city,
        country: order.billing.country,
      },
      shipping: {
        firstName: order.shipping.first_name,
        lastName: order.shipping.last_name,
        address: order.shipping.address_1,
        city: order.shipping.city,
        country: order.shipping.country,
      },
    }));

    return NextResponse.json({
      orders: simplifiedOrders,
      pagination: {
        page: parseInt(page),
        perPage: parseInt(perPage),
        total: parseInt(totalOrders),
        totalPages: parseInt(totalPages),
      },
    });
  } catch (error) {
    console.error('❌ [auth/orders] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
