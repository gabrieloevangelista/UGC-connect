import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const getAdminClient = () => {
    if (!supabaseServiceRoleKey) {
        console.warn("SUPABASE_SERVICE_ROLE_KEY is missing. Falling back to anon key, which may cause RLS errors.");
        return createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    }
    
    return createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });
};

export async function updateTransactionStatusAdmin(
    billingId: string,
    status: "COMPLETED" | "FAILED"
) {
    const supabaseAdmin = getAdminClient();

    // 1. Update transaction status
    const { data: transaction, error } = await supabaseAdmin
        .from("transactions")
        .update({ status })
        .eq("abacatepay_billing_id", billingId)
        .select()
        .single();

    if (error) throw new Error(`Erro ao atualizar transação (Admin): ${error.message}`);

    // 2. If COMPLETED, add credits to user
    if (status === "COMPLETED" && transaction) {
        // Try RPC first (it's atomic)
        const { error: creditError } = await supabaseAdmin.rpc('add_credits', {
            user_id_param: transaction.user_id,
            amount_param: transaction.amount
        });

        // Fallback if RPC doesn't exist or fails
        if (creditError) { 
             console.warn("RPC add_credits failed (Admin), trying manual update", creditError);
             
             const { data: subscriber, error: subError } = await supabaseAdmin
                .from("subscribers")
                .select("credits")
                .eq("user_id", transaction.user_id)
                .single();
             
             if (subError || !subscriber) {
                 console.error("Erro ao buscar assinante para adicionar créditos (Manual Fallback Admin):", subError);
             } else {
                 const currentCredits = Number(subscriber.credits) || 0;
                 const newCredits = currentCredits + Number(transaction.amount);
                 
                 const { error: updateError } = await supabaseAdmin
                    .from("subscribers")
                    .update({ credits: newCredits })
                    .eq("user_id", transaction.user_id);
                
                 if (updateError) {
                     console.error("Erro ao atualizar créditos manualmente (Admin):", updateError);
                 }
             }
        }
    }

    return transaction;
}

export async function updateSubscriberStatusAdmin(
    billingId: string,
    status: "PAID" | "EXPIRED"
) {
    const supabaseAdmin = getAdminClient();
    
    const { data, error } = await supabaseAdmin
        .from("subscribers")
        .update({ status })
        .eq("abacatepay_billing_id", billingId)
        .select()
        .single();

    if (error) throw new Error(`Erro ao atualizar assinante (Admin): ${error.message}`);
    return data;
}
