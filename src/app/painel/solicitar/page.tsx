"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { supabase } from "@/lib/supabase";

const formatTypes = [
    { value: "ads", label: "Vídeo para Ads", icon: "solar:play-circle-linear" },
    { value: "unboxing", label: "Unboxing", icon: "solar:box-linear" },
    { value: "testimonial", label: "Depoimento", icon: "solar:chat-round-dots-linear" },
    { value: "lifestyle", label: "Lifestyle / Uso", icon: "solar:heart-linear" },
    { value: "tutorial", label: "Tutorial / How-To", icon: "solar:book-linear" },
    { value: "tiktok_shop", label: "TikTok Shop", icon: "solar:bag-heart-linear" },
];

export default function SolicitarPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        format_type: "",
        product_name: "",
        description: "",
        deadline: "",
        reference_urls: "",
        video_quantity: "1",
        budget: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) throw new Error("Não autenticado");

            const budgetValue = parseFloat(formData.budget.replace(/[^\d.,]/g, "").replace(",", "."));
            if (isNaN(budgetValue) || budgetValue < 700) {
                throw new Error("O orçamento mínimo para produção é de R$ 700,00");
            }

            const { error: insertError } = await supabase
                .from("video_requests")
                .insert([
                    {
                        user_id: user.id,
                        format_type: formData.format_type,
                        product_name: formData.product_name,
                        description: formData.description,
                        deadline: formData.deadline,
                        reference_urls: formData.reference_urls,
                        video_quantity: parseInt(formData.video_quantity),
                        budget: budgetValue,
                        status: "PENDING",
                    },
                ]);

            if (insertError) throw insertError;

            router.push("/painel/solicitacoes");
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Erro ao criar solicitação"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-light tracking-tight text-stone-900">
                    Solicitar Vídeo
                </h1>
                <p className="text-stone-500 text-sm mt-1">
                    Envie seu briefing e nosso time cuidará da produção.
                </p>
            </div>

            <div className="bg-white rounded-2xl border border-stone-100 p-8 max-w-2xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Tipo de Formato */}
                    <div>
                        <label className="text-xs font-medium text-stone-500 uppercase tracking-wide block mb-3">
                            Tipo de Vídeo
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {formatTypes.map((type) => (
                                <button
                                    key={type.value}
                                    type="button"
                                    onClick={() =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            format_type: type.value,
                                        }))
                                    }
                                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border text-sm font-medium transition ${formData.format_type === type.value
                                            ? "border-stone-900 bg-stone-900 text-white"
                                            : "border-stone-200 text-stone-600 hover:border-stone-300"
                                        }`}
                                >
                                    <Icon icon={type.icon} width={24} />
                                    {type.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Nome do Produto */}
                    <div>
                        <label className="text-xs font-medium text-stone-500 uppercase tracking-wide block mb-1.5">
                            Nome do Produto / Marca
                        </label>
                        <input
                            type="text"
                            name="product_name"
                            value={formData.product_name}
                            onChange={handleChange}
                            required
                            placeholder="Ex: Sérum Facial Glow"
                            className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-900/20 focus:border-stone-400 transition placeholder:text-stone-400"
                        />
                    </div>

                    {/* Briefing */}
                    <div>
                        <label className="text-xs font-medium text-stone-500 uppercase tracking-wide block mb-1.5">
                            Briefing Detalhado
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows={5}
                            placeholder="Descreva o que você precisa: estilo do vídeo, tom de voz, público-alvo, mensagem principal, CTAs..."
                            className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-900/20 focus:border-stone-400 transition placeholder:text-stone-400 resize-none"
                        />
                    </div>

                    {/* URLs de Referência */}
                    <div>
                        <label className="text-xs font-medium text-stone-500 uppercase tracking-wide block mb-1.5">
                            Links de Referência{" "}
                            <span className="text-stone-400">(opcional)</span>
                        </label>
                        <input
                            type="text"
                            name="reference_urls"
                            value={formData.reference_urls}
                            onChange={handleChange}
                            placeholder="Cole links de vídeos de referência separados por vírgula"
                            className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-900/20 focus:border-stone-400 transition placeholder:text-stone-400"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Quantidade de Vídeos */}
                        <div>
                            <label className="text-xs font-medium text-stone-500 uppercase tracking-wide block mb-1.5">
                                Quantidade de Vídeos
                            </label>
                            <input
                                type="number"
                                name="video_quantity"
                                value={formData.video_quantity}
                                onChange={handleChange}
                                min="1"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-900/20 focus:border-stone-400 transition placeholder:text-stone-400"
                            />
                        </div>

                        {/* Orçamento */}
                        <div>
                            <label className="text-xs font-medium text-stone-500 uppercase tracking-wide block mb-1.5">
                                Orçamento Disponível (Mín. R$ 700)
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-3 text-stone-500 text-sm">R$</span>
                                <input
                                    type="number"
                                    name="budget"
                                    value={formData.budget}
                                    onChange={handleChange}
                                    min="700"
                                    step="0.01"
                                    required
                                    placeholder="0,00"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-900/20 focus:border-stone-400 transition placeholder:text-stone-400"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Prazo */}
                    <div>
                        <label className="text-xs font-medium text-stone-500 uppercase tracking-wide block mb-1.5">
                            Prazo Desejado
                        </label>
                        <select
                            name="deadline"
                            value={formData.deadline}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-900/20 focus:border-stone-400 transition bg-white"
                        >
                            <option value="">Selecione...</option>
                            <option value="7_days">7 dias úteis</option>
                            <option value="14_days">14 dias úteis</option>
                            <option value="flexible">Flexível</option>
                        </select>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-100">
                            {error}
                        </div>
                    )}

                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={loading || !formData.format_type}
                            className="px-8 py-3 rounded-full bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
                                <>
                                    Enviar Solicitação
                                    <Icon icon="solar:arrow-right-linear" width={16} />
                                </>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => router.push("/painel")}
                            className="px-6 py-3 rounded-full border border-stone-200 text-stone-600 text-sm font-medium hover:bg-stone-50 transition"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
