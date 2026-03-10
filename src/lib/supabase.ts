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

export interface Transaction {
    id?: string;
    user_id: string;
    amount: number;
    type: "CREDIT" | "DEBIT";
    description?: string;
    status: "PENDING" | "COMPLETED" | "FAILED";
    abacatepay_billing_id?: string;
    created_at?: string;
}

export async function createTransaction(data: Omit<Transaction, "id" | "created_at">) {
    const { data: transaction, error } = await supabase
        .from("transactions")
        .insert([data])
        .select()
        .single();

    if (error) throw new Error(`Erro ao criar transação: ${error.message}`);
    return transaction;
}

export async function updateTransactionStatus(
    billingId: string,
    status: "COMPLETED" | "FAILED"
) {
    // 1. Update transaction status
    const { data: transaction, error } = await supabase
        .from("transactions")
        .update({ status })
        .eq("abacatepay_billing_id", billingId)
        .select()
        .single();

    if (error) throw new Error(`Erro ao atualizar transação: ${error.message}`);

    // 2. If COMPLETED, add credits to user
    if (status === "COMPLETED" && transaction) {
        const { error: creditError } = await supabase.rpc('add_credits', {
            user_id_param: transaction.user_id,
            amount_param: transaction.amount
        });

        // Fallback if RPC doesn't exist (though RPC is safer for concurrency)
        // Since we can't easily create RPC without SQL access, we'll do a read-modify-write here for now, 
        // but ideally we should use RPC.
        // Let's assume we can't use RPC and do it manually.
        if (creditError) { 
             console.warn("RPC add_credits failed, trying manual update", creditError);
             
             const { data: subscriber } = await supabase
                .from("subscribers")
                .select("credits")
                .eq("user_id", transaction.user_id)
                .single();
             
             const currentCredits = subscriber?.credits || 0;
             const newCredits = currentCredits + transaction.amount;
             
             await supabase
                .from("subscribers")
                .update({ credits: newCredits })
                .eq("user_id", transaction.user_id);
        }
    }

    return transaction;
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
