"use client";

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
        } catch (error: any) {
            console.error("Erro ao adicionar admin:", error);
            if (error.code === '42501') {
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
            message: `Tem certeza que deseja remover ${email} da equipe de administração?`,
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
        } catch (error: any) {
            console.error("Erro ao remover admin:", error);
            if (error.code === '42501') {
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
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-medium ${
                                        admin.role === 'master' ? 'bg-purple-100 text-purple-700' : 'bg-stone-100 text-stone-600'
                                    }`}>
                                        {admin.email.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="font-medium text-stone-900">{admin.email}</div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold ${
                                                admin.role === 'master' 
                                                    ? 'bg-purple-50 text-purple-700 border border-purple-100' 
                                                    : 'bg-stone-100 text-stone-600 border border-stone-200'
                                            }`}>
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
