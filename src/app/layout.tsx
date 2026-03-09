import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import { ToastProvider } from "@/components/Toast";
import { ConfirmProvider } from "@/components/ConfirmDialog";
import "./globals.css";

const inter = Inter({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600"],
    variable: "--font-inter",
});

const geist = Geist({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    variable: "--font-geist",
});

export const metadata: Metadata = {
    title: {
        default: "UGC Connect | A Plataforma Nº1 de Conteúdo UGC no Brasil",
        template: "%s | UGC Connect",
    },
    description:
        "Conecte sua marca aos melhores criadores de conteúdo UGC (User Generated Content) do Brasil. Escale seus anúncios no TikTok, Reels e YouTube Shorts com vídeos autênticos que convertem.",
    keywords: ["UGC", "User Generated Content", "Criadores de Conteúdo", "Marketing de Influência", "Vídeos para Anúncios", "TikTok Ads", "Reels", "Brasil", "Conteúdo Autêntico"],
    authors: [{ name: "UGC Connect Team" }],
    creator: "UGC Connect",
    publisher: "UGC Connect",
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    openGraph: {
        type: "website",
        locale: "pt_BR",
        url: "https://ugcconnect.com.br", // URL fictícia/exemplo, ajustar se houver real
        title: "UGC Connect | A Plataforma Nº1 de Conteúdo UGC no Brasil",
        description: "Escale seus resultados com vídeos autênticos criados por consumidores reais. A maneira mais eficaz de crescer sua marca nas redes sociais.",
        siteName: "UGC Connect",
    },
    twitter: {
        card: "summary_large_image",
        title: "UGC Connect | Conteúdo que Converte",
        description: "Conecte sua marca aos melhores criadores de UGC do Brasil.",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR" className="scroll-smooth">
            <body
                className={`${inter.variable} ${geist.variable} antialiased selection:bg-stone-800 selection:text-white text-stone-800 bg-stone-50`}
                style={{ fontFamily: "var(--font-inter)" }}
            >
                <ToastProvider>
                    <ConfirmProvider>
                        {children}
                    </ConfirmProvider>
                </ToastProvider>
            </body>
        </html>
    );
}
