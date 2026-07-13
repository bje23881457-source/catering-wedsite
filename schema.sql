-- Cloudflare D1 데이터베이스 스키마 (관리자 페이지용 문의 테이블)
-- Cloudflare 대시보드 → D1 → (DB 선택) → Console 에 아래를 붙여넣고 실행하세요.

CREATE TABLE IF NOT EXISTS inquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT,
  org_name TEXT,
  contact_name TEXT,
  phone TEXT,
  email TEXT,
  org_type TEXT,
  event_type TEXT,
  event_date TEXT,
  event_time TEXT,
  headcount TEXT,
  location TEXT,
  budget TEXT,
  message TEXT,
  status TEXT DEFAULT '신규'
);
