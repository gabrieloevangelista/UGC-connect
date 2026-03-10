"use client";

import { Icon } from "@iconify/react";
import { useState } from "react";

export default function ContactSection() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        company: "",
        budget: "",
        message: ""
    });
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);
        
        const text = `*Novo contato pelo site*\n\n*Nome:* ${formData.name}\n*Empresa:* ${formData.company}\n*Email:* ${formData.email}\n*Orçamento Mensal:* ${formData.budget}\n\n*Mensagem:* ${formData.message}`;
        
        const whatsappUrl = `https://wa.me/5511932310504?text=${encodeURIComponent(text)}`;
        
        window.open(whatsappUrl, '_blank');
        
        setSending(false);
        setSent(true);
    };

    return (
        <section id="contato" className="px-6 py-24 md:px-12 max-w-[1600px] mx-auto bg-stone-50 rounded-[40px] my-12">
            <div className="flex flex-col md:flex-row gap-12 md:gap-24">
                {/* Info Side */}
                <div className="flex-1">
                    <span className="text-xs text-stone-400 uppercase tracking-widest mb-6 block">
                        / Contato
                    </span>
                    <h2 className="text-4xl md:text-5xl tracking-tight text-stone-900 font-light mb-8">
                        Vamos criar algo incrível juntos.
                    </h2>
                    <p className="text-stone-600 text-lg mb-12 max-w-md font-light">
                        Tem dúvidas sobre como o UGC pode transformar sua estratégia de marketing? Nossa equipe está pronta para ajudar.
                    </p>

                    <div className="space-y-8">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-white border border-stone-200 flex items-center justify-center shrink-0">
                                <Icon icon="solar:letter-linear" className="text-stone-900 text-xl" />
                            </div>
                            <div>
                                <h4 className="text-stone-900 font-medium mb-1">Email</h4>
                                <a href="mailto:contato@ugcconnect.com.br" className="text-stone-500 hover:text-stone-900 transition">
                                    contato@ugcconnect.com.br
                                </a>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-white border border-stone-200 flex items-center justify-center shrink-0">
                                <Icon icon="solar:phone-calling-linear" className="text-stone-900 text-xl" />
                            </div>
                            <div>
                                <h4 className="text-stone-900 font-medium mb-1">WhatsApp</h4>
                                <a 
                                    href="https://wa.me/5511932310504" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-stone-500 hover:text-stone-900 transition"
                                >
                                    (11) 93231-0504
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Side */}
                <div className="flex-1">
                    <div className="bg-white p-8 md:p-10 rounded-[32px] border border-stone-100 shadow-sm">
                        {sent ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Icon icon="solar:check-circle-bold" className="text-3xl" />
                                </div>
                                <h3 className="text-2xl font-medium text-stone-900 mb-2">Mensagem enviada!</h3>
                                <p className="text-stone-500">
                                    Obrigado pelo contato. Responderemos em breve.
                                </p>
                                <button 
                                    onClick={() => setSent(false)}
                                    className="mt-8 text-sm font-medium text-stone-900 hover:underline"
                                >
                                    Enviar outra mensagem
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-2">Nome</label>
                                    <input 
                                        type="text" 
                                        id="name" 
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-stone-900/10 focus:border-stone-400 outline-none transition"
                                        placeholder="Seu nome completo"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-2">Email Corporativo</label>
                                    <input 
                                        type="email" 
                                        id="email" 
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-stone-900/10 focus:border-stone-400 outline-none transition"
                                        placeholder="seu@empresa.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="company" className="block text-sm font-medium text-stone-700 mb-2">Empresa</label>
                                    <input 
                                        type="text" 
                                        id="company" 
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-stone-900/10 focus:border-stone-400 outline-none transition"
                                        placeholder="Nome da sua empresa"
                                        value={formData.company}
                                        onChange={(e) => setFormData({...formData, company: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="budget" className="block text-sm font-medium text-stone-700 mb-2">Orçamento Mensal Disponível</label>
                                    <input 
                                        type="text" 
                                        id="budget" 
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-stone-900/10 focus:border-stone-400 outline-none transition"
                                        placeholder="Ex: R$ 5.000,00"
                                        value={formData.budget}
                                        onChange={(e) => setFormData({...formData, budget: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-stone-700 mb-2">Mensagem</label>
                                    <textarea 
                                        id="message" 
                                        required
                                        rows={4}
                                        className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-stone-900/10 focus:border-stone-400 outline-none transition resize-none"
                                        placeholder="Como podemos ajudar?"
                                        value={formData.message}
                                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                                    />
                                </div>
                                <button 
                                    type="submit" 
                                    disabled={sending}
                                    className="w-full bg-stone-900 text-white font-medium py-4 rounded-xl hover:bg-stone-800 transition disabled:opacity-70 flex items-center justify-center gap-2"
                                >
                                    {sending ? (
                                        <>
                                            <Icon icon="solar:refresh-linear" className="animate-spin text-xl" />
                                            Enviando...
                                        </>
                                    ) : (
                                        "Enviar Mensagem"
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
