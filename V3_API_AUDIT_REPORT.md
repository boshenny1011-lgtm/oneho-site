# WooCommerce v3 API 审计与修复报告

## 修复时间
2026-01-15

## 搜索关键词及结果

### 1. 搜索 `/wp-json/wc/v3`
**命中文件：**
- ✅ `lib/woocommerce.ts:160` - **已修复** - `getProduct(id)` 方法改为重定向到 Store API
- 📄 其他命中均为文档文件（`.md`），非代码文件

### 2. 搜索 `wc/v3`
**命中文件：** 全部为文档文件，无代码文件使用 v3 API

### 3. 搜索 `Authorization.*Basic`
**命中文件：**
- ✅ `lib/woocommerce.ts` - **已删除** - `getAuthHeader()` 方法已删除，Store API 不需要认证
- 📦 `node_modules/*` - 依赖包，忽略
- 📄 文档文件

### 4. 搜索 `consumer_key` / `consumer_secret`
**命中文件：** 无，已全部清理

### 5. 搜索 `getCategories(`
**命中文件：**
- ✅ `lib/woocommerce.ts:153` - **已修复** - 重定向到 `getStoreCategories()`
- 📄 文档文件

### 6. 搜索 `getStoreCategories(`
**命中文件：**
- ✅ `app/store/[slug]/page.tsx:19, 52` - 正确使用 Store API
- ✅ `lib/woocommerce.ts:155, 288, 356` - 正确实现

## 修复的文件

### `/lib/woocommerce.ts`

#### 1. 统一 BASE URL 配置
**修改前：**
```typescript
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL;
const CONSUMER_KEY = process.env.WC_CONSUMER_KEY || "ck_...";
const CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET || "cs_...";

class WooCommerceClient {
  private baseUrl: string;
  private consumerKey: string;
  private consumerSecret: string;

  constructor() {
    this.baseUrl = BASE_URL || "https://linexpv.com";
    this.consumerKey = CONSUMER_KEY;
    this.consumerSecret = CONSUMER_SECRET;
  }

  private getAuthHeader(): string {
    const credentials = btoa(`${this.consumerKey}:${this.consumerSecret}`);
    return `Basic ${credentials}`;
  }
}
```

**修改后：**
```typescript
const STORE_BASE = "https://linexpv.com/wp-json/wc/store/v1";

class WooCommerceClient {
  private baseUrl: string;
  private storeApiBase: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://linexpv.com";
    this.storeApiBase = `${this.baseUrl}/wp-json/wc/store/v1`;

    console.log('🏠 WooCommerce Client initialized');
    console.log('🌐 Site URL:', this.baseUrl);
    console.log('📡 Store API Base:', this.storeApiBase);
  }
}
```

**改进点：**
- ✅ 删除 `CONSUMER_KEY` 和 `CONSUMER_SECRET`（Store API 不需要认证）
- ✅ 删除 `getAuthHeader()` 方法
- ✅ 新增 `storeApiBase` 统一管理 Store API 端点
- ✅ 所有 API 请求使用 `this.storeApiBase` 构建 URL

#### 2. 修复 `getProduct(id)` 方法
**修改前：** 使用 `/wp-json/wc/v3/products/${id}` + Basic Auth

**修改后：** 重定向到 `getProductById()`
```typescript
async getProduct(id: number): Promise<WooCommerceProduct> {
  console.log('⚠️ [getProduct] Deprecated method called, redirecting to Store API (getProductById)');
  const storeProduct = await this.getProductById(id);
  if (!storeProduct) {
    throw new Error(`Product ${id} not found`);
  }
  return storeProduct as any;
}
```

#### 3. 统一 API 端点
**所有方法现在使用 Store API v1：**

| 方法 | URL 构建方式 | 是否需要认证 |
|------|-------------|-------------|
| `getStoreCategories()` | `${this.storeApiBase}/products/categories` | ❌ |
| `getStoreProducts()` | `${this.storeApiBase}/products` | ❌ |
| `getProductById(id)` | `${this.storeApiBase}/products/${id}` | ❌ |
| `getProductsByCategoryId()` | 调用 `getStoreProducts()` | ❌ |
| `getStoreProductsByCategorySlug()` | 调用 `getProductsByCategoryId()` | ❌ |
| `getProduct(id)` | 重定向到 `getProductById()` | ❌ |
| `getCategories()` | 重定向到 `getStoreCategories()` | ❌ |
| `getProducts()` | 重定向到 `getStoreProducts()` | ❌ |

#### 4. 增强 Debug 日志
**所有 API 方法现在输出：**
- 🔍 请求 URL
- 📊 Response status 和 statusText
- 📊 Response URL（重定向检测）
- 📄 Content-Type
- ✅/❌ 成功/失败状态
- ❌ 错误时输出 response body 前 200 字符

**示例输出：**
```
🔍 [getStoreProducts] Fetching products: https://linexpv.com/wp-json/wc/store/v1/products?per_page=20
🔍 [getStoreProducts] Params: { per_page: 20, category: undefined, page: undefined }
📊 [getStoreProducts] Response status: 200 OK
📊 [getStoreProducts] Response URL: https://linexpv.com/wp-json/wc/store/v1/products?per_page=20
📄 [getStoreProducts] Content-Type: application/json; charset=UTF-8
✅ [getStoreProducts] Products found: 11
```

## 构建测试结果

### 构建日志
```
npm run build

✓ Compiled successfully
✓ Checking validity of types...
✓ Generating static pages (17/17)

🏠 WooCommerce Client initialized
🌐 Site URL: https://linexpv.com
📡 Store API Base: https://linexpv.com/wp-json/wc/store/v1

⚠️ [getProducts] Redirecting to Store API (getStoreProducts)
🔍 [getStoreProducts] Fetching products: https://linexpv.com/wp-json/wc/store/v1/products?per_page=100
📊 [getStoreProducts] Response status: 200 OK
📄 [getStoreProducts] Content-Type: application/json; charset=UTF-8
✅ [getStoreProducts] Products found: 11
```

