-- 1. Create a public users table to store profile data
create table if not exists public.users (
  id uuid references auth.users not null primary key,
  email text not null,
  full_name text,
  role text default 'user',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security (RLS) so users can only see/edit their own data
alter table public.users enable row level security;

create policy "Users can view their own profile."
  on public.users for select
  using ( auth.uid() = id );

create policy "Users can update their own profile."
  on public.users for update
  using ( auth.uid() = id );

-- 3. Create the function that automatically handles new signups
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, full_name)
  values (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name' -- Extracts the name we pass from the frontend
  );
  return new;
end;
$$ language plpgsql security definer;

-- 4. Create the trigger on the auth.users table
-- First, drop the trigger if it already exists (to prevent the 500 error if it's broken)
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
