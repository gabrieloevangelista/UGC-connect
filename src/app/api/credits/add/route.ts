import { NextRequest, NextResponse } from "next/server";
import { createCustomer, createBilling } from "@/lib/abacatepay";
import { createClient } from "@supabase/supabase-js";

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

        // Sanitize phone: remove non-digits, strip country code 55 if present
        let cleanPhone = phone.replace(/\D/g, "");
        if (cleanPhone.startsWith("55") && cleanPhone.length > 11) {
            cleanPhone = cleanPhone.slice(2);
        }

        // Sanitize taxId: remove non-digits
        const cleanTaxId = taxId.replace(/\D/g, "");

        if (cleanPhone.length !== 10 && cleanPhone.length !== 11) {
            return NextResponse.json(
                { error: "Celular inválido: informe DDD + número (10 ou 11 dígitos, sem código do país)" },
                { status: 400 }
            );
        }
        if (cleanTaxId.length !== 11 && cleanTaxId.length !== 14) {
            return NextResponse.json(
                { error: "CPF ou CNPJ inválido" },
                { status: 400 }
            );
        }

        // Determine base URL for return/webhook URLs
        const origin =
            request.headers.get("origin") ||
            (process.env.NEXT_PUBLIC_SITE_URL
                ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")
                : null) ||
            (process.env.VERCEL_URL
                ? `https://${process.env.VERCEL_URL}`
                : "https://ugc-connect.vercel.app");

        // 1. Create or retrieve Customer in AbacatePay
        const customerResponse = await createCustomer({
            name,
            email,
            cellphone: cleanPhone,
            taxId: cleanTaxId,
        });

        if (!customerResponse?.data?.id) {
            const errMsg = customerResponse?.error || "Falha ao criar cliente no AbacatePay";
            console.error("AbacatePay createCustomer error:", customerResponse);
            throw new Error(errMsg);
        }

        const customerId = customerResponse.data.id;

        // 2. Create Billing (Checkout) in AbacatePay
        const billingResponse = await createBilling({
            customerId,
            productName: "Créditos UGC Connect",
            productDescription: `Recarga de R$ ${numericAmount.toFixed(2)} em créditos`,
            price: Math.round(numericAmount * 100), // convert to cents
            frequency: "ONE_TIME",
            returnUrl: `${origin}/painel/dados?tab=carteira&payment=pending`,
            completionUrl: `${origin}/api/webhook`,
        });

        if (!billingResponse?.data?.id) {
            const errMsg = billingResponse?.error || "Falha ao criar cobrança no AbacatePay";
            console.error("AbacatePay createBilling error:", billingResponse);
            throw new Error(errMsg);
        }

        const billingId = billingResponse.data.id;
        const checkoutUrl = billingResponse.data.url;

        // 3. Record Transaction in Supabase as PENDING
        // Use user's Bearer token so RLS allows the insert
        const authHeader = request.headers.get("Authorization");

        const supabaseClient = authHeader
            ? createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                {
                    global: {
                        headers: { Authorization: authHeader },
                    },
                }
            )
            : createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );

        const { error: txError } = await supabaseClient
            .from("transactions")
            .insert([
                {
                    user_id: userId,
                    amount: numericAmount,
                    type: "CREDIT",
                    description: `Recarga de R$ ${numericAmount.toFixed(2)} via AbacatePay`,
                    status: "PENDING",
                    abacatepay_billing_id: billingId,
                },
            ])
            .select()
            .single();

        if (txError) {
            // Log but don't block – payment can still proceed
            console.error("Erro ao registrar transação no Supabase:", txError.message);
        }

        console.log(
            `✅ Billing criado: ${billingId} | Checkout: ${checkoutUrl} | User: ${userId} | Valor: R$ ${numericAmount}`
        );

        return NextResponse.json({ checkoutUrl });
    } catch (error) {
        console.error("ERRO AO ADICIONAR CRÉDITOS:", error);

        let message = "Erro interno no servidor";
        if (error instanceof Error) {
            // Try to parse AbacatePay JSON error messages
            if (error.message.includes("{")) {
                try {
                    const match = error.message.match(/(\{.*\})/);
                    if (match?.[1]) {
                        const parsed = JSON.parse(match[1]);
                        message = parsed.error || parsed.message || error.message;
                    } else {
                        message = error.message;
                    }
                } catch {
                    message = error.message;
                }
            } else {
                message = error.message;
            }
        }

        return NextResponse.json({ error: message }, { status: 500 });
    }
}
