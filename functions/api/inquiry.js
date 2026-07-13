// POST /api/inquiry — 견적 문의 저장 (공개)
export async function onRequestPost({ request, env }) {
  try {
    if (!env.DB) return Response.json({ ok: false, error: 'DB binding not configured' }, { status: 500 });
    const d = await request.json();
    const now = new Date().toISOString();
    await env.DB.prepare(
      `INSERT INTO inquiries
       (created_at, org_name, contact_name, phone, email, org_type, event_type, event_date, event_time, headcount, location, budget, message, status)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?, '신규')`
    ).bind(
      now,
      (d.org_name || '').slice(0, 200),
      (d.contact_name || '').slice(0, 100),
      (d.phone || '').slice(0, 50),
      (d.email || '').slice(0, 200),
      (d.org_type || '').slice(0, 50),
      (d.event_type || '').slice(0, 50),
      (d.event_date || '').slice(0, 30),
      (d.event_time || '').slice(0, 30),
      (d.headcount || '').toString().slice(0, 30),
      (d.location || '').slice(0, 200),
      (d.budget || '').slice(0, 100),
      (d.message || '').slice(0, 2000)
    ).run();
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
