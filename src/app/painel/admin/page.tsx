"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/Toast";

interface EnhancedVideoRequest {
    id: string;
    user_id: string;
    format_type: string;
    product_name: string;
    description: string;
    deadline: string;
    status: string;
    created_at: string;
    user_email?: string;
    user_name?: string;
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

export default function AdminPage() {
    const router = useRouter();
    const [requests, setRequests] = useState<EnhancedVideoRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const { showToast } = useToast();

    useEffect(() => {
        fetchRequests();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("video_requests")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;

            const { data: subscribers } = await supabase
                .from("subscribers")
                .select("user_id, email, name");

            const requestsData = (data || []) as EnhancedVideoRequest[];
            const requestsWithDetails = requestsData.map((req) => {
                const sub = subscribers?.find(s => s.user_id === req.user_id);
                return {
                    ...req,
                    user_email: sub?.email || "Desconhecido",
                    user_name: sub?.name || "Usuário"
                };
            });

            setRequests(requestsWithDetails);
        } catch (error) {
            console.error("Erro ao buscar solicitações:", error);
            showToast("Erro ao carregar solicitações", "error");
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, newStatus: string) => {
        setUpdatingId(id);
        try {
            const { error } = await supabase
                .from("video_requests")
                .update({ status: newStatus })
                .eq("id", id);

            if (error) throw error;

            setRequests(prev => prev.map(req =>
                req.id === id ? { ...req, status: newStatus } : req
            ));
            showToast("Status atualizado com sucesso", "success");
        } catch (error) {
            console.error("Erro ao atualizar status:", error);
            showToast("Erro ao atualizar status", "error");
        } finally {
            setUpdatingId(null);
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
        <div className="max-w-6xl mx-auto">
            <div className="mb-10">
                <h1 className="text-3xl font-light tracking-tight text-stone-900">
                    Master Admin Panel
                </h1>
                <p className="text-stone-500 text-sm mt-1">
                    Gerencie todas as solicitações de vídeo da plataforma.
                </p>
            </div>

            <div className="bg-white rounded-[32px] border border-stone-100 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-stone-50 border-b border-stone-100">
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-stone-400">Data</th>
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-stone-400">Usuário</th>
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-stone-400">Produto / Formato</th>
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-stone-400">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-stone-400">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-50">
                            {requests.map((req) => {
                                const status = statusConfig[req.status] || statusConfig.PENDING;
                                return (
                                    <tr
                                        key={req.id}
                                        className="hover:bg-stone-50/50 transition cursor-pointer"
                                        onClick={() => router.push(`/painel/admin/solicitacao/${req.id}`)}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">
                                            {new Date(req.created_at).toLocaleDateString("pt-BR")}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-stone-900">{req.user_name}</span>
                                                <span className="text-xs text-stone-400">{req.user_email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-stone-900">{req.product_name}</span>
                                                <span className="text-xs text-stone-400">
                                                    {formatLabels[req.format_type] || req.format_type}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${status.color}`}
                                            >
                                                <Icon icon={status.icon} width={12} />
                                                {status.label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex gap-2">
                                                <select
                                                    defaultValue={req.status}
                                                    onChange={(e) => updateStatus(req.id, e.target.value)}
                                                    disabled={updatingId === req.id}
                                                    className="text-xs bg-stone-100 border-none rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-stone-200 transition disabled:opacity-50"
                                                >
                                                    <option value="PENDING">Pendente</option>
                                                    <option value="IN_PROGRESS">Produção</option>
                                                    <option value="DELIVERED">Entregue</option>
                                                </select>
                                                <button
                                                    className="p-1.5 hover:bg-stone-200 rounded-lg transition"
                                                    title="Ver Detalhes"
                                                    onClick={() => router.push(`/painel/admin/solicitacao/${req.id}`)}
                                                >
                                                    <Icon icon="solar:eye-linear" className="text-stone-400" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
