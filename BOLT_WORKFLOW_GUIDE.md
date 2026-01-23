# Bolt + Cursor 工作流程指南

## 🎯 核心原则

**Bolt 负责：** UI/UX、页面结构、路由跳转、状态管理（购物车）、表单交互  
**Cursor/Vercel 负责：** 真实商品数据、真实下单、真实支付（Stripe/Mollie）

## ✅ 已完成的工作

### 1. 统一的 Store API 层 (`lib/store-api.ts`)

**功能：**
- ✅ 自动环境检测（Bolt vs 真实环境）
- ✅ Bolt 环境：返回 mock 数据
- ✅ 真实环境：调用 WordPress/WooCommerce API
- ✅ 安全的 fetch 包装器（Content-Type 验证）
- ✅ 自动 fallback 到 mock（如果真实 API 失败）

**API 方法：**
- `getCategories()` - 获取分类列表
- `getProducts(params)` - 获取商品列表（支持分类、搜索、分页）
- `getProductById(id)` - 获取单个商品
- `createCheckoutSession(cart)` - 创建结账会话（Bolt 返回假 session）

### 2. 购物车状态管理 (`contexts/CartContext.tsx`)

**功能：**
- ✅ 购物车状态（Context）
- ✅ 添加/删除/更新商品
- ✅ 自动保存到 localStorage
- ✅ 计算小计/税费/运费/总计
- ✅ 前端自洽（不需要后端支持）

### 3. 完整的购物流程

**页面：**
- ✅ `/store` - 商店列表页
- ✅ `/product/[id]` - 商品详情页（带"加入购物车"按钮）
- ✅ `/cart` - 购物车页面
- ✅ `/checkout` - 结账页面（表单、地址、配送方式）
- ✅ `/checkout/success` - 订单确认页

**流程：**
1. 浏览商品 → 2. 查看详情 → 3. 加入购物车 → 4. 查看购物车 → 5. 结账 → 6. 支付 → 7. 订单确认

## 🔄 工作流程

### Step A: Cursor 改动（已完成 ✅）

1. ✅ 创建统一的 `lib/store-api.ts`
2. ✅ 添加环境检测（`isBolt`）
3. ✅ 添加 mock 数据
4. ✅ 创建购物车 Context
5. ✅ 创建结账页面
6. ✅ 更新所有组件使用新的 API 层

**下一步：** Push 到 GitHub

```bash
git add .
git commit -m "Add unified store-api with Bolt support and complete checkout flow"
git push
```

### Step B: Bolt 做 UI（连续推进）

在 Bolt 中，你现在可以：

1. **测试完整流程**
   - 访问 `/store` → 看到商品列表（mock 数据）
   - 点击商品 → 进入详情页
   - 点击"Add to Cart" → 商品加入购物车
   - 访问 `/cart` → 查看购物车
   - 点击"Proceed to Checkout" → 进入结账页
   - 填写表单 → 点击"Pay Now" → 跳转到成功页

2. **优化 UI/UX**
   - 调整购物车页面样式
   - 优化结账表单布局
   - 添加加载状态
   - 添加错误提示
   - 添加成功动画

3. **添加功能**
   - 购物车图标显示商品数量（在 Header 中）
   - 快速查看购物车（侧边栏/下拉菜单）
   - 商品推荐
   - 优惠码输入

**关键：** Bolt 中所有操作都是前端状态，不需要真实 API，流程完全连贯！

### Step C: 回到 Cursor 接真后端

1. **创建 Stripe Checkout API**
   ```typescript
   // app/api/checkout/session/route.ts
   // 调用 Stripe API 创建真实的 checkout session
   ```

2. **配置环境变量**
   ```
   STRIPE_SECRET_KEY=sk_...
   STRIPE_PUBLISHABLE_KEY=pk_...
   ```

3. **部署到 Vercel**
   - 配置环境变量
   - 部署
   - 测试真实支付流程

## 🛡️ Bolt 环境保护

### 环境检测逻辑

```typescript
const isBolt = typeof window !== 'undefined' && (
  window.location.hostname.includes('bolt.new') ||
  window.location.hostname.includes('stackblitz.com') ||
  process.env.NEXT_PUBLIC_USE_MOCK === 'true'
);
```

### 安全机制

1. **Bolt 环境强制使用 mock**
   - 所有 API 调用自动返回 mock 数据
   - 不会尝试调用真实 API
   - 不会因为真实 API 错误而报错

2. **真实环境安全 fetch**
   - 检查 Content-Type 是否为 JSON
   - 如果不是 JSON，抛出清晰的错误
   - 自动 fallback 到 mock（如果 API 失败）

## 📋 测试清单

### Bolt 环境测试

- [ ] 访问 `/store` 显示商品列表（mock 数据）
- [ ] 点击商品进入详情页
- [ ] "Add to Cart" 按钮工作
- [ ] 访问 `/cart` 显示购物车
- [ ] 修改商品数量
- [ ] 删除商品
- [ ] 访问 `/checkout` 显示结账表单
- [ ] 填写表单并提交
- [ ] 跳转到 `/checkout/success` 显示订单确认

### 真实环境测试

- [ ] 访问 `/store` 显示真实商品（从 WordPress）
- [ ] 商品图片正确显示
- [ ] 价格正确显示
- [ ] 购物车功能正常
- [ ] 结账表单提交创建 Stripe session
- [ ] 跳转到 Stripe Checkout
- [ ] 支付成功后返回成功页

## 🚀 快速开始

### 在 Cursor 中

```bash
# 1. 确保所有更改已提交
git status

# 2. Push 到 GitHub
git push origin main
```

### 在 Bolt 中

```bash
# 1. Pull 最新代码
git pull origin main

# 2. 启动开发服务器
npm run dev

# 3. 开始做 UI！
```

## 💡 提示

1. **Bolt 中永远使用 mock 数据**
   - 不用担心 API 调用失败
   - 可以专注于 UI/UX
   - 流程完全连贯

2. **购物车是前端状态**
   - 使用 Context 管理
   - 自动保存到 localStorage
   - 不需要后端支持

3. **结账流程在 Bolt 中是 stub**
   - 点击"Pay Now"直接跳转到成功页
   - 真实环境会跳转到 Stripe Checkout

4. **环境切换**
   - 设置 `NEXT_PUBLIC_USE_MOCK=true` 强制使用 mock
   - 不设置则根据 hostname 自动检测

## 📝 下一步

1. ✅ **Cursor 已完成** - Push 到 GitHub
2. 🔄 **Bolt 做 UI** - 优化购物流程的 UI/UX
3. ⏳ **Cursor 接真后端** - 创建 Stripe API、部署到 Vercel

现在你可以在 Bolt 中安心做 UI，整个流程都是连贯的！
