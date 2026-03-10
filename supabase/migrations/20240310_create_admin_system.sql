-- Create app_admins table
CREATE TABLE IF NOT EXISTS public.app_admins (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'admin', -- 'master', 'admin'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.app_admins ENABLE ROW LEVEL SECURITY;

-- Insert initial admins (Idempotent)
INSERT INTO public.app_admins (email, role)
VALUES 
    ('gabriel.evan.queiroz@gmail.com', 'master'),
    ('contato@ugcconnect.shop', 'master'),
    ('admin@ugcconnect.shop', 'master')
ON CONFLICT (email) DO NOTHING;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.app_admins 
    WHERE email = auth.email()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is master admin
CREATE OR REPLACE FUNCTION public.is_master_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.app_admins 
    WHERE email = auth.email() AND role = 'master'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Policies for app_admins table
-- Only master admins can view/add/delete admins
CREATE POLICY "Admins can view admin list" ON public.app_admins
    FOR SELECT TO authenticated
    USING (public.is_admin());

CREATE POLICY "Master admins can insert admins" ON public.app_admins
    FOR INSERT TO authenticated
    WITH CHECK (public.is_master_admin());

CREATE POLICY "Master admins can delete admins" ON public.app_admins
    FOR DELETE TO authenticated
    USING (public.is_master_admin());

-- Update video_requests policies to use is_admin() function
DROP POLICY IF EXISTS "Users can view requests" ON public.video_requests;
DROP POLICY IF EXISTS "Users can update requests" ON public.video_requests;
DROP POLICY IF EXISTS "Users can delete requests" ON public.video_requests;

CREATE POLICY "Users can view requests" ON public.video_requests
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can update requests" ON public.video_requests
    FOR UPDATE TO authenticated
    USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can delete requests" ON public.video_requests
    FOR DELETE TO authenticated
    USING (auth.uid() = user_id OR public.is_admin());
