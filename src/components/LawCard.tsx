import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ImpactDots from "./ImpactDots";

interface LawCardProps {
  slug: string;
  title: string;
  summary: string;
  date: string;
  status: "Published" | "Under Discussion";
  impact: "high" | "medium" | "low";
}

const LawCard = ({ slug, title, summary, date, status, impact }: LawCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/law/${slug}`)}
      className="rounded-xl bg-card border border-border p-4 shadow-sm transition-shadow hover:shadow-md cursor-pointer">
      <div className="flex items-center justify-between mb-2">
        <span
          className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
            status === "Published"
              ? "bg-accent/10 text-accent"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {status}
        </span>
        <ImpactDots level={impact} />
      </div>
      <h3 className="text-[15px] font-bold leading-snug text-card-foreground mb-1">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed mb-2.5">
        {summary}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{date}</span>
        <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-accent">
          Details
          <ChevronRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </div>
  );
};

export default LawCard;
