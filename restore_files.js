const fs = require('fs');
const path = require('path');

const equipeOriginal = `"use client";

import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/Toast";
import { useConfirm } from "@/components/ConfirmDialog";
import { checkAdminStatus } from "@/config/admin";

interface AdminUser {
    id: string;
    email: string;
    role: string;
    created_at: string;
}

export default function TeamManagementPage() {
    const [admins, setAdmins] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [newAdminEmail, setNewAdminEmail] = useState("");
    const [adding, setAdding] = useState(false);
    const [isMaster, setIsMaster] = useState(false);
    
    const { showToast } = useToast();
    const { confirm } = useConfirm();

    useEffect(() => {
        fetchAdmins();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchAdmins = async () => {
        setLoading(true);
        try {
            // Check if current user is master
            const { data: { user } } = await supabase.auth.getUser();
            const { isMaster: masterStatus } = await checkAdminStatus(user?.email);
            setIsMaster(masterStatus);

            const { data, error } = await supabase
                .from("app_admins")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setAdmins(data || []);
        } catch (error) {
            console.error("Erro ao buscar admins:", error);
            showToast("Erro ao carregar lista de administradores", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleAddAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newAdminEmail) return;

        setAdding(true);
        try {
            // Check if already exists
            const exists = admins.some(a => a.email === newAdminEmail);
            if (exists) {
                showToast("Este email já é um administrador", "info");
                setAdding(false);
                return;
            }

            const { data, error } = await supabase
                .from("app_admins")
                .insert([{ email: newAdminEmail, role: 'admin' }]) // Default to regular admin
                .select()
                .single();

            if (error) throw error;

            setAdmins([data, ...admins]);
            setNewAdminEmail("");
            showToast("Administrador adicionado com sucesso", "success");
        } catch (error) {
            console.error("Erro ao adicionar admin:", error);
            const err = error as { code?: string };
            if (err.code === '42501') {
                showToast("Apenas Master Admins podem adicionar novos administradores", "error");
            } else {
                showToast("Erro ao adicionar administrador", "error");
            }
        } finally {
            setAdding(false);
        }
    };

    const handleRemoveAdmin = async (id: string, email: string) => {
        const isConfirmed = await confirm({
            title: "Remover Administrador",
            message: \`Tem certeza que deseja remover \${email} da equipe de administração?\`,
            confirmText: "Sim, remover",
            cancelText: "Cancelar",
            type: "danger"
        });

        if (!isConfirmed) return;

        try {
            const { error } = await supabase
                .from("app_admins")
                .delete()
                .eq("id", id);

            if (error) throw error;

            setAdmins(admins.filter(a => a.id !== id));
            showToast("Administrador removido com sucesso", "success");
        } catch (error) {
            console.error("Erro ao remover admin:", error);
            const err = error as { code?: string };
            if (err.code === '42501') {
                showToast("Apenas Master Admins podem remover administradores", "error");
            } else {
                showToast("Erro ao remover administrador", "error");
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Icon icon="solar:refresh-linear" width={32} className="animate-spin text-stone-400" />
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-light tracking-tight text-stone-900">
                    Gerenciar Equipe
                </h1>
                <p className="text-stone-500 text-sm mt-1">
                    Adicione ou remova administradores do sistema.
                </p>
            </div>

            {/* Add New Admin Form */}
            {isMaster ? (
                <div className="bg-white rounded-2xl border border-stone-100 p-6 mb-8">
                    <h2 className="text-lg font-medium text-stone-900 mb-4">Adicionar Novo Admin</h2>
                    <form onSubmit={handleAddAdmin} className="flex gap-4">
                        <div className="flex-1">
                            <input
                                type="email"
                                placeholder="Email do novo administrador"
                                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-stone-900/10 focus:border-stone-400 outline-none transition"
                                value={newAdminEmail}
                                onChange={(e) => setNewAdminEmail(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={adding}
                            className="px-6 py-3 rounded-xl bg-stone-900 text-white font-medium hover:bg-stone-800 transition disabled:opacity-50 flex items-center gap-2"
                        >
                            {adding ? (
                                <Icon icon="solar:refresh-linear" className="animate-spin" />
                            ) : (
                                <Icon icon="solar:user-plus-linear" />
                            )}
                            Adicionar
                        </button>
                    </form>
                </div>
            ) : (
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-8 text-amber-800 text-sm flex items-center gap-2">
                    <Icon icon="solar:shield-warning-linear" className="text-lg" />
                    Você precisa ser um Master Admin para gerenciar a equipe.
                </div>
            )}

            {/* Admins List */}
            <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-stone-100 bg-stone-50/50">
                    <h3 className="font-medium text-stone-900">Membros da Equipe ({admins.length})</h3>
                </div>
                
                {admins.length === 0 ? (
                    <div className="p-8 text-center text-stone-500">
                        Nenhum administrador encontrado.
                    </div>
                ) : (
                    <div className="divide-y divide-stone-100">
                        {admins.map((admin) => (
                            <div key={admin.id} className="p-6 flex items-center justify-between hover:bg-stone-50 transition">
                                <div className="flex items-center gap-4">
                                    <div className={\`w-10 h-10 rounded-full flex items-center justify-center text-lg font-medium \${
                                        admin.role === 'master' ? 'bg-purple-100 text-purple-700' : 'bg-stone-100 text-stone-600'
                                    }\`}>
                                        {admin.email.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="font-medium text-stone-900">{admin.email}</div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={\`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold \${
                                                admin.role === 'master' 
                                                    ? 'bg-purple-50 text-purple-700 border border-purple-100' 
                                                    : 'bg-stone-100 text-stone-600 border border-stone-200'
                                            }\`}>
                                                {admin.role === 'master' ? 'Master Admin' : 'Admin'}
                                            </span>
                                            <span className="text-xs text-stone-400">
                                                Adicionado em {new Date(admin.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                {isMaster && admin.role !== 'master' && (
                                    <button
                                        onClick={() => handleRemoveAdmin(admin.id, admin.email)}
                                        className="p-2 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition"
                                        title="Remover acesso"
                                    >
                                        <Icon icon="solar:trash-bin-trash-linear" width={20} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
`;

const pageOriginal = `"use client";

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
            // Fetch all requests
            const { data, error } = await supabase
                .from("video_requests")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;

            // Fetch some user emails for context (optional but helpful)
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
                                        onClick={() => router.push(\`/painel/admin/solicitacao/\${req.id}\`)}
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
                                                className={\`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider border \${status.color}\`}
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
                                                    onClick={() => router.push(\`/painel/admin/solicitacao/\${req.id}\`)}
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
`;

fs.writeFileSync(path.join(__dirname, 'src/app/painel/admin/equipe/page.tsx'), equipeOriginal);
fs.writeFileSync(path.join(__dirname, 'src/app/painel/admin/page.tsx'), pageOriginal);
console.log('Restaurados.');
