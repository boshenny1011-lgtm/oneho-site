# Stripe Checkout 测试指南

## Step 1: 配置环境变量

在 `.env.local` 文件中添加以下配置：

```bash
# WooCommerce REST API 配置
WC_BASE_URL=https://linexpv.com
WC_CONSUMER_KEY=ck_xxx
WC_CONSUMER_SECRET=cs_xxx

# Stripe 配置
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# 网站 URL（本地开发用 localhost）
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

⚠️ **注意**：
- 本地开发时 `NEXT_PUBLIC_SITE_URL` 使用 `http://localhost:3000`
- Vercel 部署时改为实际域名，例如 `https://oneho.com`

## Step 2: 安装依赖

```bash
npm install stripe
```

## Step 3: 测试 Stripe Checkout（先不管 webhook）

1. 启动开发服务器：
   ```bash
   npm run dev
   ```

2. 打开浏览器访问：`http://localhost:3000/checkout`

3. 填写表单，点击 "Pay Now"

4. **预期结果**：
   - 应该跳转到 Stripe Hosted Checkout 页面
   - 如果失败，检查浏览器控制台和服务器日志

5. **调试方法**：
   - 打开浏览器开发者工具 → Network 标签
   - 查看 `/api/stripe/checkout` 请求的响应
   - 应该返回 JSON：`{ "url": "https://checkout.stripe.com/..." }`
   - 如果返回错误，检查：
     - `STRIPE_SECRET_KEY` 是否正确
     - 服务器日志中的错误信息

## Step 4: 使用 Stripe CLI 测试 Webhook

### 4.1 安装并登录 Stripe CLI

```bash
# macOS
brew install stripe/stripe-cli/stripe

# 或使用 npm
npm install -g stripe-cli

# 登录
stripe login
```

### 4.2 转发 Webhook 到本地

在一个终端运行：

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

**重要**：这个命令会输出一个 `whsec_...` 的 webhook secret，例如：
```
> Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxx
```

### 4.3 更新环境变量

将上面输出的 `whsec_...` 复制到 `.env.local` 的 `STRIPE_WEBHOOK_SECRET`：

```bash
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

然后**重启开发服务器**（环境变量更改需要重启才能生效）。

### 4.4 完成测试支付

1. 在另一个终端或浏览器中，再次访问 `http://localhost:3000/checkout`
2. 填写表单，点击 "Pay Now"
3. 在 Stripe Checkout 页面使用测试卡号：
   - **卡号**：`4242 4242 4242 4242`
   - **过期日期**：任意未来日期（如 `12/25`）
   - **CVC**：任意 3 位数字（如 `123`）
   - **ZIP**：任意 5 位数字（如 `12345`）
4. 完成支付

### 4.5 验证成功标志

✅ **成功标志**：

1. **Webhook 终端输出**：
   - 看到 `checkout.session.completed` 事件
   - 看到 `✅ [stripe/webhook] Checkout session completed: cs_...`
   - 看到 `📦 [stripe/webhook] Creating WooCommerce order...`
   - 看到 `✅ [stripe/webhook] WooCommerce order created: 123`（订单 ID）

2. **服务器日志**：
   - 没有错误信息
   - 看到 `✅ [woo] Order created successfully: 123`

3. **WordPress 后台**：
   - 登录 WordPress 后台
   - 进入 **WooCommerce** → **Orders**
   - 应该看到新创建的订单，包含：
     - ✅ line_items（商品列表）
     - ✅ billing（账单地址）
     - ✅ shipping（配送地址）
     - ✅ total（总金额）
     - ✅ payment_method: "stripe"

4. **API 响应**：
   - Webhook 返回 `200 OK`
   - 响应体：`{ "received": true, "orderId": 123 }`

## Step 5: 推送到 GitHub 和 Vercel

### 5.1 提交代码

```bash
git add .
git commit -m "Add Stripe checkout and WooCommerce order sync"
git push
```

### 5.2 在 Vercel 配置环境变量

1. 登录 Vercel Dashboard
2. 进入项目设置 → Environment Variables
3. 添加以下变量：
   - `WC_BASE_URL` = `https://linexpv.com`
   - `WC_CONSUMER_KEY` = `ck_xxx`
   - `WC_CONSUMER_SECRET` = `cs_xxx`
   - `STRIPE_SECRET_KEY` = `sk_live_xxx`（生产环境用 live key）
   - `STRIPE_WEBHOOK_SECRET` = `whsec_xxx`（从 Stripe Dashboard 获取）
   - `NEXT_PUBLIC_SITE_URL` = `https://yourdomain.com`（实际域名）

### 5.3 在 Stripe Dashboard 配置生产 Webhook

1. 登录 [Stripe Dashboard](https://dashboard.stripe.com/)
2. 进入 **Developers** → **Webhooks**
3. 点击 **Add endpoint**
4. 填写：
   - **Endpoint URL**: `https://yourdomain.com/api/stripe/webhook`
   - **Description**: `WooCommerce Order Sync (Production)`
   - **Events to send**: 选择 `checkout.session.completed`
5. 点击 **Add endpoint**
6. 复制 **Signing secret**（`whsec_...`）
7. 更新 Vercel 环境变量中的 `STRIPE_WEBHOOK_SECRET`

### 5.4 测试生产环境

1. 访问生产环境的 `/checkout` 页面
2. 完成一次测试支付
3. 验证订单是否同步到 WooCommerce

## 故障排查

### Checkout 不跳转

- 检查浏览器控制台的 Network 标签
- 查看 `/api/stripe/checkout` 的响应
- 确认返回的是 `{ "url": "..." }` 格式
- 检查服务器日志中的错误

### Webhook 签名验证失败

- 确认 `STRIPE_WEBHOOK_SECRET` 正确
- 确认使用的是对应环境的 secret（测试/生产）
- 重启开发服务器（环境变量更改需要重启）

### WooCommerce 订单创建失败

- 检查 `WC_BASE_URL`、`WC_CONSUMER_KEY`、`WC_CONSUMER_SECRET` 是否正确
- 使用 curl 测试 WooCommerce API：
  ```bash
  curl -u "ck_xxx:cs_xxx" \
    "https://linexpv.com/wp-json/wc/v3/orders?per_page=1"
  ```
- 检查服务器日志中的详细错误信息

### 订单缺少字段

- 检查 webhook 日志中的 payload
- 确认 metadata 中包含了所有必要信息
- 检查 WooCommerce API 返回的错误信息
