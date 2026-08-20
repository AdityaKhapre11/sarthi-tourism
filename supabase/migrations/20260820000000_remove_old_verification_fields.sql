-- Remove old email verification link fields as we now use OTP verification
ALTER TABLE public.users
DROP COLUMN IF EXISTS verification_token_hash,
DROP COLUMN IF EXISTS verification_token_expires_at;
