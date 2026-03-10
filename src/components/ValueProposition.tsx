"use client";

import { useEffect, useRef } from "react";
import { Icon } from "@iconify/react";

export default function ValueProposition() {
    const revealTextRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        const initAnimation = async () => {
            const gsapModule = await import("gsap");
            const scrollTriggerModule = await import("gsap/ScrollTrigger");
            const gsap = gsapModule.default;
            const ScrollTrigger = scrollTriggerModule.ScrollTrigger;
            gsap.registerPlugin(ScrollTrigger);

            if (revealTextRef.current) {
                const element = revealTextRef.current;
                const text = element.textContent?.trim() || "";
                const words = text.split(" ");
                element.textContent = "";

                words.forEach((word) => {
                    const wrapper = document.createElement("span");
                    wrapper.classList.add("word-wrapper");
                    const inner = document.createElement("span");
                    inner.classList.add("word-inner");
                    inner.textContent = word + "\u00A0";
                    wrapper.appendChild(inner);
                    element.appendChild(wrapper);
                });

                const innerWords = element.querySelectorAll(".word-inner");
                gsap.to(innerWords, {
                    y: 0,
                    duration: 1.2,
                    stagger: 0.05,
                    ease: "power4.out",
                    scrollTrigger: {
                        trigger: element,
                        start: "top 85%",
                        toggleActions: "play none none reverse",
                    },
                });
            }
        };

        initAnimation();
    }, []);

    return (
        <section id="vantagens" className="px-6 py-24 md:px-12 max-w-[1600px] mx-auto">
            <div className="flex justify-between items-baseline mb-12 border-b border-stone-200 pb-4">
                <span className="text-xs text-stone-400 uppercase tracking-widest">
                    / 01 O Valor do UGC
                </span>
                <span className="text-xs text-stone-400 font-mono">[ 01 ]</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Image Card */}
                <div className="lg:col-span-4 relative group overflow-hidden rounded-2xl h-[500px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2070&auto=format&fit=crop"
                        className="w-full h-full object-cover transition duration-700 group-hover:scale-105 filter grayscale-[0.2]"
                        alt="Criadora de conteúdo"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 to-transparent flex flex-col justify-end p-8">
                        <p className="text-white text-lg font-light leading-snug">
                            &quot;Pessoas confiam em pessoas. O conteúdo autêntico quebra a
                            barreira do anúncio tradicional.&quot;
                        </p>
                        <div className="flex items-center gap-1 text-[#E0D8C8] mt-4">
                            <Icon icon="solar:chart-square-linear" width={14} />
                            <span className="text-white text-sm font-medium ml-1">
                                Especialistas em ROAS
                            </span>
                        </div>
                    </div>
                </div>

                {/* Middle Content */}
                <div className="lg:col-span-4 flex flex-col justify-between h-full gap-8">
                    <div>
                        <h2
                            ref={revealTextRef}
                            className="reveal-text text-3xl tracking-tight text-stone-900 leading-tight mb-8 font-light"
                        >
                            &quot; Não é apenas um vídeo, é uma prova social que gera
                            identificação imediata com sua marca. &quot;
                        </h2>
                        <p className="text-stone-500 text-base leading-relaxed">
                            Nossa plataforma cuida de todo o processo: desde o briefing e
                            curadoria dos criadores até a entrega do material editado e pronto
                            para uso em campanhas.
                        </p>
                    </div>
                    <div className="flex items-center justify-between">
                        <p className="text-stone-500 text-sm max-w-[200px]">
                            Base Curada de Criadores
                        </p>
                        <button className="bg-stone-900 text-white pl-5 pr-2 py-2 rounded-full flex items-center gap-2 hover:bg-stone-800 transition">
                            <span className="text-xs font-medium">Ver Portfólio</span>
                            <div className="bg-white text-black rounded-full p-1">
                                <Icon icon="solar:arrow-right-linear" width={12} />
                            </div>
                        </button>
                    </div>
                </div>

                {/* Right Stats Card */}
                <div className="lg:col-span-4 bg-[#2D302B] rounded-2xl p-8 flex flex-col justify-between min-h-[500px] relative overflow-hidden text-[#E0D8C8]">
                    <div className="absolute top-0 right-0 p-8 opacity-10 text-white">
                        <Icon icon="solar:graph-up-linear" width={120} height={120} />
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#E0D8C8] rounded-full animate-pulse" />
                        <span className="text-xs font-medium uppercase tracking-wide">
                            Performance Comprovada
                        </span>
                    </div>

                    <div>
                        <h3 className="text-6xl tracking-tighter text-white mb-2 font-light">
                            +73%
                        </h3>
                        <p className="text-[#E0D8C8] text-sm opacity-80 mb-8">
                            Aumento médio na taxa de conversão ao usar UGC em vez de criativos
                            de estúdio.
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-full bg-white/10 h-10 rounded-full overflow-hidden flex items-center px-4 relative">
                                    <span className="relative z-10 text-xs font-medium text-white">
                                        Engajamento TikTok
                                    </span>
                                    <div className="absolute left-0 top-0 h-full bg-[#E0D8C8]/20 w-[92%]" />
                                </div>
                                <span className="text-sm font-medium text-white">92%</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-full bg-white/10 h-10 rounded-full overflow-hidden flex items-center px-4 relative">
                                    <span className="relative z-10 text-xs font-medium text-white">
                                        Redução de CPA (Custo)
                                    </span>
                                    <div className="absolute left-0 top-0 h-full bg-[#E0D8C8]/20 w-[65%]" />
                                </div>
                                <span className="text-sm font-medium text-white">65%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Strategic Pillars & Trends */}
            <div className="mt-24">
                <div className="flex justify-between items-baseline mb-12 border-b border-stone-200 pb-4">
                    <span className="text-xs text-stone-400 uppercase tracking-widest">
                        / 02 Estratégia
                    </span>
                    <span className="text-xs text-stone-400 font-mono">[ 02 ]</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {[
                        {
                            title: "Vídeos Orgânicos",
                            desc: "Conteúdo autêntico que gera conexão real sem parecer propaganda.",
                            icon: "solar:camera-linear"
                        },
                        {
                            title: "Conteúdo Estratégico",
                            desc: "Planejamento focado em objetivos de negócio e funil de vendas.",
                            icon: "solar:target-linear"
                        },
                        {
                            title: "Posicionamento Digital",
                            desc: "Consolide sua autoridade e presença em todos os canais relevantes.",
                            icon: "solar:globe-linear"
                        },
                        {
                            title: "Collab Estratégica",
                            desc: "Parcerias com criadores alinhados aos valores da sua marca.",
                            icon: "solar:users-group-rounded-linear"
                        }
                    ].map((item, index) => (
                        <div key={index} className="bg-stone-50 p-6 rounded-2xl border border-stone-100 hover:border-stone-200 transition group">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-4 text-stone-900 group-hover:scale-110 transition border border-stone-100">
                                <Icon icon={item.icon} width={20} />
                            </div>
                            <h3 className="font-medium text-stone-900 mb-2">{item.title}</h3>
                            <p className="text-sm text-stone-500 leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Founder Led Growth - Trend 2026 */}
                <div className="bg-stone-900 rounded-3xl p-8 md:p-12 relative overflow-hidden text-white">
                    <div className="absolute top-0 right-0 p-12 opacity-5">
                        <Icon icon="solar:star-fall-linear" width={300} height={300} />
                    </div>
                    
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium uppercase tracking-wider mb-6 border border-emerald-500/20">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                Tendência 2026
                            </div>
                            <h2 className="text-3xl md:text-4xl font-light mb-6 tracking-tight">
                                Founder Led Growth
                            </h2>
                            <p className="text-stone-300 text-lg leading-relaxed max-w-xl mb-8">
                                O crescimento liderado pelo fundador é a nova fronteira da confiança digital. 
                                Humanize sua marca colocando quem a construiu na frente das câmeras, criando 
                                uma conexão inquebrável com sua audiência.
                            </p>
                            <button className="bg-white text-stone-900 px-6 py-3 rounded-full text-sm font-medium hover:bg-stone-100 transition flex items-center gap-2 group">
                                Quero saber mais
                                <Icon icon="solar:arrow-right-linear" className="group-hover:translate-x-1 transition" />
                            </button>
                        </div>
                        <div className="relative h-64 lg:h-full min-h-[300px] rounded-2xl overflow-hidden bg-stone-800 border border-white/10">
                            {/* Placeholder for Founder Led Growth Visual */}
                            <div className="absolute inset-0 flex items-center justify-center text-stone-600">
                                <div className="text-center">
                                    <Icon icon="solar:user-speak-linear" width={64} className="mx-auto mb-4 opacity-50" />
                                    <p className="text-sm font-mono uppercase tracking-widest opacity-50">Authentic Leadership</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
