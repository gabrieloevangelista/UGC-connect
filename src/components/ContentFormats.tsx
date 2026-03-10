"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

interface FormatItem {
    number: string;
    title: string;
    shortTitle: string;
    image: string;
    desc: string;
    tag: string;
}

const formats: FormatItem[] = [
    {
        number: "01",
        title: "Vídeos para TikTok Shop",
        shortTitle: "TikTok Shop",
        image:
            "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=2874&auto=format&fit=crop",
        desc: "Conteúdo otimizado para vendas diretas. Mostre o produto em ação com foco total em conversão no marketplace do TikTok.",
        tag: "E-commerce",
    },
    {
        number: "02",
        title: "Vídeos para Ads (Paid Social)",
        shortTitle: "Vídeos para Ads",
        image:
            "https://images.unsplash.com/photo-1621600411688-4be93cd68504?q=80&w=2000&auto=format&fit=crop",
        desc: "Focados inteiramente em conversão. Utilizam ganchos fortes nos primeiros 3 segundos para reter atenção e baixar o custo por clique das suas campanhas na Meta e TikTok.",
        tag: "Formato Vencedor",
    },
    {
        number: "03",
        title: "Unboxing & Reviews",
        shortTitle: "Unboxing & Reviews",
        image:
            "https://images.unsplash.com/photo-1616469829941-c7200edec809?q=80&w=2070&auto=format&fit=crop",
        desc: "Demonstração real do seu produto sendo aberto e utilizado, aumentando a confiança e removendo objeções de compra dos clientes.",
        tag: "Prova Social",
    },
    {
        number: "04",
        title: "Testemunhais (Testimonials)",
        shortTitle: "Testemunhais Autênticos",
        image:
            "https://images.unsplash.com/photo-1512314889357-e157c22f938d?q=80&w=2071&auto=format&fit=crop",
        desc: "O formato clássico reinventado. Consumidores reais falando diretamente para a câmera sobre como o seu serviço resolveu um problema específico.",
        tag: "Confiança",
    },
    {
        number: "05",
        title: "Fotos Lifestyle & Static Ads",
        shortTitle: "Fotos Lifestyle Estáticas",
        image:
            "https://images.unsplash.com/photo-1501127122-f385ca6ddd9d?q=80&w=1935&auto=format&fit=crop",
        desc: "Imagens do produto no cotidiano. Perfeito para preencher o feed do Instagram, catálogos de e-commerce e criativos estáticos de alta performance.",
        tag: "Visual Content",
    },
];

export default function ContentFormats() {
    const [activeIndex, setActiveIndex] = useState(0);
    const active = formats[activeIndex];

    return (
        <section
            id="formatos"
            className="md:px-12 bg-stone-50 max-w-[1600px] border-stone-100 border rounded-[40px] mt-12 mr-auto mb-12 ml-auto pt-24 pr-6 pb-24 pl-6"
        >
            <div className="flex justify-between items-baseline mb-16">
                <div>
                    <span className="text-xs text-stone-400 uppercase tracking-widest block mb-4">
                        / 03 Formatos
                    </span>
                    <h2 className="text-4xl md:text-5xl tracking-tight text-stone-900 max-w-lg font-light">
                        Conteúdo focado em performance.
                    </h2>
                </div>
                <div className="hidden lg:block">
                    <p className="text-sm text-stone-500 max-w-xs text-right">
                        Adaptado para o algoritmo de cada plataforma de mídia.
                    </p>
                    <span className="text-xs text-stone-400 font-mono block text-right mt-2">
                        [ 03 ]
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                {/* Left Visual (Dynamic) */}
                <div className="relative rounded-3xl overflow-hidden h-[700px] shadow-lg transition-all duration-500">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={active.image}
                        className="w-full h-full object-cover grayscale-[0.1] transition-opacity duration-300"
                        alt={active.title}
                    />

                    {/* Price Tag Widget */}
                    <div className="absolute bottom-8 left-8 right-8 bg-white p-6 rounded-2xl shadow-xl border border-stone-100 backdrop-blur-sm bg-white/95">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-xs text-stone-500 uppercase font-medium">
                                    {active.tag}
                                </p>
                                <h3 className="text-3xl tracking-tight text-stone-900 font-light">
                                    {active.title}
                                </h3>
                            </div>
                            {activeIndex === 0 && (
                                <div className="bg-stone-900 text-white text-[10px] uppercase font-bold tracking-wide px-3 py-1.5 rounded">
                                    Mais Solicitado
                                </div>
                            )}
                        </div>
                        <div className="w-full h-1 bg-stone-100 rounded-full mb-4 overflow-hidden">
                            <div className="w-[85%] bg-[#2D302B] h-full" />
                        </div>
                        <div className="flex justify-between text-xs text-stone-500 font-medium">
                            <div className="flex items-center gap-1">
                                <Icon icon="solar:check-circle-linear" className="text-[#2D302B]" />
                                <span>Ganchos 3 segundos</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Icon icon="solar:check-circle-linear" className="text-[#2D302B]" />
                                <span>Chamada p/ Ação (CTA)</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Icon icon="solar:check-circle-linear" className="text-[#2D302B]" />
                                <span>Direitos Cedidos</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Accordion List (Interactive) */}
                <div className="flex flex-col gap-2">
                    {formats.map((item, index) => {
                        const isActive = index === activeIndex;
                        return (
                            <div
                                key={item.number}
                                onClick={() => setActiveIndex(index)}
                                className={`group p-8 rounded-2xl transition cursor-pointer ${isActive
                                        ? "bg-white shadow-sm border border-stone-100"
                                        : "hover:bg-white border border-transparent hover:border-stone-100"
                                    }`}
                            >
                                <div
                                    className={`flex ${isActive ? "items-start" : "items-center"
                                        } gap-6 ${!isActive ? "opacity-60 group-hover:opacity-100" : ""} transition`}
                                >
                                    <div
                                        className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-mono ${isActive
                                                ? "bg-stone-100 text-stone-500 border-stone-300"
                                                : "border-stone-200 text-stone-400 group-hover:border-stone-400 group-hover:text-stone-600"
                                            }`}
                                    >
                                        {item.number}
                                    </div>
                                    <div className="flex-1">
                                        <h3
                                            className={`tracking-tight text-stone-900 ${isActive
                                                    ? "text-2xl mb-2 font-light"
                                                    : "text-xl font-medium"
                                                } group-hover:text-[#2D302B] transition`}
                                        >
                                            {isActive ? item.shortTitle : item.shortTitle}
                                        </h3>
                                        {isActive && (
                                            <>
                                                <p className="text-stone-500 text-base font-light leading-relaxed mb-4">
                                                    {item.desc}
                                                </p>
                                                <div className="flex items-center justify-between">
                                                    <button className="text-[#2D302B] text-xs font-medium border-b border-[#2D302B] pb-0.5 hover:opacity-70">
                                                        Ver exemplos
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
