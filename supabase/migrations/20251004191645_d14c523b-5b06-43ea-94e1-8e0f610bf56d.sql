-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Only admins can manage roles
CREATE POLICY "Only admins can manage roles"
ON public.user_roles FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Fix simulation_logs RLS policies
DROP POLICY IF EXISTS "Authenticated users can read simulation logs" ON public.simulation_logs;
DROP POLICY IF EXISTS "Anyone can insert simulation logs" ON public.simulation_logs;

CREATE POLICY "Only admins can read simulation logs"
ON public.simulation_logs FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated users can insert simulation logs"
ON public.simulation_logs FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Fix quizzes RLS policies
DROP POLICY IF EXISTS "Anyone can read quiz results" ON public.quizzes;
DROP POLICY IF EXISTS "Anyone can insert quiz results" ON public.quizzes;

CREATE POLICY "Users can view their own quizzes"
ON public.quizzes FOR SELECT
USING (auth.uid() IS NOT NULL AND user_email = (auth.jwt()->>'email'));

CREATE POLICY "Admins can view all quizzes"
ON public.quizzes FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated users can insert quizzes"
ON public.quizzes FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Fix session_time RLS policies
DROP POLICY IF EXISTS "Anyone can read session time" ON public.session_time;
DROP POLICY IF EXISTS "Anyone can insert session time" ON public.session_time;
DROP POLICY IF EXISTS "Anyone can update session time" ON public.session_time;

CREATE POLICY "Admins can view all sessions"
ON public.session_time FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated users can manage their sessions"
ON public.session_time FOR ALL
USING (auth.uid() IS NOT NULL);

-- Update update_updated_at_column function to set search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;