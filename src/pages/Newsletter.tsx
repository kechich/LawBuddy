import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";
import ImpactDots from "@/components/ImpactDots";
import { allLaws, LawItem } from "@/lib/lawData";
import { ChevronRight, ChevronLeft, RefreshCw, CalendarIcon, Shuffle, ShieldCheck, ShieldOff, Sparkles } from "lucide-react";
import { useSpaces } from "@/contexts/SpacesContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

function groupByCategory(laws: LawItem[]) {
  return laws.reduce<Record<string, LawItem[]>>((acc, law) => {
    if (!acc[law.category]) acc[law.category] = [];
    acc[law.category].push(law);
    return acc;
  }, {});
}

const loadingMessages = [
  "Scanning the Bundesgesetzblatt for you… 📜",
  "Our legal hamster is running through parliament halls… 🐹",
  "Asking Karlsruhe nicely for the latest rulings… ⚖️",
  "Translating legalese into human… 🤖",
  "Digging through bureaucratic treasure chests… 💎",
];

const LoadingState = () => {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % loadingMessages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="px-5 py-12 text-center">
      <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-2xl px-6 py-4 mb-6">
        <Sparkles className="h-5 w-5 text-primary animate-pulse" />
        <span className="text-sm font-medium text-foreground">{loadingMessages[msgIndex]}</span>
      </div>
      <div className="space-y-4 max-w-md mx-auto">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl bg-card border border-border p-4 space-y-3">
            <div className="flex justify-between">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-14" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
};

const ActiveBadge = ({ law }: { law: LawItem }) => {
  if (law.isStillActive === undefined) return null;
  return (
    <div className={cn(
      "flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full mt-2 w-fit",
      law.isStillActive
        ? "bg-green-500/10 text-green-600 dark:text-green-400"
        : "bg-red-500/10 text-red-600 dark:text-red-400"
    )}>
      {law.isStillActive ? <ShieldCheck className="h-3 w-3" /> : <ShieldOff className="h-3 w-3" />}
      {law.isStillActive ? "Active" : "No longer active"}
    </div>
  );
};

