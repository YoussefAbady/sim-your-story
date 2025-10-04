-- Create user_points table
CREATE TABLE public.user_points (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_identifier text NOT NULL,
  total_points integer DEFAULT 0,
  current_level integer DEFAULT 1,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_identifier)
);

-- Create badges table (predefined badges)
CREATE TABLE public.badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  badge_id text UNIQUE NOT NULL,
  name text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  points_required integer NOT NULL,
  category text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Create user_badges table (earned badges)
CREATE TABLE public.user_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_identifier text NOT NULL,
  badge_id text NOT NULL REFERENCES public.badges(badge_id),
  earned_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_identifier, badge_id)
);

-- Create points_history table
CREATE TABLE public.points_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_identifier text NOT NULL,
  action_type text NOT NULL,
  points_earned integer NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.points_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_points
CREATE POLICY "Anyone can insert their own points"
  ON public.user_points
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can read their own points"
  ON public.user_points
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can update their own points"
  ON public.user_points
  FOR UPDATE
  USING (true);

-- RLS Policies for badges (public read)
CREATE POLICY "Anyone can read badges"
  ON public.badges
  FOR SELECT
  USING (true);

-- RLS Policies for user_badges
CREATE POLICY "Anyone can insert their own badges"
  ON public.user_badges
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can read their own badges"
  ON public.user_badges
  FOR SELECT
  USING (true);

-- RLS Policies for points_history
CREATE POLICY "Anyone can insert their own history"
  ON public.points_history
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can read their own history"
  ON public.points_history
  FOR SELECT
  USING (true);

-- Create trigger for updating updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_points_updated_at
  BEFORE UPDATE ON public.user_points
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Seed initial badges
INSERT INTO public.badges (badge_id, name, description, icon, points_required, category) VALUES
  ('first_steps', 'First Steps', 'Complete your first simulation', '🏆', 0, 'milestone'),
  ('knowledge_seeker', 'Knowledge Seeker', 'Read 5 education tips', '🎓', 50, 'knowledge'),
  ('data_explorer', 'Data Explorer', 'Visit the advanced dashboard', '📊', 15, 'exploration'),
  ('deep_diver', 'Deep Diver', 'Read 3 detailed tip contents', '🔍', 75, 'knowledge'),
  ('fine_tuner', 'Fine Tuner', 'Adjust advanced settings', '⚙️', 30, 'exploration'),
  ('comparison_expert', 'Comparison Expert', 'Compare 3 scenarios', '📈', 120, 'achievement'),
  ('pension_pro', 'Pension Pro', 'Reach level 3', '🌟', 300, 'milestone'),
  ('master_planner', 'Master Planner', 'Reach level 5', '💎', 1000, 'milestone'),
  ('quick_learner', 'Quick Learner', 'Earn 100 points in one session', '🚀', 100, 'achievement'),
  ('goal_oriented', 'Goal Oriented', 'Set expected pension target', '🎯', 20, 'achievement');