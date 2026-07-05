import LawCard from "./LawCard";

interface Law {
  slug: string;
  category: string;
  title: string;
  summary: string;
  date: string;
  status: "Published" | "Under Discussion";
  impact: "high" | "medium" | "low";
}

interface LawSectionProps {
  title: string;
  subtitle: string;
  laws: Law[];
}

const LawSection = ({ title, subtitle, laws }: LawSectionProps) => {
  const grouped = laws.reduce<Record<string, Law[]>>((acc, law) => {
    if (!acc[law.category]) acc[law.category] = [];
    acc[law.category].push(law);
    return acc;
  }, {});

  return (
    <section className="px-5 pb-8">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-foreground">{title}</h2>
        <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
      </div>
      <div className="flex flex-col gap-6">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category}>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-accent mb-2.5">
              {category}
            </h3>
            <div className="flex flex-col gap-2.5">
              {items.map((item, i) => (
                <LawCard key={i} {...item} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LawSection;
