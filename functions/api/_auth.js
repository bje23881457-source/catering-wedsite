// 공통 인증 유틸 (파일명이 _로 시작하면 라우팅되지 않고 import 전용)

export async function sha256hex(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}

export function getCookie(request, name) {
  const cookie = request.headers.get('Cookie') || '';
  const m = cookie.match(new RegExp('(?:^|; )' + name + '=([^;]+)'));
  return m ? m[1] : null;
}

// 로그인 성공 시 발급할 세션 토큰(비밀번호를 알아야만 만들 수 있음)
export async function sessionToken(env) {
  return sha256hex((env.ADMIN_PASSWORD || '') + '::the-silla-table');
}

export async function isAuthed(request, env) {
  if (!env.ADMIN_PASSWORD) return false;
  const token = getCookie(request, 'admin_session');
  if (!token) return false;
  return token === (await sessionToken(env));
}
