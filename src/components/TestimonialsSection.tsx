"use client";

import { useRef } from "react";
import { Icon } from "@iconify/react";

const testimonials = [
    {
        image:
            "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2064&auto=format&fit=crop",
        imageAlt: "E-commerce manager",
        quote:
            '"Reduzimos nosso CPA em 42% no primeiro mês usando os vídeos criados pela plataforma. A agilidade em testar diferentes ganchos é absurda."',
        name: "Lucas Marques",
        role: "Head of Growth, Aura Skincare",
    },
    {
        image:
            "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1974&auto=format&fit=crop",
        imageAlt: "Marketing director",
        quote:
            '"Tínhamos dificuldade em gerar conteúdo em escala para o TikTok. O plano Scale resolveu o nosso problema com qualidade de estúdio mas linguagem nativa."',
        name: "Mariana Costa",
        role: "CMO, TechFit",
    },
];

export default function TestimonialsSection() {
    const containerRef = useRef<HTMLDivElement>(null);

    const scrollBy = (direction: "prev" | "next") => {
        if (!containerRef.current) return;
        const amount = containerRef.current.clientWidth * 0.7;
        containerRef.current.scrollBy({
            left: direction === "next" ? amount : -amount,
            behavior: "smooth",
        });
    };

    return (
        <section className="px-6 py-24 md:px-12 max-w-[1600px] mx-auto">
            <div className="bg-stone-100 rounded-[40px] p-8 md:p-16 relative overflow-hidden border border-stone-200">
                <div className="flex justify-between items-start mb-12 relative z-10">
                    <div>
                        <span className="text-xs text-stone-400 uppercase tracking-widest block mb-4">
                            / 05 Casos de Sucesso
                        </span>
                        <h2 className="text-3xl md:text-5xl tracking-tight text-stone-900 max-w-lg leading-tight font-light">
                            Marcas que escalaram com UGC.
                        </h2>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => scrollBy("prev")}
                            className="w-12 h-12 rounded-full border border-stone-300 flex items-center justify-center text-stone-500 hover:bg-white hover:text-stone-900 transition duration-300 bg-white/50"
                            aria-label="Anterior"
                        >
                            <Icon icon="solar:arrow-left-linear" width={20} />
                        </button>
                        <button
                            onClick={() => scrollBy("next")}
                            className="w-12 h-12 rounded-full border border-stone-300 flex items-center justify-center text-stone-500 hover:bg-white hover:text-stone-900 transition duration-300 bg-white/50"
                            aria-label="Próximo"
                        >
                            <Icon icon="solar:arrow-right-linear" width={20} />
                        </button>
                    </div>
                </div>

                {/* Slider Container */}
                <div
                    ref={containerRef}
                    className="flex overflow-x-auto gap-6 pb-4 snap-x hide-scrollbar scroll-smooth"
                >
                    {testimonials.map((t, i) => (
                        <div
                            key={i}
                            className="min-w-[100%] md:min-w-[80%] lg:min-w-[70%] snap-center"
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white rounded-3xl p-6 lg:p-0 overflow-hidden shadow-sm border border-stone-200">
                                <div className="lg:col-span-4 h-64 lg:h-auto relative">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={t.image}
                                        className="w-full h-full object-cover rounded-2xl lg:rounded-none lg:rounded-l-3xl"
                                        alt={t.imageAlt}
                                    />
                                </div>
                                <div className="lg:col-span-8 flex flex-col justify-center lg:py-12 lg:pr-12 text-stone-800">
                                    <Icon
                                        icon="solar:quote-up-bold"
                                        width={40}
                                        height={40}
                                        className="mb-6 opacity-20 text-stone-900"
                                    />
                                    <blockquote className="text-xl md:text-3xl leading-snug tracking-tight mb-8 font-light">
                                        {t.quote}
                                    </blockquote>
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <div className="font-medium text-lg text-stone-900">
                                                {t.name}
                                            </div>
                                            <div className="text-xs uppercase tracking-wider text-stone-500">
                                                {t.role}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
