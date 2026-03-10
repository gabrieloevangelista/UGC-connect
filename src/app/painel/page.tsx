"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { supabase } from "@/lib/supabase";
import type { Subscriber } from "@/lib/supabase";
import { isUserAdmin } from "@/config/admin";

export default function PainelPage() {
    const [subscriber, setSubscriber] = useState<Subscriber | null>(null);
    const [videoCount, setVideoCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showOnboarding, setShowOnboarding] = useState(false);

    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (user) {
                // Buscar dados do assinante
                const { data: sub } = await supabase
                    .from("subscribers")
                    .select("*")
                    .eq("user_id", user.id)
                    .single();

                if (sub) setSubscriber(sub);

                // Contar solicitações de vídeo
                const isAdmin = isUserAdmin(user.email);
                
                let query = supabase
                    .from("video_requests")
                    .select("*", { count: "exact", head: true });
                
                if (!isAdmin) {
                    query = query.eq("user_id", user.id);
                }
                
                const { count } = await query;

                setVideoCount(count || 0);
            }

            setLoading(false);
        };

        fetchData();

        // Check for success parameter
        if (searchParams.get("payment") === "success") {
            setShowOnboarding(true);
            // Clear the param from URL without refreshing
            router.replace("/painel");
        }
    }, [searchParams, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Icon
                    icon="solar:refresh-linear"
                    width={32}
                    className="animate-spin text-stone-400"
                />
            </div>
        );
    }

    const stats = [
        // {
        //     label: "Plano Atual",
        //     value: subscriber?.plan
        //         ? subscriber.plan.charAt(0).toUpperCase() + subscriber.plan.slice(1)
        //         : "Nenhum",
        //     icon: "solar:crown-linear",
        //     color: "bg-amber-50 text-amber-600",
        //     subtext: subscriber?.status === "PAID" ? "Ativo" : subscriber?.status === "PENDING" ? "Aguardando Pagamento" : "Inativo",
        // },
        // {
        //     label: "Próxima Cobrança",
        //     value: subscriber?.status === "PAID" ? "Em 30 dias" : "—",
        //     icon: "solar:calendar-linear",
        //     color: "bg-emerald-50 text-emerald-600",
        //     subtext: "Renovação automática",
        // },
        {
            label: "Vídeos Solicitados",
            value: videoCount.toString(),
            icon: "solar:videocamera-record-linear",
            color: "bg-blue-50 text-blue-600",
            subtext: "Total na conta",
        },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-light tracking-tight text-stone-900 flex items-center gap-2">
                    Olá, {subscriber?.name?.split(" ")[0] || "Usuário"}
                    <Icon icon="solar:smile-circle-linear" className="text-stone-400" />
                </h1>
                <p className="text-stone-500 text-sm mt-1">
                    Acompanhe sua assinatura e solicitações de vídeo.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="bg-white rounded-2xl border border-stone-100 p-6 hover:shadow-sm transition"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}>
                                <Icon icon={stat.icon} width={20} />
                            </div>
                            <span className="text-xs font-medium text-stone-400 uppercase tracking-wide">
                                {stat.label}
                            </span>
                        </div>
                        <p className="text-xl font-medium text-stone-900 truncate">
                            {stat.value}
                        </p>
                        {stat.subtext && (
                            <p className="text-xs text-stone-400 mt-2">
                                {stat.subtext}
                            </p>
                        )}
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <h2 className="text-lg font-medium text-stone-900 mb-4">
                Ações Rápidas
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <a
                    href="/painel/solicitar"
                    className="bg-stone-900 text-white rounded-2xl p-6 hover:bg-stone-800 transition group"
                >
                    <Icon
                        icon="solar:videocamera-add-linear"
                        width={32}
                        className="mb-4 text-white/80 group-hover:text-white transition"
                    />
                    <h3 className="font-medium mb-1">Solicitar Vídeo</h3>
                    <p className="text-sm text-stone-400">
                        Envie um briefing para novos vídeos UGC.
                    </p>
                </a>

                <a
                    href="/painel/solicitacoes"
                    className="bg-white border border-stone-200 rounded-2xl p-6 hover:border-stone-300 transition group"
                >
                    <Icon
                        icon="solar:clipboard-list-linear"
                        width={32}
                        className="mb-4 text-stone-400 group-hover:text-stone-600 transition"
                    />
                    <h3 className="font-medium text-stone-900 mb-1">
                        Ver Solicitações
                    </h3>
                    <p className="text-sm text-stone-500">
                        Acompanhe o status dos seus pedidos.
                    </p>
                </a>

                <a
                    href="/painel/dados"
                    className="bg-white border border-stone-200 rounded-2xl p-6 hover:border-stone-300 transition group"
                >
                    <Icon
                        icon="solar:settings-linear"
                        width={32}
                        className="mb-4 text-stone-400 group-hover:text-stone-600 transition"
                    />
                    <h3 className="font-medium text-stone-900 mb-1">Configurações</h3>
                    <p className="text-sm text-stone-500">
                        Gerencie sua conta, segurança e assinatura.
                    </p>
                </a>
            </div>

            {/* Onboarding Modal */}
            {showOnboarding && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowOnboarding(false)} />
                    <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-lg p-8 md:p-10 text-center animate-in fade-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Icon icon="solar:check-circle-bold" width={40} />
                        </div>
                        <h2 className="text-3xl font-light tracking-tight text-stone-900 mb-4">
                            Bem-vindo ao Time! 🚀
                        </h2>
                        <p className="text-stone-500 mb-8">
                            Sua assinatura foi confirmada com sucesso. Agora você tem acesso total para solicitar seus vídeos UGC e escalar seus criativos.
                        </p>
                        <div className="space-y-3">
                            <button
                                onClick={() => setShowOnboarding(false)}
                                className="w-full py-4 rounded-full bg-stone-900 text-white font-medium hover:bg-stone-800 transition"
                            >
                                Começar Agora
                            </button>
                            <a
                                href="/painel/solicitar"
                                className="block w-full py-4 rounded-full border border-stone-200 text-stone-600 font-medium hover:bg-stone-50 transition"
                            >
                                Fazer Minha Primeira Solicitação
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
