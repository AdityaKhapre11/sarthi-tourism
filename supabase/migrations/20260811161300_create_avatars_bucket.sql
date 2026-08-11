-- Create the 'avatars' bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do update set public = true;



-- Policy: Anyone can view avatars
create policy "Avatar images are publicly accessible."
on storage.objects for select
using ( bucket_id = 'avatars' );

-- Policy: Authenticated users can upload their own avatars
create policy "Users can upload their own avatars."
on storage.objects for insert
to authenticated
with check ( bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1] );

-- Policy: Authenticated users can update their own avatars
create policy "Users can update their own avatars."
on storage.objects for update
to authenticated
using ( bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1] );

-- Policy: Authenticated users can delete their own avatars
create policy "Users can delete their own avatars."
on storage.objects for delete
to authenticated
using ( bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1] );
