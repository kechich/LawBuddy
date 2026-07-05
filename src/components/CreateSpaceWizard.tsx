import { useState, useMemo } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowRight, Sparkles, HelpCircle, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import NewsletterStep from "@/components/NewsletterStep";
import type { SpaceFormData } from "@/contexts/SpacesContext";

const TOTAL_STEPS = 9;

const emojis = ["🎓", "🏠", "💼", "🔧", "👨‍💻", "🇩🇪", "🌍", "⚖️", "📚", "🏢", "👶", "🧓", "🎯", "💡"];

// Bundesland → Cities mapping
const bundeslandCities: Record<string, string[]> = {
  "Bayern": ["Munich", "Nuremberg", "Augsburg", "Regensburg", "Würzburg", "Ingolstadt", "Fürth", "Erlangen"],
  "Baden-Württemberg": ["Stuttgart", "Mannheim", "Karlsruhe", "Freiburg", "Heidelberg", "Ulm", "Heilbronn", "Pforzheim"],
  "Berlin": ["Berlin"],
  "Brandenburg": ["Potsdam", "Cottbus", "Brandenburg an der Havel", "Frankfurt (Oder)"],
  "Bremen": ["Bremen", "Bremerhaven"],
  "Hamburg": ["Hamburg"],
  "Hessen": ["Frankfurt", "Wiesbaden", "Kassel", "Darmstadt", "Offenbach", "Marburg", "Gießen"],
  "Mecklenburg-Vorpommern": ["Rostock", "Schwerin", "Neubrandenburg", "Stralsund", "Greifswald"],
  "Niedersachsen": ["Hanover", "Braunschweig", "Oldenburg", "Osnabrück", "Wolfsburg", "Göttingen", "Hildesheim"],
  "Nordrhein-Westfalen": ["Cologne", "Düsseldorf", "Dortmund", "Essen", "Duisburg", "Bochum", "Wuppertal", "Bonn", "Münster", "Aachen"],
  "Rheinland-Pfalz": ["Mainz", "Ludwigshafen", "Koblenz", "Trier", "Kaiserslautern"],
  "Saarland": ["Saarbrücken", "Neunkirchen", "Homburg", "Völklingen"],
  "Sachsen": ["Dresden", "Leipzig", "Chemnitz", "Zwickau", "Freiberg"],
  "Sachsen-Anhalt": ["Magdeburg", "Halle", "Dessau-Roßlau", "Wittenberg"],
  "Schleswig-Holstein": ["Kiel", "Lübeck", "Flensburg", "Neumünster"],
  "Thüringen": ["Erfurt", "Jena", "Gera", "Weimar", "Gotha"],
};

const bundeslaender = Object.keys(bundeslandCities);

const roleOptions = [
  { value: "student", label: "Student", emoji: "🎓" },
  { value: "working_student", label: "Working Student", emoji: "📖" },
  { value: "full_time", label: "Full-time Employee", emoji: "💼" },
  { value: "freelancer", label: "Freelancer", emoji: "🧑‍💻" },
  { value: "unemployed", label: "Unemployed", emoji: "🔍" },
  { value: "parent", label: "Parent", emoji: "👶" },
  { value: "senior", label: "Senior", emoji: "🧓" },
  { value: "immigrant", label: "Immigrant", emoji: "🌍" },
];

const housingOptions = [
  { value: "rent_apartment", label: "Rent Apartment", emoji: "🏢" },
  { value: "own_home", label: "Own Home", emoji: "🏡" },
  { value: "shared_flat", label: "Shared Flat (WG)", emoji: "👥" },
  { value: "student_dorm", label: "Student Dorm", emoji: "🏫" },
  { value: "temporary", label: "Temporary Housing", emoji: "🏨" },
];

