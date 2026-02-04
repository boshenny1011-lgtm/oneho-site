# Stripe + WooCommerce 支付流程代码审计报告

## 🔍 检查结果

### 1. 环境变量读取 ❌ 需要改进

**发现的问题：**
- `lib/woo.ts` 错误信息不够明确，没有列出具体缺失的变量
- `app/api/stripe/checkout/route.ts` 只检查了 `STRIPE_SECRET_KEY`，没有检查 `NEXT_PUBLIC_SITE_URL` 是否合理
- `app/api/stripe/webhook/route.ts` 错误信息不够明确
- 所有地方都没有在启动时验证环境变量，只在运行时检查

**原因：**
- 错误信息太笼统，调试困难
- 没有区分哪些变量缺失

**修复方案：**
- 添加明确的缺失变量检查
- 不打印 secret 全值，只显示前4个字符
- 在关键函数开始时验证所有必需变量

---

### 2. Woo API URL 拼接 ⚠️ 需要修复

**发现的问题：**
- `lib/woo.ts` 第24行：如果 `WC_BASE_URL` 包含 `/wp`，会导致 URL 变成 `https://linexpv.com/wp/wp-json/wc/v3/orders`（错误）
- 没有检查 response content-type，如果返回 text/html 会尝试 JSON.parse 失败
- 错误信息中没有打印 content-type

**原因：**
- 没有 normalize WC_BASE_URL（移除可能的 /wp 后缀）
- 没有验证响应格式

**修复方案：**
- 在构建 URL 前移除 `/wp` 后缀（如果存在）
- 检查 content-type，如果不是 JSON 要明确报错并打印前 200 字符

---

### 3. Stripe Webhook ✅ 基本正确，需要小改进

**发现的问题：**
- ✅ 使用了 `export const runtime = 'nodejs'`（正确）
- ✅ 使用了 `await request.text()` 获取 raw body（正确）
- ✅ 使用了 `stripe.webhooks.constructEvent()` 验签（正确）
- ✅ 验签失败返回 400（正确）
- ⚠️ 错误信息可以更详细（打印缺失的变量名）

**原因：**
- 代码逻辑正确，但错误提示可以更友好

**修复方案：**
- 改进错误信息，明确列出缺失的环境变量（不打印 secret 全值）

---

### 4. 订单创建 Payload ⚠️ 需要修复

**发现的问题：**
- `app/api/stripe/webhook/route.ts` 第122行：`product_id: item.productId` 可能为 undefined
- WooCommerce API 要求：如果有 product_id 就用，没有就只用 name+total+quantity
- 当前代码总是设置 product_id，即使它是 undefined，可能导致 API 错误

**原因：**
- 没有条件判断 product_id 是否存在

**修复方案：**
- 只在 product_id 存在时设置，否则只使用 name+total+quantity

---

## 📝 具体修改 Diff

### 修改 1: lib/woo.ts - 改进环境变量检查和 URL 拼接

