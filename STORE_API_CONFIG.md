# ✅ Store API 完整配置确认

## 环境配置

### .env 文件
```env
NEXT_PUBLIC_SITE_URL=https://linexpv.com
WC_CONSUMER_KEY=ck_bd7dd79b6bb178d73bfc65bd7092f97d7707a51b
WC_CONSUMER_SECRET=cs_de30b9e6f670c32262539219da9868f7957f0758
```

**重要说明：**
- ✅ BASE_URL 读取自 `process.env.NEXT_PUBLIC_SITE_URL`
- ✅ 如果未设置，回退到硬编码 `https://linexpv.com`
- ✅ 不使用 ngrok 域名
- ✅ Store API 不需要 Consumer Key/Secret

## lib/woocommerce.ts - API 方法

### 1. getProducts()
```typescript
async getProducts(params?: {
  per_page?: number;
  page?: number;
  category?: number | string;
  search?: string;
}): Promise<WooCommerceStoreProduct[]>
```

**实现：**
- ✅ 内部重定向到 `getStoreProducts()`
- ✅ 使用 Store API：`/wp-json/wc/store/v1/products`
- ✅ 不使用 Authorization header
- ✅ 控制台日志：`⚠️ [getProducts] Redirecting to Store API`

### 2. getCategories()
```typescript
async getCategories(): Promise<WooCommerceStoreCategory[]>
```

**实现：**
- ✅ 内部重定向到 `getStoreCategories()`
- ✅ 使用 Store API：`/wp-json/wc/store/v1/products/categories`
- ✅ 不使用 Authorization header
- ✅ 控制台日志：`⚠️ [getCategories] Redirecting to Store API`

### 3. getProductById(id)
```typescript
async getProductById(id: number): Promise<WooCommerceStoreProduct | null>
```

**实现：**
- ✅ 使用 Store API：`/wp-json/wc/store/v1/products/${id}`
- ✅ 不使用 Authorization header
- ✅ 详细的调试日志：
  ```
  🔍 [getProductById] Fetching product: ${id}
  🌐 [getProductById] Full URL: ${url}
  🏠 [getProductById] Base URL: ${baseUrl}
  📊 [getProductById] Response status: ${status}
  📄 [getProductById] Content-Type: ${contentType}
  ```

**开发环境增强调试：**
- ✅ 检查 Content-Type 是否为 `application/json`
- ✅ 如果不是 JSON，打印前 200 字符
- ✅ 检测 Cloudflare 或 HTML 响应
- ✅ 错误响应打印前 200 字符

### 4. getStoreProducts()
```typescript
async getStoreProducts(params?: {
  per_page?: number;
  category?: number | string;
  page?: number;
}): Promise<WooCommerceStoreProduct[]>
```

**实现：**
- ✅ 直接使用 Store API：`/wp-json/wc/store/v1/products`
- ✅ 支持分类过滤
- ✅ 支持分页
- ✅ 详细日志

### 5. getStoreCategories()
```typescript
async getStoreCategories(): Promise<WooCommerceStoreCategory[]>
```

**实现：**
- ✅ 直接使用 Store API：`/wp-json/wc/store/v1/products/categories`
- ✅ 返回完整分类列表（包含 parent 关系）

## 页面链接统一

### ✅ 所有产品链接格式
```tsx
/product/${product.id}
```

### 使用位置
1. ✅ `components/StoreProductCard.tsx` - `/product/${product.id}`
2. ✅ `components/ProductCard.tsx` - `/product/${product.id}`
3. ✅ `app/store/page.tsx` - 使用 StoreProductCard
4. ✅ `app/shop/page.tsx` - 使用 StoreProductCard
5. ✅ `components/ProductGrid.tsx` - 使用 StoreProductCard
6. ✅ `app/page.tsx` - 使用 StoreProductCard

**不使用：**
- ❌ `product.permalink` (会跳转到 WordPress)
- ❌ `/product/${product.slug}` (需要额外查询)
- ❌ ngrok 域名

## 构建验证

### ✅ 构建成功输出
```
🏠 WooCommerce Client initialized
🌐 BASE_URL: https://linexpv.com
📦 Source: env.NEXT_PUBLIC_SITE_URL
⚠️ [getProducts] Redirecting to Store API (getStoreProducts)
🔍 [getStoreProducts] Fetching products: https://linexpv.com/wp-json/wc/store/v1/products?per_page=3
📊 [getStoreProducts] Response status: 200
✅ [getStoreProducts] Products found: 3
```

### ✅ TypeScript 检查通过
```bash
npm run typecheck
# ✓ 无错误
```

### ✅ 构建通过
```bash
npm run build
# ✓ Compiled successfully
```

## 详情页调试

### 开发环境日志示例
访问 `http://localhost:3000/product/109`

