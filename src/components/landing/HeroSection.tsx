import { Hero } from "@/components/ui/animated-hero";
import { GlobePulse } from "@/components/ui/cobe-globe-pulse";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Globe background */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-15">
        <div className="w-[800px] max-w-[120vw]">
          <GlobePulse speed={0.002} />
        </div>
      </div>
      {/* Fade overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
      <div className="relative">
        <Hero />
      </div>
    </section>
  );
};

export default HeroSection;
