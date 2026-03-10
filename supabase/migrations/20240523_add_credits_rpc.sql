CREATE OR REPLACE FUNCTION add_credits(user_id_param UUID, amount_param DECIMAL)
RETURNS VOID AS $$
BEGIN
  UPDATE public.subscribers
  SET credits = COALESCE(credits, 0) + amount_param
  WHERE user_id = user_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
