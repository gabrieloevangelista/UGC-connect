"use client";

import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/Toast";
import { useConfirm } from "@/components/ConfirmDialog";
import { isUserAdmin } from "@/config/admin";

interface VideoRequest {
    id: string;
    format_type: string;
    product_name: string;
    description: string;
    deadline: string;
    status: string;
    created_at: string;
}

const statusConfig: Record<string, { label: string; color: string; icon: string }> = {
    PENDING: {
        label: "Pendente",
        color: "bg-yellow-50 text-yellow-700 border-yellow-200",
        icon: "solar:clock-circle-linear",
    },
    IN_PROGRESS: {
        label: "Em Produção",
        color: "bg-blue-50 text-blue-700 border-blue-200",
        icon: "solar:play-circle-linear",
    },
    DELIVERED: {
        label: "Entregue",
        color: "bg-emerald-50 text-emerald-700 border-emerald-200",
        icon: "solar:check-circle-linear",
    },
};

const formatLabels: Record<string, string> = {
    ads: "Vídeo para Ads",
    unboxing: "Unboxing",
    testimonial: "Depoimento",
    lifestyle: "Lifestyle / Uso",
    tutorial: "Tutorial / How-To",
};

const deadlineLabels: Record<string, string> = {
    "3_days": "3 dias úteis",
    "5_days": "5 dias úteis",
    "7_days": "7 dias úteis",
    "14_days": "14 dias úteis",
    flexible: "Flexível",
};

export default function SolicitacoesPage() {
    const [requests, setRequests] = useState<VideoRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const { showToast } = useToast();
    const { confirm } = useConfirm();

    useEffect(() => {
        const fetchRequests = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (user) {
                const isAdmin = isUserAdmin(user.email);
                
                let query = supabase
                    .from("video_requests")
                    .select("*")
                    .order("created_at", { ascending: false });

                // Se não for admin, filtra apenas as solicitações do próprio usuário
                if (!isAdmin) {
                    query = query.eq("user_id", user.id);
                }

                const { data } = await query;

                if (data) setRequests(data);
            }
            setLoading(false);
        };

        fetchRequests();
    }, []);

    const handleDelete = async (id: string) => {
        const isConfirmed = await confirm({
            title: "Cancelar Solicitação",
            message: "Tem certeza que deseja cancelar e apagar esta solicitação? Esta ação não pode ser desfeita.",
            confirmText: "Sim, cancelar",
            cancelText: "Voltar",
            type: "danger"
        });

        if (!isConfirmed) return;

        setDeletingId(id);

        try {
            const { error } = await supabase.from("video_requests").delete().eq("id", id);
            if (error) throw error;

            setRequests(prev => prev.filter(req => req.id !== id));
            showToast("Solicitação cancelada com sucesso", "success");
        } catch (error) {
            console.error("Erro ao deletar solicitação:", error);
            showToast("Erro ao cancelar solicitação", "error");
        } finally {
            setDeletingId(null);
        }
    };

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

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-light tracking-tight text-stone-900">
                        Solicitações
                    </h1>
                    <p className="text-stone-500 text-sm mt-1">
                        Acompanhe o status dos seus pedidos de vídeo.
                    </p>
                </div>
                <a
                    href="/painel/solicitar"
                    className="px-5 py-2.5 rounded-full bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 transition flex items-center gap-2"
                >
                    <Icon icon="solar:add-circle-linear" width={16} />
                    Nova Solicitação
                </a>
            </div>

            {requests.length === 0 ? (
                <div className="bg-white rounded-2xl border border-stone-100 p-12 text-center">
                    <Icon
                        icon="solar:clipboard-list-linear"
                        width={48}
                        className="mx-auto mb-4 text-stone-300"
                    />
                    <h3 className="text-lg font-medium text-stone-900 mb-2">
                        Nenhuma solicitação ainda
                    </h3>
                    <p className="text-sm text-stone-500 mb-6">
                        Clique em "Nova Solicitação" para enviar seu primeiro briefing.
                    </p>
                    <a
                        href="/painel/solicitar"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 transition"
                    >
                        Solicitar Vídeo
                        <Icon icon="solar:arrow-right-linear" width={16} />
                    </a>
                </div>
            ) : (
                <div className="space-y-4">
                    {requests.map((req) => {
                        const status = statusConfig[req.status] || statusConfig.PENDING;
                        const createdAt = new Date(req.created_at).getTime();
                        // Allows deletion if created within last 2 hours and still PENDING
                        const isRemovable = (new Date().getTime() - createdAt) <= 2 * 60 * 60 * 1000 && req.status === "PENDING";

                        return (
                            <div
                                key={req.id}
                                className="bg-white rounded-2xl border border-stone-100 p-6 hover:shadow-sm transition"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="font-medium text-stone-900 truncate">
                                                {req.product_name}
                                            </h3>
                                            <span
                                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${status.color}`}
                                            >
                                                <Icon icon={status.icon} width={12} />
                                                {status.label}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-stone-400 mb-3">
                                            <span className="flex items-center gap-1">
                                                <Icon icon="solar:videocamera-record-linear" width={14} />
                                                {formatLabels[req.format_type] || req.format_type}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Icon icon="solar:clock-circle-linear" width={14} />
                                                {deadlineLabels[req.deadline] || req.deadline}
                                            </span>
                                            <span>
                                                {new Date(req.created_at).toLocaleDateString("pt-BR")}
                                            </span>
                                        </div>
                                        <p className="text-sm text-stone-500 line-clamp-2">
                                            {req.description}
                                        </p>
                                    </div>
                                    {isRemovable && (
                                        <button
                                            onClick={() => handleDelete(req.id)}
                                            disabled={deletingId === req.id}
                                            className="flex items-center justify-center p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition disabled:opacity-50"
                                            title="Cancelar Solicitação (Disponível por 2h)"
                                        >
                                            {deletingId === req.id ? (
                                                <Icon icon="solar:refresh-linear" width={20} className="animate-spin" />
                                            ) : (
                                                <Icon icon="solar:trash-bin-trash-bold-duotone" width={20} />
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
