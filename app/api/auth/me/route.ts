import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const WC_BASE_URL = process.env.WC_BASE_URL || 'https://linexpv.com';
const WC_CONSUMER_KEY = process.env.WC_CONSUMER_KEY || '';
const WC_CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET || '';

/**
 * 获取当前登录用户信息
 * 通过 customer ID 查询用户详情
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

    if (!tokenData.id || !tokenData.email) {
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

    // 查询用户最新信息
    const baseUrl = WC_BASE_URL.replace(/\/wp\/?$/, '').replace(/\/$/, '');
    const url = `${baseUrl}/wp/wp-json/wc/v3/customers/${tokenData.id}`;
    
    const credentials = Buffer.from(`${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`).toString('base64');

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${credentials}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const customer = await response.json();

    return NextResponse.json({
      customer: {
        id: customer.id,
        email: customer.email,
        username: customer.username,
        firstName: customer.first_name,
        lastName: customer.last_name,
        displayName: customer.first_name 
          ? `${customer.first_name} ${customer.last_name}`.trim() 
          : customer.username,
        avatar: customer.avatar_url,
        billing: customer.billing,
        shipping: customer.shipping,
      },
    });
  } catch (error) {
    console.error('❌ [auth/me] Error:', error);
    return NextResponse.json(
      { error: 'Failed to get user info' },
      { status: 500 }
    );
  }
}
