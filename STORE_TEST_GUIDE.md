# 🧪 Store 页面测试指南

## ✅ 实现完成

已成功实现 Enphase 风格的 Store 页面，所有数据来自 WooCommerce Store API。

---

## 📋 功能清单

### 1. 数据层（lib/woocommerce.ts）

✅ **getStoreCategories()**
- API: `/wp-json/wc/store/v1/products/categories`
- 返回所有分类
- 包含 HTML 响应检测

✅ **getProductsByCategoryId(categoryId, pageSize=24)**
- API: `/wp-json/wc/store/v1/products?category={id}&per_page={pageSize}`
- 返回指定分类的商品
- 包含 HTML 响应检测

✅ **getProductById(id)**
- API: `/wp-json/wc/store/v1/products/{id}`
- 返回单个商品详情
- 包含 HTML 响应检测

**所有 API 请求头**:
```javascript
{
  'Accept': 'application/json',
  'User-Agent': 'Mozilla/5.0',
  'ngrok-skip-browser-warning': 'true',
}
```

**错误处理**:
- ✅ Content-Type 验证
- ✅ HTML 响应检测（检测 `<` 开头）
- ✅ 可读的错误消息
- ✅ 开发模式详细日志

---

### 2. 页面结构

#### `/store` - 默认页（自动重定向）

**行为**:
1. 获取所有分类
2. 找到 `oneho` 父分类
3. 查找 `microinverters` 子分类
4. 如果找到，重定向到 `/store/microinverters`
5. 如果没有，重定向到第一个子分类
6. 如果都没有，显示加载页面

#### `/store/[slug]` - 分类页（Enphase 布局）

**左侧边栏 (StoreCategorySidebar)**:
- 显示 `oneho` 的所有子分类
- 当前分类黑底白字高亮
- 显示每个分类的商品数量
- 点击切换分类

**右侧内容区**:
- 分类标题（H1）
- 分类描述（如果有）
- 商品数量统计
- 商品卡片网格（3 列响应式）

**错误处理（仅开发模式）**:
- 如果分类不存在，显示红色错误框
- 可展开的 Debug Info
- 显示可用分类列表
- 显示 API URL

#### `/product/[id]` - 商品详情页

**数据源**: Store API (`getProductById`)

**显示内容**:
- 商品图片
- 商品名称
- 价格（格式化）
- SKU
- Short Description
- Full Description（HTML，使用 prose 样式）
- "Back to Store" 返回链接

---

## 🧪 测试清单

### 必须测试的 URL

#### ✅ 1. Store 默认页
```
http://localhost:3000/store
```

**预期行为**:
- 自动重定向到 `/store/microinverters`
- 或者重定向到第一个子分类

**检查点**:
- [ ] 页面自动跳转
- [ ] 没有看到"Loading categories..."
- [ ] URL 变为 `/store/microinverters` 或其他分类

---

#### ✅ 2. Microinverters 分类页
```
http://localhost:3000/store/microinverters
```

**预期显示**:
- [ ] 左侧分类栏显示
- [ ] Microinverters 高亮（黑底白字）
- [ ] 右侧显示分类标题
- [ ] 显示商品数量
- [ ] 显示商品网格（3 列）
- [ ] 每个商品卡片包含：图片、名称、价格

**交互测试**:
- [ ] 点击左侧其他分类，页面切换
- [ ] 点击商品卡片，跳转到 `/product/{id}`

---

#### ✅ 3. Accessories 分类页
```
http://localhost:3000/store/accessories
```

**预期显示**:
- [ ] 左侧分类栏显示
- [ ] Accessories 高亮
- [ ] 显示配件商品

---

#### ✅ 4. 商品详情页
```
http://localhost:3000/product/109
http://localhost:3000/product/110
```

**预期显示**:
- [ ] 商品图片
- [ ] 商品名称
- [ ] 价格
- [ ] Short Description
- [ ] Full Description（格式化的 HTML）
- [ ] "Back to Store" 链接有效

