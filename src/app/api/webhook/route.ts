import { NextRequest, NextResponse } from "next/server";
import { updateSubscriberStatusAdmin, updateTransactionStatusAdmin } from "@/lib/supabase-admin";

// AbacatePay webhook events documentation:
// billing.paid / billing.completed / pix.paid = pagamento confirmado
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { event, data } = body;

        console.log("🔔 Webhook AbacatePay recebido:", event, JSON.stringify(data));

        // Aceitar todos os eventos de pagamento confirmado da AbacatePay
        const isPaidEvent = [
            "billing.paid",
            "billing.completed",
            "pix.paid",
            "charge.paid",
        ].includes(event);

        if (isPaidEvent) {
            // O billingId pode vir em diferentes formatos dependendo do evento
            const billingId =
                data?.id ||
                data?.billing?.id ||
                data?.charge?.billing?.id ||
                null;

            if (!billingId) {
                console.warn("⚠️ Webhook recebido sem billingId identificável:", data);
                return NextResponse.json({ received: true, warning: "No billingId found" });
            }

            console.log(`💳 Processando pagamento confirmado para billing: ${billingId}`);

            // Tenta primeiro como assinatura (subscribers)
            let handled = false;
            try {
                await updateSubscriberStatusAdmin(billingId, "PAID");
                console.log(`✅ Assinatura confirmada para billing: ${billingId}`);
                handled = true;
            } catch {
                // Não era uma assinatura, tentamos como transação de crédito
            }

            // Se não era assinatura, tenta como transação de créditos
            if (!handled) {
                try {
                    const tx = await updateTransactionStatusAdmin(billingId, "COMPLETED");
                    console.log(`✅ Créditos adicionados para user ${tx?.user_id}, billing: ${billingId}, valor: ${tx?.amount}`);
                    handled = true;
                } catch (txError) {
                    console.error(`❌ Erro ao processar transação de crédito para billing ${billingId}:`, txError);
                }
            }

            if (!handled) {
                console.warn(`⚠️ Billing ${billingId} não encontrado em nenhuma tabela (assinatura ou crédito).`);
            }
        } else {
            // Outros eventos como billing.expired, billing.cancelled etc
            console.log(`ℹ️ Evento não tratado: ${event}`);
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error("❌ Erro ao processar webhook:", error);
        return NextResponse.json(
            { error: "Erro ao processar webhook" },
            { status: 500 }
        );
    }
}

// Vercel: permitir que o webhook seja acessível sem autorização
export const dynamic = "force-dynamic";
