/*
# Create support complaints triage table

1. New Tables
- `support_complaints`
  - `id` (uuid, primary key)
  - `complaint_text` (text, the pasted customer complaint)
  - `category` (text, problem category detected)
  - `urgency` (text, one of 'baixo', 'medio', 'critico')
  - `cancellation_risk` (integer, 0 to 100)
  - `cancellation_level` (text, one of 'baixo', 'medio', 'alto')
  - `suggested_reply` (text, suggested answer to the customer)
  - `created_at` (timestamptz)

2. Security
- Enable RLS on `support_complaints`.
- Grant SELECT and INSERT to `anon` and `authenticated` (the panel has no sign-in).
- Policies allow read and insert only; updates and deletes are not exposed.

3. Notes
- Single-tenant internal triage panel, so the data is intentionally shared.
*/

CREATE TABLE IF NOT EXISTS support_complaints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_text text NOT NULL,
  category text NOT NULL,
  urgency text NOT NULL CHECK (urgency IN ('baixo', 'medio', 'critico')),
  cancellation_risk integer NOT NULL CHECK (cancellation_risk BETWEEN 0 AND 100),
  cancellation_level text NOT NULL CHECK (cancellation_level IN ('baixo', 'medio', 'alto')),
  suggested_reply text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS support_complaints_created_at_idx ON support_complaints (created_at DESC);

ALTER TABLE support_complaints ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT ON support_complaints TO anon, authenticated;

DROP POLICY IF EXISTS "anon_select_support_complaints" ON support_complaints;
CREATE POLICY "anon_select_support_complaints" ON support_complaints FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_support_complaints" ON support_complaints;
CREATE POLICY "anon_insert_support_complaints" ON support_complaints FOR INSERT
  TO anon, authenticated WITH CHECK (true);
