# Store API 完全迁移文档

## ✅ 已完成的修改

### 1. lib/woocommerce.ts - 新增 Store API 方法

#### getStoreProducts()
```typescript
async getStoreProducts(params?: {
  per_page?: number;
  category?: number | string;
  page?: number;
}): Promise<WooCommerceStoreProduct[]>
```
- 请求：`https://linexpv.com/wp-json/wc/store/v1/products`
- Headers：Accept, User-Agent, ngrok-skip-browser-warning
- 支持分页和分类过滤
- ❌ 不使用 Authorization

#### getStoreCategories()
```typescript
async getStoreCategories(): Promise<WooCommerceStoreCategory[]>
```
- 请求：`https://linexpv.com/wp-json/wc/store/v1/products/categories`
- Headers：Accept, User-Agent, ngrok-skip-browser-warning
- 获取所有分类（包含 parent 关系）
- ❌ 不使用 Authorization

#### getProductById()
```typescript
async getProductById(id: number): Promise<WooCommerceStoreProduct | null>
```
- 请求：`https://linexpv.com/wp-json/wc/store/v1/products/${id}`
- Headers：Accept, User-Agent, ngrok-skip-browser-warning
- ❌ 不使用 Authorization

### 2. app/store/page.tsx - 完全重写

**架构改变：**
- 服务端组件 (SSR)
- 使用 `StoreProductCard` 组件（支持 Store API 数据结构）
- Header + Footer 完整布局

**数据获取流程：**
1. 调用 `getStoreCategories()` 获取所有分类
2. 找到 ONEHO 父分类（slug: 'oneho'）
3. 获取所有子分类（parent === oneho.id）
4. 为每个子分类调用 `getStoreProducts({ category: childId })`
5. 分组渲染

**UI 特性：**
- 分类标题 + 商品数量
- 3 列网格布局 (lg:grid-cols-3)
- 每个商品卡片链接到 `/product/${id}`
- 错误处理和空状态显示

### 3. 组件使用

**StoreProductCard** (components/StoreProductCard.tsx)
- 接收 `WooCommerceStoreProduct` 类型
- 显示图片、名称、价格（支持 sale/regular）
- 链接：`/product/${product.id}`
- ✅ 已正确使用

**ProductCard** (components/ProductCard.tsx)
- 接收 `WooCommerceProduct` 类型（wc/v3 API）
- 用于其他页面（homepage, shop）

### 4. 清除残留

**✅ 完成项：**
- Store 页面不再使用内联样式
- 不再使用 wc/v3 API
- 不再使用 permalink 跳转
- 所有卡片统一链接到 `/product/${id}`
- BASE_URL 统一为 https://linexpv.com

**ℹ️ 保留项：**
- lib/utils.ts 的 getNgrokImageUrl 函数（未使用但保留）
- wc/v3 API 方法（homepage、shop、sitemap 仍在使用）

## 📋 测试清单

### Test 1: Store 首页加载
- [ ] 访问 http://localhost:3000/store
- [ ] 验证显示标题 "Store" 和描述
- [ ] 验证显示分类分组（如：Accessories、Microinverters）
- [ ] 验证每个分类显示商品数量

### Test 2: 产品卡片显示
- [ ] 验证每个商品卡片显示：
  - ✅ 产品图片
  - ✅ 产品名称
  - ✅ 价格（EUR 格式）
  - ✅ Sale 价格（如果有折扣）
- [ ] hover 效果正常（图片缩放、边框变化）

### Test 3: 产品跳转
- [ ] 点击任意商品卡片
- [ ] URL 格式为 `/product/<数字ID>`（不是 slug）
- [ ] 产品详情页正确加载

