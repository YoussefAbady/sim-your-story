-- Create table for simulation usage tracking
CREATE TABLE public.simulation_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date_of_use DATE NOT NULL DEFAULT CURRENT_DATE,
  time_of_use TIME NOT NULL DEFAULT CURRENT_TIME,
  expected_pension DECIMAL(10, 2),
  age INTEGER NOT NULL,
  sex TEXT NOT NULL CHECK (sex IN ('male', 'female')),
  salary_amount DECIMAL(10, 2) NOT NULL,
  illness_included BOOLEAN NOT NULL DEFAULT false,
  account_funds DECIMAL(12, 2),
  sub_account_funds DECIMAL(12, 2),
  actual_pension DECIMAL(10, 2) NOT NULL,
  real_pension DECIMAL(10, 2) NOT NULL,
  postal_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.simulation_logs ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert logs (anonymous usage tracking)
CREATE POLICY "Anyone can insert simulation logs" 
ON public.simulation_logs 
FOR INSERT 
WITH CHECK (true);

-- Create policy to allow only authenticated users to read logs (for admin)
CREATE POLICY "Authenticated users can read simulation logs" 
ON public.simulation_logs 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Create index for better query performance
CREATE INDEX idx_simulation_logs_created_at ON public.simulation_logs(created_at DESC);
CREATE INDEX idx_simulation_logs_date_of_use ON public.simulation_logs(date_of_use DESC);