# 本地测试清单 - Stripe + WooCommerce

## ✅ 前置准备

- [ ] `.env.local` 文件存在且格式正确（每行一个 KEY=VALUE）
- [ ] 已安装依赖：`npm install stripe`
- [ ] 环境变量已配置（见下方）

### 环境变量（.env.local）

```bash
WC_BASE_URL=https://linexpv.com
WC_CONSUMER_KEY=ck_xxx
WC_CONSUMER_SECRET=cs_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

⚠️ **注意**：`WC_BASE_URL` 不要包含 `/wp`（代码会自动处理）

---

## Step 1: 启动开发服务器

```bash
npm run dev
```

**验证**：
- [ ] 服务器启动成功（无错误）
- [ ] 没有环境变量缺失的错误日志

---

## Step 2: 测试 Checkout（先不管 webhook）

1. [ ] 打开浏览器：`http://localhost:3000/checkout`
2. [ ] 填写表单：
   - Email: `test@example.com`
   - First Name: `Test`
   - Last Name: `User`
   - Address: `123 Test St`
   - City: `Amsterdam`
   - Postcode: `1012 AB`
   - Country: `NL`
3. [ ] 点击 "Pay Now"

**预期结果**：
- [ ] 跳转到 Stripe Hosted Checkout 页面
- [ ] 浏览器 Network → `/api/stripe/checkout` 返回 `{ "url": "https://checkout.stripe.com/..." }`

**如果失败**：
- [ ] 检查浏览器控制台错误
- [ ] 检查服务器日志
- [ ] 确认 `STRIPE_SECRET_KEY` 正确

---

## Step 3: 使用 Stripe CLI 测试 Webhook

### 3.1 安装并登录

```bash
brew install stripe/stripe-cli/stripe  # macOS
# 或: npm install -g stripe-cli

stripe login
```

### 3.2 转发 Webhook

在**新终端**运行：

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

**重要**：复制输出的 `whsec_...`，例如：
```
> Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxx
```

### 3.3 更新环境变量

1. [ ] 复制 `whsec_...` 到 `.env.local` 的 `STRIPE_WEBHOOK_SECRET`
2. [ ] **重启开发服务器**（环境变量更改需要重启）

```bash
# 停止服务器 (Ctrl+C)
npm run dev
```

---

## Step 4: 完成测试支付

1. [ ] 访问：`http://localhost:3000/checkout`
2. [ ] 填写表单，点击 "Pay Now"
3. [ ] 在 Stripe Checkout 使用测试卡：
   - 卡号：`4242 4242 4242 4242`
   - 过期：`12/25`
   - CVC：`123`
   - ZIP：`12345`
4. [ ] 点击 "Pay"

---

## Step 5: 验证成功标志

### ✅ Stripe CLI 终端

- [ ] 看到 `checkout.session.completed` 事件
- [ ] 看到 `[200] POST http://localhost:3000/api/stripe/webhook`

### ✅ 开发服务器日志

- [ ] `✅ [stripe/webhook] Checkout session completed: cs_xxx`
- [ ] `📦 [woo] Creating WooCommerce order...`
- [ ] `🔍 [woo] Request: POST https://linexpv.com/wp-json/wc/v3/orders`
- [ ] `✅ [woo] Order created successfully: 123`
- [ ] `✅ [stripe/webhook] WooCommerce order created: 123`

### ✅ WordPress 后台

1. [ ] 登录 WordPress 后台
2. [ ] 进入 **WooCommerce** → **Orders**
3. [ ] 看到新订单，包含：
   - [ ] Order ID: 123
   - [ ] Payment Method: Stripe
   - [ ] Billing Address: 正确
   - [ ] Shipping Address: 正确
   - [ ] Line Items: 商品列表正确
   - [ ] Total: 金额正确

### ✅ API 响应

- [ ] Webhook 返回 `200 OK`
- [ ] 响应体：`{ "received": true, "orderId": 123 }`

---

## 🐛 故障排查

### Checkout 不跳转
- [ ] 检查浏览器 DevTools → Network → `/api/stripe/checkout`
- [ ] 查看响应是否为 `{ "url": "..." }`
- [ ] 检查服务器日志错误

### Webhook 签名验证失败
- [ ] 确认 `STRIPE_WEBHOOK_SECRET` 正确（从 Stripe CLI 复制）
- [ ] 确认已重启服务器
- [ ] 检查服务器日志错误

### WooCommerce 订单创建失败
- [ ] 测试 API：`curl -u "ck_xxx:cs_xxx" "https://linexpv.com/wp-json/wc/v3/orders?per_page=1"`
- [ ] 检查服务器日志详细错误
- [ ] 确认 `WC_BASE_URL` 正确（不包含 `/wp`）

---

## 📋 测试完成

所有项目打勾后，流程已完全验证，可以推送到 GitHub 并部署到 Vercel。
