import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Subscriber {
    id?: string;
    user_id?: string;
    name: string;
    email: string;
    phone: string;
    tax_id: string;
    company?: string;
    plan: string;
    abacatepay_customer_id?: string;
    abacatepay_billing_id?: string;
    status: "PENDING" | "PAID" | "EXPIRED" | "ACTIVE";
    created_at?: string;
}

export async function createSubscriber(data: Omit<Subscriber, "id" | "created_at">) {
    const { data: subscriber, error } = await supabase
        .from("subscribers")
        .insert([data])
        .select()
        .single();

    if (error) throw new Error(`Erro ao salvar assinante: ${error.message}`);
    return subscriber;
}

export async function updateSubscriberStatus(
    billingId: string,
    status: "PAID" | "EXPIRED"
) {
    const { data, error } = await supabase
        .from("subscribers")
        .update({ status })
        .eq("abacatepay_billing_id", billingId)
        .select()
        .single();

    if (error) throw new Error(`Erro ao atualizar assinante: ${error.message}`);
    return data;
}
