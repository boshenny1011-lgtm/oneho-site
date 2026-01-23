# 🎯 Store API 完全迁移 - 最终测试清单

## ✅ 已完成的所有修改

### 1. lib/woocommerce.ts - Store API 方法
- ✅ `getStoreProducts()` - 获取产品列表
- ✅ `getStoreCategories()` - 获取分类列表
- ✅ `getProductById()` - 获取单个产品
- ✅ 所有方法使用 `/wp-json/wc/store/v1`
- ✅ Headers: Accept, User-Agent, ngrok-skip-browser-warning
- ✅ 不使用 Authorization
- ✅ BASE_URL = https://linexpv.com

### 2. app/store/page.tsx - 完全重写
- ✅ 服务端组件 (SSR)
- ✅ 使用 `woocommerce.getStoreCategories()`
- ✅ 使用 `woocommerce.getStoreProducts({ category })`
- ✅ 自动发现 ONEHO 父分类
- ✅ 自动获取子分类（Accessories、Microinverters）
- ✅ 分组展示产品
- ✅ 使用 `StoreProductCard` 组件
- ✅ 所有产品链接到 `/product/${id}`
- ✅ Header + Footer 布局
- ✅ 错误处理

### 3. app/product/[id]/page.tsx - 确认使用 Store API
- ✅ 使用 `woocommerce.getProductById(id)`
- ✅ 从 URL params 读取 id
- ✅ 显示：name, prices, images, description
- ✅ 移除所有 `getNgrokImageUrl` 调用
- ✅ 直接使用图片 URL

### 4. 组件确认
- ✅ `StoreProductCard` - 支持 Store API 数据
- ✅ 链接：`/product/${product.id}`
- ✅ 显示价格（支持 sale/regular）

### 5. 环境配置
- ✅ `.env.local` - NEXT_PUBLIC_SITE_URL=https://linexpv.com
- ✅ BASE_URL 默认值已设置

---

## 🧪 完整测试步骤

### 📋 Phase 1: Store 列表页

#### Test 1.1: 基本加载
```bash
# 访问
http://localhost:3000/store
```

**预期结果：**
- ✅ 页面正常加载
- ✅ 显示 "Store" 标题
- ✅ 显示描述："Browse our complete range..."
- ✅ 显示分类分组（如 Accessories、Microinverters）
- ✅ 每个分类标题后显示商品数量 "(X)"

#### Test 1.2: 控制台日志检查
打开浏览器控制台或服务器终端，应该看到：
```
📦 All categories: [...]
🎯 Found ONEHO parent category: XX ONEHO
👶 Child categories: [...]
🔍 [getStoreProducts] Fetching products: https://linexpv.com/wp-json/wc/store/v1/products?category=XX&per_page=50
📊 [getStoreProducts] Response status: 200
✅ [getStoreProducts] Products found: X
✅ Accessories: X products
✅ Microinverters: X products
```

**❌ 不应该看到：**
- ❌ 任何 `/wp-json/wc/v3/products` 请求
- ❌ 任何 "ngrok" 域名
- ❌ 401 Unauthorized 错误（针对 Store 页面）

#### Test 1.3: 产品卡片显示
**检查每个产品卡片：**
- ✅ 产品图片正确显示
- ✅ 产品名称清晰可读
- ✅ 价格格式正确（EUR XX.XX）
- ✅ 如果有折扣，显示划线的原价
- ✅ hover 时边框变化
- ✅ hover 时图片轻微缩放

---

### 📋 Phase 2: 产品跳转和详情页

#### Test 2.1: 从 Store 跳转到详情页
1. 在 /store 页面点击任意产品卡片
2. 检查 URL 格式

**预期结果：**
- ✅ URL 格式：`/product/<数字ID>`
- ❌ 不应该是：`/product/<slug>`
- ❌ 不应该跳转到 WordPress 域名

#### Test 2.2: 详情页完整测试
```bash
# 直接访问
http://localhost:3000/product/109
```

**预期显示：**
- ✅ 产品主图片
- ✅ 产品名称
- ✅ 价格（EUR 格式）
- ✅ "Overview" 部分（short_description）
- ✅ "Product Details" 部分（完整 description）
- ✅ 库存状态（In Stock / Out of Stock）
- ✅ "Add to Cart" 按钮
- ✅ "Back to Store" 链接

**控制台日志：**
```
🔍 [getProductById] Fetching product: 109
🌐 [getProductById] URL: https://linexpv.com/wp-json/wc/store/v1/products/109
📊 [getProductById] Response status: 200 OK
✅ [getProductById] Product found: 109 <产品名称>
```

#### Test 2.3: 详情页图片
**检查所有图片：**
- ✅ 主图片显示正确
- ✅ 如果有多张图片，"More Images" 部分显示
- ✅ 所有图片 URL 不包含 "ngrok"
- ✅ 图片来自 WooCommerce 原始 URL

---

### 📋 Phase 3: 错误处理

#### Test 3.1: 无效产品 ID
```bash
# 访问不存在的产品
http://localhost:3000/product/999999
```

**预期结果：**
- ✅ 显示 "Product Not Found" 页面
- ✅ 显示 Debug Info（包含 id、status）
- ✅ 显示 "Back to Store" 按钮
- ✅ 控制台显示错误日志

#### Test 3.2: API 错误处理
如果 WooCommerce API 不可用，Store 页面应该：
- ✅ 显示红色错误提示框
- ✅ 错误信息清晰
- ✅ 不崩溃，页面仍可导航

---

### 📋 Phase 4: 网络请求验证

