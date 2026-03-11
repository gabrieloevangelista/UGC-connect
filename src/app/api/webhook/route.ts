import { NextRequest, NextResponse } from "next/server";
import { updateSubscriberStatusAdmin, updateTransactionStatusAdmin } from "@/lib/supabase-admin";

// AbacatePay webhook events
// billing.paid / billing.completed / pix.paid / charge.paid = pagamento confirmado
export async function POST(request: NextRequest) {
    try {
        // ── Validação do secret na URL ────────────────────────────────────────
        const { searchParams } = new URL(request.url);
        const receivedSecret = searchParams.get("webhookSecret");
        const expectedSecret = process.env.ABACATEPAY_WEBHOOK_SECRET;

        if (expectedSecret && receivedSecret !== expectedSecret) {
            console.warn("⛔ Webhook recebido com secret inválido:", receivedSecret);
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        // ─────────────────────────────────────────────────────────────────────

        const body = await request.json();
        const { event, data } = body;

        console.log("🔔 Webhook AbacatePay recebido:", event, JSON.stringify(data));

        const isPaidEvent = [
            "billing.paid",
            "billing.completed",
            "pix.paid",
            "charge.paid",
        ].includes(event);

        if (isPaidEvent) {
            const billingId =
                data?.id ||
                data?.billing?.id ||
                data?.charge?.billing?.id ||
                null;

            if (!billingId) {
                console.warn("⚠️ Webhook sem billingId identificável:", data);
                return NextResponse.json({ received: true, warning: "No billingId found" });
            }

            console.log(`💳 Pagamento confirmado para billing: ${billingId}`);

            // Tenta como assinatura primeiro
            let handled = false;
            try {
                await updateSubscriberStatusAdmin(billingId, "PAID");
                console.log(`✅ Assinatura confirmada: ${billingId}`);
                handled = true;
            } catch {
                // Não era assinatura, tenta como crédito
            }

            if (!handled) {
                try {
                    const tx = await updateTransactionStatusAdmin(billingId, "COMPLETED");
                    console.log(`✅ Créditos adicionados: user=${tx?.user_id}, billing=${billingId}, valor=${tx?.amount}`);
                    handled = true;
                } catch (txError) {
                    console.error(`❌ Erro ao processar crédito para billing ${billingId}:`, txError);
                }
            }

            if (!handled) {
                console.warn(`⚠️ Billing ${billingId} não encontrado em nenhuma tabela.`);
            }
        } else {
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

export const dynamic = "force-dynamic";
