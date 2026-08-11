-- Insert existing admin account into the public.users table manually
insert into public.users (id, email, full_name, role)
select id, email, raw_user_meta_data->>'full_name', 'admin'
from auth.users
where email = 'admin@sarthitourism.com'
on conflict (id) do update set role = 'admin';
