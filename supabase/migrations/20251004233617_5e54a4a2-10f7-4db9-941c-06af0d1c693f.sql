-- Add missing page_path column to session_time table
ALTER TABLE public.session_time ADD COLUMN IF NOT EXISTS page_path text;

-- Update RLS policies to allow anonymous inserts for session tracking
DROP POLICY IF EXISTS "Authenticated users can manage their sessions" ON public.session_time;
CREATE POLICY "Anyone can insert session data"
  ON public.session_time
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update session data"
  ON public.session_time
  FOR UPDATE
  USING (true);

-- Fix simulation_logs RLS to allow anonymous inserts
DROP POLICY IF EXISTS "Authenticated users can insert simulation logs" ON public.simulation_logs;
CREATE POLICY "Anyone can insert simulation logs"
  ON public.simulation_logs
  FOR INSERT
  WITH CHECK (true);

-- Fix quizzes RLS to allow anonymous inserts
DROP POLICY IF EXISTS "Authenticated users can insert quizzes" ON public.quizzes;
CREATE POLICY "Anyone can insert quizzes"
  ON public.quizzes
  FOR INSERT
  WITH CHECK (true);

-- Insert demo data into badges (if not exists)
INSERT INTO public.badges (badge_id, name, description, icon, points_required, category)
SELECT 'demo_explorer', 'Demo Explorer', 'Explored the demo data', '🔍', 5, 'exploration'
WHERE NOT EXISTS (SELECT 1 FROM public.badges WHERE badge_id = 'demo_explorer');

-- Insert demo simulation logs
INSERT INTO public.simulation_logs (age, sex, salary_amount, illness_included, account_funds, sub_account_funds, actual_pension, real_pension, expected_pension, postal_code)
VALUES 
  (35, 'male', 5000, false, 10000, 5000, 2500, 2300, 2800, '00-001'),
  (45, 'female', 6000, true, 15000, 8000, 3200, 2900, 3500, '00-002'),
  (55, 'male', 7000, false, 25000, 12000, 4100, 3800, 4500, '00-003')
ON CONFLICT DO NOTHING;

-- Insert demo user points
INSERT INTO public.user_points (user_identifier, total_points, current_level)
VALUES 
  ('demo_user_001', 150, 2),
  ('demo_user_002', 500, 3),
  ('demo_user_003', 1200, 5)
ON CONFLICT DO NOTHING;

-- Insert demo session time data
INSERT INTO public.session_time (session_id, start_time, end_time, duration_seconds, page_path, user_identifier)
VALUES 
  ('demo_session_001', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '1 hour 45 minutes', 900, '/', 'demo_user_001'),
  ('demo_session_002', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day' + INTERVAL '30 minutes', 1800, '/dashboard', 'demo_user_002'),
  ('demo_session_003', NOW() - INTERVAL '3 hours', NOW() - INTERVAL '2 hours 30 minutes', 1800, '/simulation', 'demo_user_003')
ON CONFLICT DO NOTHING;