interface ImpactDotsProps {
  level: "high" | "medium" | "low";
}

const ImpactDots = ({ level }: ImpactDotsProps) => {
  const count = level === "high" ? 3 : level === "medium" ? 2 : 1;
  const color =
    level === "high"
      ? "bg-impact-high"
      : level === "medium"
      ? "bg-impact-medium"
      : "bg-impact-low";
  const label = level === "high" ? "High impact" : level === "medium" ? "Medium impact" : "Low impact";

  return (
    <div className="flex items-center gap-1" title={label} aria-label={label}>
      {[1, 2, 3].map((dot) => (
        <span
          key={dot}
          className={`h-1.5 w-1.5 rounded-full ${
            dot <= count ? color : "bg-border"
          }`}
        />
      ))}
      <span className="text-[10px] text-muted-foreground ml-1 font-medium capitalize">
        {level}
      </span>
    </div>
  );
};

export default ImpactDots;
