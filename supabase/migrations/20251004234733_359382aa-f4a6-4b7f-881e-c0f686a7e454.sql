-- Add permissive SELECT policies for admin tables to allow demo data visibility

-- simulation_logs: Add public read policy
CREATE POLICY "Public can view simulation logs"
ON public.simulation_logs
FOR SELECT
USING (true);

-- session_time: Add public read policy
CREATE POLICY "Public can view session time"
ON public.session_time
FOR SELECT
USING (true);

-- quizzes: Add public read policy (in addition to existing admin/user policies)
CREATE POLICY "Public can view quizzes"
ON public.quizzes
FOR SELECT
USING (true);

-- prize_redeems: Add public read policy
CREATE POLICY "Public can view prize redeems"
ON public.prize_redeems
FOR SELECT
USING (true);