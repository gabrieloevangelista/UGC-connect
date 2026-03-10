-- Migration: Add avatar_url to subscribers table
ALTER TABLE public.subscribers ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Policy: Allow users to update their own avatar
-- (Assuming standard policies exist, if not, create one)
-- CREATE POLICY "Users can update own profile" ON public.subscribers FOR UPDATE USING (auth.uid() = user_id);

-- Storage: Create bucket 'avatars'
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policy: Allow public read
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');

-- Storage Policy: Allow authenticated upload
CREATE POLICY "Authenticated Upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'avatars');

-- Storage Policy: Allow users to update/delete their own files (optional, but good practice)
CREATE POLICY "Owner Update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'avatars' AND auth.uid() = owner);