const CategoryRow = ({ category, laws }: { category: string; laws: LawItem[] }) => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -280 : 280, behavior: "smooth" });
  };

  return (
    <div className="mb-7">
      <div className="flex items-center justify-between px-5 mb-3">
        <h3 className="text-sm font-bold text-foreground tracking-wide">{category}</h3>
        {laws.length > 1 && (
          <div className="flex gap-1">
            <button onClick={() => scroll("left")} className="p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button onClick={() => scroll("right")} className="p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto px-5 pb-2 scrollbar-hide"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {laws.map((law) => (
          <div
            key={law.slug}
            onClick={() => navigate(`/law/${law.slug}`, { state: { law } })}
            className="flex-shrink-0 w-[260px] rounded-xl bg-card border border-border p-4 cursor-pointer transition-all hover:shadow-md hover:border-primary/30 active:scale-[0.98]"
            style={{ scrollSnapAlign: "start" }}
          >
            <div className="flex items-center justify-between mb-2.5">
              <ImpactDots level={law.impact} />
              <span className="text-[10px] text-muted-foreground font-medium">{law.date}</span>
            </div>
            <h4 className="text-[14px] font-bold leading-snug text-card-foreground mb-1.5 line-clamp-2">
              {law.title}
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
              {law.summary}
            </p>
            <ActiveBadge law={law} />
            {law.activeStatusNote && (
              <p className="text-[10px] text-muted-foreground mt-1 line-clamp-1">{law.activeStatusNote}</p>
            )}
            <div className="mt-3 flex items-center gap-0.5 text-xs font-semibold text-primary">
              Read more <ChevronRight className="h-3.5 w-3.5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Newsletter = () => {
  const [tab, setTab] = useState<"published" | "discussion">("published");
  const [aiLaws, setAiLaws] = useState<Record<string, LawItem[]>>({
    published: [],
    discussion: [],
  });
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState<Record<string, boolean>>({
    published: false,
    discussion: false,
  });

  // Time period state
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [timePeriodLaws, setTimePeriodLaws] = useState<LawItem[]>([]);
  const [timePeriodLoading, setTimePeriodLoading] = useState(false);

  // Random law state
  const [randomLaw, setRandomLaw] = useState<LawItem | null>(null);
  const [randomLoading, setRandomLoading] = useState(false);

  const { user } = useAuth();
  const { activeSpace } = useSpaces();

  const fetchFeed = useCallback(
    async (currentTab: string, forceRefresh = false) => {
      if (!user || !activeSpace) return;
      if (fetched[currentTab] && !forceRefresh) return;

      setLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke("generate-feed", {
          body: { space_id: activeSpace.id, tab: currentTab, force_refresh: forceRefresh },
        });

        if (error) throw error;

        if (Array.isArray(data?.laws) && data.laws.length > 0) {
          // If cached result has fewer than 3 laws, force a fresh generation
          if (data.cached && data.laws.length < 3 && !forceRefresh) {
            return fetchFeed(currentTab, true);
          }
          setAiLaws((prev) => ({ ...prev, [currentTab]: data.laws as LawItem[] }));
          setFetched((prev) => ({ ...prev, [currentTab]: true }));
        } else {
          setFetched((prev) => ({ ...prev, [currentTab]: true }));
          if (data?.fallback) {
            toast.warning("Using default feed while AI provider is unavailable.");
          }
        }
      } catch (err) {
        console.error("Feed generation error:", err);
        toast.error("Failed to generate personalized feed. Showing default laws.");
        setFetched((prev) => ({ ...prev, [currentTab]: true }));
      } finally {
        setLoading(false);
      }
    },
    [user, activeSpace, fetched]
  );

  // Reset feed when active space changes
  useEffect(() => {
    setAiLaws({ published: [], discussion: [] });
    setFetched({ published: false, discussion: false });
    setTimePeriodLaws([]);
    setRandomLaw(null);
  }, [activeSpace?.id]);

  useEffect(() => {
    fetchFeed(tab);
  }, [tab, fetchFeed]);

  const fetchTimePeriodLaws = async () => {
    if (!user || !activeSpace) return;
    if (!dateFrom && !dateTo && !selectedCategory) {
      toast.error("Please select at least a date range or category.");
      return;
    }
    setTimePeriodLoading(true);
    try {
      const body: Record<string, unknown> = {
        space_id: activeSpace.id,
        tab,
        force_refresh: true,
        mode: "time_period",
      };
      if (dateFrom) body.date_from = format(dateFrom, "yyyy-MM-dd");
      if (dateTo) body.date_to = format(dateTo, "yyyy-MM-dd");
      if (selectedCategory) body.category = selectedCategory;

      const { data, error } = await supabase.functions.invoke("generate-feed", {
        body,
      });
      if (error) throw error;
      if (Array.isArray(data?.laws) && data.laws.length > 0) {
        setTimePeriodLaws(data.laws as LawItem[]);
      } else {
        toast.warning("No laws found for that time period.");
        setTimePeriodLaws([]);
      }
    } catch {
      toast.error("Failed to fetch laws for that time period.");
    } finally {
      setTimePeriodLoading(false);
    }
  };

  const fetchRandomLaw = async () => {
    if (!user || !activeSpace) return;
    setRandomLoading(true);
    setRandomLaw(null);
    try {
      const { data, error } = await supabase.functions.invoke("generate-feed", {
        body: {
          space_id: activeSpace.id,
          tab,
          force_refresh: true,
          mode: "random",
        },
      });
      if (error) throw error;
      if (Array.isArray(data?.laws) && data.laws.length > 0) {
        setRandomLaw(data.laws[0] as LawItem);
      } else {
        toast.warning("Couldn't generate a random law. Try again!");
      }
    } catch {
      toast.error("Failed to generate random law.");
    } finally {
      setRandomLoading(false);
    }
  };

  const hasAiLaws = aiLaws[tab].length > 0;
  const fallbackLaws = allLaws.filter(
    (l) => l.status === (tab === "published" ? "Published" : "Under Discussion")
  );
  const laws = hasAiLaws ? aiLaws[tab] : fallbackLaws;
  const grouped = groupByCategory(laws);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="mx-auto max-w-3xl">
        <AppHeader />

        {/* Tab switcher */}
        <div className="px-5 mb-6 flex items-center gap-2">
          <div className="inline-flex rounded-full bg-muted p-1 flex-1 sm:flex-none">
            <button
              onClick={() => setTab("published")}
              className={`flex-1 sm:flex-none px-5 py-2 text-sm font-semibold rounded-full transition-all ${
                tab === "published"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Published
            </button>
            <button
              onClick={() => setTab("discussion")}
              className={`flex-1 sm:flex-none px-5 py-2 text-sm font-semibold rounded-full transition-all ${
                tab === "discussion"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Under Discussion
            </button>
          </div>

          {user && activeSpace && (
            <button
              onClick={() => fetchFeed(tab, true)}
              disabled={loading}
              className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50"
              title="Refresh feed"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          )}
        </div>

        <p className="px-5 text-xs text-muted-foreground mb-5">
          {tab === "published"
            ? "Recently enacted laws that affect you"
            : "Proposals and drafts being debated"}
          {hasAiLaws && activeSpace && (
            <span className="ml-1 text-primary font-medium">· Personalized for {activeSpace.name}</span>
          )}
        </p>

        {/* Main feed — loading or content */}
        {loading && !hasAiLaws ? (
          <LoadingState />
        ) : (
          Object.entries(grouped).map(([category, items]) => (
            <CategoryRow key={category} category={category} laws={items} />
          ))
        )}

        {/* Time Period Section */}
        <div className="px-5 mt-4 mb-8">
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-primary" />
              Browse Laws
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              Filter by date range, category, or both.
            </p>

            {/* Category chips */}
            <div className="mb-4">
              <label className="text-xs font-medium text-muted-foreground mb-2 block">Category</label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "All", "Housing", "Employment", "Tax", "Education", "Immigration",
                  "Healthcare", "Consumer Protection", "Digital Rights", "Social Benefits",
                  "Transportation", "Environment", "Family", "Finance", "Criminal Law",
                  "Data Privacy", "Energy", "Trade & Commerce", "Civil Rights", "Pensions"
                ].map((cat) => {
                  const isAll = cat === "All";
                  const isSelected = isAll ? !selectedCategory : selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(isAll ? "" : cat)}
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium transition-all",
                        isSelected
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
                      )}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date range */}
            <div className="flex flex-wrap gap-3 items-end mb-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">From</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className={cn("w-[150px] justify-start text-left font-normal", !dateFrom && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                      {dateFrom ? format(dateFrom, "MMM d, yyyy") : "Start date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus className="p-3 pointer-events-auto" />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">To</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className={cn("w-[150px] justify-start text-left font-normal", !dateTo && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                      {dateTo ? format(dateTo, "MMM d, yyyy") : "End date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={dateTo} onSelect={setDateTo} initialFocus className="p-3 pointer-events-auto" />
                  </PopoverContent>
                </Popover>
              </div>

              <Button size="sm" onClick={fetchTimePeriodLaws} disabled={timePeriodLoading || (!dateFrom && !dateTo && !selectedCategory)}>
                {timePeriodLoading ? <RefreshCw className="h-3.5 w-3.5 animate-spin mr-1" /> : null}
                Search
              </Button>
            </div>

            {timePeriodLoading && (
              <div className="text-center py-6">
                <Sparkles className="h-5 w-5 text-primary animate-pulse mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Time-traveling through legal archives… ⏳</p>
              </div>
            )}

            {!timePeriodLoading && timePeriodLaws.length > 0 && (
              <div className="space-y-3">
                {timePeriodLaws.map((law) => (
                  <div
                    key={law.slug}
                    onClick={() => navigate(`/law/${law.slug}`, { state: { law } })}
                    className="rounded-lg border border-border p-4 cursor-pointer hover:shadow-md hover:border-primary/30 transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <ImpactDots level={law.impact} />
                      <span className="text-[10px] text-muted-foreground">{law.date}</span>
                    </div>
                    <h4 className="text-sm font-bold text-card-foreground mb-1">{law.title}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-2">{law.summary}</p>
                    <ActiveBadge law={law} />
                    {law.activeStatusNote && (
                      <p className="text-[10px] text-muted-foreground mt-1">{law.activeStatusNote}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Random Law Section */}
        <div className="px-5 mb-8">
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
              <Shuffle className="h-4 w-4 text-primary" />
              Random Law Generator
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              Discover a random law relevant to your profile from any time period.
            </p>

            <Button size="sm" variant="outline" onClick={fetchRandomLaw} disabled={randomLoading}>
              {randomLoading ? <RefreshCw className="h-3.5 w-3.5 animate-spin mr-1" /> : <Shuffle className="h-3.5 w-3.5 mr-1" />}
              Surprise me!
            </Button>

            {randomLoading && (
              <div className="text-center py-6">
                <Sparkles className="h-5 w-5 text-primary animate-pulse mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Spinning the wheel of German law… 🎰</p>
              </div>
            )}

            {!randomLoading && randomLaw && (
              <div
                onClick={() => navigate(`/law/${randomLaw.slug}`, { state: { law: randomLaw } })}
                className="mt-4 rounded-lg border border-border p-4 cursor-pointer hover:shadow-md hover:border-primary/30 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <ImpactDots level={randomLaw.impact} />
                  <span className="text-[10px] text-muted-foreground">{randomLaw.date}</span>
                </div>
                <h4 className="text-sm font-bold text-card-foreground mb-1">{randomLaw.title}</h4>
                <p className="text-xs text-muted-foreground line-clamp-3">{randomLaw.summary}</p>
                <ActiveBadge law={randomLaw} />
                {randomLaw.activeStatusNote && (
                  <p className="text-[10px] text-muted-foreground mt-1">{randomLaw.activeStatusNote}</p>
                )}
                <div className="mt-3 flex items-center gap-0.5 text-xs font-semibold text-primary">
                  Read more <ChevronRight className="h-3.5 w-3.5" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Newsletter;
