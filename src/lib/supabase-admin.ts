import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const getAdminClient = () => {
    if (!supabaseServiceRoleKey) {
        console.warn("SUPABASE_SERVICE_ROLE_KEY is missing. Falling back to anon key (may cause RLS errors).");
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

    // 1. Find and update transaction status
    const { data: transaction, error } = await supabaseAdmin
        .from("transactions")
        .update({ status })
        .eq("abacatepay_billing_id", billingId)
        .select()
        .single();

    if (error) throw new Error(`Transação não encontrada para billing ${billingId}: ${error.message}`);

    console.log(`📝 Transação ${transaction.id} atualizada para ${status}`);

    // 2. Add credits when payment is confirmed
    if (status === "COMPLETED" && transaction) {
        const amountToAdd = Number(transaction.amount);

        // Try atomic RPC first
        const { error: rpcError } = await supabaseAdmin.rpc('add_credits', {
            user_id_param: transaction.user_id,
            amount_param: amountToAdd
        });

        if (rpcError) {
            console.warn("RPC add_credits falhou, usando fallback manual:", rpcError.message);

            // Manual fallback: read current credits and update
            const { data: subscriber, error: subError } = await supabaseAdmin
                .from("subscribers")
                .select("credits")
                .eq("user_id", transaction.user_id)
                .single();

            if (subError || !subscriber) {
                throw new Error(`Subscriber não encontrado para user_id ${transaction.user_id}: ${subError?.message}`);
            }

            const currentCredits = Number(subscriber.credits) || 0;
            const newCredits = currentCredits + amountToAdd;

            const { error: updateError } = await supabaseAdmin
                .from("subscribers")
                .update({ credits: newCredits })
                .eq("user_id", transaction.user_id);

            if (updateError) {
                throw new Error(`Erro ao atualizar créditos: ${updateError.message}`);
            }

            console.log(`💰 Créditos atualizados: ${currentCredits} → ${newCredits} para user ${transaction.user_id}`);
        } else {
            console.log(`💰 Créditos adicionados via RPC: +${amountToAdd} para user ${transaction.user_id}`);
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

    if (error) throw new Error(`Assinante não encontrado para billing ${billingId}: ${error.message}`);

    console.log(`📝 Assinante ${data.id} atualizado para ${status}`);
    return data;
}
