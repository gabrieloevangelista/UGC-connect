import { Icon } from "@iconify/react";

const logos = [
    { icon: "simple-icons:tiktok", size: 48 },
    { icon: "simple-icons:meta", size: 64 },
    { icon: "simple-icons:shopify", size: 56 },
    { icon: "simple-icons:stripe", size: 64 },
    { icon: "simple-icons:notion", size: 56 },
    { icon: "simple-icons:vimeo", size: 56 },
    { icon: "simple-icons:framer", size: 48 },
    { icon: "simple-icons:pinterest", size: 48 },
];

function LogoSet() {
    return (
        <div className="flex items-center gap-20 px-10 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500 ease-out text-stone-800">
            {logos.map((logo, i) => (
                <Icon key={i} icon={logo.icon} width={logo.size} height={logo.size} />
            ))}
        </div>
    );
}

export default function PartnerLogos() {
    return (
        <div
            className="w-full overflow-hidden border-y border-stone-200 bg-white py-12 relative flex items-center justify-center"
            style={{
                WebkitMaskImage:
                    "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
                maskImage:
                    "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
            }}
        >
            <div className="flex w-max animate-scroll-infinite items-center">
                <LogoSet />
                <LogoSet />
            </div>
        </div>
    );
}
