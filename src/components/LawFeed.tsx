import FeedCard from "./FeedCard";

const feedItems = [
  {
    category: "Student Work",
    title: "Mini-Job Threshold Rises to €556/month",
    summary:
      "Starting July, the earnings cap for tax-free mini-jobs increases again — affecting over 7 million workers in Germany.",
    relevance: "High" as const,
    date: "Apr 8, 2026",
  },
  {
    category: "Mobility",
    title: "Deutschlandticket Price Locked Through 2027",
    summary:
      "A new federal-state agreement freezes the €49 transit pass price for another 18 months, avoiding a planned hike to €59.",
    relevance: "High" as const,
    date: "Apr 6, 2026",
  },
  {
    category: "Taxes",
    title: "Student Tax Filing Deadline Extended Nationally",
    summary:
      "A new regulation gives students an automatic 2-month extension for voluntary income tax returns, now due October 31.",
    relevance: "Medium" as const,
    date: "Apr 4, 2026",
  },
  {
    category: "Public Benefits",
    title: "BAföG Reform: Higher Rates & Looser Eligibility",
    summary:
      "Monthly support rises by 5%, and the parental income threshold is raised — meaning more students now qualify.",
    relevance: "High" as const,
    date: "Apr 2, 2026",
  },
  {
    category: "Housing",
    title: "Munich Expands Tenant Advisory Services",
    summary:
      "The city will fund 12 new Mieterverein walk-in clinics across neighborhoods with high renter populations.",
    relevance: "Medium" as const,
    date: "Mar 30, 2026",
  },
];

const LawFeed = () => {
  return (
    <section className="px-5 pb-28">
      <h2 className="text-lg font-bold text-foreground mb-4">New for you</h2>
      <div className="flex flex-col gap-3">
        {feedItems.map((item, i) => (
          <FeedCard key={i} {...item} />
        ))}
      </div>
    </section>
  );
};

export default LawFeed;
