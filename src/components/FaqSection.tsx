"use client";

import { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";

const faqItems = [
    {
        question: "Como os criadores são selecionados?",
        answer:
            'Temos um processo de curadoria rigoroso. Avaliamos a qualidade visual, dicção, habilidade de reter atenção e adequação aos nichos. Nós fazemos o "match" entre o perfil da sua marca e os criadores da nossa base.',
    },
    {
        question: "De quem são os direitos dos vídeos?",
        answer:
            "100% da sua marca (Licença perpétua). Uma vez entregue o material, você tem o direito total de usá-los em anúncios pagos (Meta Ads, TikTok Ads, etc), site oficial, redes orgânicas, sem limite de tempo.",
    },
    {
        question: "Qual é o prazo de entrega dos vídeos?",
        answer:
            "Após a confirmação do briefing e (se necessário) a chegada do produto físico na casa do criador, o prazo padrão para entrega do vídeo editado e pronto para uso é de 5 a 7 dias úteis.",
    },
    {
        question: "Posso pedir alterações na edição?",
        answer:
            "Sim! Todos os nossos planos incluem 1 rodada de revisão gratuita na edição do vídeo (cortes, textos na tela, músicas) para garantir que fique exatamente como a marca precisa.",
    },
];

export default function FaqSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        contentRefs.current = contentRefs.current.slice(0, faqItems.length);
    }, []);

    const toggle = (index: number) => {
        setOpenIndex((prev) => (prev === index ? null : index));
    };

    return (
        <section
            id="faq"
            className="px-6 py-24 md:px-12 max-w-[1600px] mx-auto border-b border-stone-200"
        >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-4">
                    <span className="text-xs text-stone-400 uppercase tracking-widest block mb-4">
                        / 06 FAQ
                    </span>
                    <h2 className="text-4xl md:text-5xl tracking-tight text-stone-900 mb-12 font-light">
                        Perguntas Frequentes
                    </h2>

                    <div className="mb-12">
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-[10px] uppercase font-bold text-stone-400">
                                Tempo de Resposta
                            </span>
                            <span className="text-[10px] font-bold text-stone-400">
                                &lt; 24 Horas
                            </span>
                        </div>
                        <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-[#2D302B] w-[98%] h-full" />
                        </div>
                    </div>

                    <button
                        onClick={() =>
                            document
                                .getElementById("footer")
                                ?.scrollIntoView({ behavior: "smooth" })
                        }
                        className="bg-stone-900 text-white pl-6 pr-2 py-3 rounded-full flex items-center gap-4 hover:bg-stone-800 transition w-full md:w-auto justify-between md:justify-start"
                    >
                        <span className="text-sm font-medium">Falar com Suporte</span>
                        <div className="bg-white text-black rounded-full p-1.5">
                            <Icon icon="solar:arrow-right-linear" width={16} />
                        </div>
                    </button>
                </div>

                <div className="lg:col-span-8 space-y-6">
                    {faqItems.map((item, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <div
                                key={index}
                                className="border-b border-stone-200 pb-6"
                            >
                                <div
                                    className="flex justify-between items-center cursor-pointer group"
                                    onClick={() => toggle(index)}
                                >
                                    <h3 className="text-xl text-stone-500 group-hover:text-stone-900 transition font-light">
                                        {item.question}
                                    </h3>
                                    <div className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center text-stone-400 group-hover:border-stone-900 group-hover:text-stone-900 transition">
                                        <Icon
                                            icon={isOpen ? "solar:minus-linear" : "solar:add-linear"}
                                            width={16}
                                        />
                                    </div>
                                </div>
                                <div
                                    ref={(el) => {
                                        contentRefs.current[index] = el;
                                    }}
                                    className={`faq-content text-stone-500 text-sm leading-relaxed max-w-2xl mt-4 ${isOpen ? "active" : ""
                                        }`}
                                    style={{
                                        maxHeight: isOpen
                                            ? `${contentRefs.current[index]?.scrollHeight || 200}px`
                                            : "0px",
                                    }}
                                >
                                    <p>{item.answer}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
