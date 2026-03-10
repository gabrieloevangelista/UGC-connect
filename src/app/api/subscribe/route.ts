import { NextRequest, NextResponse } from "next/server";
import { createCustomer, createBilling } from "@/lib/abacatepay";
import { createSubscriber } from "@/lib/supabase";

const PLANS: Record<string, { name: string; description: string; price: number; frequency: "ONE_TIME" | "MULTIPLE_PAYMENTS" }> = {
    starter: {
        name: "Plano Starter - UGC Connect",
        description: "5 Vídeos UGC originais, 1 rodada de revisão, direitos digitais",
        price: 199000, // R$ 1.990,00 em centavos
        frequency: "ONE_TIME",
    },
    scale: {
        name: "Plano Scale - UGC Connect",
        description: "10 vídeos/mês, criadores premium, direitos ilimitados, suporte WhatsApp",
        price: 499000, // R$ 4.990,00 em centavos
        frequency: "MULTIPLE_PAYMENTS",
    },
};

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, phone, taxId, plan, billingPeriod, userId } = body;

        // Validação básica
        if (!name || !email || !phone || !taxId || !plan) {
            return NextResponse.json(
                { error: "Todos os campos são obrigatórios" },
                { status: 400 }
            );
        }

        const planKey = plan?.toLowerCase();
        const selectedSettings = PLANS[planKey as keyof typeof PLANS];

        if (!selectedSettings) {
            console.error("Plano inválido recebido:", plan);
            return NextResponse.json(
                { error: `Plano '${plan}' não encontrado.` },
                { status: 400 }
            );
        }

        const planData = { ...selectedSettings };

        // Aplicar desconto trimestral se aplicável
        if (billingPeriod === 'trimestral') {
            if (plan === 'starter') {
                planData.price = 169100; // R$ 1.691,00 (15% off 1.990)
                planData.name = "Plano Starter - Trimestral (15% OFF)";
                planData.description = "5 Vídeos UGC originais, faturamento trimestral com desconto.";
                planData.frequency = "MULTIPLE_PAYMENTS";
            } else if (plan === 'scale') {
                planData.price = 424100; // R$ 4.241,00 (15% off 4.990)
                planData.name = "Plano Scale - Trimestral (15% OFF)";
                planData.description = "10 vídeos/mês, faturamento trimestral com desconto.";
            }
        }

        // Normalizar dados
        const cleanPhone = phone.replace(/\D/g, '');
        const cleanTaxId = taxId.replace(/\D/g, '');

        // 1. Criar cliente no AbacatePay
        console.log("Criando cliente no AbacatePay...", { name, email });
        const customerResponse = await createCustomer({
            name,
            email,
            cellphone: cleanPhone,
            taxId: cleanTaxId,
        });

        if (!customerResponse?.data?.id) {
            console.error("Resposta inválida do AbacatePay (cliente):", customerResponse);
            throw new Error(customerResponse?.error || "Falha ao obter ID do cliente no AbacatePay");
        }

        const customerId = customerResponse.data.id;
        console.log("Cliente criado:", customerId);

        // 2. Criar cobrança no AbacatePay
        const origin =
            request.headers.get("origin") ||
            process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
            (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
        console.log("Criando cobrança no AbacatePay...", { customerId, productName: planData.name });

        const billingResponse = await createBilling({
            customerId,
            productName: planData.name,
            productDescription: planData.description,
            price: planData.price,
            frequency: planData.frequency,
            returnUrl: `${origin}/#planos`,
            completionUrl: `${origin}/painel?payment=success`,
        });

        if (!billingResponse?.data?.id) {
            console.error("Resposta inválida do AbacatePay (cobrança):", billingResponse);
            throw new Error(billingResponse?.error || "Falha ao obter ID da cobrança no AbacatePay");
        }

        const billingId = billingResponse.data.id;
        const checkoutUrl = billingResponse.data.url;
        console.log("Cobrança criada:", billingId);

        // 3. Salvar assinante no Supabase
        console.log("Salvando assinante no Supabase...", { email, plan });
        await createSubscriber({
            name,
            email,
            phone: cleanPhone,
            tax_id: cleanTaxId,
            plan,
            user_id: userId,
            abacatepay_customer_id: customerId,
            abacatepay_billing_id: billingId,
            status: "PENDING",
        });

        return NextResponse.json({ checkoutUrl });
    } catch (error) {
        console.error("DETALHE DO ERRO NA ASSINATURA:", error);
        const message = error instanceof Error ? error.message : "Erro interno no servidor";

        const isClientError = message.includes("Erro ao criar") || message.includes("Inválido");

        return NextResponse.json({ error: message }, { status: isClientError ? 400 : 500 });
    }
}
