/**
 * Stripe PaymentIntent 创建 API
 * 
 * POST /api/stripe/payment-intent
 * 
 * 功能：
 * - 创建 PaymentIntent
 * - 返回 client_secret 给前端
 * - 将订单信息存储在 metadata 中
 */

import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    // 检查环境变量
    const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

    if (!STRIPE_SECRET_KEY) {
      console.error('❌ [stripe/payment-intent] STRIPE_SECRET_KEY not configured');
      return NextResponse.json(
        { error: 'Stripe not configured' },
        { status: 500 }
      );
    }

    // 动态导入 Stripe
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: '2024-12-18.acacia',
    });

    // 解析请求体
    const body = await request.json();
    const { items, billingAddress, shippingAddress, amount, customerId } = body;

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

    // 计算总金额（如果前端没有传递）
    let totalAmount = amount;
    if (!totalAmount) {
      const subtotal = items.reduce((sum: number, item: any) => {
        return sum + (item.price || 0) * (item.quantity || 1);
      }, 0);
      const tax = subtotal * 0.21; // 21% VAT
      const shipping = subtotal > 100 ? 0 : 10;
      totalAmount = subtotal + tax + shipping;
    }

    // 转换为分（Stripe 使用最小货币单位）
    const amountInCents = Math.round(totalAmount * 100);

    // 创建 PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'eur',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        // 存储 WooCommerce customer ID（如果已登录）
        customer_id: customerId ? String(customerId) : '',
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
        total: totalAmount.toFixed(2),
      },
      receipt_email: billingAddress.email,
    });

    console.log('✅ [stripe/payment-intent] PaymentIntent created:', paymentIntent.id);

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error: any) {
    console.error('❌ [stripe/payment-intent] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}
