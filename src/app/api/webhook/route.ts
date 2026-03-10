import { NextRequest, NextResponse } from "next/server";
import { updateSubscriberStatus, updateTransactionStatus } from "@/lib/supabase";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { event, data } = body;

        if (event === "billing.paid") {
            const billingId = data?.id || data?.billing?.id;

            if (billingId) {
                let handled = false;

                // Try to update subscription
                try {
                    await updateSubscriberStatus(billingId, "PAID");
                    console.log(`✅ Assinatura confirmada para billing: ${billingId}`);
                    handled = true;
                } catch (e) {
                    // Ignore error, might not be a subscription
                }

                if (!handled) {
                    // Try to update transaction (credits)
                    try {
                        await updateTransactionStatus(billingId, "COMPLETED");
                        console.log(`✅ Créditos confirmados para billing: ${billingId}`);
                        handled = true;
                    } catch (e) {
                        // Ignore error
                    }
                }

                if (!handled) {
                    console.warn(`⚠️ Billing ${billingId} não encontrado como assinatura ou transação.`);
                }
            }
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error("Erro no webhook:", error);
        return NextResponse.json(
            { error: "Erro ao processar webhook" },
            { status: 500 }
        );
    }
}
