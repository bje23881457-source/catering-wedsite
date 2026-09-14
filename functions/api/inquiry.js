// POST /api/inquiry — 견적 문의 저장 (공개) + 관리자 메일 알림
import { sendMail, shell, esc } from './_notify.js';

function row(label, value) {
  if (!value) return '';
  return `<tr>
    <td style="padding:6px 12px 6px 0;color:#8f8574;font-size:13px;white-space:nowrap;vertical-align:top">${esc(label)}</td>
    <td style="padding:6px 0;color:#2f281f;font-size:14px">${esc(value).replace(/\n/g, '<br>')}</td>
  </tr>`;
}

export async function onRequestPost({ request, env, waitUntil }) {
  try {
    if (!env.DB) return Response.json({ ok: false, error: 'DB binding not configured' }, { status: 500 });
    const d = await request.json();
    const now = new Date().toISOString();

    const f = {
      org_name: (d.org_name || '').slice(0, 200),
      contact_name: (d.contact_name || '').slice(0, 100),
      phone: (d.phone || '').slice(0, 50),
      email: (d.email || '').slice(0, 200),
      org_type: (d.org_type || '').slice(0, 50),
      event_type: (d.event_type || '').slice(0, 50),
      event_date: (d.event_date || '').slice(0, 30),
      event_time: (d.event_time || '').slice(0, 30),
      headcount: (d.headcount || '').toString().slice(0, 30),
      location: (d.location || '').slice(0, 200),
      budget: (d.budget || '').slice(0, 100),
      message: (d.message || '').slice(0, 2000)
    };

    await env.DB.prepare(
      `INSERT INTO inquiries
       (created_at, updated_at, stream, org_name, contact_name, phone, email, org_type, event_type, event_date, event_time, headcount, location, budget, message, status)
       VALUES (?,?,'silla',?,?,?,?,?,?,?,?,?,?,?,?, '신규')`
    ).bind(
      now, now,
      f.org_name, f.contact_name, f.phone, f.email, f.org_type,
      f.event_type, f.event_date, f.event_time, f.headcount,
      f.location, f.budget, f.message
    ).run();

    // 메일 알림은 응답을 붙잡지 않도록 백그라운드로 발송합니다.
    // 메일이 실패해도 접수 자체는 이미 DB에 저장됐으므로 성공으로 응답합니다.
    const when = [f.event_date, f.event_time].filter(Boolean).join(' ') || '미정';
    const html = shell(
      `새 견적 문의 · ${f.org_name || '기관명 미기재'}`,
      `<table style="border-collapse:collapse;width:100%">
        ${row('기관/업체', f.org_name)}
        ${row('담당자', f.contact_name)}
        ${row('연락처', f.phone)}
        ${row('이메일', f.email)}
        ${row('발주처 유형', f.org_type)}
        ${row('행사 유형', f.event_type)}
        ${row('행사 일시', when)}
        ${row('인원', f.headcount)}
        ${row('장소', f.location)}
        ${row('예산', f.budget)}
        ${row('문의 내용', f.message)}
      </table>
      <div style="margin-top:22px">
        <a href="https://catering-wedsite-2.pages.dev/dashboard.html"
           style="display:inline-block;background:#b3714c;color:#fff;text-decoration:none;padding:11px 20px;border-radius:30px;font-size:14px">
          대시보드에서 열기 →
        </a>
      </div>
      <p style="color:#8f8574;font-size:12px;margin-top:18px">홈페이지에 영업일 기준 1일 이내 회신이 안내되어 있습니다.</p>`
    );

    const mail = sendMail(env, {
      subject: `[황오부엌] 새 견적 문의 · ${f.org_name || '기관명 미기재'} (${when})`,
      html,
      text: `새 견적 문의\n기관: ${f.org_name}\n담당자: ${f.contact_name} / ${f.phone}\n행사: ${when} · ${f.headcount}명 · ${f.location}\n내용: ${f.message}`
    });
    if (waitUntil) waitUntil(mail); else await mail;

    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
