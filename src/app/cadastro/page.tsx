"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { signUp, signInWithGoogle } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function CadastroPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        taxId: "",
        company: "",
        companyLegalName: "",
        companyTradeName: "",
        companyIe: "",
        companySize: "",
        companyStreet: "",
        companyNumber: "",
        companyComplement: "",
        companyNeighborhood: "",
        companyCity: "",
        companyState: "",
        companyZip: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [companyLookupLoading, setCompanyLookupLoading] = useState(false);
    const [companyLookupError, setCompanyLookupError] = useState("");
    const [lastFetchedCnpj, setLastFetchedCnpj] = useState<string | null>(null);

    const digitsOnly = (value: string) => value.replace(/\D/g, "");

    const formatCpf = (digits: string) => {
        const v = digits.slice(0, 11);
        const p1 = v.slice(0, 3);
        const p2 = v.slice(3, 6);
        const p3 = v.slice(6, 9);
        const p4 = v.slice(9, 11);
        if (v.length <= 3) return p1;
        if (v.length <= 6) return `${p1}.${p2}`;
        if (v.length <= 9) return `${p1}.${p2}.${p3}`;
        return `${p1}.${p2}.${p3}-${p4}`;
    };

    const formatCnpj = (digits: string) => {
        const v = digits.slice(0, 14);
        const p1 = v.slice(0, 2);
        const p2 = v.slice(2, 5);
        const p3 = v.slice(5, 8);
        const p4 = v.slice(8, 12);
        const p5 = v.slice(12, 14);
        if (v.length <= 2) return p1;
        if (v.length <= 5) return `${p1}.${p2}`;
        if (v.length <= 8) return `${p1}.${p2}.${p3}`;
        if (v.length <= 12) return `${p1}.${p2}.${p3}/${p4}`;
        return `${p1}.${p2}.${p3}/${p4}-${p5}`;
    };

    const formatTaxId = (value: string) => {
        const digits = digitsOnly(value);
        if (digits.length > 11) return formatCnpj(digits);
        return formatCpf(digits);
    };

    const fetchCompanyByCnpj = async (cnpjDigits: string) => {
        if (cnpjDigits.length !== 14) return;
        if (lastFetchedCnpj === cnpjDigits) return;

        setCompanyLookupLoading(true);
        setCompanyLookupError("");
        setLastFetchedCnpj(cnpjDigits);
        try {
            const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpjDigits}`);
            if (!response.ok) {
                throw new Error("Não foi possível consultar o CNPJ");
            }
            const data = (await response.json()) as {
                razao_social?: string | null;
                nome_fantasia?: string | null;
                inscricao_estadual?: string | null;
                descricao_porte?: string | null;
                porte?: string | null;
                logradouro?: string | null;
                numero?: string | null;
                complemento?: string | null;
                bairro?: string | null;
                municipio?: string | null;
                uf?: string | null;
                cep?: string | null;
            };

            const companyName = data.nome_fantasia || data.razao_social;
            const companySize = data.descricao_porte || data.porte || "";

            setFormData((prev) => ({
                ...prev,
                company: companyName || prev.company,
                companyLegalName: data.razao_social || "",
                companyTradeName: data.nome_fantasia || "",
                companyIe: data.inscricao_estadual || "",
                companySize: companySize,
                companyStreet: data.logradouro || "",
                companyNumber: data.numero || "",
                companyComplement: data.complemento || "",
                companyNeighborhood: data.bairro || "",
                companyCity: data.municipio || "",
                companyState: data.uf || "",
                companyZip: data.cep || "",
            }));
        } catch (err) {
            const message = err instanceof Error ? err.message : "Não foi possível consultar o CNPJ";
            setCompanyLookupError(message);
        } finally {
            setCompanyLookupLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === "taxId") {
            const masked = formatTaxId(value);
            setFormData((prev) => ({ ...prev, taxId: masked }));

            const digits = digitsOnly(value);
            if (digits.length === 14) {
                fetchCompanyByCnpj(digits);
            } else if (lastFetchedCnpj && digits.length < 14) {
                setLastFetchedCnpj(null);
                setCompanyLookupError("");
                setFormData((prev) => ({
                    ...prev,
                    companyLegalName: "",
                    companyTradeName: "",
                    companyIe: "",
                    companySize: "",
                    companyStreet: "",
                    companyNumber: "",
                    companyComplement: "",
                    companyNeighborhood: "",
                    companyCity: "",
                    companyState: "",
                    companyZip: "",
                }));
            }
            return;
        }

        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // 1. Criar conta no Supabase Auth
            const authData = await signUp(formData.email, formData.password);

            if (authData.user) {
                // 2. Inserir dados na tabela subscribers
                const { error: dbError } = await supabase.from("subscribers").insert([
                    {
                        user_id: authData.user.id,
                        name: formData.name,
                        email: formData.email,
                        phone: formData.phone,
                        tax_id: formData.taxId,
                        company: formData.company,
                        company_legal_name: formData.companyLegalName || null,
                        company_trade_name: formData.companyTradeName || null,
                        company_ie: formData.companyIe || null,
                        company_size: formData.companySize || null,
                        company_street: formData.companyStreet || null,
                        company_number: formData.companyNumber || null,
                        company_complement: formData.companyComplement || null,
                        company_neighborhood: formData.companyNeighborhood || null,
                        company_city: formData.companyCity || null,
                        company_state: formData.companyState || null,
                        company_zip: formData.companyZip || null,
                        plan: "free",
                        status: "ACTIVE",
                    },
                ]);

                if (dbError) throw dbError;
            }

            router.push("/painel");
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Erro ao criar conta"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-stone-50 flex">
            {/* Left Side — Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-[#2D302B] text-white flex-col justify-between p-16 relative overflow-hidden">
                <div className="absolute top-0 right-0 opacity-5 pointer-events-none">
                    <Icon icon="solar:video-frame-linear" width={500} height={500} />
                </div>
                <div className="relative z-10">
                    <div
                        className="flex items-center gap-2 cursor-pointer mb-16"
                        onClick={() => router.push("/")}
                    >
                        <Icon icon="solar:video-frame-linear" width={28} height={28} />
                        <span className="text-xl font-medium tracking-tighter uppercase">
                            UGC Connect
                        </span>
                    </div>
                    <h1 className="text-5xl font-light tracking-tight leading-tight max-w-md">
                        Comece a escalar seu conteúdo hoje.
                    </h1>
                    <p className="text-[#E0D8C8]/70 text-lg mt-6 max-w-sm font-light">
                        Crie sua conta gratuitamente e tenha acesso a criadores verificados
                        prontos para produzir conteúdo para sua marca.
                    </p>
                </div>
                <div className="relative z-10 text-[10px] uppercase tracking-widest text-[#E0D8C8]/40">
                    © {new Date().getFullYear()} UGC Connect LTDA.
                </div>
            </div>

            {/* Right Side — Register Form */}
            <div className="flex-1 flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-md">
                    {/* Mobile logo */}
                    <div
                        className="flex items-center gap-2 mb-12 lg:hidden cursor-pointer"
                        onClick={() => router.push("/")}
                    >
                        <Icon
                            icon="solar:video-frame-linear"
                            width={24}
                            height={24}
                            className="text-stone-800"
                        />
                        <span className="text-lg font-medium tracking-tighter uppercase text-stone-800">
                            UGC Connect
                        </span>
                    </div>

                    <h2 className="text-3xl font-light tracking-tight text-stone-900 mb-2">
                        Criar conta
                    </h2>
                    <p className="text-stone-500 text-sm mb-8">
                        Preencha seus dados para acessar a plataforma.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <button
                            type="button"
                            onClick={async () => {
                                try {
                                    setLoading(true);
                                    await signInWithGoogle();
                                } catch {
                                    setError("Erro ao cadastrar com Google");
                                    setLoading(false);
                                }
                            }}
                            className="w-full py-3.5 rounded-xl border border-stone-200 bg-white text-stone-700 text-sm font-medium hover:bg-stone-50 transition flex items-center justify-center gap-3 mb-2"
                        >
                            <Icon icon="logos:google-icon" width={18} />
                            Criar conta com Google
                        </button>

                        <div className="relative flex items-center py-3">
                            <div className="flex-grow border-t border-stone-200"></div>
                            <span className="flex-shrink-0 mx-4 text-stone-400 text-xs uppercase tracking-wider">Ou preencha seus dados</span>
                            <div className="flex-grow border-t border-stone-200"></div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
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
                                    placeholder="Seu nome"
                                    className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-900/20 focus:border-stone-400 transition placeholder:text-stone-400"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-stone-500 uppercase tracking-wide block mb-1.5">
                                    Empresa
                                </label>
                                <input
                                    type="text"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                    placeholder="Nome da empresa"
                                    className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-900/20 focus:border-stone-400 transition placeholder:text-stone-400"
                                />
                            </div>
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

                        <div className="grid grid-cols-2 gap-4">
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
                                    CPF / CNPJ
                                </label>
                                <div className="relative">
                                <input
                                    type="text"
                                    name="taxId"
                                    value={formData.taxId}
                                    onChange={handleChange}
                                    required
                                    placeholder="000.000.000-00"
                                    className="w-full px-4 py-3 pr-10 rounded-xl border border-stone-200 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-900/20 focus:border-stone-400 transition placeholder:text-stone-400"
                                />
                                {companyLookupLoading && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400">
                                        <Icon icon="solar:refresh-linear" width={18} className="animate-spin" />
                                    </div>
                                )}
                                </div>
                                {companyLookupError && (
                                    <p className="text-[11px] text-amber-600 mt-1.5">
                                        {companyLookupError}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-medium text-stone-500 uppercase tracking-wide block mb-1.5">
                                Senha
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    minLength={6}
                                    placeholder="Mínimo 6 caracteres"
                                    className="w-full px-4 py-3 pr-12 rounded-xl border border-stone-200 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-900/20 focus:border-stone-400 transition placeholder:text-stone-400"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition"
                                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                                >
                                    <Icon icon={showPassword ? "solar:eye-closed-linear" : "solar:eye-linear"} width={20} />
                                </button>
                            </div>
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
                                    Criando conta...
                                </>
                            ) : (
                                "Criar Conta"
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-stone-500">
                            Já tem conta?{" "}
                            <Link
                                href="/login"
                                className="text-stone-900 font-medium hover:underline"
                            >
                                Entrar
                            </Link>
                        </p>
                    </div>

                    <div className="mt-6 text-center">
                        <Link
                            href="/"
                            className="text-xs text-stone-400 hover:text-stone-600 transition"
                        >
                            ← Voltar ao site
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
