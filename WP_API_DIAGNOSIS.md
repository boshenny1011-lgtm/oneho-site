# WordPress API 诊断报告

## 🔍 问题诊断

### 核心问题
**WordPress WooCommerce Store API 不存在或不可访问**

测试结果：
- URL: `https://linexpv.com/wp-json/wc/store/v1/products/categories`
- 状态码: **404 Not Found**
- 这意味着：
  1. WordPress REST API 可能未启用
  2. WooCommerce 插件可能未安装
  3. WooCommerce Store API 可能未启用
  4. URL 路径可能不正确

## 📋 可能的原因

### 1. WooCommerce 未安装
如果 WordPress 站点没有安装 WooCommerce 插件，`/wp-json/wc/store/v1/` 端点将不存在。

### 2. Store API 未启用
WooCommerce Store API 需要单独启用，可能需要在 WordPress 后台配置。

### 3. 错误的 WordPress URL
`https://linexpv.com` 可能不是正确的 WordPress 站点地址。

### 4. WordPress REST API 被禁用
某些 WordPress 配置或插件可能会禁用 REST API。

## ✅ 解决方案

### 方案 1: 配置正确的 WordPress API 地址

如果你有 WordPress 站点，需要：

1. **确认 WordPress 站点地址**
   - 检查实际的 WordPress 站点 URL
   - 可能不是 `linexpv.com`，而是其他地址

2. **安装并启用 WooCommerce**
   - 在 WordPress 后台安装 WooCommerce 插件
   - 确保插件已激活

3. **启用 Store API**
   - WooCommerce Store API 通常随 WooCommerce 自动启用
   - 检查 WordPress 后台的 WooCommerce 设置

4. **测试 API 端点**
   - 访问：`http://你的wordpress站点/wp-json/wc/store/v1/products/categories`
   - 应该返回 JSON 数据，而不是 404

### 方案 2: 使用 Mock 数据（临时方案）

如果暂时没有 WordPress API，可以使用 mock 数据让网站正常运行。

### 方案 3: 使用其他数据源

如果你有产品数据在其他地方（JSON 文件、数据库等），可以修改代码从那里读取。

## 🧪 诊断工具

我已经创建了一个诊断 API 端点，你可以访问：

```
http://localhost:3000/api/test-wp-api
```

这会测试：
1. WordPress 站点是否可访问
2. WordPress REST API 是否存在
3. WooCommerce Store API 是否可用
4. 返回详细的错误信息

## 📝 下一步

1. **运行诊断工具**：
   ```bash
   npm run dev
   # 然后访问 http://localhost:3000/api/test-wp-api
   ```

2. **检查你的 WordPress 配置**：
   - 确认 WordPress 站点地址
   - 确认 WooCommerce 已安装
   - 确认 Store API 已启用

3. **告诉我结果**：
   - 如果你有 WordPress 站点，告诉我正确的 URL
   - 如果没有，我可以帮你设置 mock 数据
