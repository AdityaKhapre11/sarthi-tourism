-- Add OTP verification fields to public.users table
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS otp TEXT,
ADD COLUMN IF NOT EXISTS otp_expires_at TIMESTAMP WITH TIME ZONE;
