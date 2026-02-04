# Stripe + WooCommerce 支付集成文档

本文档说明如何配置和使用 Stripe 支付与 WooCommerce 订单同步功能。

## 📋 功能概述

1. 用户在 `/checkout` 点击 "Pay Now" → 创建 Stripe Checkout Session 并跳转到 Stripe Hosted Checkout
2. 支付成功后 Stripe webhook (`checkout.session.completed`) 触发
3. Webhook 内调用 WooCommerce REST API 创建订单
4. 订单在 WordPress 后台 WooCommerce → Orders 可见（包含 line_items、billing、shipping、total、payment_method=stripe）
5. Bolt 环境兼容：Bolt / webcontainer 环境下继续使用 mock，不发真实请求

## 🔧 环境变量配置

### 必需的环境变量

在 `.env.local` 文件中添加以下环境变量：

```bash
# Stripe 配置
STRIPE_SECRET_KEY=sk_test_...          # Stripe Secret Key (从 Stripe Dashboard 获取)
STRIPE_WEBHOOK_SECRET=whsec_...        # Stripe Webhook Secret (从 Stripe Dashboard Webhook 设置获取)
NEXT_PUBLIC_SITE_URL=https://yourdomain.com  # 网站 URL（用于 success_url 和 cancel_url）

# WooCommerce REST API 配置
WC_BASE_URL=https://yourdomain.com/wp  # WordPress 站点 URL（包含 /wp 路径）
WC_CONSUMER_KEY=ck_...                 # WooCommerce Consumer Key
WC_CONSUMER_SECRET=cs_...              # WooCommerce Consumer Secret
```

### 环境变量说明

#### Stripe 配置

