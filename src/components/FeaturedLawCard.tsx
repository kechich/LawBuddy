import { ArrowRight } from "lucide-react";

const FeaturedLawCard = () => {
  return (
    <section className="px-5 pb-6">
      <div className="rounded-xl bg-card border border-border p-6 shadow-sm">
        <span className="inline-block text-xs font-semibold uppercase tracking-wider text-accent mb-3">
          Housing
        </span>
        <h2 className="text-xl font-bold leading-snug text-card-foreground mb-2">
          New Rent Cap Extension for Major German Cities
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground mb-3">
          The Bundestag approved an extension of the Mietpreisbremse through
          2029, limiting rent increases in tight housing markets across 206
          municipalities — including Munich.
        </p>
        <p className="text-sm font-medium text-foreground mb-5">
          ⚡ This directly protects your rent from exceeding 10% above the local
          benchmark.
        </p>
        <button className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-colors hover:opacity-90">
          Read impact
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
};

export default FeaturedLawCard;
