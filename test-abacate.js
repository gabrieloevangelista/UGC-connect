import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const ABACATEPAY_API_URL = "https://api.abacatepay.com/v1";
const token = process.env.ABACATEPAY_API_TOKEN;

async function testAbacatePay() {
    console.log("Token:", token ? "Present" : "Missing");

    try {
        console.log("\n--- Criando Cliente ---");
        const customerRes = await fetch(`${ABACATEPAY_API_URL}/customer/create`, {
            method: "POST",
            headers: {
                "accept": "application/json",
                "content-type": "application/json",
                "authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                name: "Teste Usuário",
                email: "teste@example.com",
                cellphone: "11999999999",
                taxId: "12345678909",
            }),
        });

        const customerText = await customerRes.text();
        console.log("Status:", customerRes.status);
        console.log("Body:", customerText);

        let customerData;
        try {
            customerData = JSON.parse(customerText);
        } catch (e) {
            console.log("Could not parse customer JSON");
            return;
        }

        if (!customerRes.ok) return;

        const customerId = customerData.data?.id;
        console.log("Customer ID:", customerId);

        console.log("\n--- Criando Cobrança ---");
        const billingRes = await fetch(`${ABACATEPAY_API_URL}/billing/create`, {
            method: "POST",
            headers: {
                "accept": "application/json",
                "content-type": "application/json",
                "authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                frequency: "ONE_TIME",
                methods: ["PIX", "CARD"],
                products: [
                    {
                        externalId: `ugc-${Date.now()}`,
                        name: "Créditos UGC",
                        description: "Adição de R$ 5.00 em créditos",
                        quantity: 1,
                        price: 500,
                    },
                ],
                returnUrl: "https://ugc-connect.vercel.app/painel/dados?tab=carteira&success=true",
                completionUrl: "https://ugc-connect.vercel.app/api/webhook",
                customerId: customerId,
            }),
        });

        const billingText = await billingRes.text();
        console.log("Status:", billingRes.status);
        console.log("Body:", billingText);

    } catch (err) {
        console.error("Fetch Error:", err);
    }
}

testAbacatePay();