#### Test 4.1: 浏览器开发者工具 - Network 面板
打开 Chrome DevTools → Network 标签页

**检查所有请求：**
- ✅ 看到 `/wp-json/wc/store/v1/products/categories`
- ✅ 看到 `/wp-json/wc/store/v1/products?category=XX&per_page=50`
- ✅ 看到 `/wp-json/wc/store/v1/products/<id>`（详情页）
- ❌ 不应该看到 `/wp-json/wc/v3/products`（Store 和详情页）
- ❌ 不应该看到任何 Authorization header（Store API）

#### Test 4.2: 请求 Headers 验证
点击任意 Store API 请求，检查 Headers：
```
Accept: application/json
User-Agent: Mozilla/5.0
ngrok-skip-browser-warning: true
```

**❌ 不应该有：**
```
Authorization: Basic xxx
```

---

### 📋 Phase 5: 数据正确性

#### Test 5.1: 分类结构验证
在服务器日志中确认：
```
📦 All categories: [
  { id: 19, name: 'ONEHO', parent: 0 },
  { id: 20, name: 'Microinverters', parent: 19 },
  { id: 21, name: 'Accessories', parent: 19 }
]
🎯 Found ONEHO parent category: 19 ONEHO
👶 Child categories: [
  { id: 20, name: 'Microinverters' },
  { id: 21, name: 'Accessories' }
]
```

#### Test 5.2: 产品数据验证
随机选择一个产品，验证：
- ✅ 价格计算正确（prices.price / 10^currency_minor_unit）
- ✅ 分类显示正确
- ✅ 图片 URL 完整可访问
- ✅ 描述内容完整（允许 HTML）

---

### 📋 Phase 6: 回归测试

#### Test 6.1: 其他页面不受影响
访问以下页面确认仍然工作：
- ✅ http://localhost:3000/ (首页)
- ✅ http://localhost:3000/support
- ✅ http://localhost:3000/install
- ✅ http://localhost:3000/solutions/balcony
- ✅ http://localhost:3000/solutions/rooftop

**注意：** /shop 页面可能仍使用 wc/v3 API

---

## 🎨 UI/UX 检查清单

### 布局
- ✅ Header 固定在顶部
- ✅ Footer 在底部
- ✅ 内容居中，最大宽度 7xl
- ✅ 响应式设计（移动端、平板、桌面）

### 产品网格
- ✅ 桌面：3 列
- ✅ 平板：2 列
- ✅ 手机：1 列
- ✅ 间距均匀（gap-x-8 gap-y-12）

### 交互效果
- ✅ 产品卡片 hover 效果
- ✅ 链接 hover 颜色变化
- ✅ 图片平滑过渡
- ✅ 按钮 hover 状态

---

## 📊 性能检查

### 加载速度
- ✅ Store 页面首次加载 < 3秒
- ✅ 产品详情页首次加载 < 2秒
- ✅ 图片懒加载工作正常

### SEO
- ✅ 产品详情页有正确的 title
- ✅ 产品详情页有正确的 description
- ✅ OpenGraph 标签正确
- ✅ 结构化数据（Product Schema）正确

---

## ✅ 验收标准

### 必须通过（Critical）
- ✅ /store 页面使用 Store API
- ✅ /product/[id] 页面使用 Store API
- ✅ 所有产品链接到 /product/${id}
- ✅ 不使用 wc/v3 API（Store 和详情页）
- ✅ BASE_URL = https://linexpv.com
- ✅ 不使用 ngrok 域名
- ✅ TypeScript 类型检查通过
- ✅ npm run build 成功

### 应该通过（Important）
- ✅ 分类自动发现和分组
- ✅ 错误处理完善
- ✅ 控制台日志清晰
- ✅ UI 使用现有组件
- ✅ 响应式设计

### 可选（Nice to have）
- ⚪ 性能优化（缓存、并行请求）
- ⚪ 搜索功能
- ⚪ 分页功能
- ⚪ 产品筛选

---

## 🐛 已知问题和限制

### 不影响 Store 页面
1. ✅ Homepage (/page.tsx) 仍使用 wc/v3 - 401 错误
2. ✅ Shop (/shop/page.tsx) 仍使用 wc/v3 - 401 错误
3. ✅ Sitemap 仍使用 wc/v3 - 401 错误

**说明：** 这些页面的错误不影响 Store 页面和产品详情页的功能。

### Store API 限制
1. Store API 不支持复杂搜索
2. 某些高级过滤功能有限
3. 分类层级当前固定为 2 层

---

## 📝 测试签收表

| 测试项 | 状态 | 测试人 | 日期 |
|--------|------|--------|------|
| Store 页面加载 | ⬜ | | |
| 产品卡片显示 | ⬜ | | |
| 产品跳转 | ⬜ | | |
| 详情页显示 | ⬜ | | |
| 错误处理 | ⬜ | | |
| 网络请求验证 | ⬜ | | |
| 数据正确性 | ⬜ | | |
| UI/UX 检查 | ⬜ | | |
| 性能检查 | ⬜ | | |

---

## 🚀 下一步（可选）

### 如果需要进一步优化：

1. **性能优化**
   ```typescript
   // 并行请求
   const results = await Promise.all(
     childCategories.map(cat => getStoreProducts({ category: cat.id }))
   );

   // 添加缓存
   { next: { revalidate: 60 } }
   ```

2. **迁移其他页面**
   - Homepage 产品展示
   - Shop 页面
   - Sitemap 生成

3. **新功能**
   - 产品搜索
   - 产品筛选
   - 分页功能
   - 购物车集成

---

**✨ 迁移完成！所有核心功能已使用 Store API。**
