// 메일 알림 공통 유틸 (import 전용)
//
// 필요한 환경 변수 (없으면 알림만 조용히 건너뛰고 본 기능은 정상 동작합니다)
//   RESEND_API_KEY : Resend(resend.com) API 키
//   NOTIFY_FROM    : 보내는 주소. 도메인 인증 전이면 onboarding@resend.dev 로 테스트 가능
//   NOTIFY_TO      : 받는 주소 (쉼표로 여러 개 가능)

export async function sendMail(env, { subject, html, text }) {
  if (!env.RESEND_API_KEY || !env.NOTIFY_TO) return { ok: false, skipped: true };
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: env.NOTIFY_FROM || 'onboarding@resend.dev',
        to: env.NOTIFY_TO.split(',').map(s => s.trim()).filter(Boolean),
        subject,
        html,
        text
      })
    });
    if (!res.ok) return { ok: false, error: `HTTP ${res.status} ${await res.text()}` };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}

export function esc(s) {
  return String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

// 메일 본문 공통 껍데기 (브랜드 톤)
export function shell(title, bodyHtml) {
  return `<div style="font-family:-apple-system,'Segoe UI',sans-serif;background:#faf6ef;padding:24px">
  <div style="max-width:640px;margin:0 auto;background:#fffdf9;border:1px solid rgba(47,40,31,.12);border-radius:14px;padding:28px">
    <div style="font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:#8f8574">Hwango Bueok</div>
    <h1 style="font-size:19px;color:#2f281f;margin:6px 0 18px">${esc(title)}</h1>
    ${bodyHtml}
  </div>
</div>`;
}
