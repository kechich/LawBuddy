import { motion } from "framer-motion";

interface PreviewCard {
  status: string;
  statusColor: string;
  category: string;
  title: string;
  impact: "high" | "medium" | "low";
}

const cards: PreviewCard[] = [
  {
    status: "Published",
    statusColor: "bg-accent/10 text-accent",
    category: "Housing",
    title: "Rent Cap Extended Through 2029",
    impact: "high",
  },
  {
    status: "Published",
    statusColor: "bg-accent/10 text-accent",
    category: "Work",
    title: "Mini-Job Threshold Rises to €556/month",
    impact: "high",
  },
  {
    status: "Under Discussion",
    statusColor: "bg-muted text-muted-foreground",
    category: "Mobility",
    title: "Free Public Transit for Under-25s Proposed",
    impact: "medium",
  },
  {
    status: "Published",
    statusColor: "bg-accent/10 text-accent",
    category: "Taxes",
    title: "Student Tax Filing Deadline Extended",
    impact: "low",
  },
  {
    status: "Under Discussion",
    statusColor: "bg-muted text-muted-foreground",
    category: "Housing",
    title: "Nationwide Rent Freeze Proposal",
    impact: "high",
  },
  {
    status: "Published",
    statusColor: "bg-accent/10 text-accent",
    category: "Benefits",
    title: "BAföG Reform: Higher Rates & Looser Eligibility",
    impact: "high",
  },
];

const impactDots = (level: "high" | "medium" | "low") => {
  const count = level === "high" ? 3 : level === "medium" ? 2 : 1;
  const color =
    level === "high" ? "bg-impact-high" : level === "medium" ? "bg-impact-medium" : "bg-impact-low";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3].map((d) => (
        <span
          key={d}
          className={`h-1.5 w-1.5 rounded-full ${d <= count ? color : "bg-border"}`}
        />
      ))}
    </div>
  );
};

const ProductPreview = () => (
  <section id="newsletter" className="bg-secondary/40 py-20 md:py-28">
    <div className="mx-auto max-w-6xl px-5">
      <div className="mb-14 text-center">
        <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
          Your personalized law feed
        </h2>
        <p className="mt-3 max-w-lg mx-auto text-sm text-muted-foreground sm:text-base">
          A preview of what your feed looks like — laws grouped by status and category, with personal impact markers.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-2xl"
      >
        <div className="rounded-xl border border-border bg-card p-5 shadow-[0_2px_8px_0_rgb(0_0_0/0.04)] sm:p-8">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-foreground">Your feed</h3>
            <span className="rounded-full bg-secondary px-3 py-1 text-[10px] font-medium text-muted-foreground">
              Student renter in Munich
            </span>
          </div>

          {/* Cards */}
          <div className="flex flex-col gap-3">
            {cards.map((card, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-xl border border-border bg-background p-3.5 transition-shadow hover:shadow-sm"
              >
                <div className="flex-1 min-w-0">
                  <div className="mb-1 flex items-center gap-2">
                    <span className={`text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${card.statusColor}`}>
                      {card.status}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{card.category}</span>
                  </div>
                  <p className="text-sm font-semibold text-foreground truncate">{card.title}</p>
                </div>
                <div className="ml-4 flex-shrink-0">
                  {impactDots(card.impact)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default ProductPreview;