const workStudyOptions = [
  { value: "university", label: "University" },
  { value: "part_time_job", label: "Part-time Job" },
  { value: "side_job", label: "Side Job (Minijob)" },
  { value: "tutoring", label: "Tutoring" },
  { value: "internship", label: "Internship" },
  { value: "looking_for_work", label: "Looking for Work" },
  { value: "full_time_work", label: "Full-time Work" },
  { value: "self_employed", label: "Self-employed" },
];

const concernOptions = [
  { value: "rent_prices", label: "Rent Prices", emoji: "🏠" },
  { value: "student_benefits", label: "Student Benefits", emoji: "🎓" },
  { value: "job_regulations", label: "Job Regulations", emoji: "📋" },
  { value: "transport_costs", label: "Transport Costs", emoji: "🚌" },
  { value: "healthcare", label: "Healthcare", emoji: "🏥" },
  { value: "taxes", label: "Taxes", emoji: "💰" },
  { value: "immigration_rules", label: "Immigration Rules", emoji: "🛂" },
  { value: "family_benefits", label: "Family Benefits", emoji: "👨‍👩‍👧" },
  { value: "digital_rights", label: "Digital Rights", emoji: "🔒" },
  { value: "environment", label: "Environment", emoji: "🌱" },
];

const WhyTooltip = ({ text }: { text: string }) => (
  <TooltipProvider delayDuration={200}>
    <Tooltip>
      <TooltipTrigger asChild>
        <button type="button" className="ml-1.5 inline-flex text-muted-foreground hover:text-foreground transition-colors">
          <HelpCircle className="h-3.5 w-3.5" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-[220px] text-xs">
        {text}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const ChipSelect = ({
  options,
  selected,
  onToggle,
  max,
}: {
  options: { value: string; label: string; emoji?: string; desc?: string }[];
  selected: string[];
  onToggle: (val: string) => void;
  max?: number;
}) => (
  <div className="grid grid-cols-2 gap-2">
    {options.map((opt) => {
      const isSelected = selected.includes(opt.value);
      const isDisabled = !isSelected && max !== undefined && selected.length >= max;
      return (
        <button
          key={opt.value}
          type="button"
          disabled={isDisabled}
          onClick={() => onToggle(opt.value)}
          className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-all text-left ${
            isSelected
              ? "border-primary bg-primary/5 text-foreground ring-1 ring-primary"
              : isDisabled
              ? "border-border bg-muted/30 text-muted-foreground/50 cursor-not-allowed"
              : "border-border bg-background text-muted-foreground hover:border-foreground/20 hover:text-foreground"
          }`}
        >
          {opt.emoji && <span className="text-base shrink-0">{opt.emoji}</span>}
          <div>
            <span>{opt.label}</span>
            {opt.desc && <span className="block text-[11px] text-muted-foreground">{opt.desc}</span>}
          </div>
        </button>
      );
    })}
  </div>
);

/** A chip-select that includes a "Custom" option with a text input */
const ChipSelectWithCustom = ({
  options,
  selected,
  onToggle,
  customValues,
  onAddCustom,
  onRemoveCustom,
  max,
  customPlaceholder = "Add your own…",
}: {
  options: { value: string; label: string; emoji?: string }[];
  selected: string[];
  onToggle: (val: string) => void;
  customValues: string[];
  onAddCustom: (val: string) => void;
  onRemoveCustom: (val: string) => void;
  max?: number;
  customPlaceholder?: string;
}) => {
  const [showInput, setShowInput] = useState(false);
  const [inputVal, setInputVal] = useState("");

  const allSelected = [...selected, ...customValues];
  const atMax = max !== undefined && allSelected.length >= max;

  const handleAdd = () => {
    const v = inputVal.trim();
    if (v && !customValues.includes(v)) {
      onAddCustom(v);
      setInputVal("");
      setShowInput(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        {options.map((opt) => {
          const isSelected = selected.includes(opt.value);
          const isDisabled = !isSelected && atMax;
          return (
            <button
              key={opt.value}
              type="button"
              disabled={isDisabled}
              onClick={() => onToggle(opt.value)}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-all text-left ${
                isSelected
                  ? "border-primary bg-primary/5 text-foreground ring-1 ring-primary"
                  : isDisabled
                  ? "border-border bg-muted/30 text-muted-foreground/50 cursor-not-allowed"
                  : "border-border bg-background text-muted-foreground hover:border-foreground/20 hover:text-foreground"
              }`}
            >
              {opt.emoji && <span className="text-base shrink-0">{opt.emoji}</span>}
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>

      {/* Custom values as chips */}
      {customValues.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {customValues.map((cv) => (
            <span
              key={cv}
              className="inline-flex items-center gap-1 rounded-full border border-primary bg-primary/5 px-3 py-1 text-xs font-medium text-foreground"
            >
              {cv}
              <button type="button" onClick={() => onRemoveCustom(cv)} className="ml-0.5 text-muted-foreground hover:text-destructive">×</button>
            </span>
          ))}
        </div>
      )}

      {/* Add custom */}
      {!atMax && (
        showInput ? (
          <div className="flex gap-2">
            <Input
              className="h-9 text-sm"
              placeholder={customPlaceholder}
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAdd(); } }}
              autoFocus
            />
            <Button type="button" size="sm" variant="outline" onClick={handleAdd} disabled={!inputVal.trim()}>Add</Button>
            <Button type="button" size="sm" variant="ghost" onClick={() => { setShowInput(false); setInputVal(""); }}>✕</Button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowInput(true)}
            className="flex items-center gap-1.5 rounded-lg border border-dashed border-border px-3 py-2.5 text-sm text-muted-foreground hover:border-foreground/20 hover:text-foreground transition-all w-full"
          >
            <Plus className="h-3.5 w-3.5" />
            Add custom
          </button>
        )
      )}
    </div>
  );
};

