# 修复 Stripe 模块未找到错误

## 问题

错误信息：
```
Module not found: Can't resolve 'stripe'
```

**原因**：`stripe` 包已在 `package.json` 中，但未安装到 `node_modules`。

## 解决方案

### 方案 1: 安装 Stripe 包（推荐）

```bash
npm install stripe
```

如果遇到网络问题，可以尝试：

1. **使用国内镜像**（如果在中国）：
   ```bash
   npm install stripe --registry=https://registry.npmmirror.com
   ```

2. **使用 yarn**（如果已安装）：
   ```bash
   yarn add stripe
   ```

3. **使用 pnpm**（如果已安装）：
   ```bash
   pnpm add stripe
   ```

### 方案 2: 检查网络连接

如果网络有问题：

1. 检查网络连接
2. 检查代理设置
3. 尝试使用 VPN（如果需要）

### 方案 3: 手动下载（最后手段）

如果以上都不行，可以：

1. 访问 https://www.npmjs.com/package/stripe
2. 下载 tarball
3. 手动解压到 `node_modules/stripe`

## 验证安装

安装成功后，验证：

```bash
# 检查 node_modules
ls node_modules/stripe

# 或检查 package.json 中的版本
npm list stripe
```

## 重启开发服务器

安装完成后，**必须重启开发服务器**：

```bash
# 停止当前服务器 (Ctrl+C)
npm run dev
```

## 如果仍然失败

如果安装后仍然报错，尝试：

1. 删除 `node_modules` 和 `package-lock.json`，重新安装：
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. 清除 Next.js 缓存：
   ```bash
   rm -rf .next
   npm run dev
   ```
