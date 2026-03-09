"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { resetPasswordForEmail } from "@/lib/auth";
import Link from "next/link";

export default function RecuperarPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(false);

        try {
            await resetPasswordForEmail(email);
            setSuccess(true);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Erro ao enviar email de recuperação"
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
                        Recuperar senha
                    </h2>
                    <p className="text-stone-500 text-sm mb-8">
                        Digite seu email para receber um link de recuperação.
                    </p>

                    {success ? (
                        <div className="text-center py-4">
                            <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Icon icon="solar:check-circle-linear" width={32} />
                            </div>
                            <h3 className="text-xl font-medium text-stone-900 mb-2">Email enviado!</h3>
                            <p className="text-stone-500 text-sm mb-8">
                                Verifique sua caixa de entrada (e a pasta de spam) para o link de reset de senha.
                            </p>
                            <Link
                                href="/login"
                                className="inline-block w-full py-3.5 rounded-full bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 transition text-center"
                            >
                                Voltar ao login
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
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
                                        Enviando...
                                    </>
                                ) : (
                                    "Enviar link de recuperação"
                                )}
                            </button>

                            <Link
                                href="/login"
                                className="block text-center text-sm text-stone-500 hover:text-stone-900 transition mt-4"
                            >
                                Voltar ao login
                            </Link>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
