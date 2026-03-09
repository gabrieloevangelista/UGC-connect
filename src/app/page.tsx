import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ValueProposition from "@/components/ValueProposition";
import PartnerLogos from "@/components/PartnerLogos";
import CreatorsSection from "@/components/CreatorsSection";
import ContentFormats from "@/components/ContentFormats";
import PricingSection from "@/components/PricingSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";

export default function Home() {
    return (
        <>
            <Navbar />
            <HeroSection />
            <ValueProposition />
            <PartnerLogos />
            <CreatorsSection />
            <ContentFormats />
            <PricingSection />
            <TestimonialsSection />
            <FaqSection />
            <Footer />
        </>
    );
}
