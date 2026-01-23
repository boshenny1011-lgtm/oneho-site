# 快速修复指南

## 问题：API 路由无法访问

### 解决方案

#### 1. 确保开发服务器正在运行

```bash
# 在项目根目录运行
npm run dev
```

你应该看到类似这样的输出：
```
▲ Next.js 13.5.1
- Local:        http://localhost:3000
- Ready in 2.3s
```

#### 2. 访问诊断页面

打开浏览器访问：
```
http://localhost:3000/test-api
```

这个页面会：
- 自动测试 WordPress API 连接
- 显示详细的诊断结果
- 告诉你哪些测试通过/失败

#### 3. 或者直接测试 API 端点

在浏览器中访问：
```
http://localhost:3000/api/test-wp-api
```

应该返回 JSON 格式的诊断结果。

#### 4. 测试商店页面

如果诊断通过，访问：
```
http://localhost:3000/store
```

## 常见问题

### 问题 1: "无法实现实时预览"

**原因：** 开发服务器没有运行

**解决：**
1. 打开终端
2. 进入项目目录：`cd "/Users/shenbo/Downloads/project 4"`
3. 运行：`npm run dev`
4. 等待服务器启动完成

### 问题 2: API 返回 404

**原因：** 
- 开发服务器没有运行
- 或者路由文件有问题

**解决：**
1. 确认 `npm run dev` 正在运行
2. 检查终端是否有错误信息
3. 尝试重启开发服务器（Ctrl+C 停止，然后重新运行）

### 问题 3: API 返回错误

**原因：** WordPress API 不可访问

**解决：**
1. 访问诊断页面：`http://localhost:3000/test-api`
2. 查看详细的错误信息
3. 检查 WordPress 站点是否正确配置

## 测试步骤

1. **启动开发服务器**
   ```bash
   npm run dev
   ```

2. **访问诊断页面**
   ```
   http://localhost:3000/test-api
   ```
   点击"运行诊断"按钮

3. **查看结果**
   - 如果所有测试通过 → 可以访问 `/store` 页面
   - 如果有失败 → 根据错误信息修复 WordPress 配置

4. **测试商店页面**
   ```
   http://localhost:3000/store
   ```

## 需要帮助？

如果还有问题，请告诉我：
1. 开发服务器是否正在运行？
2. 访问 `http://localhost:3000/test-api` 看到了什么？
3. 浏览器控制台有什么错误信息？
