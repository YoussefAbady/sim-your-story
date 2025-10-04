-- Create prize redeems table
CREATE TABLE public.prize_redeems (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email TEXT,
  session_points INTEGER NOT NULL,
  badges_count INTEGER NOT NULL DEFAULT 0,
  allow_contact BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.prize_redeems ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert their redeem records
CREATE POLICY "Anyone can insert prize redeems"
ON public.prize_redeems
FOR INSERT
WITH CHECK (true);

-- Only admins can view redeem records
CREATE POLICY "Admins can view all prize redeems"
ON public.prize_redeems
FOR SELECT
USING (has_role(auth.uid(), 'admin'));