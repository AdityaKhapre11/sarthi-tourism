-- Add new profile fields to public.users table
alter table public.users
  add column if not exists gender text,
  add column if not exists mobile_number text,
  add column if not exists address text,
  add column if not exists dob date;
