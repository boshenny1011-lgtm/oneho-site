# 注册审核流程验证清单

## 一、前置条件

### 1. 环境变量（`.env.local`）

确认已配置：

```bash
# 必选：WooCommerce（你已有）
WC_BASE_URL=https://linexpv.com
WC_CONSUMER_KEY=ck_xxx
WC_CONSUMER_SECRET=cs_xxx

# 注册审核相关
ADMIN_EMAIL=你的管理员邮箱@xxx.com    # 收“新用户注册”邮件
ADMIN_APPROVE_SECRET=随便设一个长字符串   # 用于调用审核 API，如 my-secret-123

# 可选：发邮件给管理员（不配则只打 log，不实际发信）
RESEND_API_KEY=re_xxx
```

### 2. WordPress 端

- **JWT 登录**：安装并启用 **JWT Authentication for WP REST API**（或同类插件），否则登录时无法验证密码。
- **WooCommerce**：确保 Customers API 可用（你已在用）。

---

## 二、验证步骤

### Step 1：注册一个新用户

1. 打开：`http://localhost:3000/register`（或你的线上域名）。
2. 填写：邮箱、密码、姓名（可选）→ 提交。
3. **预期**：
   - 页面显示 **“Registration Received” / “Your account is pending approval”**（不跳转登录）。
   - 若配置了 `ADMIN_EMAIL` + `RESEND_API_KEY`，管理员邮箱会收到一封“新用户注册待审核”的邮件。
   - 若未配置邮件，在运行 `npm run dev` 的终端里应看到类似：`📧 [notify] New registration: { email, name }`。

### Step 2：未审核时登录应被拦下

1. 打开：`http://localhost:3000/login`。
2. 用刚注册的邮箱和密码登录。
3. **预期**：
   - 不进入后台，页面显示 **“Account pending approval”** 的黄色提示框。
   - 接口返回 **403**，body 里带 `code: "pending_approval"`（可在浏览器 DevTools → Network 里看 `/api/auth/login` 的响应）。

### Step 3：审核通过该用户

任选一种方式：

**方式 A：调用审核 API（推荐）**

1. 在 WooCommerce 或 WordPress 后台找到该用户的 **Customer ID**（即用户 ID，例如 42）。
2. 在终端执行（把 `customerId` 和 `ADMIN_APPROVE_SECRET` 换成你的值）：

```bash
curl -X POST http://localhost:3000/api/auth/approve \
  -H "Authorization: Bearer 你的ADMIN_APPROVE_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"customerId": 42}'
```

3. **预期**：返回 `{ "success": true, "message": "Customer approved. ...", "customerId": 42 }`。

**方式 B：在 WordPress 里改 meta**

1. 安装能编辑用户 meta 的插件，或在代码里把该用户的 `account_status` 改为 `approved`。
2. WooCommerce 客户对应 WP 用户，在「用户」里找到该用户，把自定义字段 `account_status` 设为 `approved`。

### Step 4：审核通过后再登录

1. 再次打开 `http://localhost:3000/login`，用同一邮箱和密码登录。
2. **预期**：
   - 登录成功，跳转到 `/account`（或你设置的 redirect）。
   - Header 显示该用户名称/邮箱，可正常访问「我的账户」、下单等。

### Step 5：（可选）检查 WooCommerce 里确实是 pending

1. 用 WooCommerce REST API 或 WP 后台查看该客户。
2. **预期**：注册后该客户的 `meta_data` 里有一条 `key: "account_status", value: "pending"`；审核后变为 `"approved"`。

---

## 三、快速自检命令汇总

```bash
# 1. 审核通过（替换 SECRET 和 customerId）
curl -X POST http://localhost:3000/api/auth/approve \
  -H "Authorization: Bearer YOUR_ADMIN_APPROVE_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"customerId": 123}'
```

若返回 `success: true`，说明审核 API 正常；再用该用户去登录即可验证“审核通过后才能登录”。

---

## 四、常见问题

| 现象 | 可能原因 |
|------|----------|
| 登录一直提示 Invalid email or password | WordPress 未装 JWT 插件，或 JWT 未配置好；先确认 `POST /wp/wp-json/jwt-auth/v1/token` 用同一邮箱密码能拿到 token。 |
| 注册后没收到邮件 | 检查 `ADMIN_EMAIL`、`RESEND_API_KEY` 是否配置；未配置时只会打 log，不发信。 |
| 审核 API 返回 401 | Header 里 `Authorization: Bearer <ADMIN_APPROVE_SECRET>` 与 `.env.local` 里 `ADMIN_APPROVE_SECRET` 不一致。 |
| 审核 API 返回 404/500 | `customerId` 是否对应真实 WooCommerce 客户 ID；或 WooCommerce API 凭证/URL 是否正确。 |

按上面步骤跑一遍，能通过 Step 1～4 就说明“注册 → 待审核 → 发邮件 → 审核通过 → 登录”整条链路已 OK。
