# 🧪 Store 验证清单

## ✅ 实现完成

Store 页面已升级为 Enphase 风格，具有以下特性：

### 架构
- **左侧 Sidebar**：分类列表，当前分类高亮
- **右侧内容区**：标题 + 商品网格（3 列响应式）
- **数据来源**：WooCommerce Store API (`/wp-json/wc/store/v1/`)

### 路由
- `/store` → 自动重定向到 microinverters（或 accessories）
- `/store/[slug]` → 显示对应分类商品
- `/product/[id]` → 商品详情（使用 Store API）

---

## 🎯 必须测试的 URL

启动开发服务器：`npm run dev`

打开浏览器 DevTools（F12），切换到 Console 标签，然后依次访问以下 URL：

### 1️⃣ `/store` - 默认页（自动重定向）

**URL**: http://localhost:3000/store

**预期行为**:
- 自动重定向到 `/store/microinverters`
- 如果 microinverters 不存在，重定向到 `/store/accessories`
- 如果都不存在，重定向到第一个子分类

**Console 日志**:
```
🏪 [Store] Loading categories for redirect...
📦 [Store] Found X categories
🎯 [Store] Found ONEHO parent: XX oneho
👶 [Store] Found X child categories: Microinverters (microinverters), Accessories (accessories)
✅ [Store] Redirecting to microinverters: /store/microinverters
```

**检查点**:
- [ ] URL 自动跳转
- [ ] 没有停留在 "Loading..." 页面
- [ ] Console 显示重定向日志

---

### 2️⃣ `/store/microinverters` - Microinverters 分类页

**URL**: http://localhost:3000/store/microinverters

**预期显示**:
- [ ] 页面分为两列（桌面）
- [ ] 左侧 Sidebar：
  - 标题 "ONEHO Store"
  - 分类列表（Microinverters、Accessories 等）
  - Microinverters 高亮（黑底白字）
- [ ] 右侧内容区：
  - 标题 "Microinverters"
  - 显示商品数量
  - 商品网格（3 列）
- [ ] 每个商品卡片：
  - 图片（1:1 宽高比）
  - 商品名称
  - 价格

**Console 日志**:
```
🏪 [StoreCategoryPage] Loading category: microinverters
📦 [StoreCategoryPage] Loaded XX categories
🎯 [StoreCategoryPage] Found ONEHO parent: XX
👶 [StoreCategoryPage] Found X child categories
✅ [StoreCategoryPage] Current category: XX Microinverters
🔍 [getProductsByCategoryId] Fetching products for category: XX
🔍 [getStoreProducts] Fetching products: https://linexpv.com/wp-json/wc/store/v1/products?category=XX&per_page=24
📊 [getStoreProducts] Response status: 200
✅ [getStoreProducts] Products found: X
📦 [StoreCategoryPage] Loaded X products
```

**交互测试**:
- [ ] Hover 商品卡片有效果（边框变化）
- [ ] 点击商品卡片跳转到 `/product/{id}`
- [ ] 点击左侧其他分类可以切换

---

### 3️⃣ `/store/accessories` - Accessories 分类页

**URL**: http://localhost:3000/store/accessories

**预期显示**:
- [ ] 左侧 Sidebar：Accessories 高亮
- [ ] 右侧标题显示 "Accessories"
- [ ] 显示配件商品

**Console 日志**:
```
🏪 [StoreCategoryPage] Loading category: accessories
✅ [StoreCategoryPage] Current category: XX Accessories
📦 [StoreCategoryPage] Loaded X products
```

**交互测试**:
- [ ] 左侧 Sidebar 中 Accessories 高亮
- [ ] 可以点击 Microinverters 切换回去

---

### 4️⃣ `/product/109` - 商品详情页

**URL**: http://localhost:3000/product/109

（如果 109 不存在，使用实际的商品 ID）

**预期显示**:
- [ ] 商品图片（大图）
- [ ] 商品名称
- [ ] 价格
- [ ] Short Description
- [ ] Full Description（HTML 格式）
- [ ] "Back to Store" 链接

**Console 日志**:
```
🎯 [ProductPage] Raw params: {"id":"109"}
🎯 [ProductPage] params.id: 109
🎯 [ProductPage] Parsed ID: 109 isNaN: false
🚀 [ProductPage] Calling getProductById...
🔍 [getProductById] Fetching product: 109
🌐 [getProductById] Full URL: https://linexpv.com/wp-json/wc/store/v1/products/109
📊 [getProductById] Response status: 200
✅ [getProductById] Product found: 109 Product Name
📦 [ProductPage] Result: Product found
```

**交互测试**:
- [ ] 点击 "Back to Store" 返回分类页
- [ ] 图片清晰可见
- [ ] Description 格式正确

---

### 5️⃣ 不存在的分类

**URL**: http://localhost:3000/store/nonexistent

**预期行为**:
- 自动重定向到 `/store`

**Console 日志**:
```
🏪 [StoreCategoryPage] Loading category: nonexistent
❌ [StoreCategoryPage] Category not found: nonexistent
🐛 [StoreCategoryPage] Debug info: {...}
```

**开发模式额外显示**:
- [ ] 红色错误框（仅开发模式）
- [ ] 错误消息：Category 'nonexistent' not found
- [ ] 可展开的 Debug Info

---

### 6️⃣ 不存在的商品

**URL**: http://localhost:3000/product/99999

**预期显示**:
- [ ] 错误页面
- [ ] "Product Not Found" 或 "Error Loading Product"
- [ ] "Back to Store" 链接

