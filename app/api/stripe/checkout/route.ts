/**
 * Stripe Checkout Session 创建 API
 * 
 * POST /api/stripe/checkout
 * 
 * 功能：
 * - 接收购物车和客户信息
 * - 创建 Stripe Checkout Session
 * - Bolt 环境：返回 mock URL
 */

import { NextRequest, NextResponse } from 'next/server';

// 环境检测（服务器端）
function isBoltEnvironment(): boolean {
  return process.env.NEXT_PUBLIC_USE_MOCK === 'true';
}

export const runtime = 'nodejs'; // 使用 Node.js runtime，避免 Edge 限制

export async function POST(request: NextRequest) {
  try {
    // Bolt 环境：返回 mock
    if (isBoltEnvironment()) {
      console.log('🔵 [stripe/checkout] Bolt environment - returning mock');
      return NextResponse.json({
        url: '/checkout/success?session_id=mock_session_' + Date.now(),
      });
    }

    // 检查环境变量
    const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
    const NEXT_PUBLIC_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    const missing: string[] = [];
    if (!STRIPE_SECRET_KEY) missing.push('STRIPE_SECRET_KEY');
    if (!NEXT_PUBLIC_SITE_URL || NEXT_PUBLIC_SITE_URL === 'http://localhost:3000') {
      console.warn('⚠️ [stripe/checkout] NEXT_PUBLIC_SITE_URL is using default localhost - ensure this is correct for production');
    }
    
    if (missing.length > 0) {
      const missingList = missing.join(', ');
      console.error(`❌ [stripe/checkout] Missing environment variables: ${missingList}`);
      return NextResponse.json(
        { error: `Stripe not configured. Missing: ${missingList}` },
        { status: 500 }
      );
    }

    // 动态导入 Stripe（避免在 Bolt 环境加载）
    let Stripe;
    try {
      Stripe = (await import('stripe')).default;
    } catch (error: any) {
      if (error.code === 'MODULE_NOT_FOUND' || error.message?.includes("Can't resolve 'stripe'")) {
        console.error('❌ [stripe/checkout] Stripe package not installed. Please run: npm install stripe');
        return NextResponse.json(
          { error: 'Stripe package not installed. Please run: npm install stripe' },
          { status: 500 }
        );
      }
      throw error;
    }
    
    // 这里已经在上方校验过 STRIPE_SECRET_KEY 是否存在
    // 为了通过 TypeScript 检查，显式断言为 string
    const stripe = new Stripe(STRIPE_SECRET_KEY as string, {
      apiVersion: '2024-12-18.acacia',
    });

    // 解析请求体
    const body = await request.json();
    const { items, billingAddress, shippingAddress } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Cart items are required' },
        { status: 400 }
      );
    }

    if (!billingAddress) {
      return NextResponse.json(
        { error: 'Billing address is required' },
        { status: 400 }
      );
    }

    // 构建 line_items
    const lineItems = items.map((item: any) => {
      // 价格需要转换为分（Stripe 使用最小货币单位）
      // 假设 item.price 是欧元（如 55.00），需要转换为分（5500）
      const priceInCents = Math.round((item.price || 0) * 100);
      
      return {
        price_data: {
          currency: 'eur',
          product_data: {
            name: item.name || `Product ${item.productId}`,
            description: item.description || '',
          },
          unit_amount: priceInCents,
        },
        quantity: item.quantity || 1,
      };
    });

    // 计算总金额（用于 metadata）
    const subtotal = items.reduce((sum: number, item: any) => {
      return sum + (item.price || 0) * (item.quantity || 1);
    }, 0);
    const tax = subtotal * 0.21; // 21% VAT
    const shipping = subtotal > 100 ? 0 : 10;
    const total = subtotal + tax + shipping;

    // 创建 Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      success_url: `${NEXT_PUBLIC_SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${NEXT_PUBLIC_SITE_URL}/checkout`,
      customer_email: billingAddress.email,
      metadata: {
        // 存储购物车信息（JSON 字符串）
        cart: JSON.stringify(items.map((item: any) => ({
          productId: item.productId,
          quantity: item.quantity,
          name: item.name,
          price: item.price,
        }))),
        // 存储账单地址（JSON 字符串）
        billing: JSON.stringify({
          email: billingAddress.email,
          firstName: billingAddress.firstName,
          lastName: billingAddress.lastName,
          company: billingAddress.company || '',
          vatId: billingAddress.vatId || '',
          phone: billingAddress.phone || '',
          address: billingAddress.address,
          city: billingAddress.city,
          postcode: billingAddress.postcode,
          country: billingAddress.country,
        }),
        // 存储配送地址（JSON 字符串）
        shipping: JSON.stringify(shippingAddress || billingAddress),
        // 存储金额信息
        subtotal: subtotal.toFixed(2),
        tax: tax.toFixed(2),
        shipping: shipping.toFixed(2),
        total: total.toFixed(2),
      },
    });

    console.log('✅ [stripe/checkout] Checkout session created:', session.id);

    return NextResponse.json({
      url: session.url,
    });
  } catch (error: any) {
    console.error('❌ [stripe/checkout] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
