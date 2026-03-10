import React from 'react';
import { Icon } from '@iconify/react';

interface CreditCardProps {
    name: string;
    number: string;
    expiry: string;
    cvc: string;
    focused: 'name' | 'number' | 'expiry' | 'cvc' | '';
    brand: string;
}

const getBrandIcon = (brand: string) => {
    switch (brand.toLowerCase()) {
        case 'visa':
            return <Icon icon="logos:visa" className="text-4xl" />;
        case 'mastercard':
            return <Icon icon="logos:mastercard" className="text-4xl" />;
        case 'amex':
            return <Icon icon="logos:amex" className="text-4xl" />;
        case 'discover':
            return <Icon icon="logos:discover" className="text-4xl" />;
        default:
            return <Icon icon="solar:card-outline" className="text-3xl text-white/50" />;
    }
};

const formatCardNumber = (num: string) => {
    // Pad with placeholders up to 16
    const formatted = num.replace(/\D/g, '').padEnd(16, '•');
    // Group by 4
    return formatted.match(/.{1,4}/g)?.join(' ') || '';
};

export default function CreditCard({ name, number, expiry, cvc, focused, brand }: CreditCardProps) {
    const isFlipped = focused === 'cvc';

    return (
        <div style={{ perspective: '1000px' }} className="w-full max-w-[340px] h-52 mx-auto">
            <div
                style={{
                    transformStyle: 'preserve-3d',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
                className="relative w-full h-full transition-transform duration-700 ease-in-out"
            >
                {/* Front Side */}
                <div
                    style={{ backfaceVisibility: 'hidden' }}
                    className="absolute inset-0 bg-gradient-to-br from-stone-800 to-stone-950 rounded-2xl p-6 text-white shadow-xl flex flex-col justify-between overflow-hidden border border-white/10"
                >
                    {/* Decorative Elements */}
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
                    <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-stone-500/10 rounded-full blur-xl"></div>

                    <div className="relative flex items-start justify-between">
                        {/* Chip Mock */}
                        <div className="w-12 h-9 bg-stone-300 rounded-md bg-gradient-to-br from-stone-200 to-stone-400 opacity-90 overflow-hidden relative">
                            <div className="absolute inset-x-0 top-1/2 h-[1px] bg-stone-500"></div>
                            <div className="absolute inset-y-0 left-1/3 w-[1px] bg-stone-500"></div>
                            <div className="absolute inset-y-0 right-1/3 w-[1px] bg-stone-500"></div>
                            <div className="absolute bottom-2 left-0 right-0 h-[10px] border-t border-b border-stone-500 rounded-full"></div>
                        </div>
                        {/* Brand Icon */}
                        <div>{getBrandIcon(brand)}</div>
                    </div>

                    <div className="relative">
                        <div className={`font-mono text-xl tracking-widest mb-4 transition-opacity ${focused === 'number' ? 'opacity-100' : 'opacity-80'}`}>
                            {formatCardNumber(number)}
                        </div>

                        <div className="flex justify-between items-end">
                            <div className="flex-1 overflow-hidden pr-4">
                                <p className="text-[10px] uppercase tracking-wider text-stone-400 mb-1">
                                    Titular do Cartão
                                </p>
                                <p className={`font-medium tracking-wide truncate transition-opacity ${focused === 'name' ? 'opacity-100' : 'opacity-80'}`}>
                                    {name ? name.toUpperCase() : 'NOME IMPRESSO'}
                                </p>
                            </div>
                            <div className="flex-shrink-0">
                                <p className="text-[10px] uppercase tracking-wider text-stone-400 mb-1 text-center">
                                    Validade
                                </p>
                                <p className={`font-mono text-center transition-opacity ${focused === 'expiry' ? 'opacity-100' : 'opacity-80'}`}>
                                    {expiry || 'MM/AA'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Back Side */}
                <div
                    style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                    }}
                    className="absolute inset-0 bg-stone-900 rounded-2xl shadow-xl flex flex-col border border-white/10"
                >
                    {/* Magnetic Strip */}
                    <div className="w-full h-12 bg-black/80 mt-6"></div>

                    <div className="px-6 mt-6">
                        <p className="text-[10px] uppercase tracking-wider text-stone-400 mb-1 text-right">
                            CVV
                        </p>
                        <div className="bg-white rounded h-10 w-full flex items-center justify-end px-3">
                            <span className="text-stone-900 font-mono text-sm tracking-widest">
                                {cvc || '•••'}
                            </span>
                        </div>
                    </div>

                    <div className="mt-auto p-6 text-[8px] text-stone-500 uppercase leading-relaxed opacity-50">
                        ESTE CARTÃO É DE USO PESSOAL E INTRANSFERÍVEL. EM CASO DE PERDA, COMUNIQUE O EMISSOR IMEDIATAMENTE.
                    </div>
                </div>
            </div>
        </div>
    );
}
