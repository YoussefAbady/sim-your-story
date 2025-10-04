-- Create session points summary table for analytics
CREATE TABLE IF NOT EXISTS public.session_points_summary (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  user_identifier TEXT NOT NULL,
  total_points INTEGER NOT NULL DEFAULT 0,
  actions_performed INTEGER NOT NULL DEFAULT 0,
  duration_seconds INTEGER,
  milestone_reached TEXT,
  unique_interactions JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.session_points_summary ENABLE ROW LEVEL SECURITY;

-- Create policy for inserting session summaries
CREATE POLICY "Anyone can insert session summaries"
ON public.session_points_summary
FOR INSERT
WITH CHECK (true);

-- Create policy for reading session summaries
CREATE POLICY "Anyone can read session summaries"
ON public.session_points_summary
FOR SELECT
USING (true);

-- Add index for faster queries
CREATE INDEX idx_session_points_user ON public.session_points_summary(user_identifier);
CREATE INDEX idx_session_points_created ON public.session_points_summary(created_at DESC);