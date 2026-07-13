// POST /api/logout — 세션 쿠키 삭제
export async function onRequestPost() {
  return new Response(JSON.stringify({ ok: true }), {
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': 'admin_session=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0'
    }
  });
}
