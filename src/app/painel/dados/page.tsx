"use client";

import { useEffect, useState, useRef } from "react";
import { Icon } from "@iconify/react";
import { supabase } from "@/lib/supabase";
import CreditCard from "@/components/CreditCard";
import { useToast } from "@/components/Toast";
import { Plan, plans } from "@/lib/constants";

interface ProfileData {
    name: string;
    email: string;
    phone: string;
    tax_id: string;
    company: string;
    plan?: string;
    status?: string;
    credits?: number;
}

type TabType = 'perfil' | 'seguranca' | 'carteira' | 'assinatura' | 'pagamento';

export default function ConfigPage() {
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState<TabType>('perfil');

    // Form Data
    const [formData, setFormData] = useState<ProfileData>({
        name: "",
        email: "",
        phone: "",
        tax_id: "",
        company: "",
        plan: "Nenhum",
        status: "Inativo"
    });

    // Security Data
    const [passwordData, setPasswordData] = useState({ new: "", confirm: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [cardData, setCardData] = useState({
        name: "",
        number: "",
        expiry: "",
        cvc: "",
        brand: "unknown"
    });
    const [focused, setFocused] = useState<'name' | 'number' | 'expiry' | 'cvc' | ''>('');

    // Upgrade Flow Data
    const [isUpgrading, setIsUpgrading] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'pix'>('credit_card');
    const [upgradeSuccess, setUpgradeSuccess] = useState(false);

    // States
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    // Avatar State
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Wallet State
    const [transactions, setTransactions] = useState<any[]>([]);
    const [addCreditAmount, setAddCreditAmount] = useState("");
    const [processingCredit, setProcessingCredit] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                // Fetch subscriber data
                const { data } = await supabase
                    .from("subscribers")
                    .select("*")
                    .eq("user_id", user.id)
                    .single();

                if (data) {
                    setFormData({
                        name: data.name || "",
                        email: data.email || "",
                        phone: data.phone || "",
                        tax_id: data.tax_id || "",
                        company: data.company || "",
                        plan: data.plan || "Nenhum",
                        status: data.status || "Inativo",
                        credits: data.credits || 0
                    });
                    setAvatarUrl(data.avatar_url);
                }

                // Fetch transactions
                const { data: transactionsData } = await supabase
                    .from("transactions")
                    .select("*")
                    .eq("user_id", user.id)
                    .order("created_at", { ascending: false });
                
                setTransactions(transactionsData || []);
            }
            setLoading(false);
        };

        fetchProfile();
    }, []);

    const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploadingAvatar(true);
            setError("");

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error("Selecione uma imagem para fazer upload.");
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Usuário não autenticado");

            // Upload image
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            // Update profile
            const { error: updateError } = await supabase
                .from('subscribers')
                .update({ avatar_url: publicUrl })
                .eq('user_id', user.id);

            if (updateError) throw updateError;

            setAvatarUrl(publicUrl);
            setSuccess("Foto de perfil atualizada com sucesso!");
            setTimeout(() => setSuccess(""), 3000);
        } catch (error) {
            setError(error instanceof Error ? error.message : "Erro ao fazer upload da imagem");
        } finally {
            setUploadingAvatar(false);
        }
    };


    // --- Tab 1: Profile ---
    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true); setError(""); setSuccess("");

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Não autenticado");

            const { error: updateError } = await supabase
                .from("subscribers")
                .update({
                    name: formData.name,
                    phone: formData.phone,
                    tax_id: formData.tax_id,
                    company: formData.company,
                })
                .eq("user_id", user.id);

            if (updateError) throw updateError;
            setSuccess("Dados do perfil atualizados com sucesso!");
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao salvar perfil");
        } finally {
            setSaving(false);
        }
    };

    // --- Tab 2: Security ---
    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true); setError(""); setSuccess("");

        if (passwordData.new !== passwordData.confirm) {
            setError("As senhas não coincidem.");
            setSaving(false);
            return;
        }

        if (passwordData.new.length < 6) {
            setError("A senha deve ter pelo menos 6 caracteres.");
            setSaving(false);
            return;
        }

        try {
            const { error: updateError } = await supabase.auth.updateUser({
                password: passwordData.new
            });

            if (updateError) throw updateError;
            setSuccess("Senha atualizada com sucesso!");
            setPasswordData({ new: "", confirm: "" });
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao atualizar senha");
        } finally {
            setSaving(false);
        }
    };

    // --- Tab 4: Payment ---
    const detectCardBrand = (num: string) => {
        const clean = num.replace(/\D/g, '');
        if (/^4/.test(clean)) return 'visa';
        if (/^5[1-5]/.test(clean)) return 'mastercard';
        if (/^3[47]/.test(clean)) return 'amex';
        if (/^6(?:011|5)/.test(clean)) return 'discover';
        return 'unknown';
    };

    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/\D/g, '').slice(0, 16);
        let formatted = val;
        // Basic spacing for input (optional, keeps it raw for simple state)
        if (formatted.length > 0) {
            formatted = formatted.match(/.{1,4}/g)?.join(' ') || '';
        }

        setCardData(prev => ({
            ...prev,
            number: val, // raw number
            brand: detectCardBrand(val)
        }));
    };

    const handleCardExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val.length >= 2) {
            val = val.slice(0, 2) + '/' + val.slice(2, 4);
        }
        setCardData(prev => ({ ...prev, expiry: val }));
    };

    const handlePaymentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true); setError(""); setSuccess("");

        // Simulating API call since AbacatePay doesn't have a direct card endpoint
        setTimeout(() => {
            setSuccess("Cartão atualizado com sucesso!");
            setSaving(false);
            setTimeout(() => setSuccess(""), 3000);
        }, 1000);
    };

    const handleUpgradePayment = async (e?: React.FormEvent, isAbacatePayRedirect = false) => {
        if (e) e.preventDefault();
        setSaving(true);
        setError("");

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Não autenticado");

            if (isAbacatePayRedirect) {
                // Call our AbacatePay wrapper endpoint
                const res = await fetch('/api/subscribe', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: formData.name || user.email?.split('@')[0] || 'Usuário',
                        email: formData.email || user.email,
                        phone: formData.phone || '00000000000',
                        taxId: formData.tax_id || '00000000000',
                        plan: selectedPlan?.key || "scale",
                    })
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.error || "Erro ao conectar com AbacatePay");
                }

                const data = await res.json();
                if (data.checkoutUrl) {
                    window.location.href = data.checkoutUrl;
                    return; // Stop here, redirecting
                }
            }

            // Update user plan locally for demonstration if not redirecting
            const { error: updateError } = await supabase
                .from("subscribers")
                .update({
                    plan: selectedPlan?.key || "Scale",
                    status: "PAID"
                })
                .eq("user_id", user.id);

            if (updateError) throw updateError;

            // Refresh local formData state to update the UI
            setFormData(prev => ({ ...prev, plan: selectedPlan?.key || "scale", status: "PAID" }));
            setUpgradeSuccess(true);
            showToast("Plano ativado com sucesso!", "success");
        } catch (err) {
            showToast(err instanceof Error ? err.message : "Erro ao processar upgrade", "error");
        } finally {
            setSaving(false);
        }
    };

    const handleAddCredits = async () => {
        setProcessingCredit(true);
        setError("");
        setSuccess("");

        try {
            // Remove non-numeric chars except comma and dot, then normalize
            // Assuming input might be "100,00" or "100.00"
            let cleanAmount = addCreditAmount.replace(/[^0-9.,]/g, '');
            cleanAmount = cleanAmount.replace(',', '.');
            const amount = parseFloat(cleanAmount);

            if (isNaN(amount) || amount < 5) {
                throw new Error("Valor mínimo para recarga é R$ 5,00.");
            }

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Usuário não autenticado");

            if (!formData.name || !formData.phone || !formData.tax_id) {
                throw new Error("Complete seu perfil (Nome, Telefone e CPF/CNPJ) antes de adicionar créditos.");
            }

            const res = await fetch('/api/credits/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    taxId: formData.tax_id,
                    amount,
                    userId: user.id
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Erro ao gerar pagamento");

            if (data.checkoutUrl) {
                window.location.href = data.checkoutUrl;
            } else {
                throw new Error("URL de checkout não recebida");
            }

        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao adicionar créditos");
            setProcessingCredit(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Icon icon="solar:refresh-linear" width={32} className="animate-spin text-stone-400" />
            </div>
        );
    }

    const tabs = [
        { id: 'perfil', label: 'Perfil', icon: 'solar:user-circle-linear' },
        { id: 'carteira', label: 'Carteira & Créditos', icon: 'solar:wallet-money-linear' },
        { id: 'seguranca', label: 'Segurança', icon: 'solar:lock-keyhole-linear' },
        // { id: 'assinatura', label: 'Assinatura', icon: 'solar:crown-linear' },
        // { id: 'pagamento', label: 'Pagamento', icon: 'solar:card-outline' },
    ];

    return (
        <div className="max-w-4xl">
            <div className="mb-8">
                <h1 className="text-3xl font-light tracking-tight text-stone-900">Configurações</h1>
                <p className="text-stone-500 text-sm mt-1">Gerencie sua conta, segurança e assinatura.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Tabs */}
                <div className="w-full md:w-64 flex-shrink-0">
                    <div className="bg-white border border-stone-100 rounded-2xl overflow-hidden p-2 flex flex-row md:flex-col gap-1 overflow-x-auto">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => { setActiveTab(tab.id as TabType); setError(""); setSuccess(""); setIsUpgrading(false); setSelectedPlan(null); setUpgradeSuccess(false); }}
                                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition whitespace-nowrap md:whitespace-normal
                                    ${activeTab === tab.id
                                        ? 'bg-stone-900 text-white'
                                        : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'}`}
                            >
                                <Icon icon={tab.icon} width={20} className={activeTab === tab.id ? 'text-white/80' : 'text-stone-400'} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1">
                    <div className="bg-white rounded-2xl border border-stone-100 p-8">

                        {/* Status Messages */}
                        {error && (
                            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-100 mb-6 flex items-center gap-2">
                                <Icon icon="solar:danger-circle-linear" width={18} />
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="bg-emerald-50 text-emerald-600 text-sm px-4 py-3 rounded-xl border border-emerald-100 mb-6 flex items-center gap-2">
                                <Icon icon="solar:check-circle-linear" width={18} />
                                {success}
                            </div>
                        )}

                        {/* --- TAB: PERFIL --- */}
                        {activeTab === 'perfil' && (
                            <form onSubmit={handleProfileSubmit} className="space-y-6">
                                {/* Profile Completion Wizard */}
                                <div className="mb-8 bg-stone-50 rounded-xl p-4 border border-stone-100">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-sm font-medium text-stone-900">Complete seu Perfil</h3>
                                        <span className="text-xs font-medium text-stone-500">
                                            {(() => {
                                                let filled = 0;
                                                if (formData.name) filled++;
                                                if (formData.phone) filled++;
                                                if (formData.tax_id) filled++;
                                                if (formData.company) filled++;
                                                if (avatarUrl) filled++;
                                                return Math.round((filled / 5) * 100);
                                            })()}% Completo
                                        </span>
                                    </div>
                                    <div className="h-2 bg-stone-200 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-stone-900 rounded-full transition-all duration-500"
                                            style={{ width: `${(() => {
                                                let filled = 0;
                                                if (formData.name) filled++;
                                                if (formData.phone) filled++;
                                                if (formData.tax_id) filled++;
                                                if (formData.company) filled++;
                                                if (avatarUrl) filled++;
                                                return Math.round((filled / 5) * 100);
                                            })()}%` }}
                                        />
                                    </div>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {!formData.name && <span className="text-[10px] px-2 py-1 bg-red-50 text-red-600 rounded-md border border-red-100">Nome pendente</span>}
                                        {!formData.phone && <span className="text-[10px] px-2 py-1 bg-red-50 text-red-600 rounded-md border border-red-100">Telefone pendente</span>}
                                        {!formData.tax_id && <span className="text-[10px] px-2 py-1 bg-red-50 text-red-600 rounded-md border border-red-100">CPF/CNPJ pendente</span>}
                                        {!formData.company && <span className="text-[10px] px-2 py-1 bg-yellow-50 text-yellow-600 rounded-md border border-yellow-100">Empresa pendente</span>}
                                        {!avatarUrl && <span className="text-[10px] px-2 py-1 bg-yellow-50 text-yellow-600 rounded-md border border-yellow-100">Foto pendente</span>}
                                    </div>
                                </div>

                                <div>
                                    <h2 className="text-lg font-medium text-stone-900">Informações Pessoais</h2>
                                    <p className="text-sm text-stone-500 mb-4">Atualize seus dados básicos e de contato.</p>
                                    
                                    <div className="flex items-center gap-6 mb-8 p-4 bg-stone-50 rounded-2xl border border-stone-100">
                                        <div className="w-20 h-20 rounded-full bg-white overflow-hidden relative group border border-stone-200 shadow-sm">
                                            {avatarUrl ? (
                                                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-stone-300">
                                                    <Icon icon="solar:user-circle-bold" width={48} />
                                                </div>
                                            )}
                                            <div 
                                                className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer backdrop-blur-[1px]" 
                                                onClick={() => fileInputRef.current?.click()}
                                            >
                                                <Icon icon="solar:camera-add-linear" className="text-white" width={24} />
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-stone-900">Foto de Perfil</h3>
                                            <p className="text-xs text-stone-500 mb-3 max-w-[200px]">Carregue uma imagem para personalizar seu perfil.</p>
                                            <input 
                                                type="file" 
                                                ref={fileInputRef} 
                                                onChange={handleAvatarUpload} 
                                                className="hidden" 
                                                accept="image/*"
                                            />
                                            <button 
                                                type="button" 
                                                disabled={uploadingAvatar}
                                                onClick={() => fileInputRef.current?.click()} 
                                                className="text-xs font-medium text-stone-700 bg-white border border-stone-200 px-3 py-1.5 rounded-lg hover:bg-stone-50 transition shadow-sm flex items-center gap-2"
                                            >
                                                {uploadingAvatar ? (
                                                    <>
                                                        <Icon icon="solar:refresh-linear" className="animate-spin" />
                                                        Enviando...
                                                    </>
                                                ) : (
                                                    "Alterar Foto"
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="text-xs font-medium text-stone-500 uppercase tracking-wide block mb-1.5">Nome Completo</label>
                                        <input type="text" name="name" value={formData.name} onChange={handleProfileChange} className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-stone-900/20 focus:border-stone-400 outline-none transition" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-stone-500 uppercase tracking-wide block mb-1.5">Empresa</label>
                                        <input type="text" name="company" value={formData.company} onChange={handleProfileChange} className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-stone-900/20 focus:border-stone-400 outline-none transition" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-stone-500 uppercase tracking-wide block mb-1.5">Email</label>
                                    <input type="email" value={formData.email} disabled className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm text-stone-400 bg-stone-50 cursor-not-allowed" />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="text-xs font-medium text-stone-500 uppercase tracking-wide block mb-1.5">WhatsApp</label>
                                        <input type="tel" name="phone" value={formData.phone} onChange={handleProfileChange} className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-stone-900/20 focus:border-stone-400 outline-none transition" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-stone-500 uppercase tracking-wide block mb-1.5">CPF / CNPJ</label>
                                        <input type="text" name="tax_id" value={formData.tax_id} onChange={handleProfileChange} className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-stone-900/20 focus:border-stone-400 outline-none transition" />
                                    </div>
                                </div>
                                <div className="pt-4">
                                    <button type="submit" disabled={saving} className="px-6 py-2.5 rounded-xl bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 transition disabled:opacity-50">
                                        {saving ? "Salvando..." : "Salvar Perfil"}
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* --- TAB: CARTEIRA --- */}
                        {activeTab === 'carteira' && (
                            <div className="space-y-8">
                                <div>
                                    <h2 className="text-lg font-medium text-stone-900">Carteira Digital</h2>
                                    <p className="text-sm text-stone-500 mb-4">Adicione créditos para solicitar novos vídeos sob demanda.</p>
                                </div>

                                {/* Balance Card */}
                                <div className="bg-stone-900 text-white rounded-2xl p-6 md:p-8 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-8 opacity-10">
                                        <Icon icon="solar:wallet-bold" width={120} />
                                    </div>
                                    <div className="relative z-10">
                                        <p className="text-stone-400 text-sm font-medium uppercase tracking-wider mb-2">Saldo Disponível</p>
                                        <h3 className="text-4xl md:text-5xl font-light tracking-tight mb-6">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(formData.credits || 0)}
                                        </h3>
                                        
                                        <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center">
                                            <div className="w-full sm:max-w-xs">
                                                <label className="text-xs text-stone-400 uppercase tracking-wide block mb-1.5">Adicionar Crédito (R$)</label>
                                                <input 
                                                    type="number" 
                                                    value={addCreditAmount} 
                                                    onChange={(e) => setAddCreditAmount(e.target.value)} 
                                                    placeholder="0,00" 
                                                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-stone-500 focus:ring-2 focus:ring-white/20 focus:border-white/30 outline-none transition"
                                                />
                                            </div>
                                            <button 
                                                onClick={handleAddCredits}
                                                disabled={processingCredit || !addCreditAmount}
                                                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white text-stone-900 font-medium hover:bg-stone-100 transition disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap"
                                            >
                                                {processingCredit ? <Icon icon="solar:refresh-linear" className="animate-spin" /> : <Icon icon="solar:card-send-linear" />}
                                                Adicionar via Pix
                                            </button>
                                        </div>
                                        <p className="text-xs text-stone-500 mt-3">
                                            * Pagamento processado via AbacatePay (Pix). O saldo é creditado automaticamente após a confirmação.
                                        </p>
                                    </div>
                                </div>

                                {/* Transaction History */}
                                <div>
                                    <h3 className="text-base font-medium text-stone-900 mb-4 flex items-center gap-2">
                                        <Icon icon="solar:history-linear" />
                                        Histórico de Transações
                                    </h3>
                                    <div className="border border-stone-100 rounded-2xl overflow-hidden">
                                        {transactions.length > 0 ? (
                                            <div className="divide-y divide-stone-100">
                                                {transactions.map((tx) => (
                                                    <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-stone-50 transition">
                                                        <div className="flex items-center gap-4">
                                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'CREDIT' ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-500'}`}>
                                                                <Icon icon={tx.type === 'CREDIT' ? "solar:arrow-left-down-linear" : "solar:arrow-right-up-linear"} width={20} />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-stone-900">{tx.description || (tx.type === 'CREDIT' ? 'Crédito Adicionado' : 'Uso de Saldo')}</p>
                                                                <p className="text-xs text-stone-500">{new Date(tx.created_at).toLocaleDateString('pt-BR')} às {new Date(tx.created_at).toLocaleTimeString('pt-BR')}</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className={`text-sm font-medium ${tx.type === 'CREDIT' ? 'text-emerald-600' : 'text-stone-900'}`}>
                                                                {tx.type === 'CREDIT' ? '+' : '-'} {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(tx.amount)}
                                                            </p>
                                                            <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-medium ${
                                                                tx.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' :
                                                                tx.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                                                'bg-red-100 text-red-700'
                                                            }`}>
                                                                {tx.status === 'COMPLETED' ? 'Concluído' : tx.status === 'PENDING' ? 'Pendente' : 'Falhou'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="p-8 text-center text-stone-500">
                                                <Icon icon="solar:bill-list-linear" width={48} className="mx-auto mb-2 opacity-20" />
                                                <p className="text-sm">Nenhuma transação encontrada.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* --- TAB: SEGURANÇA --- */}
                        {activeTab === 'seguranca' && (
                            <form onSubmit={handlePasswordSubmit} className="space-y-6">
                                <div>
                                    <h2 className="text-lg font-medium text-stone-900">Mudar Senha</h2>
                                    <p className="text-sm text-stone-500 mb-4">Escolha uma nova senha forte para proteger sua conta.</p>
                                </div>
                                <div className="space-y-5 max-w-sm">
                                    <div>
                                        <label className="text-xs font-medium text-stone-500 uppercase tracking-wide block mb-1.5">Nova Senha</label>
                                        <div className="relative">
                                            <input type={showPassword ? "text" : "password"} value={passwordData.new} onChange={(e) => setPasswordData(p => ({ ...p, new: e.target.value }))} required minLength={6} className="w-full pl-4 pr-12 py-3 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-stone-900/20 focus:border-stone-400 outline-none transition" placeholder="Mínimo 6 caracteres" />
                                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition p-1">
                                                <Icon icon={showPassword ? "solar:eye-linear" : "solar:eye-closed-linear"} width={20} />
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-stone-500 uppercase tracking-wide block mb-1.5">Confirmar Nova Senha</label>
                                        <div className="relative">
                                            <input type={showConfirmPassword ? "text" : "password"} value={passwordData.confirm} onChange={(e) => setPasswordData(p => ({ ...p, confirm: e.target.value }))} required minLength={6} className="w-full pl-4 pr-12 py-3 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-stone-900/20 focus:border-stone-400 outline-none transition" placeholder="Repita a nova senha" />
                                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition p-1">
                                                <Icon icon={showConfirmPassword ? "solar:eye-linear" : "solar:eye-closed-linear"} width={20} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-4">
                                    <button type="submit" disabled={saving} className="px-6 py-2.5 rounded-xl bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 transition disabled:opacity-50">
                                        {saving ? "Atualizando..." : "Atualizar Senha"}
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* --- TAB: ASSINATURA (DESABILITADA) --- */}
                        {false && activeTab === 'assinatura' && (
                            <div className="space-y-6">
                                {upgradeSuccess ? (
                                    <div className="text-center py-16 animate-in fade-in zoom-in duration-500">
                                        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-500 mx-auto mb-6">
                                            <Icon icon="solar:check-circle-bold" width={40} />
                                        </div>
                                        <h3 className="text-2xl font-medium text-stone-900 mb-2">Parabéns pelo Upgrade!</h3>
                                        <p className="text-stone-500 mb-8 max-w-sm mx-auto">
                                            Seu plano agora é o <strong>{selectedPlan?.name}</strong>. Todas as funcionalidades já foram liberadas na sua conta.
                                        </p>
                                        <button
                                            onClick={() => { setUpgradeSuccess(false); setIsUpgrading(false); setSelectedPlan(null); }}
                                            className="px-8 py-3 rounded-full bg-stone-900 text-white font-medium hover:bg-stone-800 transition"
                                        >
                                            Voltar à Minha Assinatura
                                        </button>
                                    </div>
                                ) : selectedPlan ? (
                                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <div className="flex items-center gap-4 mb-6">
                                            <button onClick={() => setSelectedPlan(null)} className="text-stone-400 hover:text-stone-900 transition mb-1 flex items-center justify-center w-10 h-10 rounded-full hover:bg-stone-100">
                                                <Icon icon="solar:arrow-left-linear" width={24} />
                                            </button>
                                            <div>
                                                <h3 className="text-xl font-medium text-stone-900">Finalizar Upgrade</h3>
                                                <p className="text-sm text-stone-500">Plano escolhido: <span className="font-semibold text-stone-800">{selectedPlan?.name}</span> - {selectedPlan?.priceDisplay}</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-4 mb-8">
                                            <button
                                                onClick={() => setPaymentMethod('credit_card')}
                                                className={`flex-1 flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition ${paymentMethod === 'credit_card' ? 'border-stone-900 bg-stone-50' : 'border-stone-100 hover:border-stone-200'}`}
                                            >
                                                <Icon icon="solar:card-bold-duotone" width={32} className={paymentMethod === 'credit_card' ? 'text-stone-900 mb-2' : 'text-stone-400 mb-2'} />
                                                <span className={`text-sm font-medium ${paymentMethod === 'credit_card' ? 'text-stone-900' : 'text-stone-500'}`}>Cartão de Crédito</span>
                                            </button>
                                            <button
                                                onClick={() => setPaymentMethod('pix')}
                                                className={`flex-1 flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition ${paymentMethod === 'pix' ? 'border-emerald-500 bg-emerald-50' : 'border-stone-100 hover:border-stone-200'}`}
                                            >
                                                <Icon icon="solar:qr-code-bold-duotone" width={32} className={paymentMethod === 'pix' ? 'text-emerald-500 mb-2' : 'text-stone-400 mb-2'} />
                                                <span className={`text-sm font-medium ${paymentMethod === 'pix' ? 'text-emerald-700' : 'text-stone-500'}`}>PIX</span>
                                            </button>
                                        </div>

                                        <div className="bg-white border text-left border-stone-100 rounded-3xl p-6 shadow-sm overflow-hidden">
                                            {paymentMethod === 'credit_card' ? (
                                                <form onSubmit={handleUpgradePayment} className="space-y-6">
                                                    <div className="mb-2 max-w-xs mx-auto scale-90 sm:scale-100 origin-center">
                                                        <CreditCard
                                                            name={cardData.name}
                                                            number={cardData.number}
                                                            expiry={cardData.expiry}
                                                            cvc={cardData.cvc}
                                                            focused={focused}
                                                            brand={cardData.brand}
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="md:col-span-2">
                                                            <input type="text" placeholder="0000 0000 0000 0000" maxLength={19} value={cardData.number.match(/.{1,4}/g)?.join(' ') || ''} onChange={handleCardNumberChange} onFocus={() => setFocused('number')} onBlur={() => setFocused('')} required className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-stone-900/20 outline-none" />
                                                        </div>
                                                        <div className="md:col-span-2">
                                                            <input type="text" placeholder="Nome como no cartão" value={cardData.name} onChange={(e) => setCardData(p => ({ ...p, name: e.target.value }))} onFocus={() => setFocused('name')} onBlur={() => setFocused('')} required className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-stone-900/20 outline-none uppercase" />
                                                        </div>
                                                        <div>
                                                            <input type="text" placeholder="Validade (MM/AA)" maxLength={5} value={cardData.expiry} onChange={handleCardExpiryChange} onFocus={() => setFocused('expiry')} onBlur={() => setFocused('')} required className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-stone-900/20 outline-none" />
                                                        </div>
                                                        <div>
                                                            <input type="password" placeholder="CVV" maxLength={4} value={cardData.cvc} onChange={(e) => setCardData(p => ({ ...p, cvc: e.target.value.replace(/\D/g, '') }))} onFocus={() => setFocused('cvc')} onBlur={() => setFocused('')} required className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-stone-900/20 outline-none font-mono" />
                                                        </div>
                                                    </div>
                                                    <button type="submit" disabled={saving} className="w-full py-3.5 rounded-xl bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 transition disabled:opacity-50 flex items-center justify-center gap-2 mt-4">
                                                        {saving ? <Icon icon="solar:refresh-linear" width={18} className="animate-spin" /> : <Icon icon="solar:shield-check-bold" width={18} />}
                                                        {saving ? "Processando..." : `Pagar ${selectedPlan?.priceDisplay}`}
                                                    </button>
                                                </form>
                                            ) : (
                                                <div className="text-center space-y-6">
                                                    <div className="bg-stone-50 p-8 rounded-2xl flex flex-col items-center justify-center border border-dashed border-stone-200">
                                                        <Icon icon="solar:qr-code-bold" width={140} className="text-stone-300 mb-4" />
                                                        <p className="text-sm text-stone-500 mb-3">Escaneie com o app do seu banco ou use a chave abaixo (Simulação API).</p>
                                                        <div className="w-full max-w-sm flex flex-col items-center">
                                                            <div className="w-full bg-white border border-stone-200 rounded-lg p-3 text-xs text-stone-400 font-mono truncate cursor-pointer hover:border-emerald-300 hover:text-emerald-600 transition" onClick={() => showToast("Código PIX copiado!", "success")}>
                                                                00020101021126360014BR.GOV.BCB.PIX0114+5511999990000...
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col gap-3">
                                                        <button onClick={() => handleUpgradePayment(undefined, true)} disabled={saving} className="w-full py-3.5 rounded-xl bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition disabled:opacity-50 flex items-center justify-center gap-2">
                                                            {saving ? <Icon icon="solar:refresh-linear" width={18} className="animate-spin" /> : <Icon icon="solar:wallet-money-bold" width={18} />}
                                                            {saving ? "Processando..." : "Gerar Link PIX pelo AbacatePay"}
                                                        </button>
                                                        <button onClick={() => handleUpgradePayment()} disabled={saving} className="w-full py-3.5 rounded-xl bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition disabled:opacity-50 flex items-center justify-center gap-2">
                                                            {saving ? <Icon icon="solar:refresh-linear" width={18} className="animate-spin" /> : <Icon icon="solar:check-circle-bold" width={18} />}
                                                            {saving ? "Processando..." : "Já realizei o pagamento (Simulação Local)"}
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : isUpgrading ? (
                                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                            <div className="flex items-center gap-4">
                                                <button onClick={() => setIsUpgrading(false)} className="text-stone-400 hover:text-stone-900 transition mb-1 flex items-center justify-center w-10 h-10 rounded-full hover:bg-stone-100 shrink-0">
                                                    <Icon icon="solar:arrow-left-linear" width={24} />
                                                </button>
                                                <div>
                                                    <h3 className="text-xl font-medium text-stone-900">Escolha seu novo Plano</h3>
                                                    <p className="text-sm text-stone-500">Selecione o plano desejado para fazer upgrade.</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 max-w-lg mx-auto md:max-w-none md:grid-cols-2 gap-6">
                                            {plans.filter(p => p.subscribable).map((plan) => (
                                                <div key={plan.key} className={`border rounded-[24px] p-6 flex flex-col relative transition ${plan.variant === 'dark' ? 'bg-stone-900 text-white border-stone-800' : 'bg-white text-stone-900 border-stone-200 hover:border-stone-300'}`}>
                                                    {plan.recommended && (
                                                        <div className="absolute top-0 right-6 -translate-y-1/2">
                                                            <span className="bg-emerald-400 text-emerald-950 text-[10px] font-bold uppercase tracking-widest py-1 px-3 rounded-full">Recomendado</span>
                                                        </div>
                                                    )}
                                                    <h4 className={`text-xl font-medium mb-1 ${plan.variant === 'dark' ? 'text-white' : 'text-stone-900'}`}>{plan.name}</h4>
                                                    <p className={`text-sm mb-6 ${plan.variant === 'dark' ? 'text-stone-400' : 'text-stone-500'}`}>{plan.description}</p>
                                                    <div className="mb-8">
                                                        <span className={`text-3xl tracking-tight font-light ${plan.variant === 'dark' ? 'text-white' : 'text-stone-900'}`}>{plan.priceDisplay}</span>
                                                        {plan.priceSuffix && <span className={`text-sm ${plan.variant === 'dark' ? 'text-stone-400' : 'text-stone-500'}`}>{plan.priceSuffix}</span>}
                                                    </div>
                                                    <ul className="mb-8 space-y-3">
                                                        {plan.features.slice(0, 4).map((f, i) => (
                                                            <li key={i} className={`text-sm flex items-center gap-2 ${plan.variant === 'dark' ? 'text-stone-300' : 'text-stone-600'}`}>
                                                                <Icon icon="solar:check-circle-linear" className={f.iconColor || (plan.variant === 'dark' ? 'text-white' : 'text-stone-400')} /> {f.text}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                    <button onClick={() => setSelectedPlan(plan)} className={`w-full py-3 rounded-xl text-sm font-medium transition mt-auto ${plan.variant === 'dark' ? 'bg-white text-stone-900 hover:bg-stone-200' : 'border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-900'}`}>
                                                        Escolher {plan.name}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div>
                                            <h2 className="text-lg font-medium text-stone-900">Meu Plano</h2>
                                            <p className="text-sm text-stone-500 mb-4">Gerencie sua assinatura, veja opções de upgrade ou cancele seu plano.</p>
                                        </div>

                                        <div className="bg-stone-50 rounded-2xl p-6 border border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-amber-500">
                                                    <Icon icon="solar:crown-bold-duotone" width={28} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-stone-500 uppercase tracking-wide">Plano Atual</p>
                                                    <h3 className="text-2xl font-semibold text-stone-900 capitalize">{formData.plan}</h3>
                                                    <span className={`inline-block px-2 py-0.5 mt-1 rounded text-xs font-medium ${formData.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-200 text-stone-600'}`}>{formData.status}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                                            <div className="border border-stone-200 rounded-2xl p-5 hover:border-stone-300 transition group cursor-pointer" onClick={() => setIsUpgrading(true)}>
                                                <div className="text-blue-500 mb-3"><Icon icon="solar:double-alt-arrow-up-linear" width={24} /></div>
                                                <h4 className="font-medium text-stone-900">Fazer Upgrade</h4>
                                                <p className="text-sm text-stone-500 mt-1">Aumente seu limite de solicitações de vídeos UGC mensais.</p>
                                            </div>
                                            <div className="border border-stone-200 rounded-2xl p-5 hover:border-stone-300 transition group cursor-pointer" onClick={() => showToast("Para fazer downgrade de plano, contate o Suporte.", "info")}>
                                                <div className="text-stone-400 mb-3"><Icon icon="solar:double-alt-arrow-down-linear" width={24} /></div>
                                                <h4 className="font-medium text-stone-900">Fazer Downgrade</h4>
                                                <p className="text-sm text-stone-500 mt-1">Mude para um plano inferior no próximo ciclo de cobrança.</p>
                                            </div>
                                        </div>

                                        <div className="border-t border-stone-100 pt-8 mt-8">
                                            <h4 className="text-sm font-medium text-red-600 mb-2">Zona de Perigo</h4>
                                            <p className="text-sm text-stone-500 mb-4 max-w-xl">
                                                O cancelamento interrompe a renovação automática. Seu plano continuará ativo até o final do ciclo já pago.
                                            </p>
                                            <button onClick={() => showToast("Para cancelar sua assinatura, por favor, entre em contato via WhatsApp ou envie um email para nosso suporte.", "warning")} className="px-5 py-2.5 rounded-xl border border-red-200 text-red-600 font-medium hover:bg-red-50 text-sm transition">
                                                Cancelar Assinatura
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {/* --- TAB: PAGAMENTO (CARTÃO 3D) (DESABILITADA) --- */}
                        {false && activeTab === 'pagamento' && (
                            <form onSubmit={handlePaymentSubmit} className="space-y-8">
                                <div>
                                    <h2 className="text-lg font-medium text-stone-900">Métodos de Pagamento</h2>
                                    <p className="text-sm text-stone-500">Adicione ou atualize seu cartão de crédito principal.</p>
                                </div>

                                <div className="py-4">
                                    {/* 3D Card Component */}
                                    <CreditCard
                                        name={cardData.name}
                                        number={cardData.number}
                                        expiry={cardData.expiry}
                                        cvc={cardData.cvc}
                                        focused={focused}
                                        brand={cardData.brand}
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-xl mx-auto">
                                    <div className="sm:col-span-2">
                                        <label className="text-xs font-medium text-stone-500 block mb-1.5">Número do Cartão</label>
                                        <input
                                            type="text"
                                            placeholder="0000 0000 0000 0000"
                                            maxLength={19}
                                            value={cardData.number.match(/.{1,4}/g)?.join(' ') || ''}
                                            onChange={handleCardNumberChange}
                                            onFocus={() => setFocused('number')}
                                            onBlur={() => setFocused('')}
                                            className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-stone-900/20 outline-none"
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="text-xs font-medium text-stone-500 block mb-1.5">Nome Impresso</label>
                                        <input
                                            type="text"
                                            placeholder="Nome como no cartão"
                                            value={cardData.name}
                                            onChange={(e) => setCardData(p => ({ ...p, name: e.target.value }))}
                                            onFocus={() => setFocused('name')}
                                            onBlur={() => setFocused('')}
                                            className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-stone-900/20 outline-none uppercase"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-stone-500 block mb-1.5">Validade (MM/AA)</label>
                                        <input
                                            type="text"
                                            placeholder="MM/AA"
                                            maxLength={5}
                                            value={cardData.expiry}
                                            onChange={handleCardExpiryChange}
                                            onFocus={() => setFocused('expiry')}
                                            onBlur={() => setFocused('')}
                                            className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-stone-900/20 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-stone-500 block mb-1.5">CVV</label>
                                        <input
                                            type="password"
                                            placeholder="•••"
                                            maxLength={4}
                                            value={cardData.cvc}
                                            onChange={(e) => setCardData(p => ({ ...p, cvc: e.target.value.replace(/\D/g, '') }))}
                                            onFocus={() => setFocused('cvc')}
                                            onBlur={() => setFocused('')}
                                            className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-stone-900/20 outline-none font-mono"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-stone-100 max-w-xl mx-auto">
                                    <button type="button" onClick={() => setCardData({ name: "", number: "", expiry: "", cvc: "", brand: "unknown" })} className="text-sm font-medium text-stone-500 hover:text-stone-800">
                                        Remover Atual
                                    </button>
                                    <button type="submit" disabled={saving} className="px-6 py-2.5 rounded-xl bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 transition disabled:opacity-50">
                                        {saving ? "Salvando..." : "Salvar Cartão"}
                                    </button>
                                </div>
                            </form>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}
