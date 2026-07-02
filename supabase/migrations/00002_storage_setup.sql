-- 00002_storage_setup.sql
-- Insert a new bucket for sarthi-tourism media
INSERT INTO storage.buckets (id, name, public) 
VALUES ('sarthi-tourism-media', 'sarthi-tourism-media', true)
ON CONFLICT (id) DO NOTHING;

-- It is already enabled by default in Supabase
-- Allow public read access to the bucket
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'sarthi-tourism-media');

-- Allow authenticated users (Admins) to upload files
CREATE POLICY "Admin Upload Access" 
ON storage.objects FOR INSERT 
WITH CHECK (
    bucket_id = 'sarthi-tourism-media' 
    AND auth.role() = 'authenticated'
);

-- Allow authenticated users (Admins) to delete files
CREATE POLICY "Admin Delete Access" 
ON storage.objects FOR DELETE 
USING (
    bucket_id = 'sarthi-tourism-media' 
    AND auth.role() = 'authenticated'
);

-- Allow authenticated users (Admins) to update files
CREATE POLICY "Admin Update Access" 
ON storage.objects FOR UPDATE 
USING (
    bucket_id = 'sarthi-tourism-media' 
    AND auth.role() = 'authenticated'
);
