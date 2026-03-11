"use client";

import { Icon } from "@iconify/react";

type Creator = {
    name: string;
    username: string;
    photoUrl: string;
    socials: {
        instagram: string;
        tiktok: string;
        youtube: string;
        linkedin: string;
    };
};

const creators: Creator[] = [
    {
        name: "Sarah Silva",
        username: "@sarahugc",
        photoUrl:
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=512&auto=format&fit=crop",
        socials: {
            instagram: "https://instagram.com/",
            tiktok: "https://tiktok.com/",
            youtube: "https://youtube.com/",
            linkedin: "https://linkedin.com/",
        },
    },
    {
        name: "Lucas Almeida",
        username: "@lucasugc",
        photoUrl:
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=512&auto=format&fit=crop",
        socials: {
            instagram: "https://instagram.com/",
            tiktok: "https://tiktok.com/",
            youtube: "https://youtube.com/",
            linkedin: "https://linkedin.com/",
        },
    },
    {
        name: "Marina Costa",
        username: "@marinacriadora",
        photoUrl:
            "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=512&auto=format&fit=crop",
        socials: {
            instagram: "https://instagram.com/",
            tiktok: "https://tiktok.com/",
            youtube: "https://youtube.com/",
            linkedin: "https://linkedin.com/",
        },
    },
    {
        name: "Gustavo Rocha",
        username: "@gustavoperformance",
        photoUrl:
            "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=512&auto=format&fit=crop",
        socials: {
            instagram: "https://instagram.com/",
            tiktok: "https://tiktok.com/",
            youtube: "https://youtube.com/",
            linkedin: "https://linkedin.com/",
        },
    },
    {
        name: "Camila Souza",
        username: "@camilaugc",
        photoUrl:
            "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=512&auto=format&fit=crop",
        socials: {
            instagram: "https://instagram.com/",
            tiktok: "https://tiktok.com/",
            youtube: "https://youtube.com/",
            linkedin: "https://linkedin.com/",
        },
    },
    {
        name: "Bruno Martins",
        username: "@brunocreator",
        photoUrl:
            "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=512&auto=format&fit=crop",
        socials: {
            instagram: "https://instagram.com/",
            tiktok: "https://tiktok.com/",
            youtube: "https://youtube.com/",
            linkedin: "https://linkedin.com/",
        },
    },
];

export default function CreatorsMarketplacePage() {
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-light tracking-tight text-stone-900">
                    Marketplace de Creators
                </h1>
                <p className="text-stone-500 text-sm mt-1">
                    Encontre creators e acesse as redes sociais rapidamente.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {creators.map((creator) => (
                    <div
                        key={creator.username}
                        className="bg-white rounded-2xl border border-stone-100 p-6 hover:shadow-sm transition"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-stone-100 shrink-0">
                                <img
                                    src={creator.photoUrl}
                                    alt={creator.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="min-w-0">
                                <p className="text-base font-medium text-stone-900 truncate">
                                    {creator.name}
                                </p>
                                <p className="text-sm text-stone-500 truncate">
                                    {creator.username}
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 flex items-center gap-3">
                            <a
                                href={creator.socials.instagram}
                                target="_blank"
                                rel="noreferrer"
                                className="w-10 h-10 rounded-xl border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition"
                                aria-label="Instagram"
                            >
                                <Icon icon="mdi:instagram" width={20} />
                            </a>
                            <a
                                href={creator.socials.tiktok}
                                target="_blank"
                                rel="noreferrer"
                                className="w-10 h-10 rounded-xl border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition"
                                aria-label="TikTok"
                            >
                                <Icon icon="ic:baseline-tiktok" width={20} />
                            </a>
                            <a
                                href={creator.socials.youtube}
                                target="_blank"
                                rel="noreferrer"
                                className="w-10 h-10 rounded-xl border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition"
                                aria-label="YouTube"
                            >
                                <Icon icon="mdi:youtube" width={22} />
                            </a>
                            <a
                                href={creator.socials.linkedin}
                                target="_blank"
                                rel="noreferrer"
                                className="w-10 h-10 rounded-xl border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition"
                                aria-label="LinkedIn"
                            >
                                <Icon icon="mdi:linkedin" width={20} />
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