**检查 Console**:
```
🔍 [getProductById] Fetching product: 109
🌐 [getProductById] Full URL: https://linexpv.com/wp-json/wc/store/v1/products/109
📊 [getProductById] Response status: 200
✅ [getProductById] Product found: 109 Product Name
```

---

#### ✅ 5. 不存在的分类
```
http://localhost:3000/store/nonexistent
```

**预期行为**:
- 重定向到 `/store`

**开发模式额外显示**:
- [ ] 红色错误框
- [ ] 错误消息："Category 'nonexistent' not found"
- [ ] Debug Info 可展开
- [ ] 显示可用分类列表

---

#### ✅ 6. 不存在的商品
```
http://localhost:3000/product/99999
```

**预期显示**:
- [ ] 错误页面
- [ ] "Product Not Found" 或类似消息
- [ ] "Back to Store" 链接

---

## 🐛 Console 日志检查

### 正常流程日志

#### 访问 `/store`
```
📦 All categories: [...]
🎯 Found ONEHO parent category: 19 oneho
👶 Child categories: [...]
🔄 Redirecting to /store/microinverters
```

#### 访问 `/store/microinverters`
```
🏪 [StoreCategoryPage] Loading category: microinverters
📦 [StoreCategoryPage] Categories loaded: 15
🎯 [StoreCategoryPage] Found ONEHO parent: 19
✅ [StoreCategoryPage] Current category: 20 Microinverters
🔍 [getProductsByCategoryId] Fetching products for category: 20
🔍 [getStoreProducts] Fetching products: https://linexpv.com/wp-json/wc/store/v1/products?category=20&per_page=24
📊 [getStoreProducts] Response status: 200
✅ [getStoreProducts] Products found: 8
📦 [StoreCategoryPage] Products loaded: 8
```

#### 访问 `/product/109`
```
🔍 [getProductById] Fetching product: 109
🌐 [getProductById] Full URL: https://linexpv.com/wp-json/wc/store/v1/products/109
📊 [getProductById] Response status: 200
📄 [getProductById] Content-Type: application/json; charset=UTF-8
✅ [getProductById] Product found: 109 Product Name
```

---

## ❌ 错误场景测试

### 场景 1: API 返回 HTML（被拦截）

**模拟**: 暂时更改 BASE_URL 为错误地址

**预期**:
```
❌ [getStoreProducts] Response is NOT JSON! Content-Type: text/html
❌ [getStoreProducts] First 200 chars: <!DOCTYPE html>...
Error: Store API returned HTML instead of JSON
```

**页面显示**（开发模式）:
- 红色错误框
- 错误消息
- Debug Info

---

### 场景 2: API 返回 403/404

**预期**:
```
❌ [getStoreProducts] Failed to fetch products
❌ [getStoreProducts] Status: 403
Error: Failed to fetch products: 403 Forbidden
```

---

### 场景 3: 分类不存在

**访问**: `/store/invalid-category`

**预期**:
```
❌ [StoreCategoryPage] Category not found: invalid-category
🐛 [StoreCategoryPage] Debug info: {...}
```

**行为**: 重定向到 `/store`

---

## 🔗 链接格式验证

### ✅ 正确格式

所有商品卡片链接:
```tsx
/product/109
/product/110
/product/111
```

### ❌ 错误格式（不应出现）

```
https://linexpv.com/product/...  ❌
/product/slug-name              ❌
WordPress permalink             ❌
```

---

## 📱 响应式测试

### 桌面（≥1024px）
- [ ] 左侧边栏固定宽度（256px）
- [ ] 商品网格 3 列

### 平板（768px - 1023px）
- [ ] 侧边栏在顶部或全宽
- [ ] 商品网格 2 列

### 移动端（<768px）
- [ ] 侧边栏全宽
- [ ] 商品网格 1 列

---

## 🎨 UI 视觉检查

### 左侧边栏
- [ ] 白色背景
- [ ] 边框清晰
- [ ] 分类列表整齐
- [ ] 当前分类：黑底白字
- [ ] 其他分类：hover 时灰色背景
- [ ] 商品数量右对齐

### 商品卡片
- [ ] 图片宽高比正确（1:1）
- [ ] 名称清晰可读
- [ ] 价格显示正确
- [ ] Hover 效果：边框变化
- [ ] 间距合理

