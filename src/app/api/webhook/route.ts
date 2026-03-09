import { NextRequest, NextResponse } from "next/server";
import { updateSubscriberStatus } from "@/lib/supabase";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { event, data } = body;

        if (event === "billing.paid") {
            const billingId = data?.id || data?.billing?.id;

            if (billingId) {
                await updateSubscriberStatus(billingId, "PAID");
                console.log(`✅ Pagamento confirmado para billing: ${billingId}`);
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
