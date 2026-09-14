-- Cloudflare D1 데이터베이스 스키마 (견적 문의 테이블)
-- Cloudflare 대시보드 → D1 → (DB 선택) → Console 에 아래를 붙여넣고 실행하세요.
--
-- ℹ️ 이 표는 업무 대시보드(`바탕 화면\my` 폴더)와 **함께 씁니다.**
--    홈페이지 문의 폼이 여기에 쌓이고, 업무 대시보드의 "문의" 탭이 이걸 읽습니다.
--    대시보드가 쓰는 표(할 일·가계부·세금계산서)까지 한 번에 만들려면
--    `my\schema.sql` 을 실행하세요. 그쪽이 이 내용을 전부 포함합니다.

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
  status TEXT DEFAULT '신규',

  -- 아래 4개는 업무 대시보드에서 쓰는 칸입니다.
  -- 문의 접수(inquiry.js)가 updated_at·stream 에 값을 넣으므로 반드시 있어야 합니다.
  updated_at TEXT,                -- 마지막으로 상태·금액·메모가 바뀐 시각
  stream TEXT DEFAULT 'silla',    -- 업무 구분 (홈페이지 문의는 전부 황오부엌)
  quote_amount INTEGER,           -- 확정 견적 금액 (원, 부가세 별도)
  memo TEXT                       -- 관리자 내부 메모
);

CREATE INDEX IF NOT EXISTS idx_inquiries_event_date ON inquiries(event_date);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);


-- ─────────────────────────────────────────────────────────────
-- 이미 예전 버전으로 표를 만들어 둔 경우 (칸이 4개 없는 상태)
-- 아래 4줄의 -- 를 지우고 한 번만 실행하세요.
-- "duplicate column name" 오류가 나면 이미 있다는 뜻이니 무시하면 됩니다.
-- ─────────────────────────────────────────────────────────────
-- ALTER TABLE inquiries ADD COLUMN updated_at TEXT;
-- ALTER TABLE inquiries ADD COLUMN stream TEXT DEFAULT 'silla';
-- ALTER TABLE inquiries ADD COLUMN quote_amount INTEGER;
-- ALTER TABLE inquiries ADD COLUMN memo TEXT;
