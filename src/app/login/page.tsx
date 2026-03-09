"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { signIn, signInWithGoogle } from "@/lib/auth";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await signIn(email, password);
            router.push("/painel");
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Email ou senha incorretos"
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
                        Gerencie seus criativos em um só lugar.
                    </h1>
                    <p className="text-[#E0D8C8]/70 text-lg mt-6 max-w-sm font-light">
                        Acesse seu painel para solicitar vídeos, acompanhar entregas e
                        gerenciar sua assinatura.
                    </p>
                </div>
                <div className="relative z-10 text-[10px] uppercase tracking-widest text-[#E0D8C8]/40">
                    © {new Date().getFullYear()} UGC Connect LTDA.
                </div>
            </div>

            {/* Right Side — Login Form */}
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
                        Entrar na conta
                    </h2>
                    <p className="text-stone-500 text-sm mb-8">
                        Acesse o painel da sua marca.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <button
                            type="button"
                            onClick={async () => {
                                try {
                                    setLoading(true);
                                    await signInWithGoogle();
                                } catch (err) {
                                    setError("Erro ao logar com Google");
                                    setLoading(false);
                                }
                            }}
                            className="w-full py-3.5 rounded-xl border border-stone-200 bg-white text-stone-700 text-sm font-medium hover:bg-stone-50 transition flex items-center justify-center gap-3"
                        >
                            <Icon icon="logos:google-icon" width={18} />
                            Continuar com Google
                        </button>

                        <div className="relative flex items-center py-2">
                            <div className="flex-grow border-t border-stone-200"></div>
                            <span className="flex-shrink-0 mx-4 text-stone-400 text-xs uppercase tracking-wider">Ou com email</span>
                            <div className="flex-grow border-t border-stone-200"></div>
                        </div>

                        <div>
                            <label className="text-xs font-medium text-stone-500 uppercase tracking-wide block mb-1.5">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="seu@email.com"
                                className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-900/20 focus:border-stone-400 transition placeholder:text-stone-400"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-medium text-stone-500 uppercase tracking-wide block mb-1.5">
                                Senha
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="••••••••"
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
                            <div className="flex justify-end mt-1">
                                <Link
                                    href="/recuperar"
                                    className="text-xs text-stone-400 hover:text-stone-700 transition"
                                >
                                    Esqueci minha senha
                                </Link>
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
                            className="w-full py-3.5 rounded-full bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Icon
                                        icon="solar:refresh-linear"
                                        width={16}
                                        className="animate-spin"
                                    />
                                    Entrando...
                                </>
                            ) : (
                                "Entrar"
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-stone-500">
                            Ainda não tem conta?{" "}
                            <Link
                                href="/cadastro"
                                className="text-stone-900 font-medium hover:underline"
                            >
                                Criar conta
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
