import { NextRequest, NextResponse } from 'next/server';
import { sendAdminNewRegistrationEmail } from '@/lib/notify-registration';

export const runtime = 'nodejs';

const WC_BASE_URL = process.env.WC_BASE_URL || 'https://linexpv.com';
const WC_CONSUMER_KEY = process.env.WC_CONSUMER_KEY || '';
const WC_CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET || '';

/** WooCommerce 客户 meta：account_status = pending | approved */
export const ACCOUNT_STATUS_META_KEY = 'account_status';
export const ACCOUNT_STATUS_PENDING = 'pending';
export const ACCOUNT_STATUS_APPROVED = 'approved';

interface RegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  username?: string;
}

export async function POST(request: NextRequest) {
  try {
    // 检查 WooCommerce API 凭证
    if (!WC_CONSUMER_KEY || !WC_CONSUMER_SECRET) {
      console.error('❌ [auth/register] WooCommerce API credentials not configured');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const body: RegisterRequest = await request.json();
    const { email, password, firstName, lastName, username } = body;

    // 验证必填字段
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // 验证密码长度
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // 构建 WooCommerce Customer 请求
    const baseUrl = WC_BASE_URL.replace(/\/wp\/?$/, '').replace(/\/$/, '');
    const url = `${baseUrl}/wp-json/wc/v3/customers`;

    console.log('🔍 [auth/register] Creating customer:', email);

    // Basic Auth
    const credentials = Buffer.from(`${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`).toString('base64');

    const customerData = {
      email,
      username: username || email.split('@')[0], // 如果没有用户名，用邮箱前缀
      password,
      first_name: firstName || '',
      last_name: lastName || '',
      // 待审核：创建时写入 meta，审核通过后改为 approved
      meta_data: [
        { key: ACCOUNT_STATUS_META_KEY, value: ACCOUNT_STATUS_PENDING },
      ],
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${credentials}`,
      },
      body: JSON.stringify(customerData),
    });

    const responseText = await response.text();

    if (!response.ok) {
      console.error('❌ [auth/register] WooCommerce error:', response.status, responseText);
      
      // 解析 WooCommerce 错误
      try {
        const errorData = JSON.parse(responseText);
        if (errorData.code === 'registration-error-email-exists') {
          return NextResponse.json(
            { error: 'This email is already registered' },
            { status: 409 }
          );
        }
        if (errorData.code === 'registration-error-username-exists') {
          return NextResponse.json(
            { error: 'This username is already taken' },
            { status: 409 }
          );
        }
        return NextResponse.json(
          { error: errorData.message || 'Registration failed' },
          { status: response.status }
        );
      } catch {
        return NextResponse.json(
          { error: 'Registration failed' },
          { status: response.status }
        );
      }
    }

    const customer = JSON.parse(responseText);
    console.log('✅ [auth/register] Customer created (pending):', customer.id, customer.email);

    // 通知管理员：有新注册，需审核通过后用户才能登录
    await sendAdminNewRegistrationEmail({
      email: customer.email,
      firstName: customer.first_name,
      lastName: customer.last_name,
      displayName: customer.first_name
        ? `${customer.first_name} ${customer.last_name}`.trim()
        : customer.username,
    });

    // 返回成功，不返回 token；前端提示“等待审核”
    return NextResponse.json({
      success: true,
      pending: true,
      message: 'Registration successful. Your account is pending approval. We will notify you once approved.',
      customer: {
        id: customer.id,
        email: customer.email,
        username: customer.username,
        firstName: customer.first_name,
        lastName: customer.last_name,
        displayName: customer.first_name 
          ? `${customer.first_name} ${customer.last_name}`.trim() 
          : customer.username,
      },
    });
  } catch (error) {
    console.error('❌ [auth/register] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Registration failed' },
      { status: 500 }
    );
  }
}
