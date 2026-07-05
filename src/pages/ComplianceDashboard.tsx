import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  RefreshCw,
  Sparkles,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import ImpactDots from "@/components/ImpactDots";
import { useAuth } from "@/contexts/AuthContext";
import { useSpaces } from "@/contexts/SpacesContext";
import { supabase } from "@/integrations/supabase/client";
import { LawItem } from "@/lib/lawData";
import { toast } from "sonner";
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";

/* ─── helpers ─── */

function daysUntil(dateStr?: string): number | null {
  if (!dateStr) return null;
  const target = new Date(dateStr);
  if (isNaN(target.getTime())) return null;
  const now = new Date();
  return Math.ceil((target.getTime() - now.getTime()) / 86_400_000);
}

function computeScore(laws: LawItem[]): number {
  if (!laws.length) return 100;
  const total = laws.length;
  const highCount = laws.filter((l) => l.impact === "high").length;
  const medCount = laws.filter((l) => l.impact === "medium").length;
  const urgentCount = laws.filter((l) => {
    const d = daysUntil(l.effectiveDate);
    return d !== null && d <= 30 && d >= 0;
  }).length;
  const actionItems = laws.reduce((s, l) => s + (l.whatYouCanDo?.length || 0), 0);

  let score = 100;
  score -= (highCount / total) * 30;
  score -= (medCount / total) * 10;
  score -= Math.min(urgentCount * 5, 20);
  score -= Math.min(actionItems * 1.5, 20);
  return Math.max(0, Math.min(100, Math.round(score)));
}

function scoreColor(score: number) {
  if (score >= 75) return "hsl(var(--primary))";
  if (score >= 50) return "hsl(var(--impact-medium))";
  return "hsl(var(--destructive))";
}

function scoreLabel(score: number) {
  if (score >= 75) return "Good";
  if (score >= 50) return "Needs Attention";
  return "Critical";
}

interface CategoryRisk {
  category: string;
  count: number;
  highCount: number;
  medCount: number;
  level: "high" | "medium" | "low";
}

function buildCategoryRisks(laws: LawItem[]): CategoryRisk[] {
  const map: Record<string, { count: number; high: number; med: number }> = {};
  laws.forEach((l) => {
    if (!map[l.category]) map[l.category] = { count: 0, high: 0, med: 0 };
    map[l.category].count++;
    if (l.impact === "high") map[l.category].high++;
    if (l.impact === "medium") map[l.category].med++;
  });
  return Object.entries(map)
    .map(([category, v]) => ({
      category,
      count: v.count,
      highCount: v.high,
      medCount: v.med,
      level: v.high > 0 ? ("high" as const) : v.med > 0 ? ("medium" as const) : ("low" as const),
    }))
    .sort((a, b) => b.highCount - a.highCount || b.medCount - a.medCount);
}

interface ActionItem {
  action: string;
  lawTitle: string;
  lawSlug: string;
  impact: "high" | "medium" | "low";
}

function buildActionItems(laws: LawItem[]): ActionItem[] {
  const items: ActionItem[] = [];
  const sorted = [...laws].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.impact] - order[b.impact];
  });
  sorted.forEach((law) => {
    law.whatYouCanDo?.forEach((action) => {
      items.push({ action, lawTitle: law.title, lawSlug: law.slug, impact: law.impact });
    });
  });
  return items;
}

/* ─── main component ─── */

