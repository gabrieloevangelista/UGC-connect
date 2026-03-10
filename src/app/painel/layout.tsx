"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Icon } from "@iconify/react";
import { supabase } from "@/lib/supabase";
import { signOut } from "@/lib/auth";
import type { User } from "@supabase/supabase-js";
import { isUserAdmin, checkAdminStatus } from "@/config/admin";

const navItems = [
    {
        label: "Visão Geral",
        href: "/painel",
        icon: "solar:home-2-linear",
    },
    {
        label: "Solicitar Vídeo",
        href: "/painel/solicitar",
        icon: "solar:videocamera-record-linear",
    },
    {
        label: "Solicitações",
        href: "/painel/solicitacoes",
        icon: "solar:clipboard-list-linear",
    },
    {
        label: "Configurações",
        href: "/painel/dados",
        icon: "solar:settings-linear",
    },
];

const adminNavItem = {
    label: "Painel Admin",
    href: "/painel/admin",
    icon: "solar:shield-keyhole-linear",
};

export default function PainelLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<User | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (!session) {
                router.push("/login");
                return;
            }

            // Check if subscriber exists, create if not (for Google Auth)
            const { data: sub } = await supabase
                .from("subscribers")
                .select("id")
                .eq("user_id", session.user.id)
                .single();

            if (!sub) {
                await supabase.from("subscribers").insert([
                    {
                        user_id: session.user.id,
                        name: session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "Usuário",
                        email: session.user.email,
                        phone: "",
                        tax_id: "",
                        company: "",
                        plan: "free",
                        status: "ACTIVE",
                    },
                ]);
            }

            setUser(session.user);
            const { isAdmin: admin } = await checkAdminStatus(session.user.email);
            setIsAdmin(admin);

            // Redirecionar se tentar acessar admin sem permissão
            if (pathname.startsWith("/painel/admin") && !admin) {
                router.push("/painel");
            }

            setLoading(false);
        };

        checkAuth();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!session) {
                router.push("/login");
            } else {
                setUser(session.user);
            }
        });

        return () => subscription.unsubscribe();
    }, [router]);

    const handleSignOut = async () => {
        await signOut();
        router.push("/login");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-stone-50 flex items-center justify-center">
                <Icon
                    icon="solar:refresh-linear"
                    width={32}
                    className="animate-spin text-stone-400"
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-stone-50 flex overflow-x-hidden">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-[#2D302B] text-white flex flex-col transform transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                {/* Logo */}
                <div className="px-8 py-8 border-b border-white/10">
                    <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => router.push("/")}
                    >
                        <Icon icon="solar:video-frame-linear" width={24} height={24} />
                        <span className="text-lg font-medium tracking-tighter uppercase">
                            UGC Connect
                        </span>
                    </div>
                </div>

                {/* Nav Items */}
                <nav className="flex-1 px-4 py-6 space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <button
                                key={item.href}
                                onClick={() => {
                                    router.push(item.href);
                                    setSidebarOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${isActive
                                    ? "bg-white/10 text-white"
                                    : "text-[#E0D8C8]/60 hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                <Icon icon={item.icon} width={20} />
                                {item.label}
                            </button>
                        );
                    })}

                    {/* Admin Item Removed as per request */}
                    {/* {isAdmin && (
                        <div className="pt-4 mt-4 border-t border-white/5 space-y-1">
                            <span className="px-4 text-[10px] font-bold uppercase tracking-widest text-white/30">
                                Administração
                            </span>
                            <button
                                onClick={() => {
                                    router.push(adminNavItem.href);
                                    setSidebarOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${pathname === adminNavItem.href
                                    ? "bg-emerald-500/10 text-emerald-400"
                                    : "text-[#E0D8C8]/60 hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                <Icon icon={adminNavItem.icon} width={20} />
                                {adminNavItem.label}
                            </button>
                        </div>
                    )} */}
                </nav>

                {/* User + Logout */}
                <div className="px-4 pb-6 space-y-2">
                    <div className="px-4 py-3">
                        <p className="text-xs text-[#E0D8C8]/40 truncate">{user?.email}</p>
                    </div>
                    <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition"
                    >
                        <Icon icon="solar:logout-2-linear" width={20} />
                        Sair
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Top Bar */}
                <header className="bg-white border-b border-stone-100 px-6 py-4 flex items-center justify-between lg:justify-end">
                    <button
                        className="lg:hidden text-stone-600"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Icon icon="solar:hamburger-menu-linear" width={24} />
                    </button>
                    <div className="flex items-center gap-3 relative">
                        <div 
                            className="w-8 h-8 rounded-full bg-stone-900 flex items-center justify-center text-white text-xs font-medium cursor-pointer hover:opacity-80 transition"
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            {user?.email?.[0]?.toUpperCase() || "U"}
                        </div>

                        {menuOpen && (
                            <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-stone-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                                <div className="px-4 py-2 border-b border-stone-100 mb-1">
                                    <p className="text-xs text-stone-500 font-medium">Conta</p>
                                    <p className="text-sm text-stone-900 truncate">{user?.email}</p>
                                </div>
                                <button
                                    onClick={() => {
                                        router.push("/painel/dados");
                                        setMenuOpen(false);
                                    }}
                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-stone-600 hover:bg-stone-50 transition"
                                >
                                    <Icon icon="solar:user-circle-linear" width={18} />
                                    Minha Conta
                                </button>
                                <button
                                    onClick={() => {
                                        handleSignOut();
                                        setMenuOpen(false);
                                    }}
                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                                >
                                    <Icon icon="solar:logout-2-linear" width={18} />
                                    Sair
                                </button>
                            </div>
                        )}
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 px-6 md:px-10 py-8">{children}</main>
            </div>
        </div>
    );
}
