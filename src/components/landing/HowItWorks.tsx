import { motion } from "framer-motion";
import { Search, Languages, Bell } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Track new laws & proposals",
    description:
      "We continuously monitor published legislation and bills under discussion at federal and state level.",
  },
  {
    icon: Languages,
    title: "Translate into plain language",
    description:
      "Complex legal text becomes a clear, readable summary — no jargon, no legalese.",
  },
  {
    icon: Bell,
    title: "Show personal impact & keep you updated",
    description:
      "See how each law affects you based on your profile, and get notified when things change.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.15 },
  }),
};

const HowItWorks = () => (
  <section id="how-it-works" className="bg-secondary/40 py-20 md:py-28">
    <div className="mx-auto max-w-6xl px-5">
      <div className="mb-14 text-center">
        <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
          How it works
        </h2>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          From legislation to understanding in three steps.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            custom={i}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="flex flex-col items-center rounded-xl border border-border bg-card p-8 text-center shadow-[0_1px_3px_0_rgb(0_0_0/0.04)]"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/8">
              <step.icon className="h-5 w-5 text-primary" />
            </div>
            <span className="mb-1 text-xs font-semibold uppercase tracking-wider text-primary/70">
              Step {i + 1}
            </span>
            <h3 className="font-serif text-lg font-bold text-foreground">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {step.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
