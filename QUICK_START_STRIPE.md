# Stripe Checkout 快速开始

## ✅ 已完成的工作

1. ✅ 创建了 `lib/woo.ts` - WooCommerce REST API 客户端
2. ✅ 创建了 `app/api/stripe/checkout/route.ts` - Stripe Checkout Session 创建
3. ✅ 创建了 `app/api/stripe/webhook/route.ts` - Stripe Webhook 处理
4. ✅ 修改了 `app/checkout/page.tsx` - 调用新的 Stripe API
5. ✅ 添加了 `stripe` 依赖到 `package.json`

## 🚀 立即开始测试

### Step 1: 配置环境变量

在 `.env.local` 文件中添加：

```bash
# WooCommerce REST API
WC_BASE_URL=https://linexpv.com
WC_CONSUMER_KEY=ck_xxx
WC_CONSUMER_SECRET=cs_xxx

# Stripe
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx  # 先用占位符，Step 3 会用 Stripe CLI 生成

# 网站 URL（本地用 localhost）
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

⚠️ **注意**：
- `WC_BASE_URL` 如果 WordPress 安装在根目录用 `https://linexpv.com`，如果在 `/wp` 子目录用 `https://linexpv.com/wp`
- `NEXT_PUBLIC_SITE_URL` 本地开发用 `http://localhost:3000`，Vercel 部署时改为实际域名

### Step 2: 安装依赖并启动

```bash
npm install stripe
npm run dev
```

### Step 3: 测试 Checkout（先不管 webhook）

1. 访问 `http://localhost:3000/checkout`
2. 填写表单，点击 "Pay Now"
3. **预期**：跳转到 Stripe Hosted Checkout

**如果失败**：
- 打开浏览器 DevTools → Network
- 查看 `/api/stripe/checkout` 的响应
- 应该返回 `{ "url": "https://checkout.stripe.com/..." }`
- 检查服务器日志中的错误

### Step 4: 使用 Stripe CLI 测试 Webhook

#### 4.1 安装 Stripe CLI

```bash
# macOS
brew install stripe/stripe-cli/stripe

# 或
npm install -g stripe-cli
```

#### 4.2 登录并转发 Webhook

```bash
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

**重要**：会输出一个 `whsec_...`，例如：
```
> Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxx
```

#### 4.3 更新环境变量

将 `whsec_...` 复制到 `.env.local`：
```bash
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

**重启开发服务器**（环境变量更改需要重启）

#### 4.4 完成测试支付

1. 再次访问 `http://localhost:3000/checkout`
2. 填写表单，点击 "Pay Now"
3. 在 Stripe Checkout 使用测试卡：
   - 卡号：`4242 4242 4242 4242`
   - 过期：`12/25`
   - CVC：`123`
   - ZIP：`12345`

#### 4.5 验证成功

✅ **成功标志**：

1. **Stripe CLI 终端**：
   - 看到 `checkout.session.completed` 事件
   - 看到 `✅ [stripe/webhook] WooCommerce order created: 123`

2. **服务器日志**：
   - 看到 `✅ [woo] Order created successfully: 123`

3. **WordPress 后台**：
   - WooCommerce → Orders 中出现新订单
   - 包含 line_items、billing、shipping、total、payment_method=stripe

4. **API 响应**：
   - Webhook 返回 `200 OK`
   - 响应：`{ "received": true, "orderId": 123 }`

## 📦 部署到 Vercel

### 1. 提交代码

```bash
git add .
git commit -m "Add Stripe checkout and WooCommerce order sync"
git push
```

### 2. 在 Vercel 配置环境变量

Vercel Dashboard → Project → Settings → Environment Variables：

- `WC_BASE_URL` = `https://linexpv.com`
- `WC_CONSUMER_KEY` = `ck_xxx`
- `WC_CONSUMER_SECRET` = `cs_xxx`
- `STRIPE_SECRET_KEY` = `sk_live_xxx`（生产用 live key）
- `STRIPE_WEBHOOK_SECRET` = `whsec_xxx`（从 Stripe Dashboard 获取）
- `NEXT_PUBLIC_SITE_URL` = `https://yourdomain.com`

### 3. 在 Stripe Dashboard 配置生产 Webhook

1. Stripe Dashboard → Developers → Webhooks
2. Add endpoint
3. URL: `https://yourdomain.com/api/stripe/webhook`
4. Events: `checkout.session.completed`
5. 复制 Signing secret 到 Vercel 环境变量

## 🐛 常见问题

### Checkout 不跳转
- 检查 `/api/stripe/checkout` 响应格式
- 确认 `STRIPE_SECRET_KEY` 正确
- 查看服务器日志

### Webhook 签名验证失败
- 确认 `STRIPE_WEBHOOK_SECRET` 正确
- 重启服务器（环境变量更改需要重启）

### WooCommerce 订单创建失败
- 测试 API：`curl -u "ck_xxx:cs_xxx" "https://linexpv.com/wp-json/wc/v3/orders?per_page=1"`
- 检查 `WC_BASE_URL` 是否正确（根目录 vs `/wp` 子目录）

## 📚 详细文档

查看 `docs/stripe-woo.md` 和 `TESTING_STRIPE_CHECKOUT.md` 获取完整文档。
