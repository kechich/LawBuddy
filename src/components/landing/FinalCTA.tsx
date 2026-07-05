import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";


const FinalCTA = () => (
  <section className="bg-primary/95 py-20 md:py-28">
    <div className="mx-auto max-w-6xl px-5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-2xl text-center"
      >
        <h2 className="font-serif text-3xl font-bold text-primary-foreground sm:text-4xl">
          Start understanding the laws that shape your life
        </h2>
        <p className="mt-4 text-base leading-relaxed text-primary-foreground/70">
          Create your profile, set your interests, and get a personalized feed
          of the legislation that matters most to you.
        </p>
        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <a href="#pricing-citizens" onClick={(e) => { e.preventDefault(); document.getElementById('pricing-citizens')?.scrollIntoView({ behavior: 'smooth' }); }}>
            <Button
              size="lg"
              variant="secondary"
              className="rounded-md px-8 text-sm font-semibold"
            >
              Get started free
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </a>
          <a href="#pricing-business" onClick={(e) => { e.preventDefault(); document.getElementById('pricing-business')?.scrollIntoView({ behavior: 'smooth' }); }}>
            <Button
              size="lg"
              variant="ghost"
              className="rounded-md px-8 text-sm font-semibold text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              Plans for businesses
            </Button>
          </a>
        </div>
      </motion.div>
    </div>
  </section>
);

export default FinalCTA;
