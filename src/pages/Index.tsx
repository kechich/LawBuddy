import AppHeader from "@/components/AppHeader";
import LawSection from "@/components/LawSection";
import BottomNav from "@/components/BottomNav";
import { allLaws } from "@/lib/lawData";

const publishedLaws = allLaws
  .filter((l) => l.status === "Published")
  .map(({ slug, category, title, summary, date, status, impact }) => ({
    slug, category, title, summary, date, status, impact,
  }));

const discussionLaws = allLaws
  .filter((l) => l.status === "Under Discussion")
  .map(({ slug, category, title, summary, date, status, impact }) => ({
    slug, category, title, summary, date, status, impact,
  }));

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-lg">
        <AppHeader />
        <LawSection
          title="Published Laws"
          subtitle="Recently enacted laws that affect you"
          laws={publishedLaws}
        />
        <div className="mx-5 border-t border-border mb-6" />
        <LawSection
          title="Laws Under Discussion"
          subtitle="Proposals and drafts being debated"
          laws={discussionLaws}
        />
      </div>
      <BottomNav />
    </div>
  );
};

export default Index;