**正常响应（JSON）：**
```
🔍 [getProductById] Fetching product: 109
🌐 [getProductById] Full URL: https://linexpv.com/wp-json/wc/store/v1/products/109
🏠 [getProductById] Base URL: https://linexpv.com
📊 [getProductById] Response status: 200 OK
📄 [getProductById] Content-Type: application/json; charset=UTF-8
✅ [getProductById] Product found: 109 Product Name
```

**异常响应（HTML）：**
```
🔍 [getProductById] Fetching product: 109
🌐 [getProductById] Full URL: https://linexpv.com/wp-json/wc/store/v1/products/109
🏠 [getProductById] Base URL: https://linexpv.com
📊 [getProductById] Response status: 200 OK
📄 [getProductById] Content-Type: text/html; charset=UTF-8
⚠️ [getProductById] Response is NOT JSON!
⚠️ [getProductById] First 200 chars of response:
<!DOCTYPE html>
<html>
<head><title>Cloudflare Challenge</title></head>
...
❌ Error: Received HTML instead of JSON - possible Cloudflare/CDN page or login redirect
```

**网络错误：**
```
🔍 [getProductById] Fetching product: 109
🌐 [getProductById] Full URL: https://linexpv.com/wp-json/wc/store/v1/products/109
🏠 [getProductById] Base URL: https://linexpv.com
📊 [getProductById] Response status: 404 Not Found
📄 [getProductById] Content-Type: application/json
❌ [getProductById] Failed to fetch product
❌ [getProductById] Status: 404
❌ [getProductById] Error response (first 200 chars): {"code":"woocommerce_rest_product_invalid_id","message":"Invalid ID.","data":{"status":404}}
```

## API 端点对比表

| 方法 | 旧端点 (wc/v3) | 新端点 (Store API) | 需要认证 |
|------|---------------|-------------------|---------|
| `getProducts()` | `/wp-json/wc/v3/products` | **`/wp-json/wc/store/v1/products`** | ❌ |
| `getCategories()` | `/wp-json/wc/v3/products/categories` | **`/wp-json/wc/store/v1/products/categories`** | ❌ |
| `getProductById(id)` | `/wp-json/wc/v3/products/${id}` | **`/wp-json/wc/store/v1/products/${id}`** | ❌ |

## 测试清单

### ✅ 环境配置
- [x] `.env` 包含 `NEXT_PUBLIC_SITE_URL=https://linexpv.com`
- [x] BASE_URL 读取正确
- [x] 不使用 ngrok 域名

### ✅ API 方法
- [x] `getProducts()` 使用 Store API
- [x] `getCategories()` 使用 Store API
- [x] `getProductById()` 使用 Store API
- [x] 所有请求不使用 Authorization

### ✅ 页面链接
- [x] Store 页面链接格式 `/product/${id}`
- [x] Shop 页面链接格式 `/product/${id}`
- [x] 首页产品链接格式 `/product/${id}`
- [x] 详情页正常工作

### ✅ 调试功能
- [x] Content-Type 检查
- [x] HTML 响应检测
- [x] 错误响应前 200 字符打印
- [x] Cloudflare 页面检测

### ✅ 构建和类型
- [x] TypeScript 检查通过
- [x] 构建成功
- [x] 无类型错误

## 快速测试命令

```bash
# 1. 检查环境变量
echo $NEXT_PUBLIC_SITE_URL

# 2. TypeScript 检查
npm run typecheck

# 3. 构建测试
npm run build

# 4. 启动开发服务器
npm run dev

# 5. 测试页面
# - http://localhost:3000/store
# - http://localhost:3000/product/109
# - http://localhost:3000/shop
```

## 常见问题排查

### 问题 1: 获取 HTML 而不是 JSON

**症状：**
```
⚠️ [getProductById] Response is NOT JSON!
<!DOCTYPE html>...
```

**可能原因：**
1. Cloudflare 挑战页面
2. WordPress 登录重定向
3. CDN 缓存了错误页面
4. URL 配置错误

**解决方案：**
- 检查 BASE_URL 是否正确
- 在浏览器中直接访问 API URL
- 检查 Cloudflare 设置
- 清除 CDN 缓存

### 问题 2: 401 Unauthorized

**症状：**
```
📊 Response status: 401
```

**原因：**
- 错误地使用了 wc/v3 API
- 检查代码是否真的使用了 Store API

**解决方案：**
- 确认日志显示 `/wc/store/v1/products`
- 确认没有 Authorization header

### 问题 3: CORS 错误

**症状：**
浏览器控制台显示 CORS 错误

**解决方案：**
- Store API 是服务端调用，不应该有 CORS 问题
- 如果有，检查是否在客户端组件中调用

## 总结

✅ **所有 API 方法已迁移到 Store API**
✅ **BASE_URL 使用环境变量 NEXT_PUBLIC_SITE_URL**
✅ **所有产品链接统一为 `/product/${id}`**
✅ **添加了完善的调试日志**
✅ **开发环境增强调试功能**
✅ **构建和类型检查通过**

🎉 **迁移完成！准备好进行生产部署。**