**Console 日志**:
```
🎯 [ProductPage] Parsed ID: 99999 isNaN: false
❌ [getProductById] Product not found or error
```

---

## 🎨 UI 检查

### 桌面（≥1024px）
- [ ] 左侧 Sidebar 宽度 256px
- [ ] 右侧内容区占满剩余空间
- [ ] 商品网格 3 列
- [ ] 间距合理

### 平板（768px - 1023px）
- [ ] Sidebar 在顶部或全宽
- [ ] 商品网格 2 列

### 移动端（<768px）
- [ ] Sidebar 全宽，堆叠在顶部
- [ ] 商品网格 1 列
- [ ] 触摸交互流畅

---

## 📊 API 调用检查

### Store API 端点使用情况

✅ **分类列表**
- API: `https://linexpv.com/wp-json/wc/store/v1/products/categories`
- 使用位置: `/store`, `/store/[slug]`

✅ **商品列表（按分类）**
- API: `https://linexpv.com/wp-json/wc/store/v1/products?category={id}&per_page=24`
- 使用位置: `/store/[slug]`

✅ **商品详情**
- API: `https://linexpv.com/wp-json/wc/store/v1/products/{id}`
- 使用位置: `/product/[id]`

### 不再使用的端点

❌ **旧的 WC API v3**
- `/wp-json/wc/v3/products` - 已废弃

❌ **ngrok 域名**
- 不再使用任何 ngrok URL

---

## 🔗 链接格式验证

### ✅ 正确格式

所有商品卡片链接必须是：
```
/product/109
/product/110
/product/111
```

### ❌ 错误格式（不应出现）

```
https://linexpv.com/product/...  ❌ 外部链接
/product/slug-name              ❌ 使用 slug
WordPress permalink             ❌ WP 链接
```

**验证方法**:
1. 右键点击商品卡片
2. 选择 "检查" 或 "审查元素"
3. 查看 `<a>` 标签的 `href` 属性
4. 确认格式为 `/product/{数字 ID}`

---

## 🐛 错误处理检查

### 场景 1: API 返回 HTML（被安全插件拦截）

**症状**:
```
❌ [getStoreProducts] Response is NOT JSON! Content-Type: text/html
❌ [getStoreProducts] First 200 chars: <!DOCTYPE html>...
Error: Store API returned HTML instead of JSON
```

**页面显示**（开发模式）:
- [ ] 红色错误框
- [ ] 错误消息清晰
- [ ] Debug Info 可展开

---

### 场景 2: API 返回 403/404

**症状**:
```
❌ [getStoreProducts] Failed to fetch products
❌ [getStoreProducts] Fetch URL: https://...
❌ [getStoreProducts] Status: 403
Error: Failed to fetch products: 403 Forbidden
```

---

### 场景 3: 分类不存在

**行为**: 自动重定向到 `/store`

**开发模式**: 显示错误信息和可用分类列表

---

## 🚀 构建验证

```bash
# 运行类型检查
npm run typecheck

# 运行生产构建
npm run build
```

**预期结果**:
```
✓ Compiled successfully
✓ Generating static pages (17/17)

Route (app)
├ λ /store                               386 B          79.7 kB
├ λ /store/[slug]                        1.83 kB        93.9 kB
├ λ /product/[id]                        1.34 kB        93.4 kB
```

- [ ] 类型检查通过
- [ ] 构建成功
- [ ] 无错误或警告

---

## 📝 代码组织检查

### 新增文件

- [ ] `components/store/StoreSidebar.tsx` - 左侧分类栏
- [ ] `components/store/StoreGrid.tsx` - 商品网格

### 修改文件

- [ ] `app/store/page.tsx` - 重定向逻辑
- [ ] `app/store/[slug]/page.tsx` - Enphase 布局
- [ ] `app/product/[id]/page.tsx` - 使用 Store API（已存在）

### 复用组件

- [ ] `components/StoreProductCard.tsx` - 商品卡片
- [ ] `components/Header.tsx` - 页头导航

---

## 🔍 最终验收标准

### 功能完整性
- [ ] `/store` 自动重定向
- [ ] `/store/[slug]` Enphase 布局正常
- [ ] 左侧 Sidebar 显示分类
- [ ] 当前分类高亮
- [ ] 商品卡片可点击
- [ ] 商品链接格式正确（`/product/{id}`）
- [ ] `/product/[id]` 显示详情

### 数据准确性
- [ ] 所有数据来自 Store API
- [ ] 不使用 wc/v3 API
- [ ] 不使用 ngrok 域名
- [ ] 不使用 WordPress permalink

### 错误处理
- [ ] 不存在的分类重定向
- [ ] 不存在的商品显示错误
- [ ] API 错误显示友好提示
- [ ] 开发模式显示详细日志

### 用户体验
- [ ] 响应式布局正常
- [ ] 加载状态清晰
- [ ] 交互流畅
- [ ] 视觉层次分明

### 代码质量
- [ ] TypeScript 类型检查通过
- [ ] 构建成功
- [ ] Console 无意外错误
- [ ] 代码组织清晰

---

## ✅ 测试完成

完成以上所有检查点后，Store 页面即可投入使用。

**注意事项**:
1. 确保 `.env` 中 `NEXT_PUBLIC_SITE_URL=https://linexpv.com` 正确
2. 确保 WordPress 中 ONEHO 分类结构正确：
   - ONEHO（父分类）
     - Microinverters（子分类）
     - Accessories（子分类）
3. 确保商品已分配到对应分类
4. 确保 Store API 端点可访问（无安全插件拦截）

祝测试顺利！🎉
