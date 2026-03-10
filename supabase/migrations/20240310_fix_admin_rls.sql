-- Habilita RLS na tabela video_requests
ALTER TABLE public.video_requests ENABLE ROW LEVEL SECURITY;

-- Remove políticas antigas para evitar conflitos
DROP POLICY IF EXISTS "Users can view own requests" ON public.video_requests;
DROP POLICY IF EXISTS "Users can insert own requests" ON public.video_requests;
DROP POLICY IF EXISTS "Users can update own requests" ON public.video_requests;
DROP POLICY IF EXISTS "Users can delete own requests" ON public.video_requests;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.video_requests;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.video_requests;

-- Política de visualização: Admin vê tudo, usuário vê apenas o seu
CREATE POLICY "Users can view requests" ON public.video_requests
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id 
  OR 
  auth.email() ILIKE '%gabriel.evan.queiroz%'
  OR 
  auth.email() IN ('contato@ugcconnect.shop', 'admin@ugcconnect.shop')
);

-- Política de inserção: Usuário insere para si mesmo
CREATE POLICY "Users can insert requests" ON public.video_requests
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Política de atualização: Admin atualiza tudo, usuário atualiza o seu
CREATE POLICY "Users can update requests" ON public.video_requests
FOR UPDATE
TO authenticated
USING (
  auth.uid() = user_id 
  OR 
  auth.email() ILIKE '%gabriel.evan.queiroz%'
  OR 
  auth.email() IN ('contato@ugcconnect.shop', 'admin@ugcconnect.shop')
);

-- Política de deleção: Admin deleta tudo, usuário deleta o seu
CREATE POLICY "Users can delete requests" ON public.video_requests
FOR DELETE
TO authenticated
USING (
  auth.uid() = user_id 
  OR 
  auth.email() ILIKE '%gabriel.evan.queiroz%'
  OR 
  auth.email() IN ('contato@ugcconnect.shop', 'admin@ugcconnect.shop')
);
