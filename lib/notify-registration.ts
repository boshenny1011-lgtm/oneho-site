/**
 * 新用户注册时通知管理员
 * 配置 RESEND_API_KEY + ADMIN_EMAIL 后发送邮件；未配置则仅打 log
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || process.env.WC_ADMIN_EMAIL || '';

export interface NewRegistrationPayload {
  email: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
}

export async function sendAdminNewRegistrationEmail(payload: NewRegistrationPayload): Promise<void> {
  const { email, firstName, lastName, displayName } = payload;
  const name = displayName || [firstName, lastName].filter(Boolean).join(' ') || email;

  if (!ADMIN_EMAIL) {
    console.log('📧 [notify] ADMIN_EMAIL not set, skipping registration email');
    console.log('📧 [notify] New registration:', { email, name });
    return;
  }

  if (!RESEND_API_KEY) {
    console.log('📧 [notify] RESEND_API_KEY not set, skipping registration email');
    console.log('📧 [notify] New registration:', { email, name });
    return;
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'LinexPv <onboarding@resend.dev>', // Resend 默认域名；生产环境改为你的域名
        to: [ADMIN_EMAIL],
        subject: `[LinexPv] 新用户注册待审核：${name} (${email})`,
        html: `
          <p>有新用户注册，请登录后台审核通过后，对方才能登录下单。</p>
          <ul>
            <li><strong>邮箱</strong>: ${email}</li>
            <li><strong>姓名</strong>: ${name}</li>
          </ul>
          <p>审核方式：在 WordPress 后台编辑该用户，将 <code>account_status</code> 改为 <code>approved</code>；或调用审核 API。</p>
        `,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('❌ [notify] Resend API error:', res.status, err);
      return;
    }
    console.log('✅ [notify] Registration email sent to admin:', ADMIN_EMAIL);
  } catch (error) {
    console.error('❌ [notify] Failed to send registration email:', error);
  }
}
