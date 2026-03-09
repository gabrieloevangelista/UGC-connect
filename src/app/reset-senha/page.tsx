"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { updatePassword, getSession } from "@/lib/auth";
import Link from "next/link";
import { useToast } from "@/components/Toast";

export default function ResetSenhaPage() {
    const router = useRouter();
    const { showToast } = useToast();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isSessionActive, setIsSessionActive] = useState(false);

    useEffect(() => {
        const checkSession = async () => {
            const session = await getSession();
            if (!session) {
                setError("Sessão expirada ou link inválido. Por favor, solicite a recuperação novamente.");
                setIsSessionActive(false);
            } else {
                setIsSessionActive(true);
            }
        };
        checkSession();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("As senhas não coincidem");
            return;
        }

        if (password.length < 6) {
            setError("A senha deve ter pelo menos 6 caracteres");
            return;
        }

        setLoading(true);
        setError("");

        try {
            await updatePassword(password);
            showToast("Senha atualizada com sucesso!", "success");
            router.push("/login?reset=success");
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Erro ao atualizar senha"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-stone-50 flex items-center justify-center px-6 py-12">
            <div className="w-full max-w-md">
                <div
                    className="flex items-center gap-2 mb-12 cursor-pointer justify-center"
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

                <div className="bg-white rounded-[32px] p-8 md:p-10 border border-stone-100 shadow-sm">
                    <h2 className="text-3xl font-light tracking-tight text-stone-900 mb-2">
                        Nova senha
                    </h2>
                    <p className="text-stone-500 text-sm mb-8">
                        Escolha uma nova senha segura para sua conta.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="text-xs font-medium text-stone-500 uppercase tracking-wide block mb-1.5">
                                Nova Senha
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
                                >
                                    <Icon icon={showPassword ? "solar:eye-closed-linear" : "solar:eye-linear"} width={20} />
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-medium text-stone-500 uppercase tracking-wide block mb-1.5">
                                Confirmar Senha
                            </label>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                                className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-900/20 focus:border-stone-400 transition placeholder:text-stone-400"
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-100">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || (error !== "" && !isSessionActive)}
                            className="w-full py-3.5 rounded-full bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Icon
                                        icon="solar:refresh-linear"
                                        width={16}
                                        className="animate-spin"
                                    />
                                    Atualizando...
                                </>
                            ) : (
                                "Redefinir Senha"
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-xs text-stone-400">
                        O link de recuperação expira em pouco tempo. Se tiver problemas,{" "}
                        <Link href="/recuperar" className="text-stone-900 underline">solicite novamente</Link>.
                    </div>
                </div>
            </div>
        </div>
    );
}
