export interface PlanFeature {
    text: string;
    iconColor?: string;
}

export interface Plan {
    key: string;
    name: string;
    description: string;
    price: string;
    priceDisplay: string;
    priceSuffix?: string;
    priceLabel: string;
    buttonText: string;
    featuresLabel: string;
    features: PlanFeature[];
    variant: "light" | "dark" | "olive";
    recommended?: boolean;
    subscribable?: boolean;
}

export const plans: Plan[] = [
    {
        key: "starter",
        name: "Starter",
        description: "Perfeito para o primeiro teste. Inclui vídeos variados de até 30s.",
        price: "R$ 1.990",
        priceDisplay: "R$ 1.990",
        priceLabel: "Pagamento Único",
        buttonText: "Começar Teste",
        featuresLabel: "O que está incluso:",
        features: [
            { text: "5 Vídeos UGC originais" },
            { text: "1 Rodada de edição/revisão" },
            { text: "Direitos de uso digitais" },
            { text: "Escolha de perfil (Nicho)" },
        ],
        variant: "light",
        subscribable: true,
    },
    {
        key: "scale",
        name: "Scale",
        description: "A solução completa para marcas que precisam testar criativos constantemente.",
        price: "R$ 4.990/mês",
        priceDisplay: "R$ 4.990",
        priceSuffix: "/mês",
        priceLabel: "Assinatura Mensal",
        buttonText: "Assinar Plano",
        featuresLabel: "Tudo do Starter, mais:",
        features: [
            { text: "10 Vídeos UGC editados/mês", iconColor: "text-emerald-400" },
            { text: "Gestão de envio de produtos", iconColor: "text-emerald-400" },
            { text: "Acesso a criadores Premium", iconColor: "text-emerald-400" },
            { text: "Direitos de uso ilimitados", iconColor: "text-emerald-400" },
            { text: "Suporte prioritário no WhatsApp", iconColor: "text-emerald-400" },
        ],
        variant: "dark",
        recommended: true,
        subscribable: true,
    },
    {
        key: "enterprise",
        name: "Enterprise",
        description: "Volume alto de vídeos, múltiplos clientes e atendimento VIP.",
        price: "Personalizado",
        priceDisplay: "Personalizado",
        priceLabel: "",
        buttonText: "Falar com Consultor",
        featuresLabel: "Para grandes operações:",
        features: [
            { text: "+30 Vídeos/mês" },
            { text: "Gerente de conta dedicado" },
            { text: "Material bruto (Raw) incluso" },
            { text: "Múltiplas marcas/produtos" },
        ],
        variant: "olive",
        subscribable: false,
    },
];
