import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorks from "@/components/landing/HowItWorks";
import Features from "@/components/landing/Features";
import ProductPreview from "@/components/landing/ProductPreview";
import PricingPlans from "@/components/landing/PricingPlans";
import WhyItMatters from "@/components/landing/WhyItMatters";
import FAQ from "@/components/landing/FAQ";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";

const Landing = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <HeroSection />
    <HowItWorks />
    <Features />
    <ProductPreview />
    <PricingPlans />
    <WhyItMatters />
    <FAQ />
    <FinalCTA />
    <Footer />
  </div>
);

export default Landing;
