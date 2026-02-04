/**
 * WooCommerce REST API 客户端
 * 
 * 用于服务器端调用 WooCommerce REST API 创建订单
 * 使用 Basic Auth (Consumer Key / Consumer Secret)
 */

const WC_BASE_URL = process.env.WC_BASE_URL || '';
const WC_CONSUMER_KEY = process.env.WC_CONSUMER_KEY || '';
const WC_CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET || '';

/**
 * 验证环境变量并返回缺失的变量列表
 */
function validateEnvVars(): string[] {
  const missing: string[] = [];
  if (!WC_BASE_URL) missing.push('WC_BASE_URL');
  if (!WC_CONSUMER_KEY) missing.push('WC_CONSUMER_KEY');
  if (!WC_CONSUMER_SECRET) missing.push('WC_CONSUMER_SECRET');
  return missing;
}

/**
 * Normalize WC_BASE_URL: 移除末尾的 /wp（如果存在）
 */
function normalizeBaseUrl(url: string): string {
  return url.replace(/\/wp\/?$/, '').replace(/\/$/, '');
}

/**
 * 发送请求到 WooCommerce REST API
 */
async function wooRequest(
  path: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: any
): Promise<any> {
  const missing = validateEnvVars();
  if (missing.length > 0) {
    const missingList = missing.join(', ');
    console.error(`❌ [woo] Missing environment variables: ${missingList}`);
    throw new Error(`WooCommerce API credentials not configured. Missing: ${missingList}`);
  }

  // Normalize base URL: 移除可能的 /wp 后缀
  const baseUrl = normalizeBaseUrl(WC_BASE_URL);
  const url = `${baseUrl}/wp-json/wc/v3${path}`;
  
  console.log(`🔍 [woo] Request: ${method} ${url}`);
  
  // Basic Auth
  const credentials = Buffer.from(`${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`).toString('base64');
  
  const headers: HeadersInit = {
    'Authorization': `Basic ${credentials}`,
    'Content-Type': 'application/json',
  };

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const contentType = response.headers.get('content-type') || '';
    
    // 检查 content-type
    if (!contentType.includes('application/json')) {
      const responseText = await response.text();
      console.error(`❌ [woo] Response is not JSON: ${method} ${path}`);
      console.error(`❌ [woo] Status: ${response.status} ${response.statusText}`);
      console.error(`❌ [woo] Content-Type: ${contentType}`);
      console.error(`❌ [woo] Response (first 200 chars): ${responseText.substring(0, 200)}`);
      throw new Error(`Expected JSON but got ${contentType}. Status: ${response.status}`);
    }

    const responseText = await response.text();
    
    if (!response.ok) {
      console.error(`❌ [woo] Request failed: ${method} ${path}`);
      console.error(`❌ [woo] Status: ${response.status} ${response.statusText}`);
      console.error(`❌ [woo] Response: ${responseText.substring(0, 500)}`);
      throw new Error(`WooCommerce API error: ${response.status} - ${responseText.substring(0, 200)}`);
    }

    return responseText ? JSON.parse(responseText) : {};
  } catch (error) {
    console.error(`❌ [woo] Request error: ${method} ${path}`, error);
    throw error;
  }
}

/**
 * WooCommerce 订单 payload 类型
 */
export interface WooOrderPayload {
  payment_method: string;
  payment_method_title: string;
  set_paid: boolean;
  customer_id?: number; // WooCommerce 客户 ID（已登录用户）
  billing: {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    company?: string;
    address_1: string;
    city: string;
    postcode: string;
    country: string;
  };
  shipping: {
    first_name: string;
    last_name: string;
    company?: string;
    address_1: string;
    city: string;
    postcode: string;
    country: string;
  };
  line_items: Array<{
    product_id?: number;
    name: string;
    quantity: number;
    total: string; // 格式: "145.20" (欧元字符串)
    subtotal?: string;
  }>;
  total: string; // 格式: "145.20" (欧元字符串)
  currency: string;
}

/**
 * 创建 WooCommerce 订单
 */
export async function createWooOrder(payload: WooOrderPayload): Promise<any> {
  console.log('📦 [woo] Creating WooCommerce order...');
  console.log('📦 [woo] Payload:', JSON.stringify(payload, null, 2));
  
  try {
    const order = await wooRequest('/orders', 'POST', payload);
    console.log('✅ [woo] Order created successfully:', order.id);
    return order;
  } catch (error) {
    console.error('❌ [woo] Failed to create order:', error);
    throw error;
  }
}