### Test 4: 服务端日志
打开运行 dev server 的终端，查看日志：
```
🔍 [getStoreCategories] Fetching categories: https://linexpv.com/wp-json/wc/store/v1/products/categories
📊 [getStoreCategories] Response status: 200
✅ [getStoreCategories] Categories found: X
📦 All categories: [...]
🎯 Found ONEHO parent category: XX ONEHO
👶 Child categories: [...]
🔍 [getStoreProducts] Fetching products: https://linexpv.com/wp-json/wc/store/v1/products?category=XX&per_page=50
📊 [getStoreProducts] Response status: 200
✅ [getStoreProducts] Products found: X
✅ Accessories: X products
✅ Microinverters: X products
```

### Test 5: 错误处理
- [ ] 如果 API 失败，显示错误提示框（红色边框）
- [ ] 如果分类为空，显示 "No products found in this category"

### Test 6: 详情页仍然工作
- [ ] 访问 http://localhost:3000/product/109
- [ ] 验证详情页正常显示（图片、标题、价格、描述）
- [ ] 点击 "Back to Store" 返回 /store

## API 端点对比

| 功能 | 旧 API (wc/v3) | 新 API (Store API) |
|------|----------------|-------------------|
| 获取产品列表 | `/wp-json/wc/v3/products` (需要 Auth) | **`/wp-json/wc/store/v1/products`** ✅ |
| 获取单个产品 | `/wp-json/wc/v3/products/{id}` (需要 Auth) | **`/wp-json/wc/store/v1/products/{id}`** ✅ |
| 获取分类列表 | `/wp-json/wc/v3/products/categories` (需要 Auth) | **`/wp-json/wc/store/v1/products/categories`** ✅ |

## 数据结构对比

### WooCommerceProduct (wc/v3)
```typescript
{
  id: number;
  name: string;
  price: string;          // "99.00"
  regular_price: string;
  sale_price: string;
  images: Array<{ src: string; }>;
}
```

### WooCommerceStoreProduct (Store API)
```typescript
{
  id: number;
  name: string;
  prices: {
    price: string;              // "9900" (分为单位)
    regular_price: string;
    currency_code: string;      // "EUR"
    currency_prefix: string;    // "€"
    currency_minor_unit: number; // 2
  };
  images: Array<{ src: string; }>;
}
```

## 分类结构

```
ONEHO (parent)
├── Accessories (child)
│   └── Products: 螺丝、电缆等
└── Microinverters (child)
    └── Products: 微逆变器产品
```

## 环境变量

**.env.local:**
```bash
NEXT_PUBLIC_SITE_URL=https://linexpv.com
WC_CONSUMER_KEY=ck_xxx  # Store API 不需要，但其他页面仍使用 wc/v3
WC_CONSUMER_SECRET=cs_xxx
```

## 性能优化建议

1. **缓存策略**
   - 当前：`cache: 'no-store'`
   - 建议：使用 Next.js revalidate
   ```typescript
   { next: { revalidate: 60 } }  // 60秒缓存
   ```

2. **并行请求**
   - 当前：串行获取每个分类的产品
   - 建议：使用 Promise.all 并行
   ```typescript
   const results = await Promise.all(
     childCategories.map(cat =>
       woocommerce.getStoreProducts({ category: cat.id })
     )
   );
   ```

3. **图片优化**
   - 使用 Next.js Image 组件（已实现）
   - 考虑添加 loading="lazy"

## 已知限制

1. ⚠️ 其他页面（homepage、shop、sitemap）仍使用 wc/v3 API
   - 需要 Authorization
   - 当前返回 401 错误
   - Store 页面不受影响

2. ⚠️ Store API 不支持搜索功能
   - 如需搜索，需要客户端过滤或使用 wc/v3

3. ⚠️ 分类层级固定为 2 层
   - 当前实现：ONEHO -> 子分类
   - 不支持更深层级

## 下一步建议

### 短期（可选）
1. ✅ Store 页面已完成 Store API 迁移
2. ✅ 产品详情页已完成 Store API 迁移
3. 🔄 考虑将 homepage 产品展示也迁移到 Store API

### 长期（可选）
1. 实现搜索功能（客户端过滤或混合 API）
2. 添加分页功能
3. 添加产品筛选（价格、库存状态）
4. 性能优化（并行请求、缓存策略）
