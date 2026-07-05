import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Calendar, Tag, AlertTriangle, CheckCircle2, ExternalLink, ShieldCheck, ShieldOff, ScrollText } from "lucide-react";
import { getLawBySlug, LawItem } from "@/lib/lawData";
import ImpactDots from "@/components/ImpactDots";
import BottomNav from "@/components/BottomNav";

const LawDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  // Try route state first (AI-generated laws), then fall back to static data
  const routeLaw = (location.state as { law?: LawItem } | null)?.law;
  const law = routeLaw || (slug ? getLawBySlug(slug) : undefined);

  if (!law) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center px-6">
          <h1 className="text-xl font-bold text-foreground mb-2">Law not found</h1>
          <p className="text-muted-foreground mb-4">This law may have been moved or removed.</p>
          <button onClick={() => navigate("/feed")} className="text-primary font-semibold">
            ← Back to Feed
          </button>
        </div>
      </div>
    );
  }

  const impactColor =
    law.impact === "high"
      ? "text-red-500 bg-red-500/10"
      : law.impact === "medium"
      ? "text-amber-500 bg-amber-500/10"
      : "text-emerald-500 bg-emerald-500/10";

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-lg">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        </div>

        <div className="px-5 py-6 space-y-6">
          {/* Status & Impact */}
          <div className="flex items-center justify-between">
            <span
              className={`text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                law.status === "Published"
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {law.status}
            </span>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${impactColor}`}>
                {law.impact.charAt(0).toUpperCase() + law.impact.slice(1)} Impact
              </span>
              <ImpactDots level={law.impact} />
            </div>
          </div>

          {/* Title & Meta */}
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-primary mb-1.5 block">
              {law.category}
            </span>
            <h1 className="text-2xl font-bold text-foreground leading-tight mb-3">
              {law.title}
            </h1>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {law.date}
              </span>
              {law.effectiveDate && (
                <span className="flex items-center gap-1">
                  <Tag className="h-3.5 w-3.5" />
                  Effective: {law.effectiveDate}
                </span>
              )}
            </div>

            {/* Active Status Verification */}
            {law.isStillActive !== undefined && (
              <div className={`mt-3 flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg w-fit ${
                law.isStillActive
                  ? "bg-green-500/10 text-green-600 dark:text-green-400"
                  : "bg-red-500/10 text-red-600 dark:text-red-400"
              }`}>
                {law.isStillActive ? <ShieldCheck className="h-4 w-4" /> : <ShieldOff className="h-4 w-4" />}
                <span>{law.isStillActive ? "Currently in effect" : "No longer active"}</span>
              </div>
            )}
            {law.activeStatusNote && (
              <p className="text-xs text-muted-foreground mt-1.5">{law.activeStatusNote}</p>
            )}
          </div>

          {/* Summary */}
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-sm text-muted-foreground leading-relaxed font-medium">
              {law.summary}
            </p>
          </div>

          {/* Full Text */}
          <div>
            <h2 className="text-base font-bold text-foreground mb-2">What's happening</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {law.fullText}
            </p>
          </div>

          {/* Original Legal Text */}
          {law.originalLegalText && (
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <ScrollText className="h-5 w-5 text-primary" />
                <h2 className="text-base font-bold text-foreground">Original Legal Text</h2>
              </div>
              <blockquote className="border-l-4 border-primary/40 pl-4 py-1">
                <p className="text-sm text-muted-foreground leading-relaxed italic whitespace-pre-line">
                  {law.originalLegalText}
                </p>
              </blockquote>
              <p className="text-xs text-muted-foreground mt-2">Source: {law.source}</p>
            </div>
          )}
          {/* Key Points */}
          <div>
            <h2 className="text-base font-bold text-foreground mb-3">Key points</h2>
            <ul className="space-y-2">
              {law.keyPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* How it affects you */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-5 w-5 text-primary" />
              <h2 className="text-base font-bold text-foreground">How this affects you</h2>
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed">
              {law.howItAffectsYou}
            </p>
          </div>

          {/* What you can do */}
          <div>
            <h2 className="text-base font-bold text-foreground mb-3">What you can do</h2>
            <div className="space-y-2">
              {law.whatYouCanDo.map((action, i) => (
                <div key={i} className="flex items-start gap-2.5 bg-card border border-border rounded-lg p-3">
                  <span className="flex items-center justify-center h-5 w-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-sm text-muted-foreground leading-relaxed">{action}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Source */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-border">
            <ExternalLink className="h-3.5 w-3.5" />
            <span>Source: {law.source}</span>
          </div>
        </div>

        <div className="h-20" />
      </div>
      <BottomNav />
    </div>
  );
};

export default LawDetail;
