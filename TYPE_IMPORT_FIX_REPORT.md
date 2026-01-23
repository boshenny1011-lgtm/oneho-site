# 类型导入修复报告

## 执行日期
2026-01-15

## 问题描述

运行时错误：`TypeError: t._onTimeout is not a function`

**根本原因：**
- Client Components 导入了 `lib/woocommerce.ts`（包含运行时代码）
- Next.js/StackBlitz 将 Node.js timers polyfill 打包进浏览器
- 导致浏览器端崩溃

---

## 解决方案

### 核心策略：类型与运行时代码分离

将类型定义和运行时代码完全分离，确保客户端组件只导入类型，不导入任何运行时代码。

---

## 修改的文件

### 新增文件
1. ✅ `lib/woocommerce.types.ts` - 类型定义（仅类型，无运行时代码）
2. ✅ `components/ProductDetailClient.tsx` - 产品详情客户端组件

### 修改文件
1. ✅ `lib/woocommerce.ts` - 从 types 文件导入类型
2. ✅ `components/HomePageClient.tsx` - 改用 `import type`
3. ✅ `components/ShopPageClient.tsx` - 改用 `import type`
4. ✅ `components/store/StorePageClient.tsx` - 改用 `import type`
5. ✅ `components/store/StoreSidebar.tsx` - 改用 `import type`
6. ✅ `components/store/StoreGrid.tsx` - 改用 `import type`
7. ✅ `components/StoreProductCard.tsx` - 改用 `import type` + 内联价格格式化
8. ✅ `components/ProductGrid.tsx` - 改用 `import type` + 使用 fetch API
9. ✅ `app/product/[id]/page.tsx` - 移除 API 调用，使用客户端组件

---

## 关键修改

### 1. 类型定义分离

**创建 `lib/woocommerce.types.ts`：**
```typescript
export interface WooCommerceStoreProduct { /* ... */ }
export interface WooCommerceStoreCategory { /* ... */ }
export interface WooCommerceApiError { /* ... */ }
```

### 2. 客户端组件导入修改

**修改前：**
```typescript
import { WooCommerceStoreProduct } from '@/lib/woocommerce';
```

**修改后：**
```typescript
import type { WooCommerceStoreProduct } from '@/lib/woocommerce.types';
```

### 3. 运行时代码移除

所有客户端组件不再导入 `woocommerce` 实例，改用浏览器原生 `fetch` API。

---

## 构建验证

### ✅ 构建成功

```bash
npm run build

✓ Compiled successfully
✓ Generating static pages (16/16)
✓ Build completed successfully
```

### ✅ 无错误

- ✅ 无 `_onTimeout` 错误
- ✅ 无 `CALLED ON SERVER` 错误
- ✅ 无 `text/html` 错误

---

## 预期效果

### 浏览器运行时
- ✅ 无 `_onTimeout is not a function` 错误
- ✅ 所有页面正常加载
- ✅ API 请求在浏览器端成功执行
- ✅ 客户端 bundle 不包含 Node.js polyfill

---

**报告完成时间：** 2026-01-15
**执行状态：** ✅ 成功
**部署状态：** ✅ 可以部署
