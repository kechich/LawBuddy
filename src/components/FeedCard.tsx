import { ChevronRight } from "lucide-react";

interface FeedCardProps {
  category: string;
  title: string;
  summary: string;
  relevance: "High" | "Medium";
  date: string;
}

const FeedCard = ({ category, title, summary, relevance, date }: FeedCardProps) => {
  return (
    <div className="rounded-xl bg-card border border-border p-5 shadow-sm transition-shadow hover:shadow-md cursor-pointer">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-accent">
          {category}
        </span>
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            relevance === "High"
              ? "bg-relevance-high/10 text-relevance-high"
              : "bg-relevance-medium/10 text-relevance-medium"
          }`}
        >
          {relevance}
        </span>
      </div>
      <h3 className="text-base font-bold leading-snug text-card-foreground mb-1.5">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed mb-3">
        {summary}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{date}</span>
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent">
          See how this affects you
          <ChevronRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </div>
  );
};

export default FeedCard;
