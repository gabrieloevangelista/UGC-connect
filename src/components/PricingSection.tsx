"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import SubscribeModal from "./SubscribeModal";

import { Plan, plans } from "@/lib/constants";

export default function PricingSection() {
    const [billingPeriod, setBillingPeriod] = useState<"mensal" | "trimestral">("mensal");
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<{
        key: string;
        name: string;
        price: string;
        billingPeriod?: string;
    } | null>(null);

    const handleSubscribe = (plan: Plan) => {
        if (plan.subscribable) {
            let price = plan.priceDisplay;
            if (billingPeriod === 'trimestral') {
                if (plan.key === 'starter') price = "R$ 1.691";
                if (plan.key === 'scale') price = "R$ 4.241";
            }
            setSelectedPlan({
                key: plan.key,
                name: plan.name,
                price: price,
                billingPeriod: plan.key === 'starter' || plan.key === 'scale' ? billingPeriod : 'mensal'
            });
            setModalOpen(true);
        } else {
            // Enterprise — abrir WhatsApp
            window.open(
                "https://wa.me/5511999990000?text=Olá! Tenho interesse no plano Enterprise do UGC Connect.",
                "_blank"
            );
        }
    };

    return (
        <>
            <section id="planos" className="px-6 py-24 md:px-12 max-w-[1600px] mx-auto">
                <div className="flex justify-between items-baseline mb-8 border-b border-stone-200 pb-4">
                    <span className="text-xs text-stone-400 uppercase tracking-widest">
                        / 04 Planos
                    </span>
                    <span className="text-xs text-stone-400 font-mono">[ 04 ]</span>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <h2 className="text-4xl tracking-tight text-stone-900 max-w-lg font-light">
                        Planos para escalar sua criação de conteúdo.
                    </h2>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setBillingPeriod("mensal")}
                            className={`px-4 py-1.5 rounded-full text-xs font-medium transition ${billingPeriod === "mensal"
                                ? "bg-stone-900 text-white"
                                : "border border-stone-200 text-stone-600 hover:border-stone-400"
                                }`}
                        >
                            Mensal
                        </button>
                        <button
                            onClick={() => setBillingPeriod("trimestral")}
                            className={`px-4 py-1.5 rounded-full text-xs font-medium transition ${billingPeriod === "trimestral"
                                ? "bg-stone-900 text-white"
                                : "border border-stone-200 text-stone-600 hover:border-stone-400"
                                }`}
                        >
                            Trimestral (-15%)
                        </button>
                    </div>
                </div>

                {/* PRICING CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center max-w-6xl mx-auto mt-12">
                    {plans.map((plan) => {
                        if (plan.variant === "light") {
                            return (
                                <div
                                    key={plan.name}
                                    className="bg-white border border-stone-200 rounded-[32px] p-8 md:p-10 flex flex-col h-full hover:border-stone-300 transition-colors shadow-sm relative"
                                >
                                    <h4 className="text-xl font-medium text-stone-900 mb-2">
                                        {plan.name}
                                    </h4>
                                    <p className="text-sm text-stone-500 mb-8 min-h-[40px]">
                                        {plan.description}
                                    </p>
                                    <div className="mb-8">
                                        <span className="text-4xl md:text-5xl tracking-tight text-stone-900 font-light">
                                            {plan.key === 'starter' && billingPeriod === 'trimestral' ? 'R$ 1.691' :
                                                plan.key === 'scale' && billingPeriod === 'trimestral' ? 'R$ 4.241' :
                                                    plan.priceDisplay}
                                        </span>
                                        <span className="text-xs text-stone-400 font-medium uppercase tracking-wide block mt-2">
                                            {billingPeriod === 'trimestral' ? 'Pagamento Trimestral' : plan.priceLabel}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleSubscribe(plan)}
                                        className="w-full py-3 rounded-full border border-stone-200 text-stone-900 text-sm font-medium hover:bg-stone-50 transition mb-8"
                                    >
                                        {plan.buttonText}
                                    </button>
                                    <div className="flex flex-col gap-4 mt-auto">
                                        <span className="text-xs font-semibold uppercase tracking-wider text-stone-900">
                                            {plan.featuresLabel}
                                        </span>
                                        <ul className="space-y-3 text-sm text-stone-600">
                                            {plan.features.map((f, i) => (
                                                <li key={i} className="flex items-start gap-3">
                                                    <Icon
                                                        icon="solar:check-circle-linear"
                                                        className="text-stone-900 mt-0.5 text-base shrink-0"
                                                    />
                                                    {f.text}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            );
                        }

                        if (plan.variant === "dark") {
                            return (
                                <div
                                    key={plan.name}
                                    className="bg-stone-900 text-white rounded-[32px] p-8 md:p-10 flex flex-col h-full shadow-2xl relative border border-stone-800 md:scale-105 z-10"
                                >
                                    {plan.recommended && (
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                            <span className="bg-emerald-400 text-emerald-950 text-[10px] font-bold uppercase tracking-widest py-1.5 px-4 rounded-full">
                                                Recomendado
                                            </span>
                                        </div>
                                    )}
                                    <h4 className="text-xl font-medium text-white mb-2">
                                        {plan.name}
                                    </h4>
                                    <p className="text-sm text-stone-400 mb-8 min-h-[40px]">
                                        {plan.description}
                                    </p>
                                    <div className="mb-8">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-4xl md:text-5xl tracking-tight text-white font-light">
                                                {plan.key === 'starter' && billingPeriod === 'trimestral' ? 'R$ 1.691' :
                                                    plan.key === 'scale' && billingPeriod === 'trimestral' ? 'R$ 4.241' :
                                                        plan.priceDisplay}
                                            </span>
                                            {(plan.priceSuffix || (plan.key === 'starter' && billingPeriod === 'trimestral')) && (
                                                <span className="text-stone-400 text-sm">
                                                    {plan.key === 'starter' && billingPeriod === 'trimestral' ? '/mês' : plan.priceSuffix}
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-xs text-stone-400 font-medium uppercase tracking-wide block mt-2">
                                            {billingPeriod === 'trimestral' ? 'Assinatura Trimestral' : plan.priceLabel}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleSubscribe(plan)}
                                        className="w-full py-3 rounded-full bg-white text-stone-900 text-sm font-medium hover:bg-stone-200 transition mb-8"
                                    >
                                        {plan.buttonText}
                                    </button>
                                    <div className="flex flex-col gap-4 mt-auto">
                                        <span className="text-xs font-semibold uppercase tracking-wider text-white">
                                            {plan.featuresLabel}
                                        </span>
                                        <ul className="space-y-3 text-sm text-stone-300">
                                            {plan.features.map((f, i) => (
                                                <li key={i} className="flex items-start gap-3">
                                                    <Icon
                                                        icon="solar:check-circle-linear"
                                                        className={`${f.iconColor || "text-white"} mt-0.5 text-base shrink-0`}
                                                    />
                                                    {f.text}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            );
                        }

                        // olive variant (Enterprise)
                        return (
                            <div
                                key={plan.name}
                                className="bg-[#2D302B] text-[#E0D8C8] rounded-[32px] p-8 md:p-10 flex flex-col h-full border border-stone-800 transition-colors shadow-sm relative"
                            >
                                <h4 className="text-xl font-medium text-white mb-2">
                                    {plan.name}
                                </h4>
                                <p className="text-sm text-[#E0D8C8]/60 mb-8 min-h-[40px]">
                                    {plan.description}
                                </p>
                                <div className="mb-8 flex flex-col justify-center min-h-[56px] md:min-h-[64px]">
                                    <span className="text-3xl md:text-4xl tracking-tight text-white font-light">
                                        {plan.priceDisplay}
                                    </span>
                                </div>
                                <button
                                    onClick={() => handleSubscribe(plan)}
                                    className="w-full py-3 rounded-full border border-[#E0D8C8]/30 text-white text-sm font-medium hover:bg-[#E0D8C8]/10 transition mb-8"
                                >
                                    {plan.buttonText}
                                </button>
                                <div className="flex flex-col gap-4 mt-auto">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-white">
                                        {plan.featuresLabel}
                                    </span>
                                    <ul className="space-y-3 text-sm text-[#E0D8C8]/80">
                                        {plan.features.map((f, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <Icon
                                                    icon="solar:check-circle-linear"
                                                    className="text-white mt-0.5 text-base shrink-0"
                                                />
                                                {f.text}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Subscribe Modal */}
            {selectedPlan && (
                <SubscribeModal
                    isOpen={modalOpen}
                    onClose={() => {
                        setModalOpen(false);
                        setSelectedPlan(null);
                    }}
                    plan={selectedPlan}
                />
            )}
        </>
    );
}
