// POST /api/login — 관리자 로그인 (비밀번호 → 세션 쿠키 발급)
import { sessionToken } from './_auth.js';

export async function onRequestPost({ request, env }) {
  if (!env.ADMIN_PASSWORD) {
    return Response.json({ ok: false, error: 'ADMIN_PASSWORD not set' }, { status: 500 });
  }
  let d = {};
  try { d = await request.json(); } catch (e) {}
  if (!d.password || d.password !== env.ADMIN_PASSWORD) {
    return Response.json({ ok: false }, { status: 401 });
  }
  const token = await sessionToken(env);
  return new Response(JSON.stringify({ ok: true }), {
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': `admin_session=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=86400`
    }
  });
}
