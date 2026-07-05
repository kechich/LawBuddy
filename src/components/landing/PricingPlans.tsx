import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Crown } from "lucide-react";
import { Link } from "react-router-dom";

const citizenFeatures = [
  "Personalized law feed",
  "Plain-language summaries",
  "Personal impact markers",
  "Q&A with Law Buddy",
  "Weekly newsletter",
];

const businessFeatures = [
  "Everything in Citizens, plus:",
  "Regulatory compliance monitoring",
  "Industry-specific law tracking",
  "Team accounts & shared spaces",
  "Priority email digests (daily)",
  "API access (coming soon)",
];

const PricingPlans = () => (
  <section id="pricing" className="py-20 md:py-28 bg-muted/30">
    <div className="mx-auto max-w-6xl px-5">
      <div className="mb-14 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
            A plan for everyone
          </h2>
          <p className="mt-3 mx-auto max-w-lg text-sm text-muted-foreground sm:text-base">
            Whether you're a citizen staying informed or a business staying compliant — Law Buddy has you covered.
          </p>
        </motion.div>
      </div>

      <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
        {/* Citizens */}
        <motion.div
          id="pricing-citizens"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45 }}
          className="flex flex-col rounded-xl border border-border bg-card p-8 shadow-[0_1px_3px_0_rgb(0_0_0/0.04)] scroll-mt-24"
        >
          <h3 className="font-serif text-xl font-bold text-foreground">Citizens</h3>
          <p className="mt-1 text-sm text-muted-foreground">For individuals who want to stay informed</p>
          <p className="mt-6 font-serif text-4xl font-bold text-foreground">
            Free
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Forever — no credit card needed</p>

          <ul className="mt-8 flex-1 space-y-3">
            {citizenFeatures.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                {f}
              </li>
            ))}
          </ul>

          <Link to="/signup" className="mt-8">
            <Button variant="outline" className="w-full rounded-md font-semibold">
              Get started free
            </Button>
          </Link>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-accent hover:underline">Sign in</Link>
          </p>
        </motion.div>

        {/* Business */}
        <motion.div
          id="pricing-business"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="relative flex flex-col rounded-xl border-2 border-primary bg-card p-8 shadow-[0_2px_8px_0_rgb(0_0_0/0.06)] scroll-mt-24"
        >
          <span className="absolute -top-3 right-6 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
            <Crown className="h-3 w-3" /> Popular
          </span>

          <h3 className="font-serif text-xl font-bold text-foreground">Business</h3>
          <p className="mt-1 text-sm text-muted-foreground">For teams that need regulatory clarity</p>
          <p className="mt-6 font-serif text-4xl font-bold text-foreground">
            €49<span className="text-lg font-normal text-muted-foreground">/month</span>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Per team · cancel anytime</p>

          <ul className="mt-8 flex-1 space-y-3">
            {businessFeatures.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                {f}
              </li>
            ))}
          </ul>

          <Link to="/signup?plan=business" className="mt-8">
            <Button className="w-full rounded-md font-semibold gap-2">
              Start trial <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-accent hover:underline">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  </section>
);

export default PricingPlans;