1. **STRIPE_SECRET_KEY**
   - 获取方式：登录 [Stripe Dashboard](https://dashboard.stripe.com/) → Developers → API keys
   - 测试环境使用 `sk_test_...`，生产环境使用 `sk_live_...`
   - ⚠️ 不要提交到 Git，这是敏感信息

2. **STRIPE_WEBHOOK_SECRET**
   - 获取方式：见下方 "Stripe Webhook 配置" 章节
   - 格式：`whsec_...`
   - ⚠️ 不要提交到 Git

3. **NEXT_PUBLIC_SITE_URL**
   - 你的网站完整 URL，例如：`https://oneho.com`
   - 用于构建 Stripe Checkout 的 `success_url` 和 `cancel_url`

#### WooCommerce 配置

1. **WC_BASE_URL**
   - WordPress 站点的基础 URL，例如：`https://linexpv.com/wp`
   - 确保包含 `/wp` 路径（如果 WordPress 安装在子目录）

2. **WC_CONSUMER_KEY** 和 **WC_CONSUMER_SECRET**
   - 获取方式：见下方 "WooCommerce API Keys 生成" 章节
   - ⚠️ 不要提交到 Git

## 🔗 Stripe Webhook 配置

### 1. 创建 Webhook Endpoint

1. 登录 [Stripe Dashboard](https://dashboard.stripe.com/)
2. 进入 **Developers** → **Webhooks**
3. 点击 **Add endpoint**
4. 填写：
   - **Endpoint URL**: `https://yourdomain.com/api/stripe/webhook`
   - **Description**: `WooCommerce Order Sync`
   - **Events to send**: 选择 `checkout.session.completed`
5. 点击 **Add endpoint**

### 2. 获取 Webhook Secret

1. 创建 Webhook 后，点击进入详情页
2. 在 **Signing secret** 部分，点击 **Reveal** 按钮
3. 复制 `whsec_...` 开头的值
4. 添加到 `.env.local` 作为 `STRIPE_WEBHOOK_SECRET`

### 3. 本地测试 Webhook（使用 Stripe CLI）

#### 安装 Stripe CLI

```bash
# macOS
brew install stripe/stripe-cli/stripe

# 或使用 npm
npm install -g stripe-cli
```

#### 登录 Stripe CLI

```bash
stripe login
```

#### 转发 Webhook 到本地

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

这个命令会：
- 显示一个 `whsec_...` 的 webhook secret（用于本地测试）
- 将所有 Stripe 事件转发到本地服务器
- 在本地 `.env.local` 中使用这个 secret 作为 `STRIPE_WEBHOOK_SECRET`

#### 触发测试事件

在另一个终端运行：

```bash
# 触发 checkout.session.completed 事件
stripe trigger checkout.session.completed
```

或者使用测试卡号在 Stripe Checkout 中完成支付：
- 卡号：`4242 4242 4242 4242`
- 过期日期：任意未来日期
- CVC：任意 3 位数字
- ZIP：任意 5 位数字

## 🔑 WooCommerce API Keys 生成

### 1. 在 WordPress 后台生成 API Keys

1. 登录 WordPress 后台
2. 进入 **WooCommerce** → **Settings** → **Advanced** → **REST API**
3. 点击 **Add key**
4. 填写：
   - **Description**: `Stripe Webhook Integration`
   - **User**: 选择一个有管理权限的用户
   - **Permissions**: 选择 **Read/Write**
5. 点击 **Generate API key**
6. 复制生成的：
   - **Consumer key**: `ck_...`
   - **Consumer secret**: `cs_...`
7. 添加到 `.env.local`：
   ```bash
   WC_CONSUMER_KEY=ck_...
   WC_CONSUMER_SECRET=cs_...
   ```

### 2. 验证 API Keys

可以使用 curl 测试：

```bash
curl -u "ck_...:cs_..." \
  "https://yourdomain.com/wp/wp-json/wc/v3/orders?per_page=1"
```

如果返回订单列表（JSON），说明配置正确。

## 📦 安装依赖

确保安装了 Stripe SDK：

```bash
npm install stripe
```

## 🧪 测试流程

### 1. 本地测试（使用 Stripe CLI）

1. 启动开发服务器：
   ```bash
   npm run dev
   ```

2. 在另一个终端启动 Stripe webhook 转发：
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

3. 复制显示的 `whsec_...` 到 `.env.local` 作为 `STRIPE_WEBHOOK_SECRET`

4. 访问 `http://localhost:3000/checkout`
5. 填写表单，点击 "Pay Now"
6. 使用测试卡号完成支付
7. 检查：
   - Stripe Dashboard → Payments 中是否有新支付
   - WordPress 后台 → WooCommerce → Orders 中是否有新订单

### 2. 生产环境测试

1. 确保所有环境变量已配置
2. 部署到生产环境
3. 在 Stripe Dashboard 中配置生产环境的 Webhook
4. 使用真实卡号（或测试卡号）完成一次支付
5. 验证订单是否同步到 WooCommerce

## 🐛 故障排查

### Webhook 签名验证失败

- 检查 `STRIPE_WEBHOOK_SECRET` 是否正确
- 确保使用的是对应环境的 webhook secret（测试/生产）
- 检查 webhook endpoint URL 是否正确

### WooCommerce 订单创建失败

- 检查 `WC_BASE_URL`、`WC_CONSUMER_KEY`、`WC_CONSUMER_SECRET` 是否正确
- 使用 curl 测试 WooCommerce API 是否可访问
- 检查服务器日志中的错误信息

### Bolt 环境问题

- Bolt 环境会自动使用 mock，不会调用真实 API
- 如果需要在 Bolt 中测试，设置 `NEXT_PUBLIC_USE_MOCK=true`

## 📝 代码结构

```
lib/
  └── woo.ts                    # WooCommerce REST API 客户端

app/api/stripe/
  ├── checkout/
  │   └── route.ts             # 创建 Stripe Checkout Session
  └── webhook/
      └── route.ts              # 处理 Stripe Webhook

app/checkout/
  └── page.tsx                  # 结账页面（已修改为调用新 API）
```

## 🔒 安全注意事项

1. **永远不要提交敏感信息到 Git**
   - 使用 `.env.local`（已在 `.gitignore` 中）
   - 生产环境使用 Vercel/Netlify 的环境变量配置

2. **使用 HTTPS**
   - Stripe Webhook 要求 HTTPS（生产环境）
   - 本地测试可以使用 Stripe CLI 转发

3. **验证 Webhook 签名**
   - 代码中已实现签名验证
   - 不要跳过签名验证步骤

4. **限制 API 权限**
   - WooCommerce API Key 使用最小必要权限（Read/Write）
   - 定期轮换 API Keys

## 📚 相关文档

- [Stripe Checkout 文档](https://stripe.com/docs/payments/checkout)
- [Stripe Webhooks 文档](https://stripe.com/docs/webhooks)
- [WooCommerce REST API 文档](https://woocommerce.github.io/woocommerce-rest-api-docs/)
- [Stripe CLI 文档](https://stripe.com/docs/stripe-cli)