```diff
--- a/lib/woo.ts
+++ b/lib/woo.ts
@@ -8,9 +8,25 @@
 const WC_BASE_URL = process.env.WC_BASE_URL || '';
 const WC_CONSUMER_KEY = process.env.WC_CONSUMER_KEY || '';
 const WC_CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET || '';
 
+/**
+ * 验证环境变量并返回缺失的变量列表
+ */
+function validateEnvVars(): string[] {
+  const missing: string[] = [];
+  if (!WC_BASE_URL) missing.push('WC_BASE_URL');
+  if (!WC_CONSUMER_KEY) missing.push('WC_CONSUMER_KEY');
+  if (!WC_CONSUMER_SECRET) missing.push('WC_CONSUMER_SECRET');
+  return missing;
+}
+
+/**
+ * Normalize WC_BASE_URL: 移除末尾的 /wp（如果存在）
+ */
+function normalizeBaseUrl(url: string): string {
+  return url.replace(/\/wp\/?$/, '').replace(/\/$/, '');
+}
+
 /**
  * 发送请求到 WooCommerce REST API
  */
 async function wooRequest(
@@ -18,11 +34,18 @@ async function wooRequest(
   method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
   body?: any
 ): Promise<any> {
-  if (!WC_BASE_URL || !WC_CONSUMER_KEY || !WC_CONSUMER_SECRET) {
-    throw new Error('WooCommerce API credentials not configured');
+  const missing = validateEnvVars();
+  if (missing.length > 0) {
+    const missingList = missing.join(', ');
+    console.error(`❌ [woo] Missing environment variables: ${missingList}`);
+    throw new Error(`WooCommerce API credentials not configured. Missing: ${missingList}`);
   }
 
-  const url = `${WC_BASE_URL.replace(/\/$/, '')}/wp-json/wc/v3${path}`;
+  // Normalize base URL: 移除可能的 /wp 后缀
+  const baseUrl = normalizeBaseUrl(WC_BASE_URL);
+  const url = `${baseUrl}/wp-json/wc/v3${path}`;
+  
+  console.log(`🔍 [woo] Request: ${method} ${url}`);
   
   // Basic Auth
   const credentials = Buffer.from(`${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`).toString('base64');
@@ -34,17 +57,30 @@ async function wooRequest(
   try {
     const response = await fetch(url, {
       method,
       headers,
       body: body ? JSON.stringify(body) : undefined,
     });
 
+    const contentType = response.headers.get('content-type') || '';
+    
+    // 检查 content-type
+    if (!contentType.includes('application/json')) {
+      const responseText = await response.text();
+      console.error(`❌ [woo] Response is not JSON: ${method} ${path}`);
+      console.error(`❌ [woo] Status: ${response.status} ${response.statusText}`);
+      console.error(`❌ [woo] Content-Type: ${contentType}`);
+      console.error(`❌ [woo] Response (first 200 chars): ${responseText.substring(0, 200)}`);
+      throw new Error(`Expected JSON but got ${contentType}. Status: ${response.status}`);
+    }
+
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
```

### 修改 2: app/api/stripe/checkout/route.ts - 改进环境变量检查

```diff
--- a/app/api/stripe/checkout/route.ts
+++ b/app/api/stripe/checkout/route.ts
@@ -31,9 +31,19 @@ export async function POST(request: NextRequest) {
     }
 
     // 检查环境变量
     const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
     const NEXT_PUBLIC_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
 
-    if (!STRIPE_SECRET_KEY) {
-      console.error('❌ [stripe/checkout] STRIPE_SECRET_KEY not configured');
+    const missing: string[] = [];
+    if (!STRIPE_SECRET_KEY) missing.push('STRIPE_SECRET_KEY');
+    if (!NEXT_PUBLIC_SITE_URL || NEXT_PUBLIC_SITE_URL === 'http://localhost:3000') {
+      console.warn('⚠️ [stripe/checkout] NEXT_PUBLIC_SITE_URL is using default localhost - ensure this is correct for production');
+    }
+    
+    if (missing.length > 0) {
+      const missingList = missing.join(', ');
+      console.error(`❌ [stripe/checkout] Missing environment variables: ${missingList}`);
       return NextResponse.json(
-        { error: 'Stripe not configured' },
+        { error: `Stripe not configured. Missing: ${missingList}` },
         { status: 500 }
       );
     }
```

### 修改 3: app/api/stripe/webhook/route.ts - 改进环境变量检查和错误信息

```diff
--- a/app/api/stripe/webhook/route.ts
+++ b/app/api/stripe/webhook/route.ts
@@ -17,13 +17,20 @@ export const runtime = 'nodejs'; // 使用 Node.js runtime，确保可以读取
 
 export async function POST(request: NextRequest) {
   try {
     const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
     const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
 
-    if (!STRIPE_WEBHOOK_SECRET || !STRIPE_SECRET_KEY) {
-      console.error('❌ [stripe/webhook] Stripe credentials not configured');
+    const missing: string[] = [];
+    if (!STRIPE_WEBHOOK_SECRET) missing.push('STRIPE_WEBHOOK_SECRET');
+    if (!STRIPE_SECRET_KEY) missing.push('STRIPE_SECRET_KEY');
+    
+    if (missing.length > 0) {
+      const missingList = missing.join(', ');
+      console.error(`❌ [stripe/webhook] Missing environment variables: ${missingList}`);
+      // 不打印 secret 全值，只显示前4个字符用于调试
+      if (STRIPE_WEBHOOK_SECRET) console.error(`❌ [stripe/webhook] STRIPE_WEBHOOK_SECRET: ${STRIPE_WEBHOOK_SECRET.substring(0, 4)}...`);
+      if (STRIPE_SECRET_KEY) console.error(`❌ [stripe/webhook] STRIPE_SECRET_KEY: ${STRIPE_SECRET_KEY.substring(0, 4)}...`);
       return NextResponse.json(
-        { error: 'Webhook not configured' },
+        { error: `Webhook not configured. Missing: ${missingList}` },
         { status: 500 }
       );
     }
```

### 修改 4: app/api/stripe/webhook/route.ts - 修复 product_id 处理

```diff
--- a/app/api/stripe/webhook/route.ts
+++ b/app/api/stripe/webhook/route.ts
@@ -117,11 +117,16 @@ export async function POST(request: NextRequest) {
           line_items: cart.map((item: any) => {
             // 计算单个商品总价（欧元字符串格式）
             const itemTotal = ((item.price || 0) * (item.quantity || 1)).toFixed(2);
             
-            return {
-              product_id: item.productId, // 如果有 product_id 就用，没有就用 name
-              name: item.name || `Product ${item.productId}`,
+            // 构建 line_item：优先使用 product_id，如果没有则只用 name+total+quantity
+            const lineItem: any = {
+              name: item.name || `Product ${item.productId}`,
               quantity: item.quantity || 1,
               total: itemTotal,
               subtotal: itemTotal,
             };
+            
+            // 只在 product_id 存在且为有效数字时添加
+            if (item.productId && typeof item.productId === 'number' && item.productId > 0) {
+              lineItem.product_id = item.productId;
+            }
+            
+            return lineItem;
           }),
           total: total.toFixed(2), // 欧元字符串格式
           currency: 'EUR',
```

---

## ✅ 本地测试清单

### 前置条件
1. ✅ 确保 `.env.local` 文件存在且格式正确（每行一个 KEY=VALUE）
2. ✅ 安装依赖：`npm install stripe`
3. ✅ 配置环境变量（见下方）

### 环境变量配置（.env.local）

```bash
# WooCommerce REST API
WC_BASE_URL=https://linexpv.com
WC_CONSUMER_KEY=ck_xxx
WC_CONSUMER_SECRET=cs_xxx

# Stripe
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

⚠️ **注意**：
- 每行一个变量，不要连在一行
- `WC_BASE_URL` 不要包含 `/wp`（代码会自动处理）
- `STRIPE_WEBHOOK_SECRET` 先用占位符，Step 3 会用 Stripe CLI 生成

### Step 1: 启动开发服务器

```bash
npm run dev
```

**验证**：
- 服务器启动成功
- 没有环境变量缺失的错误日志

### Step 2: 测试 Checkout（先不管 webhook）

1. 打开浏览器：`http://localhost:3000/checkout`
2. 填写表单：
   - Email: `test@example.com`
   - First Name: `Test`
   - Last Name: `User`
   - Address: `123 Test St`
   - City: `Amsterdam`
   - Postcode: `1012 AB`
   - Country: `NL`
3. 点击 "Pay Now"

**预期结果**：
- ✅ 跳转到 Stripe Hosted Checkout 页面
- ✅ 浏览器 Network 标签中 `/api/stripe/checkout` 返回 `{ "url": "https://checkout.stripe.com/..." }`

**如果失败**：
- 检查浏览器控制台错误
- 检查服务器日志中的错误信息
- 确认 `STRIPE_SECRET_KEY` 正确

### Step 3: 使用 Stripe CLI 测试 Webhook

#### 3.1 安装并登录 Stripe CLI

```bash
# macOS
brew install stripe/stripe-cli/stripe

# 或
npm install -g stripe-cli

# 登录
stripe login
```

#### 3.2 转发 Webhook 到本地

在**新终端**运行：

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

**重要输出**：
```
> Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxx
```

#### 3.3 更新环境变量

1. 复制上面输出的 `whsec_...`
2. 更新 `.env.local` 中的 `STRIPE_WEBHOOK_SECRET`
3. **重启开发服务器**（环境变量更改需要重启）

```bash
# 停止当前服务器 (Ctrl+C)
# 重新启动
npm run dev
```

### Step 4: 完成测试支付

1. 再次访问：`http://localhost:3000/checkout`
2. 填写表单，点击 "Pay Now"
3. 在 Stripe Checkout 页面使用测试卡：
   - **卡号**：`4242 4242 4242 4242`
   - **过期日期**：`12/25`（任意未来日期）
   - **CVC**：`123`（任意3位数字）
   - **ZIP**：`12345`（任意5位数字）
4. 点击 "Pay"

### Step 5: 验证成功标志

#### ✅ Stripe CLI 终端输出

应该看到：
```
2024-01-XX XX:XX:XX   --> checkout.session.completed [evt_xxx]
2024-01-XX XX:XX:XX  <--  [200] POST http://localhost:3000/api/stripe/webhook [evt_xxx]
```

#### ✅ 开发服务器日志

应该看到：
```
✅ [stripe/webhook] Checkout session completed: cs_xxx
📦 [stripe/webhook] Creating WooCommerce order...
📦 [woo] Creating WooCommerce order...
🔍 [woo] Request: POST https://linexpv.com/wp-json/wc/v3/orders
✅ [woo] Order created successfully: 123
✅ [stripe/webhook] WooCommerce order created: 123
```

#### ✅ WordPress 后台验证

1. 登录 WordPress 后台
2. 进入 **WooCommerce** → **Orders**
3. 应该看到新订单，包含：
   - ✅ **Order ID**: 123（或其他数字）
   - ✅ **Payment Method**: Stripe
   - ✅ **Status**: Processing / Completed
   - ✅ **Billing Address**: 正确显示
   - ✅ **Shipping Address**: 正确显示
   - ✅ **Line Items**: 商品列表正确
   - ✅ **Total**: 金额正确

#### ✅ API 响应验证

Webhook 应该返回：
```json
{
  "received": true,
  "orderId": 123
}
```

### 故障排查

#### Checkout 不跳转
- 检查浏览器 DevTools → Network → `/api/stripe/checkout`
- 查看响应是否为 `{ "url": "..." }`
- 检查服务器日志中的错误

#### Webhook 签名验证失败
- 确认 `STRIPE_WEBHOOK_SECRET` 正确（从 Stripe CLI 复制）
- 确认已重启服务器
- 检查服务器日志中的错误信息

#### WooCommerce 订单创建失败
- 测试 WooCommerce API：
  ```bash
  curl -u "ck_xxx:cs_xxx" \
    "https://linexpv.com/wp-json/wc/v3/orders?per_page=1"
  ```
- 检查服务器日志中的详细错误
- 确认 `WC_BASE_URL` 正确（不包含 `/wp`）

---

## 📋 总结

### 需要修复的问题
1. ✅ 环境变量检查不够明确 → 已修复
2. ✅ Woo API URL 拼接需要 normalize → 已修复
3. ✅ 响应 content-type 检查缺失 → 已修复
4. ✅ product_id 处理逻辑需要改进 → 已修复

### 代码质量
- ✅ Webhook 使用 Node.js runtime（正确）
- ✅ 使用 raw body 验签（正确）
- ✅ 错误处理完善
- ✅ 日志输出详细

### 部署准备
- ✅ 所有环境变量已文档化
- ✅ 错误信息友好
- ✅ 支持本地和生产环境