const ComplianceDashboard = () => {
  const { user } = useAuth();
  const { activeSpace } = useSpaces();
  const navigate = useNavigate();
  const [laws, setLaws] = useState<LawItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  const fetchFeed = useCallback(async () => {
    if (!user || !activeSpace) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-feed", {
        body: { space_id: activeSpace.id, tab: "published", force_refresh: false },
      });
      if (error) throw error;
      if (Array.isArray(data?.laws) && data.laws.length > 0) {
        setLaws(data.laws as LawItem[]);
      }
    } catch (err) {
      console.error("Feed fetch error:", err);
      toast.error("Failed to load compliance data.");
    } finally {
      setLoading(false);
      setFetched(true);
    }
  }, [user, activeSpace]);

  useEffect(() => {
    if (!fetched) fetchFeed();
  }, [fetchFeed, fetched]);

  useEffect(() => {
    setFetched(false);
    setLaws([]);
  }, [activeSpace?.id]);

  const score = useMemo(() => computeScore(laws), [laws]);
  const deadlines = useMemo(() => {
    return [...laws]
      .filter((l) => l.effectiveDate)
      .map((l) => ({ ...l, _days: daysUntil(l.effectiveDate)! }))
      .sort((a, b) => a._days - b._days);
  }, [laws]);
  const categoryRisks = useMemo(() => buildCategoryRisks(laws), [laws]);
  const actionItems = useMemo(() => buildActionItems(laws), [laws]);

  const gaugeData = [{ value: score, fill: scoreColor(score) }];

  if (loading && !fetched) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <AppHeader />
        <div className="flex-1 px-4 py-6 pb-24 space-y-6 max-w-2xl mx-auto w-full">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-48 w-48 mx-auto rounded-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader />
      <div className="flex-1 px-4 py-6 pb-24 space-y-6 max-w-2xl mx-auto w-full">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold text-foreground">Compliance Dashboard</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => { setFetched(false); setLaws([]); }}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>

        {laws.length === 0 && fetched ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Sparkles className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No compliance data available yet. Make sure you have an active space with laws.</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* ── Compliance Score ── */}
            <Card>
              <CardContent className="pt-6 flex flex-col items-center">
                <div className="relative w-44 h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                      cx="50%"
                      cy="50%"
                      innerRadius="78%"
                      outerRadius="100%"
                      startAngle={90}
                      endAngle={-270}
                      data={gaugeData}
                      barSize={12}
                    >
                      <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                      <RadialBar
                        background={{ fill: "hsl(var(--muted))" }}
                        dataKey="value"
                        angleAxisId={0}
                        cornerRadius={6}
                      />
                    </RadialBarChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span
                      className="text-3xl font-bold"
                      style={{ color: scoreColor(score) }}
                    >
                      {score}
                    </span>
                    <span className="text-xs text-muted-foreground">/ 100</span>
                  </div>
                </div>
                <Badge
                  className="mt-3"
                  variant={score >= 75 ? "default" : score >= 50 ? "secondary" : "destructive"}
                >
                  {score >= 75 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                  {scoreLabel(score)}
                </Badge>
                <p className="text-xs text-muted-foreground mt-2 text-center max-w-xs">
                  Based on {laws.length} tracked regulations, {actionItems.length} pending actions
                </p>

                {/* Score explanation */}
                <div className="mt-4 w-full rounded-lg border border-border bg-muted/30 p-3 space-y-2">
                  <p className="text-xs font-semibold text-foreground">How is this score calculated?</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Your compliance score starts at 100 and is adjusted based on four factors from your tracked regulations:
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1 list-none">
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-destructive shrink-0" />
                      <span><span className="font-medium text-foreground">High-impact laws</span> — each high-impact regulation reduces your score proportionally (up to −30 pts)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-impact-medium shrink-0" />
                      <span><span className="font-medium text-foreground">Medium-impact laws</span> — moderate regulations have a smaller effect (up to −10 pts)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                      <span><span className="font-medium text-foreground">Approaching deadlines</span> — laws effective within 30 days increase urgency (up to −20 pts)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-accent-foreground shrink-0" />
                      <span><span className="font-medium text-foreground">Pending actions</span> — unresolved action items indicate open compliance gaps (up to −20 pts)</span>
                    </li>
                  </ul>
                  <p className="text-[10px] text-muted-foreground pt-1 border-t border-border">
                    75+ = Good · 50–74 = Needs Attention · Below 50 = Critical
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* ── Deadline Tracker ── */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  Upcoming Deadlines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {deadlines.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No upcoming deadlines.</p>
                ) : (
                  deadlines.slice(0, 6).map((law) => {
                    const days = law._days;
                    const urgent = days <= 7;
                    const soon = days <= 30;
                    const overdue = days < 0;

                    return (
                      <button
                        key={law.slug}
                        onClick={() => navigate(`/law/${law.slug}`, { state: { law } })}
                        className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors text-left"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{law.title}</p>
                          <p className="text-xs text-muted-foreground">{law.effectiveDate}</p>
                        </div>
                        <Badge
                          variant={overdue ? "destructive" : urgent ? "destructive" : soon ? "secondary" : "outline"}
                          className="shrink-0 text-xs"
                        >
                          {overdue
                            ? `${Math.abs(days)}d overdue`
                            : days === 0
                            ? "Today"
                            : `${days}d left`}
                        </Badge>
                        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                      </button>
                    );
                  })
                )}
              </CardContent>
            </Card>

            {/* ── Risk Heatmap ── */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                  Risk by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {categoryRisks.map((cr) => (
                    <div
                      key={cr.category}
                      className="rounded-lg p-3 border border-border transition-colors"
                      style={{
                        backgroundColor:
                          cr.level === "high"
                            ? "hsl(var(--destructive) / 0.12)"
                            : cr.level === "medium"
                            ? "hsl(var(--impact-medium) / 0.12)"
                            : "hsl(var(--primary) / 0.08)",
                      }}
                    >
                      <p className="text-sm font-semibold text-foreground">{cr.category}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">{cr.count} law{cr.count > 1 ? "s" : ""}</span>
                        <ImpactDots level={cr.level} />
                      </div>
                      {cr.highCount > 0 && (
                        <p className="text-[10px] mt-1" style={{ color: "hsl(var(--destructive))" }}>
                          {cr.highCount} high-impact
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* ── Prioritized Action Items ── */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                  Prioritized Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {actionItems.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No pending action items.</p>
                ) : (
                  actionItems.slice(0, 10).map((item, i) => (
                    <button
                      key={i}
                      onClick={() => navigate(`/law/${item.lawSlug}`)}
                      className="w-full flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors text-left"
                    >
                      <ImpactDots level={item.impact} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground">{item.action}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">
                          From: {item.lawTitle}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    </button>
                  ))
                )}
                {actionItems.length > 10 && (
                  <p className="text-xs text-muted-foreground text-center pt-1">
                    +{actionItems.length - 10} more actions
                  </p>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default ComplianceDashboard;
