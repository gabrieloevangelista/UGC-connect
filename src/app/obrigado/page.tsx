import { Icon } from "@iconify/react";
import Link from "next/link";

export default function ObrigadoPage() {
    return (
        <div className="min-h-screen bg-stone-50 flex items-center justify-center px-6">
            <div className="max-w-md text-center">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8">
                    <Icon
                        icon="solar:check-circle-bold"
                        width={48}
                        className="text-emerald-600"
                    />
                </div>
                <h1 className="text-4xl tracking-tight text-stone-900 font-light mb-4">
                    Pagamento Confirmado!
                </h1>
                <p className="text-stone-500 text-lg leading-relaxed mb-8">
                    Obrigado por assinar o UGC Connect. Nossa equipe entrará em contato
                    pelo WhatsApp em até 24 horas para iniciar o seu briefing.
                </p>
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 bg-stone-900 text-white pl-6 pr-3 py-3 rounded-full text-sm font-medium hover:bg-stone-800 transition"
                >
                    Voltar ao Início
                    <div className="bg-white text-stone-900 rounded-full p-1">
                        <Icon icon="solar:arrow-right-linear" width={14} />
                    </div>
                </Link>
            </div>
        </div>
    );
}
