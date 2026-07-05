import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";


function Hero() {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["clearly", "personally", "instantly", "simply", "confidently"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2600);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="w-full">
      <div className="container mx-auto">
        <div className="flex flex-col items-center justify-center gap-8 py-20 lg:py-32">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              Public decisions, made usable
            </span>
          </div>
          <div className="flex flex-col gap-4">
            <h1 className="max-w-2xl text-center font-serif text-5xl font-bold tracking-tight text-foreground md:text-7xl">
              <span>Understand the laws</span>
              <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1">
                &nbsp;
                <AnimatePresence mode="wait">
                  {titles.map((title, index) =>
                    index === titleNumber ? (
                      <motion.span
                        key={index}
                        className="absolute font-serif text-primary"
                        initial={{ opacity: 0, y: 40, filter: "blur(6px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -40, filter: "blur(6px)" }}
                        transition={{
                          type: "spring",
                          stiffness: 120,
                          damping: 17,
                        }}
                      >
                        {title}
                      </motion.span>
                    ) : null
                  )}
                </AnimatePresence>
              </span>
            </h1>

            <p className="mx-auto max-w-xl text-center text-base leading-relaxed text-muted-foreground md:text-lg">
              Every law, decoded. Every change, delivered.
              Plain language. Personal impact. Zero complexity.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <a href="#pricing-citizens" onClick={(e) => { e.preventDefault(); document.getElementById('pricing-citizens')?.scrollIntoView({ behavior: 'smooth' }); }}>
              <Button size="lg" className="gap-2 rounded-md px-8 font-semibold shadow-sm">
                For Citizens — Free <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
            <a href="#pricing-business" onClick={(e) => { e.preventDefault(); document.getElementById('pricing-business')?.scrollIntoView({ behavior: 'smooth' }); }}>
              <Button size="lg" variant="outline" className="gap-2 rounded-md px-8 font-semibold">
                For Businesses
              </Button>
            </a>
          </div>

          {/* Product preview card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 w-full max-w-2xl"
          >
            <div className="rounded-xl border border-border bg-card p-5 shadow-[0_2px_8px_0_rgb(0_0_0/0.04)] sm:p-8">
              <div className="mb-4 flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-impact-high" />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  High impact · Published
                </span>
              </div>
              <h3 className="font-serif text-lg font-bold text-card-foreground sm:text-xl">
                Rent Cap Extended Through 2029
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                The Mietpreisbremse now covers 206 municipalities including
                Munich, limiting rent increases to 10% above the local
                benchmark.
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Apr 8, 2026</span>
                <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                  Affects you directly →
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export { Hero };
