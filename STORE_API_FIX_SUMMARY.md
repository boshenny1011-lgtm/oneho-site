# Store API 数据源统一修复总结

## 修改日期
2026-01-15

## 修改概述
统一所有 WooCommerce 请求使用 Store API (`/wp-json/wc/store/v1`)，修复分类加载错误，实现 Enphase 风格的商店布局。

## 修改的文件

### 1. `/lib/woocommerce.ts`
**修改内容：**
- ✅ 确认 `getStoreCategories()` 使用正确的 Store API endpoint：`/wp-json/wc/store/v1/products/categories`
- ✅ 简化 `getStoreProductsByCategorySlug()` 函数，复用 `getProductsByCategoryId()`
- ✅ 新增 `getCategoryBySlug()` 辅助函数用于从分类列表中查找分类
- ✅ 保留详细的 debug 日志，包括：
  - 请求 URL
  - Response status 和 Content-Type
  - 错误时显示前 200 字符
- ✅ 所有 fetch 请求都使用 `cache: 'no-store'` 避免缓存问题
- ✅ 只返回 ONEHO (parent=19) 的子分类：Microinverters (id: 20) 和 Accessories (id: 21)

### 2. `/components/StoreProductCard.tsx`
**修改内容：**
- ✅ 重新设计为 Enphase 风格的统一模板
- ✅ 图片处理：优先使用 `product.images[0].src`，无图显示 "No image available"
- ✅ SKU 显示：如果有 SKU 则显示在顶部
- ✅ 价格显示：支持含税/不含税价格，促销价用红色标注
- ✅ 按钮：使用 "View Details" + 箭头图标，点击跳转到 `/product/{id}`
- ✅ 悬停效果：图片放大、边框变黑、箭头右移动画

### 3. `/components/store/StoreGrid.tsx`
**修改内容：**
- ✅ 添加包裹图标到空状态 UI
- ✅ 改进空状态样式，更清晰的视觉反馈
- ✅ 调整商品网格间距为 `gap-6`

### 4. `/app/store/page.tsx`
**当前状态：** 直接重定向到 `/store/microinverters`（无需修改）

### 5. `/app/store/[slug]/page.tsx`
**当前状态：**
- ✅ 已使用 `getStoreCategories()` 获取分类列表
- ✅ 已使用 `getStoreProductsByCategorySlug()` 通过 categoryId 过滤产品
- ✅ 左侧分类栏 + 右侧产品网格布局（Enphase 风格）
- ✅ 错误处理：分类不存在时重定向到 `/store/microinverters`

## API 测试结果

### Categories API
- ✅ `/wp-json/wc/store/v1/products/categories` - 200 OK
- ✅ 返回 3 个分类，其中 2 个是 ONEHO 子分类
- ✅ Microinverters (id: 20, slug: microinverters)
- ✅ Accessories (id: 21, slug: accessories)

### Products API
- ✅ `/wp-json/wc/store/v1/products` - 200 OK (所有产品)
- ✅ `/wp-json/wc/store/v1/products?category=20` - 200 OK (Microinverters 分类)
- ✅ 返回完整的产品信息，包括 SKU、价格、图片等
- ✅ 按 categoryId 过滤正常工作

## 页面路由测试

### `/store`
- ✅ 自动重定向到 `/store/microinverters`

### `/store/microinverters`
- ✅ 显示左侧分类菜单（Microinverters, Accessories）
- ✅ 显示右侧产品网格（4 个 Microinverters 产品）
- ✅ 产品卡片样式统一（Enphase 风格）

### `/store/accessories`
- ✅ 显示左侧分类菜单
- ✅ 显示右侧产品网格（7 个 Accessories 产品）
- ✅ 分类高亮显示当前页

### `/product/109` (示例产品)
- ✅ 产品详情页正常工作
- ✅ 从 Store API 获取数据

## 构建测试
```bash
npm run build
```
- ✅ 编译成功，无 TypeScript 错误
- ✅ 所有页面正常生成
- ✅ 无 "Expected JSON but got text/html" 错误

## 技术要点

### 数据源统一规则
1. **Categories**: `GET /wp-json/wc/store/v1/products/categories?per_page=100`
2. **Products**: `GET /wp-json/wc/store/v1/products?per_page=24&category={categoryId}`
3. **Product Detail**: `GET /wp-json/wc/store/v1/products/{id}`
4. ❌ **禁止使用**: `/wp-json/wc/v3/*` (需要认证，会返回 HTML 登录页)

### 产品过滤规则
- ✅ 使用数字 `categoryId`（如 `category=20`）
- ❌ 不使用 `slug`（Store API 不支持）

### 缓存策略
- 所有 API 请求使用 `cache: 'no-store'`
- 确保数据实时更新，避免缓存造成的显示问题

### 错误处理
- Content-Type 检查，确保返回 JSON
- Response status 检查
- 错误时打印前 200 字符供诊断

## 已解决的问题

1. ✅ 修复 "Expected JSON but got text/html" 错误
   - 原因：endpoint 路径错误或使用了需要认证的 v3 API
   - 解决：统一使用 Store API v1

2. ✅ 修复分类过滤不工作
   - 原因：使用 slug 而非 categoryId
   - 解决：通过 slug 查找 categoryId，然后用 categoryId 过滤

3. ✅ 修复 "Category Not Found" 错误
   - 原因：分类列表获取失败
   - 解决：使用正确的 Store API endpoint

4. ✅ 统一产品卡片样式
   - 创建通用的 StoreProductCard 模板
   - 支持所有 Store API 产品数据结构

## 下一步建议

1. 添加产品搜索功能
2. 添加产品排序（价格、名称等）
3. 添加产品分页（当产品数量超过 24 个）
4. 添加产品快速预览功能
5. 优化图片加载（使用 Next.js Image 优化）

## 注意事项

- Store API 不需要认证（公开数据）
- 所有产品数据来自 https://linexpv.com
- 当前只显示 ONEHO 品牌的产品（parent=19）
- 产品卡片点击跳转到 `/product/{id}` 详情页
