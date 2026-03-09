"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { supabase } from "@/lib/supabase";

interface SubscribeModalProps {
    isOpen: boolean;
    onClose: () => void;
    plan: {
        key: string;
        name: string;
        price: string;
        billingPeriod?: string;
    };
}

export default function SubscribeModal({
    isOpen,
    onClose,
    plan,
}: SubscribeModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        taxId: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const { data: { session } } = await supabase.auth.getSession();

            const res = await fetch("/api/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    plan: plan.key,
                    billingPeriod: plan.billingPeriod || 'mensal',
                    userId: session?.user?.id,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Erro ao processar assinatura");
            }

            // Redirecionar para checkout do AbacatePay
            window.location.href = data.checkoutUrl;
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro inesperado");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in">
                {/* Header */}
                <div className="bg-[#2D302B] text-white px-8 py-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs uppercase tracking-widest text-[#E0D8C8]/60 mb-1">
                                Assinar Plano
                            </p>
                            <h3 className="text-2xl font-light tracking-tight">
                                {plan.name}
                            </h3>
                            <p className="text-[#E0D8C8] text-sm mt-1">{plan.price}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white/60 hover:text-white transition p-1"
                            aria-label="Fechar"
                        >
                            <Icon icon="solar:close-circle-linear" width={24} />
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-8 py-6 space-y-4">
                    <div>
                        <label className="text-xs font-medium text-stone-500 uppercase tracking-wide block mb-1.5">
                            Nome Completo
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Seu nome completo"
                            className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-900/20 focus:border-stone-400 transition placeholder:text-stone-400"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-medium text-stone-500 uppercase tracking-wide block mb-1.5">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="seu@email.com"
                            className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-900/20 focus:border-stone-400 transition placeholder:text-stone-400"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-medium text-stone-500 uppercase tracking-wide block mb-1.5">
                            WhatsApp
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            placeholder="(11) 99999-0000"
                            className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-900/20 focus:border-stone-400 transition placeholder:text-stone-400"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-medium text-stone-500 uppercase tracking-wide block mb-1.5">
                            CPF ou CNPJ
                        </label>
                        <input
                            type="text"
                            name="taxId"
                            value={formData.taxId}
                            onChange={handleChange}
                            required
                            placeholder="000.000.000-00"
                            className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-900/20 focus:border-stone-400 transition placeholder:text-stone-400"
                        />
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-100">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 rounded-full bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                    >
                        {loading ? (
                            <>
                                <Icon
                                    icon="solar:refresh-linear"
                                    width={16}
                                    className="animate-spin"
                                />
                                Processando...
                            </>
                        ) : (
                            <>
                                Ir para Pagamento
                                <Icon icon="solar:arrow-right-linear" width={16} />
                            </>
                        )}
                    </button>

                    <p className="text-[10px] text-stone-400 text-center mt-3">
                        Pagamento processado com segurança via AbacatePay (PIX ou Cartão).
                    </p>
                </form>
            </div>
        </div>
    );
}
