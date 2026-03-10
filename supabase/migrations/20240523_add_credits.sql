
ALTER TABLE public.subscribers ADD COLUMN IF NOT EXISTS credits DECIMAL(10, 2) DEFAULT 0.00;

CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('CREDIT', 'DEBIT')),
    description TEXT,
    status TEXT DEFAULT 'PENDING', -- PENDING, COMPLETED, FAILED
    abacatepay_billing_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Policies
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own transactions" ON public.transactions
    FOR SELECT USING (auth.uid() = user_id);

-- Only service role can insert/update transactions (via API)
-- But for now, we might need to allow authenticated users to insert if we do it client side? 
-- No, better to do it via API route. So Service Role will handle it.
