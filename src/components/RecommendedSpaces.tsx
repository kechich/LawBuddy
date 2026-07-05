import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { SpaceFormData } from "@/contexts/SpacesContext";

interface RecommendedSpace {
  id: string;
  emoji: string;
  name: string;
  description: string;
  tags: string[];
  data: SpaceFormData;
}

const recommendedSpaces: RecommendedSpace[] = [
  {
    id: "intl-student-munich",
    emoji: "🎓",
    name: "Int'l Student Munich",
    description: "BAföG, visa rules, student housing caps, semester ticket laws",
    tags: ["Student", "Immigration", "Munich"],
    data: {
      name: "Int'l Student Munich",
      emoji: "🎓",
      bundesland: "Bayern",
      city: "München",
      primary_roles: ["Student", "Immigrant"],
      housing_situation: ["Student dorm", "Shared flat"],
      work_study_status: ["University"],
      key_concerns: ["Student benefits", "Immigration rules", "Rent prices", "Transport costs"],
      income_level: "0-1000",
    },
  },
  {
    id: "berlin-freelancer",
    emoji: "💻",
    name: "Berlin Tech Freelancer",
    description: "Freelance tax rules, Kleinunternehmer, health insurance, co-working deductions",
    tags: ["Freelancer", "Taxes", "Berlin"],
    data: {
      name: "Berlin Tech Freelancer",
      emoji: "💻",
      bundesland: "Berlin",
      city: "Berlin",
      primary_roles: ["Freelancer"],
      housing_situation: ["Rent apartment"],
      work_study_status: ["Freelance / Self-employed"],
      key_concerns: ["Taxes", "Healthcare", "Job regulations"],
      income_level: "2000-5000",
    },
  },
  {
    id: "young-parent-hamburg",
    emoji: "👶",
    name: "Young Parent Hamburg",
    description: "Elterngeld, Kindergeld, Kita subsidies, parental leave rights",
    tags: ["Parent", "Family", "Hamburg"],
    data: {
      name: "Young Parent Hamburg",
      emoji: "👶",
      bundesland: "Hamburg",
      city: "Hamburg",
      primary_roles: ["Parent", "Full-time Employee"],
      housing_situation: ["Rent apartment"],
      work_study_status: ["Full-time employment"],
      key_concerns: ["Family benefits", "Healthcare", "Rent prices"],
      income_level: "3000-5000",
    },
  },
  {
    id: "minijob-renter-nrw",
    emoji: "🏠",
    name: "Minijob Renter NRW",
    description: "Mietpreisbremse, Wohngeld, 520€ job rules, Bürgergeld eligibility",
    tags: ["Low income", "Renter", "NRW"],
    data: {
      name: "Minijob Renter NRW",
      emoji: "🏠",
      bundesland: "Nordrhein-Westfalen",
      city: "Köln",
      primary_roles: ["Unemployed"],
      housing_situation: ["Rent apartment"],
      work_study_status: ["Part-time job", "Looking for work"],
      key_concerns: ["Rent prices", "Job regulations", "Healthcare", "Transport costs"],
      income_level: "0-520",
    },
  },
  {
    id: "expat-frankfurt-finance",
    emoji: "🏦",
    name: "Expat Finance Frankfurt",
    description: "Double taxation treaties, residence permits, Aufenthaltstitel, banking regulations",
    tags: ["Immigrant", "High income", "Frankfurt"],
    data: {
      name: "Expat Finance Frankfurt",
      emoji: "🏦",
      bundesland: "Hessen",
      city: "Frankfurt am Main",
      primary_roles: ["Full-time Employee", "Immigrant"],
      housing_situation: ["Rent apartment"],
      work_study_status: ["Full-time employment"],
      key_concerns: ["Taxes", "Immigration rules", "Healthcare", "Rent prices"],
      income_level: "5000-10000",
    },
  },
  {
    id: "senior-retiree-bayern",
    emoji: "🌿",
    name: "Retiree Bavaria",
    description: "Pension law changes, Pflegeversicherung, property tax, senior discounts",
    tags: ["Senior", "Healthcare", "Bayern"],
    data: {
      name: "Retiree Bavaria",
      emoji: "🌿",
      bundesland: "Bayern",
      city: "Nürnberg",
      primary_roles: ["Senior"],
      housing_situation: ["Own home"],
      work_study_status: [],
      key_concerns: ["Healthcare", "Taxes", "Transport costs"],
      income_level: "1500-3000",
    },
  },
];

interface Props {
  onAdd: (data: SpaceFormData) => Promise<void>;
  existingNames: string[];
}

export default function RecommendedSpaces({ onAdd, existingNames }: Props) {
  const [addingId, setAddingId] = useState<string | null>(null);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const alreadyOwned = (name: string) => existingNames.some((n) => n.toLowerCase() === name.toLowerCase());

  const handleAdd = async (space: RecommendedSpace) => {
    if (addedIds.has(space.id) || alreadyOwned(space.name)) return;
    setAddingId(space.id);
    try {
      await onAdd(space.data);
      setAddedIds((prev) => new Set(prev).add(space.id));
      toast({ title: "Space added!", description: `"${space.name}" is ready in your arsenal.` });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setAddingId(null);
    }
  };

  return (
    <section className="mt-10">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-primary" />
        <h2 className="font-serif text-lg font-semibold text-foreground">Recommended for you</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Pre-built expert spaces — add one instantly and start tracking laws that matter.
      </p>

      <div className="flex gap-3 overflow-x-auto pb-3 -mx-5 px-5 snap-x snap-mandatory scrollbar-hide">
        {recommendedSpaces.map((space, i) => {
          const owned = alreadyOwned(space.name) || addedIds.has(space.id);
          const isAdding = addingId === space.id;

          return (
            <motion.div
              key={space.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="snap-start shrink-0 w-[260px]"
            >
              <div className="relative flex flex-col justify-between h-full rounded-xl border border-border bg-card p-4 shadow-sm hover:shadow-md transition-shadow">
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-3xl leading-none">{space.emoji}</span>
                    <Button
                      size="sm"
                      variant={owned ? "secondary" : "default"}
                      className="rounded-full h-8 px-3 text-xs gap-1"
                      disabled={owned || isAdding}
                      onClick={() => handleAdd(space)}
                    >
                      {owned ? (
                        <>
                          <Check className="h-3.5 w-3.5" /> Added
                        </>
                      ) : isAdding ? (
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                      ) : (
                        <>
                          <Plus className="h-3.5 w-3.5" /> Add
                        </>
                      )}
                    </Button>
                  </div>
                  <h3 className="font-semibold text-sm text-foreground mb-1">{space.name}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3">{space.description}</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {space.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