### 商品详情页
- [ ] 图片大而清晰
- [ ] 价格突出
- [ ] Description 格式化良好
- [ ] "Back to Store" 链接明显

---

## 🛠️ 故障排查

### 问题 1: 分类不显示

**检查**:
1. Console 中查找 `📦 All categories`
2. 确认是否有 `oneho` 父分类
3. 确认是否有子分类

**解决**:
- 在 WordPress 后台创建 `oneho` 父分类
- 创建 `microinverters` 和 `accessories` 子分类

---

### 问题 2: 商品不显示

**检查**:
1. Console 中查找 `✅ [getStoreProducts] Products found: X`
2. 访问 API URL 确认返回数据

**解决**:
- 在 WordPress 中为商品分配分类
- 确保商品状态为 "Published"
- 确保商品在该分类下

---

### 问题 3: API 返回 HTML

**症状**:
```
❌ Response is NOT JSON!
<!DOCTYPE html>...
```

**可能原因**:
- Cloudflare 挑战页
- WordPress 安全插件拦截
- 服务器配置问题

**解决**:
1. 浏览器直接访问 API URL 测试
2. 检查 Cloudflare 设置
3. 暂时禁用安全插件测试
4. 检查 WordPress REST API 设置

---

### 问题 4: 商品链接错误

**检查**: 点击商品卡片后的 URL

**预期**: `/product/109`（数字 ID）

**如果错误**:
- 检查 `StoreProductCard.tsx` 中的 Link href
- 确保使用 `product.id` 而不是 `product.slug`

---

## 📊 性能检查

### 页面加载时间
- [ ] 首次加载 < 2 秒
- [ ] 分类切换 < 1 秒
- [ ] 商品详情加载 < 1.5 秒

### API 调用
- [ ] 每个页面只调用必要的 API
- [ ] 没有重复调用
- [ ] 错误时有重试机制（可选）

---

## ✅ 最终验收清单

### 功能完整性
- [ ] `/store` 自动重定向
- [ ] `/store/[slug]` 显示分类商品
- [ ] 左侧边栏正常工作
- [ ] 分类高亮正确
- [ ] 商品卡片点击跳转正确
- [ ] `/product/[id]` 显示详情
- [ ] "Back to Store" 有效

### 数据准确性
- [ ] 所有数据来自 Store API
- [ ] 不使用 permalink
- [ ] 价格格式化正确
- [ ] 图片显示正常

### 错误处理
- [ ] 不存在的分类重定向到 `/store`
- [ ] 不存在的商品显示错误页
- [ ] API 错误显示友好提示（开发模式）
- [ ] Console 无报错（除预期的 404）

### 用户体验
- [ ] 响应式布局正常
- [ ] 加载状态清晰
- [ ] 交互流畅
- [ ] 视觉层次分明

### 代码质量
- [ ] TypeScript 类型检查通过
- [ ] 构建成功
- [ ] 无 ESLint 错误
- [ ] Console 日志有意义

---

## 🚀 部署前检查

- [ ] .env 配置正确
- [ ] NEXT_PUBLIC_SITE_URL 设置为生产域名
- [ ] 测试所有关键路径
- [ ] 验证生产环境 API 可访问
- [ ] 检查 Cloudflare/CDN 设置

---

## 📝 测试报告模板

```
测试日期: ___________
测试人员: ___________

1. /store 重定向: □ 通过 □ 失败
2. /store/microinverters: □ 通过 □ 失败
3. /store/accessories: □ 通过 □ 失败
4. /product/109: □ 通过 □ 失败
5. 不存在分类处理: □ 通过 □ 失败
6. 响应式布局: □ 通过 □ 失败
7. API 错误处理: □ 通过 □ 失败

发现问题:
___________________________________________
___________________________________________
___________________________________________
```

---

## 🎯 开始测试

1. 启动开发服务器：`npm run dev`
2. 打开浏览器 DevTools（F12）
3. 切换到 Console 标签
4. 依次访问测试 URL
5. 记录结果

祝测试顺利！🎉
