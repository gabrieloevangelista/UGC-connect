import { Icon } from "@iconify/react";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer id="footer" className="bg-[#2D302B] text-white px-6 py-24 md:px-12">
            <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-24">
                <div className="lg:col-span-1">
                    <h2 className="text-2xl tracking-tight mb-8 font-light">
                        Escalabilidade Criativa.
                    </h2>
                    <button className="bg-[#E0D8C8] text-[#2D302B] pl-6 pr-2 py-2 rounded-full flex items-center gap-4 hover:bg-white transition group">
                        <span className="text-sm font-medium">Cadastrar Marca</span>
                        <div className="bg-[#2D302B] text-[#E0D8C8] rounded-full p-1.5 group-hover:rotate-45 transition duration-300">
                            <Icon icon="solar:arrow-right-linear" width={16} />
                        </div>
                    </button>
                </div>

                <div className="grid grid-cols-2 lg:col-span-3 gap-8 text-[10px] uppercase tracking-widest text-[#E0D8C8]/60">
                    <div className="space-y-8">
                        <div>
                            <span className="block mb-4 text-[#E0D8C8]">Atendimento</span>
                            <div className="text-white normal-case text-sm font-light">
                                Segunda - Sexta
                                <br />
                                09:00 - 18:00 (BRT)
                            </div>
                        </div>
                        <div>
                            <span className="block mb-4 text-[#E0D8C8]">
                                Contato Comercial
                            </span>
                            <div className="text-white normal-case text-sm font-light block">
                                contato@ugcconnect.com.br
                            </div>
                            <div className="text-white normal-case text-sm font-light block mt-1">
                                +55 (11) 99999-0000
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div>
                            <span className="block mb-4 text-[#E0D8C8]">Para Criadores</span>
                            <a
                                href="#"
                                className="text-white normal-case text-sm font-light mb-2 hover:underline block"
                            >
                                Aplicar como Criador
                            </a>
                            <a
                                href="#"
                                className="text-white normal-case text-sm font-light hover:underline block"
                            >
                                Manual de Boas Práticas
                            </a>
                        </div>

                        <div className="pt-8">
                            <span className="block mb-4 text-[#E0D8C8]">Social</span>
                            <div className="flex gap-2">
                                <a
                                    href="#"
                                    className="w-8 h-8 flex items-center justify-center rounded border border-[#E0D8C8]/20 text-white hover:bg-[#E0D8C8] hover:text-[#2D302B] transition"
                                    aria-label="Instagram"
                                >
                                    <Icon icon="simple-icons:instagram" />
                                </a>
                                <a
                                    href="#"
                                    className="w-8 h-8 flex items-center justify-center rounded border border-[#E0D8C8]/20 text-white hover:bg-[#E0D8C8] hover:text-[#2D302B] transition"
                                    aria-label="LinkedIn"
                                >
                                    <Icon icon="simple-icons:linkedin" />
                                </a>
                                <a
                                    href="#"
                                    className="w-8 h-8 flex items-center justify-center rounded border border-[#E0D8C8]/20 text-white hover:bg-[#E0D8C8] hover:text-[#2D302B] transition"
                                    aria-label="TikTok"
                                >
                                    <Icon icon="simple-icons:tiktok" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1600px] mx-auto mt-24 pt-8 border-t border-[#E0D8C8]/20 flex flex-col md:flex-row justify-between text-[10px] text-[#E0D8C8]/60 tracking-wider uppercase">
                <div className="flex gap-6 mb-4 md:mb-0">
                    <a href="#" className="hover:text-white transition">
                        Termos de Serviço
                    </a>
                    <a href="#" className="hover:text-white transition">
                        Política de Uso
                    </a>
                </div>
                <div className="flex gap-6">
                    <span>© {currentYear} UGC Connect LTDA.</span>
                    <a href="#" className="hover:text-white transition">
                        Privacidade
                    </a>
                </div>
            </div>
        </footer>
    );
}
