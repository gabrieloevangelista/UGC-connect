import { Icon } from "@iconify/react";

const tags = ["Unboxing", "Testimonials", "TikTok Trends", "Voiceover", "Lifestyle"];

const barHeights = ["40%", "50%", "45%", "60%", "90%", "70%", "65%", "80%"];

export default function CreatorsSection() {
    return (
        <section id="criadores" className="px-6 py-24 md:px-12 max-w-[1600px] mx-auto">
            <div className="bg-[#2D302B] rounded-[40px] p-8 md:p-16 text-white relative overflow-hidden">
                {/* Decorative bg */}
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                    <Icon icon="solar:clapperboard-play-linear" width={400} height={400} />
                </div>

                <div className="flex justify-between items-baseline mb-12 border-b border-white/10 pb-4 relative z-10">
                    <span className="text-xs text-[#E0D8C8]/60 uppercase tracking-widest">
                        / 02 Processo
                    </span>
                    <span className="text-xs text-[#E0D8C8]/60 font-mono">[ 02 ]</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 relative z-10">
                    {/* Left Side */}
                    <div className="flex flex-col justify-between order-2 lg:order-1 gap-12">
                        <div>
                            <div className="flex items-start justify-between gap-6">
                                <h2 className="text-4xl lg:text-5xl tracking-tight text-white mb-8 max-w-md font-light">
                                    Match perfeito entre sua marca e o criador.
                                </h2>
                                <div className="border border-[#E0D8C8]/20 rounded-full p-2 hidden lg:block shrink-0">
                                    <Icon
                                        icon="solar:users-group-two-rounded-linear"
                                        width={24}
                                        height={24}
                                        className="text-[#E0D8C8]"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3 mb-8">
                                {tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-4 py-2 rounded-full border border-[#E0D8C8]/20 text-xs font-medium text-[#E0D8C8] hover:bg-[#E0D8C8] hover:text-[#2D302B] transition cursor-pointer"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="bg-[#3A3D37] border border-white/5 rounded-2xl p-6 flex gap-6 items-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop"
                                className="w-20 h-20 rounded-xl object-cover grayscale opacity-80"
                                alt="Criadora de conteúdo UGC"
                            />
                            <div>
                                <h4 className="text-lg font-medium text-white">Sarah Silva</h4>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xs text-white/50">
                                        UGC Creator • Beauty &amp; Tech
                                    </span>
                                </div>
                                <p className="text-sm text-white/70 max-w-xs mb-4">
                                    &quot;Crio vídeos dinâmicos que conectam o produto ao dia a
                                    dia real do consumidor.&quot;
                                </p>
                                <button className="bg-[#E0D8C8] text-[#2D302B] pl-4 pr-1 py-1.5 rounded-full flex items-center gap-2 text-xs font-medium w-max hover:bg-white transition">
                                    Solicitar Briefing
                                    <div className="bg-[#2D302B] text-[#E0D8C8] rounded-full p-1">
                                        <Icon icon="solar:arrow-right-linear" width={12} />
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Side (Image + Card) */}
                    <div className="relative rounded-3xl overflow-hidden h-[500px] lg:h-[600px] group order-1 lg:order-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="https://images.unsplash.com/photo-1581456495146-65a71b2c8e52?q=80&w=1972&auto=format&fit=crop"
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-700 opacity-90 grayscale-[0.3]"
                            alt="Gravação de conteúdo pelo celular"
                        />

                        {/* Floating Card */}
                        <div className="absolute top-6 right-6 bg-[#3A3D37]/90 backdrop-blur-md p-5 rounded-2xl shadow-xl w-72 border border-white/10">
                            <div className="flex justify-between items-end mb-4 border-b border-white/10 pb-2">
                                <div>
                                    <span className="text-[10px] uppercase text-[#E0D8C8]/60 font-bold tracking-wider">
                                        Métricas de Campanha
                                    </span>
                                    <div className="text-2xl tracking-tight font-light text-white">
                                        ROAS{" "}
                                        <span className="text-xs text-white/40 font-normal">
                                            Ads
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] uppercase text-[#E0D8C8]/60 font-bold tracking-wider">
                                        Custo/Conv.
                                    </span>
                                    <div className="text-2xl tracking-tight font-light text-[#a7f3d0]">
                                        -45%
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-between gap-1 h-10 items-end">
                                {barHeights.map((h, i) => (
                                    <div
                                        key={i}
                                        className={`w-2 rounded-full ${i === 4
                                                ? "bg-[#E0D8C8] shadow-[0_0_10px_rgba(224,216,200,0.5)]"
                                                : "bg-white/10"
                                            }`}
                                        style={{ height: h }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
