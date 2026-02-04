/**
 * Stripe Webhook 处理 API
 * 
 * POST /api/stripe/webhook
 * 
 * 功能：
 * - 验证 Stripe webhook 签名
 * - 处理 payment_intent.succeeded 事件（内嵌支付）
 * - 处理 checkout.session.completed 事件（跳转支付，向后兼容）
 * - 调用 WooCommerce API 创建订单
 */

import { NextRequest, NextResponse } from 'next/server';
import { createWooOrder, type WooOrderPayload } from '@/lib/woo';

export const runtime = 'nodejs'; // 使用 Node.js runtime，确保可以读取 raw body

/**
 * 从 metadata 创建 WooCommerce 订单
 */
async function createOrderFromMetadata(
  metadata: any,
  customerEmail: string | null,
  amountTotal: number | null
): Promise<{ orderId: number } | { error: string }> {
  try {
    // 解析 metadata
    const cart = metadata?.cart ? JSON.parse(metadata.cart) : [];
    const billing = metadata?.billing ? JSON.parse(metadata.billing) : {};
    const shipping = metadata?.shipping ? JSON.parse(metadata.shipping) : billing;
    
    // 获取 customer_id（如果用户已登录）
    const customerId = metadata?.customer_id ? parseInt(metadata.customer_id) : null;
    
    // 计算总金额：优先使用 metadata，否则从 amount_total 计算（Stripe 返回的是分）
    let total = 0;
    if (metadata?.total) {
      total = parseFloat(metadata.total);
    } else if (amountTotal) {
      total = amountTotal / 100; // Stripe 返回的是分，转换为元
    }

    if (!cart || cart.length === 0) {
      console.error('❌ [stripe/webhook] No cart items in metadata');
      return { error: 'No cart items found' };
    }

    // 构建 WooCommerce 订单 payload
    const orderPayload: WooOrderPayload = {
      payment_method: 'stripe',
      payment_method_title: 'Stripe',
      set_paid: true,
      // 如果有 customer_id，关联到已注册用户
      ...(customerId && customerId > 0 ? { customer_id: customerId } : {}),
      billing: {
        first_name: billing.firstName || '',
        last_name: billing.lastName || '',
        email: billing.email || customerEmail || '',
        phone: billing.phone || '',
        company: billing.company || '',
        address_1: billing.address || '',
        city: billing.city || '',
        postcode: billing.postcode || '',
        country: billing.country || 'NL',
      },
      shipping: {
        first_name: shipping.firstName || billing.firstName || '',
        last_name: shipping.lastName || billing.lastName || '',
        company: shipping.company || billing.company || '',
        address_1: shipping.address || billing.address || '',
        city: shipping.city || billing.city || '',
        postcode: shipping.postcode || billing.postcode || '',
        country: shipping.country || billing.country || 'NL',
      },
      line_items: cart.map((item: any) => {
        // 计算单个商品总价（欧元字符串格式）
        const itemTotal = ((item.price || 0) * (item.quantity || 1)).toFixed(2);
        
        // 构建 line_item：优先使用 product_id，如果没有则只用 name+total+quantity
        const lineItem: any = {
          name: item.name || `Product ${item.productId}`,
          quantity: item.quantity || 1,
          total: itemTotal,
          subtotal: itemTotal,
        };
        
        // 只在 product_id 存在且为有效数字时添加
        if (item.productId && typeof item.productId === 'number' && item.productId > 0) {
          lineItem.product_id = item.productId;
        }
        
        return lineItem;
      }),
      total: total.toFixed(2), // 欧元字符串格式
      currency: 'EUR',
    };

    console.log('📦 [stripe/webhook] Creating WooCommerce order...');
    console.log('📦 [stripe/webhook] Customer ID:', customerId || 'Guest');
    console.log('📦 [stripe/webhook] Order payload:', JSON.stringify(orderPayload, null, 2));

    // 创建 WooCommerce 订单
    const wooOrder = await createWooOrder(orderPayload);

    console.log('✅ [stripe/webhook] WooCommerce order created:', wooOrder.id);

    return { orderId: wooOrder.id };
  } catch (error: any) {
    console.error('❌ [stripe/webhook] Error creating WooCommerce order:', error);
    return { error: error.message };
  }
}

export async function POST(request: NextRequest) {
  try {
    const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
    const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

    const missing: string[] = [];
    if (!STRIPE_WEBHOOK_SECRET) missing.push('STRIPE_WEBHOOK_SECRET');
    if (!STRIPE_SECRET_KEY) missing.push('STRIPE_SECRET_KEY');
    
    if (missing.length > 0) {
      const missingList = missing.join(', ');
      console.error(`❌ [stripe/webhook] Missing environment variables: ${missingList}`);
      return NextResponse.json(
        { error: `Webhook not configured. Missing: ${missingList}` },
        { status: 500 }
      );
    }

    // 获取原始 body（用于签名验证）
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      console.error('❌ [stripe/webhook] Missing stripe-signature header');
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      );
    }

    // 动态导入 Stripe
    let Stripe;
    try {
      Stripe = (await import('stripe')).default;
    } catch (error: any) {
      if (error.code === 'MODULE_NOT_FOUND' || error.message?.includes("Can't resolve 'stripe'")) {
        console.error('❌ [stripe/webhook] Stripe package not installed. Please run: npm install stripe');
        return NextResponse.json(
          { error: 'Stripe package not installed. Please run: npm install stripe' },
          { status: 500 }
        );
      }
      throw error;
    }
    
    const stripe = new Stripe(STRIPE_SECRET_KEY as string, {
      apiVersion: '2025-02-24.acacia',
    });

    // 验证签名
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        STRIPE_WEBHOOK_SECRET as string
      );
    } catch (err: any) {
      console.error('❌ [stripe/webhook] Signature verification failed:', err.message);
      return NextResponse.json(
        { error: `Webhook signature verification failed: ${err.message}` },
        { status: 400 }
      );
    }

    console.log(`📨 [stripe/webhook] Received event: ${event.type}`);

    // 处理 payment_intent.succeeded 事件（内嵌支付）
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as any;
      
      console.log('✅ [stripe/webhook] Payment intent succeeded:', paymentIntent.id);

      const result = await createOrderFromMetadata(
        paymentIntent.metadata,
        paymentIntent.receipt_email,
        paymentIntent.amount
      );

      if ('error' in result) {
        // 返回 200 但记录错误，避免 Stripe 重试
        return NextResponse.json({
          received: true,
          error: result.error,
        });
      }

      return NextResponse.json({
        received: true,
        orderId: result.orderId,
      });
    }

    // 处理 checkout.session.completed 事件（跳转支付，向后兼容）
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any;
      
      console.log('✅ [stripe/webhook] Checkout session completed:', session.id);

      const result = await createOrderFromMetadata(
        session.metadata,
        session.customer_email,
        session.amount_total
      );

      if ('error' in result) {
        // 返回 200 但记录错误，避免 Stripe 重试
        return NextResponse.json({
          received: true,
          error: result.error,
        });
      }

      return NextResponse.json({
        received: true,
        orderId: result.orderId,
      });
    }

    // 其他事件类型，返回成功但不处理
    console.log('ℹ️ [stripe/webhook] Unhandled event type:', event.type);
    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('❌ [stripe/webhook] Unexpected error:', error);
    return NextResponse.json(
      { error: error.message || 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
