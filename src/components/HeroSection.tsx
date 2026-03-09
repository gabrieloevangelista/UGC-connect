"use client";

import { useEffect, useRef } from "react";
import { Icon } from "@iconify/react";

export default function HeroSection() {
    const heroBgRef = useRef<HTMLImageElement>(null);
    const heroSectionRef = useRef<HTMLElement>(null);
    const revealTextRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        let gsapInstance: typeof import("gsap").default | null = null;
        let ScrollTriggerPlugin: typeof import("gsap/ScrollTrigger").ScrollTrigger | null = null;

        const initAnimations = async () => {
            const gsapModule = await import("gsap");
            const scrollTriggerModule = await import("gsap/ScrollTrigger");

            gsapInstance = gsapModule.default;
            ScrollTriggerPlugin = scrollTriggerModule.ScrollTrigger;
            gsapInstance.registerPlugin(ScrollTriggerPlugin);

            // Parallax background
            if (heroBgRef.current && heroSectionRef.current) {
                gsapInstance.to(heroBgRef.current, {
                    yPercent: 30,
                    ease: "none",
                    scrollTrigger: {
                        trigger: heroSectionRef.current,
                        start: "top top",
                        end: "bottom top",
                        scrub: true,
                    },
                });
            }

            // Text reveal animation
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
                gsapInstance.to(innerWords, {
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

        initAnimations();

        return () => {
            if (ScrollTriggerPlugin) {
                ScrollTriggerPlugin.getAll().forEach((t) => t.kill());
            }
        };
    }, []);

    return (
        <header
            id="hero-section"
            ref={heroSectionRef}
            className="relative w-full h-screen min-h-[800px] overflow-hidden"
        >
            {/* Parallax Background Image */}
            <div className="absolute inset-0 w-full h-full overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    ref={heroBgRef}
                    src="https://euronewsweek.co.uk/wp-content/uploads/2025/04/How-to-Start-as-a-UGC-Creator-in-2025-Euronewsweek.png"
                    alt="Criador de conteúdo gravando vídeo"
                    className="absolute inset-0 w-full h-[120%] -top-[10%] object-cover filter brightness-[0.4] sepia-[0.1] will-change-transform"
                />
            </div>

            <div className="flex flex-col md:px-12 md:pb-24 text-white pr-6 pb-12 pl-6 absolute top-0 right-0 bottom-0 left-0 justify-end z-10">
                <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
                    <div>
                        <div className="flex items-center gap-2 mb-6 opacity-80">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-xs font-medium tracking-wide uppercase">
                                Plataforma Global • 100% Online
                            </span>
                        </div>
                        <h1
                            ref={revealTextRef}
                            className="reveal-text leading-[1.05] md:text-7xl text-5xl tracking-tighter mb-6 font-light"
                        >
                            Conteúdo autêntico que converte.
                        </h1>
                    </div>
                    <div className="flex flex-col items-start lg:items-end justify-end gap-8">
                        <p className="text-lg md:text-xl font-light leading-relaxed max-w-md text-left lg:text-right opacity-90">
                            Conectamos marcas aos melhores criadores de UGC (User Generated
                            Content) para escalar suas vendas no TikTok Shop, Reels e Ads.
                        </p>
                        <a
                            href="#contato"
                            className="group flex items-center gap-3 bg-white text-stone-950 pl-6 pr-2 py-2 rounded-full transition hover:bg-stone-200"
                        >
                            <span className="text-sm font-medium">Falar com Consultor</span>
                            <div className="w-8 h-8 bg-stone-950 rounded-full flex items-center justify-center text-white group-hover:rotate-45 transition duration-300">
                                <Icon icon="solar:arrow-right-linear" width={18} />
                            </div>
                        </a>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto w-full flex justify-between text-xs font-medium uppercase tracking-widest opacity-50 mt-12 border-t border-white/20 pt-6">
                    <span>User Generated Content</span>
                    <span>UGC Connect Pro</span>
                </div>
            </div>
        </header>
    );
}
