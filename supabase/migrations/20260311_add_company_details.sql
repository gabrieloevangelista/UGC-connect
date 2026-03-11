ALTER TABLE public.subscribers ADD COLUMN IF NOT EXISTS company_legal_name TEXT;
ALTER TABLE public.subscribers ADD COLUMN IF NOT EXISTS company_trade_name TEXT;
ALTER TABLE public.subscribers ADD COLUMN IF NOT EXISTS company_ie TEXT;
ALTER TABLE public.subscribers ADD COLUMN IF NOT EXISTS company_size TEXT;

ALTER TABLE public.subscribers ADD COLUMN IF NOT EXISTS company_street TEXT;
ALTER TABLE public.subscribers ADD COLUMN IF NOT EXISTS company_number TEXT;
ALTER TABLE public.subscribers ADD COLUMN IF NOT EXISTS company_complement TEXT;
ALTER TABLE public.subscribers ADD COLUMN IF NOT EXISTS company_neighborhood TEXT;
ALTER TABLE public.subscribers ADD COLUMN IF NOT EXISTS company_city TEXT;
ALTER TABLE public.subscribers ADD COLUMN IF NOT EXISTS company_state TEXT;
ALTER TABLE public.subscribers ADD COLUMN IF NOT EXISTS company_zip TEXT;
