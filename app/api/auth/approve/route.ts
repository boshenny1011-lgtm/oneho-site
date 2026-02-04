import { NextRequest, NextResponse } from 'next/server';
import { ACCOUNT_STATUS_META_KEY, ACCOUNT_STATUS_APPROVED } from '../register/route';

export const runtime = 'nodejs';

const WC_BASE_URL = process.env.WC_BASE_URL || 'https://linexpv.com';
const WC_CONSUMER_KEY = process.env.WC_CONSUMER_KEY || '';
const WC_CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET || '';
const ADMIN_SECRET = process.env.ADMIN_APPROVE_SECRET || process.env.ADMIN_SECRET || '';

/**
 * 管理员审核通过：将客户 meta account_status 改为 approved
 * POST /api/auth/approve
 * Body: { customerId: number }
 * Header: Authorization: Bearer <ADMIN_APPROVE_SECRET>
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const bearer = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : '';

    if (!ADMIN_SECRET || bearer !== ADMIN_SECRET) {
      console.error('❌ [auth/approve] Unauthorized: missing or invalid ADMIN_APPROVE_SECRET');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!WC_CONSUMER_KEY || !WC_CONSUMER_SECRET) {
      return NextResponse.json(
        { error: 'WooCommerce not configured' },
        { status: 500 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const customerId = body.customerId ?? body.customer_id;

    if (!customerId || typeof customerId !== 'number') {
      return NextResponse.json(
        { error: 'customerId (number) is required' },
        { status: 400 }
      );
    }

    const baseUrl = WC_BASE_URL.replace(/\/wp\/?$/, '').replace(/\/$/, '');
    const url = `${baseUrl}/wp/wp-json/wc/v3/customers/${customerId}`;
    const credentials = Buffer.from(`${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`).toString('base64');

    // 先获取当前 meta，再更新 account_status
    const getRes = await fetch(url, {
      method: 'GET',
      headers: { 'Authorization': `Basic ${credentials}` },
    });

    if (!getRes.ok) {
      const err = await getRes.text();
      console.error('❌ [auth/approve] Failed to get customer:', getRes.status, err);
      return NextResponse.json(
        { error: 'Customer not found or API error' },
        { status: getRes.status }
      );
    }

    const customer = await getRes.json();
    const meta_data = Array.isArray(customer.meta_data) ? [...customer.meta_data] : [];
    const idx = meta_data.findIndex((m: any) => m.key === ACCOUNT_STATUS_META_KEY);

    if (idx >= 0) {
      meta_data[idx].value = ACCOUNT_STATUS_APPROVED;
    } else {
      meta_data.push({ key: ACCOUNT_STATUS_META_KEY, value: ACCOUNT_STATUS_APPROVED });
    }

    const patchRes = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ meta_data }),
    });

    if (!patchRes.ok) {
      const err = await patchRes.text();
      console.error('❌ [auth/approve] Failed to update customer:', patchRes.status, err);
      return NextResponse.json(
        { error: 'Failed to approve customer' },
        { status: patchRes.status }
      );
    }

    console.log('✅ [auth/approve] Customer approved:', customerId);
    return NextResponse.json({
      success: true,
      message: 'Customer approved. They can now log in and place orders.',
      customerId,
    });
  } catch (error) {
    console.error('❌ [auth/approve] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Server error' },
      { status: 500 }
    );
  }
}