### API 调用验证
✅ 所有 API 请求使用 Store API v1
✅ 所有请求返回 JSON（Content-Type: application/json）
✅ 无 "Expected JSON but got text/html" 错误
✅ 无 401 Unauthorized 错误
✅ 无 v3 API 调用

## 页面路由测试

### `/store` → `/store/microinverters`
- ✅ 自动重定向工作
- ✅ 分类列表加载成功
- ✅ 产品列表加载成功

### `/store/microinverters`
- ✅ 左侧分类菜单显示（Microinverters, Accessories）
- ✅ 右侧产品网格显示 4 个产品
- ✅ 使用 `category=20` 过滤

### `/store/accessories`
- ✅ 左侧分类菜单显示
- ✅ 右侧产品网格显示 7 个产品
- ✅ 使用 `category=21` 过滤

### `/product/109`
- ✅ 产品详情页正常加载
- ✅ 使用 Store API 获取数据

## API 端点总结

### 当前使用的 API（全部 Store API v1）
```
BASE: https://linexpv.com/wp-json/wc/store/v1

GET /products                        - 获取所有产品
GET /products?category={id}          - 按分类 ID 过滤产品
GET /products?per_page={n}           - 限制返回数量
GET /products/{id}                   - 获取单个产品
GET /products/categories             - 获取所有分类
GET /products/categories?per_page={n} - 限制返回分类数量
```

### 已废弃的 API（不再使用）
```
❌ /wp-json/wc/v3/products           - 需要认证，返回 HTML
❌ /wp-json/wc/v3/products/{id}      - 需要认证，返回 HTML
❌ /wp-json/wc/v3/products/categories - 需要认证，返回 HTML
```

## 数据过滤规则

### 分类过滤
- ✅ 使用数字 `categoryId`（如 `category=20`）
- ✅ 从分类列表中查找 `slug` 对应的 `id`
- ❌ 不直接使用 `slug` 参数（Store API 不支持）

### ONEHO 品牌过滤
```typescript
const ONEHO_CATEGORY_ID = 19;
const onehoCategoryChildren = allCategories.filter(
  (cat: WooCommerceStoreCategory) => cat.parent === ONEHO_CATEGORY_ID
);
```

**过滤后的分类：**
- Microinverters (id: 20, slug: microinverters)
- Accessories (id: 21, slug: accessories)

## 错误处理改进

### Content-Type 检查
```typescript
const contentType = response.headers.get('content-type');
if (!contentType || !contentType.includes('application/json')) {
  const text = await response.text();
  console.error('❌ Response is NOT JSON! Content-Type:', contentType);
  console.error('❌ Response body (first 200 chars):', text.substring(0, 200));
  throw new Error(`Expected JSON but got ${contentType || 'unknown content-type'}`);
}
```

### Response Status 检查
```typescript
if (!response.ok) {
  const errorText = await response.text();
  console.error('❌ Failed to fetch');
  console.error('❌ Fetch URL:', url);
  console.error('❌ Status:', response.status);
  console.error('❌ Error body (first 200 chars):', errorText.substring(0, 200));
  throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
}
```

## 缓存策略
所有 API 请求使用：
```typescript
{
  cache: 'no-store'
}
```

确保每次都获取最新数据，避免缓存导致的显示问题。

## 安全改进

### 删除的认证代码
- ❌ `CONSUMER_KEY` 常量
- ❌ `CONSUMER_SECRET` 常量
- ❌ `getAuthHeader()` 方法
- ❌ `Authorization: Basic xxx` header

### 原因
Store API 是公开 API，不需要认证。使用认证会导致：
1. 请求被重定向到登录页
2. 返回 HTML 而非 JSON
3. 触发 "Expected JSON but got text/html" 错误

## 已解决的问题

1. ✅ **"Expected JSON but got text/html" 错误**
   - 原因：使用 v3 API + 认证，返回 HTML 登录页
   - 解决：统一使用 Store API v1，无需认证

2. ✅ **"Category Not Found" 错误**
   - 原因：分类 API 调用失败
   - 解决：使用正确的 Store API 端点

3. ✅ **产品过滤不工作**
   - 原因：使用 slug 而非 categoryId
   - 解决：先查找 slug 对应的 categoryId，再用 categoryId 过滤

4. ✅ **API 端点不统一**
   - 原因：多处硬编码 URL
   - 解决：统一使用 `this.storeApiBase`

5. ✅ **认证信息泄露**
   - 原因：硬编码 consumer key/secret
   - 解决：完全删除认证代码

## 验证清单

- ✅ 所有 API 使用 Store API v1
- ✅ 无 v3 API 调用
- ✅ 无认证代码（Authorization header）
- ✅ 无 consumer_key / consumer_secret
- ✅ 统一 BASE URL 配置
- ✅ 详细 debug 日志
- ✅ Content-Type 检查
- ✅ Response status 检查
- ✅ 错误时输出 response body
- ✅ 构建成功，无错误
- ✅ /store 页面正常工作
- ✅ /store/microinverters 正常工作
- ✅ /store/accessories 正常工作
- ✅ /product/{id} 正常工作

## 下一步建议

1. 考虑添加 API 响应缓存（使用 Next.js 的 revalidate）
2. 添加错误边界组件处理 API 错误
3. 添加产品搜索功能
4. 添加产品排序功能
5. 优化图片加载（使用 Next.js Image）
6. 添加 Loading skeleton 组件
