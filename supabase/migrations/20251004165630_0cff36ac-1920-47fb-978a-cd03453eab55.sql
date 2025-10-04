-- Create session_time table to track user engagement in education center
CREATE TABLE public.session_time (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  user_identifier TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  end_time TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER,
  page_path TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quizzes table to store quiz results and user information
CREATE TABLE public.quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  quiz_type TEXT NOT NULL,
  quiz_data JSONB,
  score NUMERIC,
  total_questions INTEGER,
  answers JSONB,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.session_time ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert session data
CREATE POLICY "Anyone can insert session time"
ON public.session_time
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow anyone to read session data (for admin panel)
CREATE POLICY "Anyone can read session time"
ON public.session_time
FOR SELECT
TO anon, authenticated
USING (true);

-- Allow anyone to update their own session
CREATE POLICY "Anyone can update session time"
ON public.session_time
FOR UPDATE
TO anon, authenticated
USING (true);

-- Allow anyone to insert quiz results
CREATE POLICY "Anyone can insert quiz results"
ON public.quizzes
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow anyone to read quiz results (for admin panel)
CREATE POLICY "Anyone can read quiz results"
ON public.quizzes
FOR SELECT
TO anon, authenticated
USING (true);