-- Remove page_path column from session_time table
ALTER TABLE public.session_time DROP COLUMN IF EXISTS page_path;