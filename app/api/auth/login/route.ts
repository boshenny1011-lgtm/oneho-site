import { NextRequest, NextResponse } from 'next/server';
import { ACCOUNT_STATUS_META_KEY, ACCOUNT_STATUS_APPROVED } from '../register/route';

export const runtime = 'nodejs';

const WC_BASE_URL = process.env.WC_BASE_URL || 'https://linexpv.com';
const WC_CONSUMER_KEY = process.env.WC_CONSUMER_KEY || '';
const WC_CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET || '';

interface LoginRequest {
  email: string;
  password: string;
}

/**
 * 从 WooCommerce 客户 meta_data 中读取 account_status
 */
function getAccountStatus(customer: any): string | null {
  const meta = customer.meta_data;
  if (!Array.isArray(meta)) return null;
  const item = meta.find((m: any) => m.key === ACCOUNT_STATUS_META_KEY);
  return item?.value ?? null;
}

/**
 * 登录流程：
 * 1. 用 JWT 验证用户名密码（WordPress JWT 插件）
 * 2. 获取该用户的 WooCommerce 客户数据，检查 meta account_status
 * 3. 若为 pending → 返回 403（前端提示：等待审核）
 * 4. 若为 approved 或未设置 → 返回 token 和客户信息
 */
export async function POST(request: NextRequest) {
  try {
    if (!WC_CONSUMER_KEY || !WC_CONSUMER_SECRET) {
      console.error('❌ [auth/login] WooCommerce API credentials not configured');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const body: LoginRequest = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const baseUrl = WC_BASE_URL.replace(/\/wp\/?$/, '').replace(/\/$/, '');
    const credentials = Buffer.from(`${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`).toString('base64');

    console.log('🔍 [auth/login] Attempting login for:', email);

    // 1) 先查 WooCommerce 客户（按邮箱），拿到 customer id 和 meta
    const searchUrl = `${baseUrl}/wp-json/wc/v3/customers?email=${encodeURIComponent(email)}`;
    const searchResponse = await fetch(searchUrl, {
      method: 'GET',
      headers: { 'Authorization': `Basic ${credentials}` },
    });

    if (!searchResponse.ok) {
      console.error('❌ [auth/login] Failed to search customers:', searchResponse.status);
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const customers = await searchResponse.json();
    if (!customers?.length) {
      console.log('❌ [auth/login] User not found:', email);
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const customer = customers[0];

    // 2) 检查 account_status：pending → 403（等待审核）
    const accountStatus = getAccountStatus(customer);
    if (accountStatus && accountStatus !== ACCOUNT_STATUS_APPROVED) {
      console.log('⏳ [auth/login] Account pending approval:', email);
      return NextResponse.json(
        {
          error: 'Your account is pending approval. We will notify you once approved.',
          code: 'pending_approval',
        },
        { status: 403 }
      );
    }

    // 3) 用 JWT 验证密码（WordPress 需安装 JWT Authentication for WP REST API）
    const jwtUrl = `${baseUrl}/wp-json/jwt-auth/v1/token`;
    const jwtResponse = await fetch(jwtUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: email,
        password: password,
      }),
    });

    if (!jwtResponse.ok) {
      const errText = await jwtResponse.text();
      console.error('❌ [auth/login] JWT failed:', jwtResponse.status, errText);
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const jwtData = await jwtResponse.json();
    const token = jwtData.token;

    if (!token) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    console.log('✅ [auth/login] Login successful:', customer.id);

    return NextResponse.json({
      success: true,
      token,
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
      },
    });
  } catch (error) {
    console.error('❌ [auth/login] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Login failed' },
      { status: 500 }
    );
  }
}
