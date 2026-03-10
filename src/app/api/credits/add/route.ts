import { NextRequest, NextResponse } from "next/server";
import { createCustomer, createBilling } from "@/lib/abacatepay";
import { getAdminClient } from "@/lib/supabase-admin";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, phone, taxId, amount, userId } = body;

        // Validation
        if (!name || !email || !phone || !taxId || !amount || !userId) {
            return NextResponse.json(
                { error: "Todos os campos são obrigatórios" },
                { status: 400 }
            );
        }

        const numericAmount = Number(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            return NextResponse.json(
                { error: "Valor inválido" },
                { status: 400 }
            );
        }

        const cleanPhone = phone.replace(/\D/g, '');
        const cleanTaxId = taxId.replace(/\D/g, '');

        // 1. Create Customer in AbacatePay
        const customerResponse = await createCustomer({
            name,
            email,
            cellphone: cleanPhone,
            taxId: cleanTaxId,
        });

        if (!customerResponse?.data?.id) {
            throw new Error(customerResponse?.error || "Falha ao obter ID do cliente no AbacatePay");
        }

        const customerId = customerResponse.data.id;

        // 2. Create Billing in AbacatePay
        const origin = request.headers.get("origin") || "http://localhost:3000";
        const billingResponse = await createBilling({
            customerId,
            productName: "Créditos UGC",
            productDescription: `Adição de R$ ${numericAmount.toFixed(2)} em créditos`,
            price: Math.round(numericAmount * 100), // Convert to cents
            frequency: "ONE_TIME",
            returnUrl: `${origin}/painel/dados?tab=carteira&success=true`,
            completionUrl: `${origin}/painel/dados?tab=carteira&payment=success`,
        });

        if (!billingResponse?.data?.id) {
            throw new Error(billingResponse?.error || "Falha ao obter ID da cobrança no AbacatePay");
        }

        const billingId = billingResponse.data.id;
        const checkoutUrl = billingResponse.data.url;

        // 3. Save Transaction in Supabase (Using Admin Client to bypass RLS)
        const supabaseAdmin = getAdminClient();
        const { error: txError } = await supabaseAdmin
            .from("transactions")
            .insert([{
                user_id: userId,
                amount: numericAmount,
                type: "CREDIT",
                description: "Adição de créditos via Pix",
                status: "PENDING",
                abacatepay_billing_id: billingId,
            }])
            .select()
            .single();

        if (txError) {
            throw new Error(`Erro ao criar transação: ${txError.message}`);
        }

        return NextResponse.json({ checkoutUrl });
    } catch (error: any) {
        console.error("ERRO AO ADICIONAR CRÉDITOS:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Erro interno no servidor" },
            { status: 500 }
        );
    }
}
