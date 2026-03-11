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

        let cleanPhone = phone.replace(/\D/g, '');
        if (cleanPhone.startsWith('55') && cleanPhone.length > 11) {
            cleanPhone = cleanPhone.slice(2);
        }

        const cleanTaxId = taxId.replace(/\D/g, '');

        if (cleanPhone.length !== 10 && cleanPhone.length !== 11) {
            return NextResponse.json({ error: "O celular precisa ter DDD e o número (10 ou 11 dígitos, sem 55)" }, { status: 400 });
        }
        if (cleanTaxId.length !== 11 && cleanTaxId.length !== 14) {
            return NextResponse.json({ error: "O CPF ou CNPJ está inválido" }, { status: 400 });
        }

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
        const origin =
            request.headers.get("origin") ||
            process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
            (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://ugc-connect.vercel.app");
        const billingResponse = await createBilling({
            customerId,
            productName: "Créditos UGC",
            productDescription: `Adição de R$ ${numericAmount.toFixed(2)} em créditos`,
            price: Math.round(numericAmount * 100), // Convert to cents
            frequency: "ONE_TIME",
            returnUrl: `${origin}/painel/dados?tab=carteira&success=true`,
            completionUrl: `${origin}/api/webhook`, // webhook opcional, mas vamos usar a URL baseada na request pra testes se estiver no staging
        });

        if (!billingResponse?.data?.id) {
            throw new Error(billingResponse?.error || "Falha ao obter ID da cobrança no AbacatePay");
        }

        const billingId = billingResponse.data.id;
        const checkoutUrl = billingResponse.data.url;

        // 3. Save Transaction in Supabase (Using Authenticated Client to pass RLS)
        const authHeader = request.headers.get('Authorization');

        let supabaseClient;
        if (authHeader) {
            supabaseClient = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                {
                    global: {
                        headers: {
                            Authorization: authHeader,
                        },
                    },
                }
            );
        } else {
            // Fallback to anon/admin if no header (might fail RLS, but avoids breaking)
            supabaseClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
        }

        const { error: txError } = await supabaseClient
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
    } catch (error) {
        console.error("ERRO AO ADICIONAR CRÉDITOS:", error);

        let message = "Erro interno no servidor";
        if (error instanceof Error) {
            // Se o erro começa com um JSON em string do AbacatePay, vamos tentar parsear
            if (error.message.includes("{")) {
                try {
                    const match = error.message.match(/({.*})/);
                    if (match && match[1]) {
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
