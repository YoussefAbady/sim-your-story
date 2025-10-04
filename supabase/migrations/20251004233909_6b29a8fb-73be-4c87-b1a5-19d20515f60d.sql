-- Seed demo data into all tables if empty (idempotent)

-- badges: keep existing if present; add one extra demo badge only if not exists
INSERT INTO public.badges (badge_id, name, description, icon, points_required, category)
SELECT 'demo_explorer', 'Demo Explorer', 'Explored the demo data', '🔍', 5, 'exploration'
WHERE NOT EXISTS (SELECT 1 FROM public.badges WHERE badge_id = 'demo_explorer');

-- user_points
DO $$
BEGIN
  IF (SELECT COUNT(*) FROM public.user_points) = 0 THEN
    INSERT INTO public.user_points (user_identifier, total_points, current_level)
    VALUES 
      ('demo_user_001', 150, 2),
      ('demo_user_002', 500, 3),
      ('demo_user_003', 1200, 5);
  END IF;
END $$;

-- user_badges
DO $$
BEGIN
  IF (SELECT COUNT(*) FROM public.user_badges) = 0 THEN
    INSERT INTO public.user_badges (user_identifier, badge_id)
    VALUES 
      ('demo_user_001', 'data_explorer'),
      ('demo_user_001', 'knowledge_seeker'),
      ('demo_user_002', 'fine_tuner'),
      ('demo_user_002', 'goal_oriented'),
      ('demo_user_003', 'pension_pro');
  END IF;
END $$;

-- points_history
DO $$
BEGIN
  IF (SELECT COUNT(*) FROM public.points_history) = 0 THEN
    INSERT INTO public.points_history (user_identifier, action_type, points_earned)
    VALUES 
      ('demo_user_001', 'tip_read', 10),
      ('demo_user_001', 'simulation_run', 20),
      ('demo_user_002', 'first_simulation', 50),
      ('demo_user_002', 'advanced_dashboard', 30),
      ('demo_user_003', 'quiz_completed', 40);
  END IF;
END $$;

-- session_time
DO $$
BEGIN
  IF (SELECT COUNT(*) FROM public.session_time) = 0 THEN
    INSERT INTO public.session_time (session_id, start_time, end_time, duration_seconds, page_path, user_identifier)
    VALUES 
      ('demo_session_001', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '1 hour 45 minutes', 900, '/', 'demo_user_001'),
      ('demo_session_002', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day' + INTERVAL '30 minutes', 1800, '/dashboard', 'demo_user_002'),
      ('demo_session_003', NOW() - INTERVAL '3 hours', NOW() - INTERVAL '2 hours 30 minutes', 1800, '/simulation', 'demo_user_003');
  END IF;
END $$;

-- session_points_summary
DO $$
BEGIN
  IF (SELECT COUNT(*) FROM public.session_points_summary) = 0 THEN
    INSERT INTO public.session_points_summary (session_id, user_identifier, total_points, actions_performed, duration_seconds, milestone_reached, unique_interactions)
    VALUES 
      ('demo_session_001', 'demo_user_001', 80, 6, 900, 'Bronze Beginner', '["tip_read","simulation_run"]'::jsonb),
      ('demo_session_002', 'demo_user_002', 260, 12, 1800, 'Silver Learner', '["first_simulation","advanced_dashboard"]'::jsonb),
      ('demo_session_003', 'demo_user_003', 540, 18, 1800, 'Gold Planner', '["quiz_completed","comparison"]'::jsonb);
  END IF;
END $$;

-- simulation_logs
DO $$
BEGIN
  IF (SELECT COUNT(*) FROM public.simulation_logs) = 0 THEN
    INSERT INTO public.simulation_logs (age, sex, salary_amount, illness_included, account_funds, sub_account_funds, actual_pension, real_pension, expected_pension, postal_code)
    VALUES 
      (35, 'male', 5000, false, 10000, 5000, 2500, 2300, 2800, '00-001'),
      (45, 'female', 6000, true, 15000, 8000, 3200, 2900, 3500, '00-002'),
      (55, 'male', 7000, false, 25000, 12000, 4100, 3800, 4500, '00-003');
  END IF;
END $$;

-- quizzes
DO $$
BEGIN
  IF (SELECT COUNT(*) FROM public.quizzes) = 0 THEN
    INSERT INTO public.quizzes (quiz_type, user_name, user_email, total_questions, score, answers, quiz_data)
    VALUES 
      ('onboarding', 'Demo User 1', 'demo1@example.com', 5, 4, '{"q1":"a","q2":"b","q3":"c","q4":"a","q5":"d"}'::jsonb, '{"timeSpent":120}'::jsonb),
      ('knowledge', 'Demo User 2', 'demo2@example.com', 8, 6, '{"q1":"true","q2":"false"}'::jsonb, '{"category":"pension_basics"}'::jsonb);
  END IF;
END $$;

-- prize_redeems
DO $$
BEGIN
  IF (SELECT COUNT(*) FROM public.prize_redeems) = 0 THEN
    INSERT INTO public.prize_redeems (user_email, session_points, badges_count, allow_contact)
    VALUES 
      ('demo1@example.com', 120, 2, true),
      ('demo2@example.com', 350, 4, false);
  END IF;
END $$;