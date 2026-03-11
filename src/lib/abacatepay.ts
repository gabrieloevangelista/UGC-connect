const ABACATEPAY_API_URL = "https://api.abacatepay.com/v1";

function getHeaders(): HeadersInit {
    const token = process.env.ABACATEPAY_API_TOKEN;
    if (!token) {
        throw new Error("ABACATEPAY_API_TOKEN não configurado no .env.local");
    }
    return {
        accept: "application/json",
        "content-type": "application/json",
        authorization: `Bearer ${token}`,
    };
}

export interface CreateCustomerData {
    name: string;
    email: string;
    cellphone: string;
    taxId: string;
}

export interface CreateBillingData {
    customerId: string;
    productName: string;
    productDescription: string;
    price: number; // em centavos
    frequency: "ONE_TIME" | "MULTIPLE_PAYMENTS";
    returnUrl: string;
    completionUrl: string;
}

export interface CreatePixQrCodeData {
    amount: number; // em centavos
    description?: string;
    customer?: {
        name: string;
        cellphone: string;
        email: string;
        taxId: string;
    };
    metadata?: Record<string, any>;
}

export async function createCustomer(data: CreateCustomerData) {
    const res = await fetch(`${ABACATEPAY_API_URL}/customer/create`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
            name: data.name,
            email: data.email,
            cellphone: data.cellphone,
            taxId: data.taxId,
        }),
    });

    if (!res.ok) {
        const error = await res.text();
        throw new Error(`Erro ao criar cliente: ${error}`);
    }

    return res.json();
}

export async function createBilling(data: CreateBillingData) {
    const res = await fetch(`${ABACATEPAY_API_URL}/billing/create`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
            frequency: data.frequency,
            methods: ["PIX", "CARD"],
            products: [
                {
                    externalId: `ugc-${Date.now()}`,
                    name: data.productName,
                    description: data.productDescription,
                    quantity: 1,
                    price: data.price,
                },
            ],
            returnUrl: data.returnUrl,
            completionUrl: data.completionUrl,
            customerId: data.customerId,
        }),
    });

    if (!res.ok) {
        const error = await res.text();
        throw new Error(`Erro ao criar cobrança: ${error}`);
    }

    return res.json();
}

export async function listBillings() {
    const res = await fetch(`${ABACATEPAY_API_URL}/billing/list`, {
        method: "GET",
        headers: getHeaders(),
    });

    if (!res.ok) {
        const error = await res.text();
        throw new Error(`Erro ao listar cobranças: ${error}`);
    }

    return res.json();
}

export async function createPixQrCode(data: CreatePixQrCodeData) {
    const res = await fetch(`${ABACATEPAY_API_URL}/pixQrCode/create`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const error = await res.text();
        throw new Error(`Erro ao gerar QRCode PIX: ${error}`);
    }

    return res.json();
}
