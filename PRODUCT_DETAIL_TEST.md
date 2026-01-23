# 产品详情页测试清单

## 已完成的修改

### 1. ✅ lib/woocommerce.ts - getProductById 方法
- 使用 Store API: `${baseUrl}/wp-json/wc/store/v1/products/${id}`
- Headers 包含:
  - `Accept: application/json`
  - `User-Agent: Mozilla/5.0`
  - `ngrok-skip-browser-warning: true`
- ❌ **不使用** Authorization（Store API 不需要）
- 失败时 throw 错误，并打印详细信息（URL、status）

### 2. ✅ app/product/[id]/page.tsx
- 从 params 读取 id 并 parseInt
- 调用 `woocommerce.getProductById(id)`
- 渲染产品信息:
  - name
  - price (从 prices 对象计算)
  - images[0]?.src
  - short_description (dangerouslySetInnerHTML)
  - description (dangerouslySetInnerHTML)
- 404/null 时显示 "Product Not Found" 并包含 Debug Info
- ✅ **移除了所有 getNgrokImageUrl 调用**

### 3. ✅ components/StoreProductCard.tsx
- 已经使用 `/product/${product.id}` 链接
- ❌ **不跳转到 permalink**

### 4. ✅ app/store/page.tsx
- 已经使用 `/product/${p.id}` 链接
- ❌ **不跳转到 WP permalink**

### 5. ✅ 清理 ngrok 残留
- ✅ app/product/[id]/page.tsx - 移除所有 getNgrokImageUrl 调用
- ✅ components/ProductCard.tsx - 移除所有 getNgrokImageUrl 调用
- ✅ lib/woocommerce.ts - BASE_URL 统一为 https://linexpv.com
- ℹ️ lib/utils.ts - getNgrokImageUrl 函数保留但未使用

## 测试清单

### Test 1: Store 列表页面
- [ ] 访问 http://localhost:3000/store
- [ ] 验证能看到产品列表（ONEHO, Accessories, Microinverters）
- [ ] 验证产品卡片显示正确（图片、名称、价格）

### Test 2: 从 Store 点击产品
- [ ] 在 /store 页面点击任意产品卡片
- [ ] 验证 URL 格式为 `/product/<数字ID>`（不是 slug）
- [ ] 验证产品详情页正确加载

### Test 3: 直接访问产品详情页
- [ ] 访问 http://localhost:3000/product/109
- [ ] 验证页面能正确加载
- [ ] 验证显示以下内容:
  - ✅ 产品名称
  - ✅ 产品价格（EUR 格式）
  - ✅ 产品图片
  - ✅ 短描述（Overview 部分）
  - ✅ 完整描述（Product Details 部分）
  - ✅ 库存状态
  - ✅ 其他产品图片（如果有多张）

### Test 4: 检查控制台日志
打开浏览器开发者工具，查看控制台：
- [ ] 应该看到 `🔍 [getProductById] Fetching product: 109`
- [ ] 应该看到 `🌐 [getProductById] URL: https://linexpv.com/wp-json/wc/store/v1/products/109`
- [ ] 应该看到 `📊 [getProductById] Response status: 200 OK`
- [ ] 应该看到 `✅ [getProductById] Product found: 109 <产品名称>`

### Test 5: 测试错误处理
- [ ] 访问 http://localhost:3000/product/999999（不存在的 ID）
- [ ] 验证显示 "Product Not Found" 页面
- [ ] 验证有 Debug Info 显示
- [ ] 验证有 "Back to Store" 按钮

### Test 6: 验证 API 调用
在服务器端日志中检查（运行 dev server 的终端）：
- [ ] URL 格式: `https://linexpv.com/wp-json/wc/store/v1/products/<id>`
- [ ] **不应该**有 `/wp-json/wc/v3/products/<id>` 调用
- [ ] **不应该**有任何包含 "ngrok" 的 URL

### Test 7: 检查图片加载
- [ ] 产品详情页中所有图片都能正确显示
- [ ] 检查浏览器网络面板，图片 URL 应该直接是 WooCommerce 图片 URL
- [ ] **不应该**有任何 ngrok 域名出现

## 已知问题

1. ⚠️ 其他页面（如 /shop, /page.tsx, /sitemap.ts）仍在使用 wc/v3 API，因为它们需要获取产品列表
2. ⚠️ wc/v3 API 返回 401 Unauthorized，但不影响 Store API 的产品详情页功能

## API 端点对比

| 用途 | 旧 API | 新 API (仅产品详情页) |
|------|--------|---------------------|
| 获取产品列表 | `/wp-json/wc/v3/products` | `/wp-json/wc/store/v1/products` |
| 获取单个产品 | `/wp-json/wc/v3/products/{id}` | **`/wp-json/wc/store/v1/products/{id}`** ✅ |

## 下一步建议

如果需要进一步优化：
1. 考虑将所有产品列表页面也迁移到 Store API
2. 清理 lib/woocommerce.ts 中未使用的 wc/v3 方法
3. 删除 lib/utils.ts 中的 getNgrokImageUrl 函数（已无调用）
