// POST /api/status — 문의 상태 변경 (관리자 인증 필요)
import { isAuthed } from './_auth.js';

const ALLOWED = ['신규', '응대중', '견적발송', '완료', '보류'];

export async function onRequestPost({ request, env }) {
  if (!(await isAuthed(request, env))) {
    return Response.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }
  let d = {};
  try { d = await request.json(); } catch (e) {}
  const id = parseInt(d.id);
  if (!id || !ALLOWED.includes(d.status)) {
    return Response.json({ ok: false, error: 'bad request' }, { status: 400 });
  }
  await env.DB.prepare('UPDATE inquiries SET status=? WHERE id=?').bind(d.status, id).run();
  return Response.json({ ok: true });
}
