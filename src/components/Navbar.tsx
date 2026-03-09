"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

const navLinks = [
    { href: "#vantagens", label: "O Valor" },
    { href: "#criadores", label: "Criadores" },
    { href: "#formatos", label: "Formatos" },
    { href: "#contato", label: "Contato" },
];

const mobileNavLinks = [
    { href: "#vantagens", label: "Vantagens" },
    { href: "#formatos", label: "Formatos" },
    { href: "#criadores", label: "Criadores" },
    { href: "#contato", label: "Contato" },
    { href: "#faq", label: "FAQ" },
];

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);

    const toggleMenu = () => {
        setMobileOpen((prev) => !prev);
        document.body.classList.toggle("overflow-hidden");
    };

    return (
        <>
            {/* Mobile Menu Overlay */}
            <div
                className={`fixed inset-0 bg-stone-900 z-[60] transform transition-transform duration-300 flex flex-col justify-center items-center text-white gap-8 md:hidden ${mobileOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <button
                    onClick={toggleMenu}
                    className="absolute top-6 right-6 p-2"
                    aria-label="Fechar menu"
                >
                    <Icon icon="solar:close-circle-linear" width={32} />
                </button>
                {mobileNavLinks.map((link) => (
                    <a
                        key={link.href}
                        href={link.href}
                        className="text-2xl font-light"
                        onClick={toggleMenu}
                    >
                        {link.label}
                    </a>
                ))}
            </div>

            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 px-6 py-6 flex justify-between items-center text-white mix-blend-difference">
                <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => window.scrollTo(0, 0)}
                >
                    <Icon icon="solar:video-frame-linear" width={28} height={28} />
                    <span className="text-xl font-medium tracking-tighter uppercase">
                        UGC Connect
                    </span>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8 text-sm font-medium tracking-tight bg-stone-900/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/10">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="hover:opacity-70 transition"
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    <a href="/login" className="bg-white text-stone-950 px-5 py-2.5 rounded-full text-xs font-medium hover:bg-stone-200 transition hidden md:block">
                        Acesso Empresas
                    </a>
                    {/* Mobile Toggle */}
                    <button
                        onClick={toggleMenu}
                        className="md:hidden text-white"
                        aria-label="Abrir menu"
                    >
                        <Icon icon="solar:hamburger-menu-linear" width={28} />
                    </button>
                </div>
            </nav>
        </>
    );
}