interface Props {
  onComplete: (data: SpaceFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<SpaceFormData>;
  saving?: boolean;
}

const CreateSpaceWizard = ({ onComplete, onCancel, initialData, saving }: Props) => {
  const [step, setStep] = useState(1);
  const [spaceName, setSpaceName] = useState(initialData?.name || "");
  const [emoji, setEmoji] = useState(initialData?.emoji || "");
  const [city, setCity] = useState(initialData?.city || "");
  const [customCity, setCustomCity] = useState("");
  const [bundesland, setBundesland] = useState(initialData?.bundesland || "");
  const [primaryRoles, setPrimaryRoles] = useState<string[]>(initialData?.primary_roles || []);
  const [customRoles, setCustomRoles] = useState<string[]>([]);
  const [housing, setHousing] = useState<string[]>(initialData?.housing_situation || []);
  const [customHousing, setCustomHousing] = useState<string[]>([]);
  const [workStudy, setWorkStudy] = useState<string[]>(initialData?.work_study_status || []);
  const [customWorkStudy, setCustomWorkStudy] = useState<string[]>([]);
  const [concerns, setConcerns] = useState<string[]>(initialData?.key_concerns || []);
  const [customConcerns, setCustomConcerns] = useState<string[]>([]);
  const [incomeLower, setIncomeLower] = useState("");
  const [incomeUpper, setIncomeUpper] = useState("");
  const [customInstructions, setCustomInstructions] = useState(initialData?.custom_instructions || "");
  const [newsletterEnabled, setNewsletterEnabled] = useState(false);
  const [newsletterFrequency, setNewsletterFrequency] = useState("weekly");

  // Parse initial income_level if present (format: "1500" or "1500-3000")
  useState(() => {
    if (initialData?.income_level) {
      const parts = initialData.income_level.split("-");
      if (parts.length === 2) {
        setIncomeLower(parts[0]);
        setIncomeUpper(parts[1]);
      } else {
        setIncomeLower(parts[0]);
      }
    }
  });

  const toggleArray = (arr: string[], val: string, setter: (v: string[]) => void) => {
    setter(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);
  };

  const resolvedCity = city === "__other" ? customCity.trim() : city;
  const availableCities = bundesland ? (bundeslandCities[bundesland] || []) : [];

  const allRoles = [...primaryRoles, ...customRoles];
  const allHousing = [...housing, ...customHousing];
  const allWorkStudy = [...workStudy, ...customWorkStudy];
  const allConcerns = [...concerns, ...customConcerns];

  const canNext = useMemo(() => {
    switch (step) {
      case 1: return spaceName.trim().length > 0;
      case 2: return bundesland.length > 0 && resolvedCity.length > 0;
      case 3: return allRoles.length >= 1;
      case 4: return allHousing.length >= 1;
      case 5: return true;
      case 6: return allConcerns.length >= 2;
      case 7: return true;
      case 8: return true;
      case 9: return true;
      default: return false;
    }
  }, [step, spaceName, bundesland, resolvedCity, allRoles, allHousing, allConcerns]);

  const progress = (step / TOTAL_STEPS) * 100;

  const previewText = useMemo(() => {
    const parts: string[] = [];
    if (resolvedCity) parts.push(resolvedCity);
    const roleLabels = allRoles.map((r) => roleOptions.find((o) => o.value === r)?.label || r).filter(Boolean);
    if (roleLabels.length) parts.push(roleLabels.join(" & ").toLowerCase());
    const housingLabels = allHousing.map((h) => housingOptions.find((o) => o.value === h)?.label?.toLowerCase() || h).filter(Boolean);
    if (housingLabels.length) parts.push(`in ${housingLabels[0]}`);
    if (parts.length === 0) return "";
    return `This space will track laws affecting ${parts.join(" ")}s`;
  }, [resolvedCity, allRoles, allHousing]);

  const buildIncomeLevel = () => {
    const lo = incomeLower.trim();
    const hi = incomeUpper.trim();
    if (!lo && !hi) return undefined;
    if (lo && hi) return `${lo}-${hi}`;
    return lo || hi;
  };

  const handleSubmit = () => {
    const data: SpaceFormData = {
      name: spaceName.trim(),
      emoji: emoji || undefined,
      city: resolvedCity || undefined,
      bundesland: bundesland || undefined,
      primary_roles: allRoles.length ? allRoles : undefined,
      persona_type: allRoles[0] || undefined,
      housing_situation: allHousing.length ? allHousing : undefined,
      work_study_status: allWorkStudy.length ? allWorkStudy : undefined,
      key_concerns: allConcerns.length ? allConcerns : undefined,
      income_level: buildIncomeLevel(),
      custom_instructions: customInstructions.trim() || undefined,
      newsletter_enabled: newsletterEnabled,
      newsletter_frequency: newsletterEnabled ? newsletterFrequency : undefined,
    };
    onComplete(data);
  };

  const next = () => { if (step < TOTAL_STEPS) setStep(step + 1); else handleSubmit(); };
  const back = () => { if (step > 1) setStep(step - 1); else onCancel(); };

  const stepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-5">
            <div>
              <Label className="text-sm font-medium">Space Name</Label>
              <WhyTooltip text="Give your space a memorable name that reflects your life context." />
              <Input
                className="mt-2"
                placeholder="e.g. Student Renter Munich"
                value={spaceName}
                onChange={(e) => setSpaceName(e.target.value)}
                autoFocus
              />
            </div>
            <div>
              <Label className="text-sm font-medium">Pick an emoji</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {emojis.map((e) => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => setEmoji(emoji === e ? "" : e)}
                    className={`h-10 w-10 rounded-lg text-xl flex items-center justify-center transition-all ${
                      emoji === e ? "bg-primary/10 ring-2 ring-primary" : "bg-muted/50 hover:bg-muted"
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            {/* Bundesland first */}
            <div>
              <Label className="text-sm font-medium">Bundesland (State)</Label>
              <WhyTooltip text="State-level laws vary significantly across Germany." />
              <div className="mt-2 grid grid-cols-2 gap-2 max-h-[160px] overflow-y-auto scrollbar-hide">
                {bundeslaender.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => {
                      if (bundesland === b) {
                        setBundesland("");
                        setCity("");
                      } else {
                        setBundesland(b);
                        setCity("");
                        setCustomCity("");
                      }
                    }}
                    className={`rounded-lg border px-3 py-2 text-sm transition-all ${
                      bundesland === b ? "border-primary bg-primary/5 text-foreground ring-1 ring-primary" : "border-border text-muted-foreground hover:border-foreground/20 hover:text-foreground"
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* City selection — only after Bundesland is chosen */}
            {bundesland && (
              <div>
                <Label className="text-sm font-medium">City in {bundesland}</Label>
                <WhyTooltip text="Local laws differ by city. We use this to show relevant regulations." />
                <div className="mt-2 grid grid-cols-2 gap-2 max-h-[140px] overflow-y-auto scrollbar-hide">
                  {availableCities.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => { setCity(c); setCustomCity(""); }}
                      className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-all ${
                        city === c ? "border-primary bg-primary/5 text-foreground ring-1 ring-primary" : "border-border text-muted-foreground hover:border-foreground/20 hover:text-foreground"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setCity("__other")}
                    className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-all ${
                      city === "__other" ? "border-primary bg-primary/5 text-foreground ring-1 ring-primary" : "border-border text-muted-foreground hover:border-foreground/20 hover:text-foreground"
                    }`}
                  >
                    Other…
                  </button>
                </div>
                {city === "__other" && (
                  <Input className="mt-2" placeholder="Enter your city" value={customCity} onChange={(e) => setCustomCity(e.target.value)} autoFocus />
                )}
              </div>
            )}
          </div>
        );
      case 3:
        return (
          <div>
            <Label className="text-sm font-medium">Primary Role</Label>
            <WhyTooltip text="We use your role to surface laws that directly impact your daily life." />
            <p className="text-xs text-muted-foreground mt-1 mb-3">Pick 1–2 that describe you best, or add your own</p>
            <ChipSelectWithCustom
              options={roleOptions}
              selected={primaryRoles}
              onToggle={(v) => toggleArray(primaryRoles, v, setPrimaryRoles)}
              customValues={customRoles}
              onAddCustom={(v) => setCustomRoles([...customRoles, v])}
              onRemoveCustom={(v) => setCustomRoles(customRoles.filter((x) => x !== v))}
              max={2}
              customPlaceholder="e.g. Researcher"
            />
          </div>
        );
      case 4:
        return (
          <div>
            <Label className="text-sm font-medium">Housing Situation</Label>
            <WhyTooltip text="Housing laws differ based on whether you rent, own, or live in shared housing." />
            <p className="text-xs text-muted-foreground mt-1 mb-3">Select all that apply, or add your own</p>
            <ChipSelectWithCustom
              options={housingOptions}
              selected={housing}
              onToggle={(v) => toggleArray(housing, v, setHousing)}
              customValues={customHousing}
              onAddCustom={(v) => setCustomHousing([...customHousing, v])}
              onRemoveCustom={(v) => setCustomHousing(customHousing.filter((x) => x !== v))}
              customPlaceholder="e.g. Living with family"
            />
          </div>
        );
      case 5:
        return (
          <div>
            <Label className="text-sm font-medium">Work & Study Status</Label>
            <WhyTooltip text="Employment and education status determines which regulations and benefits apply." />
            <p className="text-xs text-muted-foreground mt-1 mb-3">Select all that apply, or add your own (optional)</p>
            <ChipSelectWithCustom
              options={workStudyOptions}
              selected={workStudy}
              onToggle={(v) => toggleArray(workStudy, v, setWorkStudy)}
              customValues={customWorkStudy}
              onAddCustom={(v) => setCustomWorkStudy([...customWorkStudy, v])}
              onRemoveCustom={(v) => setCustomWorkStudy(customWorkStudy.filter((x) => x !== v))}
              customPlaceholder="e.g. Volunteer work"
            />
          </div>
        );
      case 6:
        return (
          <div>
            <Label className="text-sm font-medium">Key Concerns</Label>
            <WhyTooltip text="We prioritize laws based on what matters most to you." />
            <p className="text-xs text-muted-foreground mt-1 mb-3">Pick 2–5 topics you care about, or add your own</p>
            <ChipSelectWithCustom
              options={concernOptions}
              selected={concerns}
              onToggle={(v) => toggleArray(concerns, v, setConcerns)}
              customValues={customConcerns}
              onAddCustom={(v) => setCustomConcerns([...customConcerns, v])}
              onRemoveCustom={(v) => setCustomConcerns(customConcerns.filter((x) => x !== v))}
              max={5}
              customPlaceholder="e.g. Childcare costs"
            />
          </div>
        );
      case 7:
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Income Level</Label>
              <WhyTooltip text="Many benefits and regulations are income-dependent." />
              <p className="text-xs text-muted-foreground mt-1 mb-3">Enter your monthly income — use both fields for a range, or just one for an exact amount (optional)</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Lower bound (€/month)</Label>
                <Input
                  type="number"
                  placeholder="e.g. 800"
                  value={incomeLower}
                  onChange={(e) => setIncomeLower(e.target.value)}
                  min={0}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Upper bound (€/month)</Label>
                <Input
                  type="number"
                  placeholder="e.g. 2000"
                  value={incomeUpper}
                  onChange={(e) => setIncomeUpper(e.target.value)}
                  min={0}
                />
              </div>
            </div>
            {(incomeLower || incomeUpper) && (
              <p className="text-xs text-muted-foreground">
                {incomeLower && incomeUpper
                  ? `Range: €${incomeLower} – €${incomeUpper}/month`
                  : incomeLower
                  ? `Exact: €${incomeLower}/month`
                  : `Up to: €${incomeUpper}/month`}
              </p>
            )}
          </div>
        );
      case 8:
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Custom Instructions</Label>
              <WhyTooltip text="Give specific guidance like 'Focus on Munich student housing laws' or 'Track visa rule changes'." />
              <Textarea
                className="mt-2 min-h-[80px]"
                placeholder="e.g. Focus on Munich student housing laws and BAföG changes"
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
              />
            </div>
            {previewText && (
              <div className="rounded-lg border border-accent/30 bg-accent/5 p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground mb-1">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Preview
                </div>
                <p className="text-sm text-muted-foreground">{previewText}</p>
              </div>
            )}
          </div>
        );
      case 9:
        return (
          <NewsletterStep
            enabled={newsletterEnabled}
            frequency={newsletterFrequency}
            onEnabledChange={setNewsletterEnabled}
            onFrequencyChange={setNewsletterFrequency}
          />
        );
    }
  };

  const stepTitles = [
    "Name Your Space",
    "Set Your Location",
    "Choose Your Role",
    "Housing Situation",
    "Work & Study",
    "Key Concerns",
    "Income Level",
    "Custom Instructions",
    "Email Updates",
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Step {step} of {TOTAL_STEPS}</span>
          <span>{stepTitles[step - 1]}</span>
        </div>
        <Progress value={progress} className="h-1.5" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="min-h-[280px]"
        >
          {stepContent()}
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between pt-2">
        <Button variant="ghost" size="sm" onClick={back} className="gap-1">
          <ArrowLeft className="h-3.5 w-3.5" />
          {step === 1 ? "Cancel" : "Back"}
        </Button>
        <Button
          size="sm"
          onClick={next}
          disabled={!canNext || saving}
          className="gap-1 rounded-md px-6"
        >
          {step === TOTAL_STEPS ? (saving ? "Creating…" : "Create Space") : "Next"}
          {step < TOTAL_STEPS && !saving && <ArrowRight className="h-3.5 w-3.5" />}
        </Button>
      </div>
    </div>
  );
};

export default CreateSpaceWizard;
