// GET /api/inquiries — 문의 목록 (관리자 인증 필요)
import { isAuthed } from './_auth.js';

export async function onRequestGet({ request, env }) {
  if (!(await isAuthed(request, env))) {
    return Response.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }
  if (!env.DB) return Response.json({ ok: false, error: 'DB binding not configured' }, { status: 500 });
  const { results } = await env.DB.prepare('SELECT * FROM inquiries ORDER BY id DESC').all();
  return Response.json({ ok: true, items: results || [] });
}
