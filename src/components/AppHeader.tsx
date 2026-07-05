import { useAuth } from "@/contexts/AuthContext";
import { useSpaces } from "@/contexts/SpacesContext";
import SpaceSwitcher from "@/components/SpaceSwitcher";
import { Bell, User, Home } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const AppHeader = () => {
  const { profile, signOut, user } = useAuth();
  const { activeSpace } = useSpaces();
  const navigate = useNavigate();
  const [lawCount, setLawCount] = useState<number | null>(null);
  const [lawTitles, setLawTitles] = useState<string[]>([]);

  const today = new Date().toLocaleDateString("en-DE", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const subtitle = activeSpace?.city
    ? `Laws for you in ${activeSpace.city}`
    : "Your personalized feed";

  const initials = profile?.full_name
    ? profile.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const handleSignOut = async () => {
    await signOut();
    navigate("/", { replace: true });
  };

  // Fetch cached laws from the past week for the active space
  useEffect(() => {
    if (!user || !activeSpace) {
      setLawCount(null);
      setLawTitles([]);
      return;
    }

    const fetchRecentLaws = async () => {
      // Fetch all cached laws for this space (any tab)
      const { data } = await supabase
        .from("feed_cache")
        .select("laws_json")
        .eq("space_id", activeSpace.id);

      if (data && data.length > 0) {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        // Filter laws by their actual date field, not cache creation time
        const recentLaws: { title: string }[] = [];
        for (const row of data) {
          if (Array.isArray(row.laws_json)) {
            for (const law of row.laws_json as { title?: string; date?: string; effectiveDate?: string }[]) {
              if (!law?.title || !law?.date) continue;
              // Parse the law's date (format: "Mon DD, YYYY" or similar)
              const lawDate = new Date(law.date);
              // Also check effectiveDate
              const effectiveDate = law.effectiveDate ? new Date(law.effectiveDate) : null;
              const relevantDate = effectiveDate && effectiveDate > lawDate ? effectiveDate : lawDate;

              if (!isNaN(relevantDate.getTime()) && relevantDate >= oneWeekAgo) {
                recentLaws.push({ title: law.title });
              }
            }
          }
        }
        setLawCount(recentLaws.length);
        setLawTitles(recentLaws.slice(0, 2).map((l) => l.title));
      } else {
        setLawCount(0);
        setLawTitles([]);
      }
    };

    fetchRecentLaws();
  }, [user, activeSpace]);

  const bannerText =
    lawCount === null
      ? null
      : lawCount === 0
      ? "No new updates this week — check back soon!"
      : lawCount === 1
      ? "1 new law affects you this week"
      : `${lawCount} new laws affect you this week`;

  const bannerSubtext =
    lawTitles.length > 0
      ? `${lawTitles.join(" & ")}${lawCount && lawCount > 2 ? ` + ${lawCount - 2} more` : ""} — tap to read more.`
      : "Refresh your feed to see the latest.";

  return (
    <header className="px-5 pt-6 pb-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
            aria-label="Back to home"
          >
            <Home className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Law Buddy
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">{today}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <SpaceSwitcher />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold ring-1 ring-border hover:ring-primary/50 transition-all">
                {initials}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <div className="px-3 py-2">
                <p className="text-sm font-medium text-foreground truncate">{profile?.full_name || "User"}</p>
                <p className="text-xs text-muted-foreground truncate">{profile?.city || ""}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/settings")}>
                <User className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-3">{subtitle}</p>

      {/* Alert banner — dynamic */}
      <div className="mt-4 flex items-start gap-3 rounded-xl border border-accent/20 bg-accent/5 px-4 py-3">
        <Bell className="h-4 w-4 text-accent mt-0.5 shrink-0" />
        {lawCount === null ? (
          <div className="space-y-1.5 flex-1">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-56" />
          </div>
        ) : (
          <div>
            <p className="text-sm font-semibold text-foreground">{bannerText}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{bannerSubtext}</p>
          </div>
        )}
      </div>
    </header>
  );
};

export default AppHeader;
