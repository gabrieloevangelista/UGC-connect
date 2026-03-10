"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Icon } from "@iconify/react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/Toast";
import { useConfirm } from "@/components/ConfirmDialog";

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

export default function SolicitacaoDetalhesPage() {
    const params = useParams();
    const router = useRouter();
    const { showToast } = useToast();
    const { confirm } = useConfirm();

    const [loading, setLoading] = useState(true);
    const [request, setRequest] = useState<any>(null);
    const [subscriber, setSubscriber] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        product_name: "",
        description: "",
        reference_urls: "",
        video_quantity: 1,
        budget: 0,
        deadline: "",
        status: "",
    });

    useEffect(() => {
        if (params.id) {
            fetchRequestDetails(params.id as string);
        }
    }, [params.id]);

    const fetchRequestDetails = async (id: string) => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("video_requests")
                .select("*")
                .eq("id", id)
                .single();

            if (error) throw error;

            setRequest(data);
            setFormData({
                product_name: data.product_name,
                description: data.description,
                reference_urls: data.reference_urls || "",
                video_quantity: data.video_quantity || 1,
                budget: data.budget || 0,
                deadline: data.deadline,
                status: data.status,
            });

            // Fetch user details
            const { data: sub } = await supabase
                .from("subscribers")
                .select("*")
                .eq("user_id", data.user_id)
                .single();

            if (sub) setSubscriber(sub);
        } catch (error) {
            console.error("Erro ao buscar detalhes:", error);
            showToast("Erro ao carregar detalhes da solicitação", "error");
            router.push("/painel/admin");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            const { error } = await supabase
                .from("video_requests")
                .update({
                    product_name: formData.product_name,
                    description: formData.description,
                    reference_urls: formData.reference_urls,
                    video_quantity: formData.video_quantity,
                    budget: formData.budget,
                    deadline: formData.deadline,
                    status: formData.status,
                })
                .eq("id", request.id);

            if (error) throw error;

            showToast("Solicitação atualizada com sucesso", "success");
            setIsEditing(false);
            fetchRequestDetails(request.id);
        } catch (error) {
            console.error("Erro ao atualizar:", error);
            showToast("Erro ao salvar alterações", "error");
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "video_quantity" || name === "budget" ? parseFloat(value) : value
        }));
    };

    const updateStatus = async (newStatus: string) => {
        try {
            const { error } = await supabase
                .from("video_requests")
                .update({ status: newStatus })
                .eq("id", params.id);

            if (error) throw error;

            setRequest({ ...request, status: newStatus });
            showToast(`Status atualizado para ${statusConfig[newStatus]?.label || newStatus}`, "success");
        } catch (error) {
            console.error("Erro ao atualizar status:", error);
            showToast("Erro ao atualizar status", "error");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Icon icon="solar:refresh-linear" width={32} className="animate-spin text-stone-400" />
            </div>
        );
    }

    if (!request) return null;

    const status = statusConfig[request.status] || statusConfig.PENDING;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => router.push("/painel/admin")}
                    className="p-2 rounded-full hover:bg-stone-100 transition"
                >
                    <Icon icon="solar:arrow-left-linear" width={24} />
                </button>
                <div>
                    <h1 className="text-2xl font-light tracking-tight text-stone-900">
                        Detalhes da Solicitação
                    </h1>
                    <p className="text-stone-500 text-sm">
                        ID: {request.id}
                    </p>
                </div>
                <div className="ml-auto flex gap-2">
                    {isEditing ? (
                        <>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 text-sm font-medium hover:bg-stone-50 transition"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 rounded-xl bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 transition"
                            >
                                Salvar Alterações
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-4 py-2 rounded-xl bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 transition flex items-center gap-2"
                        >
                            <Icon icon="solar:pen-linear" width={16} />
                            Editar
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Status Card */}
                    <div className="bg-white rounded-2xl border border-stone-100 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-medium text-stone-900">Status do Pedido</h3>
                            {!isEditing && (
                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${status.color}`}>
                                    <Icon icon={status.icon} width={12} />
                                    {status.label}
                                </span>
                            )}
                        </div>
                        {isEditing ? (
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/20"
                            >
                                <option value="PENDING">Pendente</option>
                                <option value="IN_PROGRESS">Em Produção</option>
                                <option value="DELIVERED">Entregue</option>
                            </select>
                        ) : (
                            <div className="w-full bg-stone-100 rounded-full h-2 mt-2">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${
                                        request.status === "DELIVERED" ? "w-full bg-emerald-500" :
                                        request.status === "IN_PROGRESS" ? "w-1/2 bg-blue-500" :
                                        "w-5 bg-yellow-500"
                                    }`}
                                />
                            </div>
                        )}
                    </div>

                    {/* Project Details */}
                    <div className="bg-white rounded-2xl border border-stone-100 p-6 space-y-4">
                        <h3 className="font-medium text-stone-900 border-b border-stone-100 pb-2">
                            Dados do Projeto
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-medium text-stone-500 uppercase block mb-1">
                                    Produto / Marca
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="product_name"
                                        value={formData.product_name}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm"
                                    />
                                ) : (
                                    <p className="text-stone-900">{request.product_name}</p>
                                )}
                            </div>
                            <div>
                                <label className="text-xs font-medium text-stone-500 uppercase block mb-1">
                                    Formato
                                </label>
                                <p className="text-stone-900 flex items-center gap-2">
                                    <Icon icon="solar:videocamera-record-linear" className="text-stone-400" />
                                    {formatLabels[request.format_type] || request.format_type}
                                </p>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-stone-500 uppercase block mb-1">
                                    Quantidade
                                </label>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        name="video_quantity"
                                        value={formData.video_quantity}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm"
                                    />
                                ) : (
                                    <p className="text-stone-900">{request.video_quantity || 1} vídeo(s)</p>
                                )}
                            </div>
                            <div>
                                <label className="text-xs font-medium text-stone-500 uppercase block mb-1">
                                    Orçamento Disponível
                                </label>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        name="budget"
                                        value={formData.budget}
                                        onChange={handleChange}
                                        step="0.01"
                                        className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm"
                                    />
                                ) : (
                                    <p className="text-stone-900 font-medium text-lg">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(request.budget || 0)}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-medium text-stone-500 uppercase block mb-1">
                                Briefing
                            </label>
                            {isEditing ? (
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={5}
                                    className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm resize-none"
                                />
                            ) : (
                                <p className="text-stone-600 text-sm whitespace-pre-wrap bg-stone-50 p-4 rounded-xl border border-stone-100">
                                    {request.description}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="text-xs font-medium text-stone-500 uppercase block mb-1">
                                Links de Referência
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="reference_urls"
                                    value={formData.reference_urls}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm"
                                />
                            ) : (
                                request.reference_urls ? (
                                    <a 
                                        href={request.reference_urls} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline text-sm break-all"
                                    >
                                        {request.reference_urls}
                                    </a>
                                ) : (
                                    <p className="text-stone-400 text-sm italic">Nenhum link fornecido</p>
                                )
                            )}
                        </div>

                        {/* Status Actions */}
                        <div className="flex flex-col gap-2">
                            <span className="text-sm font-medium text-stone-700">Ações de Status:</span>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => updateStatus('PENDING')}
                                    disabled={request.status === 'PENDING'}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition ${
                                        request.status === 'PENDING' 
                                            ? 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed'
                                            : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                                    }`}
                                >
                                    Pendente
                                </button>
                                <button
                                    onClick={() => updateStatus('IN_PROGRESS')}
                                    disabled={request.status === 'IN_PROGRESS'}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition ${
                                        request.status === 'IN_PROGRESS'
                                            ? 'bg-blue-100 text-blue-400 border-blue-200 cursor-not-allowed'
                                            : 'bg-white text-blue-600 border-blue-200 hover:bg-blue-50'
                                    }`}
                                >
                                    Em Produção
                                </button>
                                <button
                                    onClick={() => updateStatus('DELIVERED')}
                                    disabled={request.status === 'DELIVERED'}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition ${
                                        request.status === 'DELIVERED'
                                            ? 'bg-emerald-100 text-emerald-400 border-emerald-200 cursor-not-allowed'
                                            : 'bg-white text-emerald-600 border-emerald-200 hover:bg-emerald-50'
                                    }`}
                                >
                                    Entregar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* User Info Card */}
                <div className="bg-white rounded-2xl border border-stone-100 p-6 mb-8">
                    <h2 className="text-lg font-medium text-stone-900 mb-4 flex items-center gap-2">
                        <Icon icon="solar:user-circle-linear" />
                        Dados do Solicitante
                    </h2>
                    {subscriber ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div>
                                <span className="text-xs text-stone-400 uppercase tracking-wider block mb-1">Nome</span>
                                <p className="font-medium text-stone-900">{subscriber.name}</p>
                            </div>
                            <div>
                                <span className="text-xs text-stone-400 uppercase tracking-wider block mb-1">Email</span>
                                <p className="font-medium text-stone-900">{subscriber.email}</p>
                            </div>
                            <div>
                                <span className="text-xs text-stone-400 uppercase tracking-wider block mb-1">Empresa</span>
                                <p className="font-medium text-stone-900">{subscriber.company || "—"}</p>
                            </div>
                            <div>
                                <span className="text-xs text-stone-400 uppercase tracking-wider block mb-1">Telefone</span>
                                <p className="font-medium text-stone-900">{subscriber.phone || "—"}</p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-stone-500">Dados do usuário não encontrados.</p>
                    )}
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    {/* Client Info */}
                    <div className="bg-white rounded-2xl border border-stone-100 p-6">
                        <h3 className="font-medium text-stone-900 border-b border-stone-100 pb-2 mb-4">
                            Cliente
                        </h3>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-stone-900 flex items-center justify-center text-white font-medium">
                                {subscriber?.name?.[0] || request.user_id[0]}
                            </div>
                            <div>
                                <p className="font-medium text-stone-900 text-sm">
                                    {subscriber?.name || "Usuário"}
                                </p>
                                <p className="text-xs text-stone-500">
                                    {subscriber?.email}
                                </p>
                            </div>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-stone-500">Telefone:</span>
                                <span className="text-stone-900">{subscriber?.phone || "—"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-stone-500">Empresa:</span>
                                <span className="text-stone-900">{subscriber?.company || "—"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="bg-white rounded-2xl border border-stone-100 p-6">
                         <h3 className="font-medium text-stone-900 border-b border-stone-100 pb-2 mb-4">
                            Prazos
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-medium text-stone-500 uppercase block mb-1">
                                    Data de Criação
                                </label>
                                <p className="text-stone-900 text-sm">
                                    {new Date(request.created_at).toLocaleString('pt-BR')}
                                </p>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-stone-500 uppercase block mb-1">
                                    Prazo Desejado
                                </label>
                                {isEditing ? (
                                     <select
                                        name="deadline"
                                        value={formData.deadline}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm"
                                    >
                                        <option value="7_days">7 dias úteis</option>
                                        <option value="14_days">14 dias úteis</option>
                                        <option value="flexible">Flexível</option>
                                    </select>
                                ) : (
                                    <p className="text-stone-900 text-sm font-medium">
                                        {request.deadline === "7_days" ? "7 dias úteis" : 
                                         request.deadline === "14_days" ? "14 dias úteis" : 
                                         "Flexível"}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
