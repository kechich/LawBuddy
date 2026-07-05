import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSpaces } from "@/contexts/SpacesContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, ArrowLeft, Building2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const industries = ["Tech", "Legal", "Healthcare", "Retail", "Finance", "Manufacturing", "Other"];
const companySizes = ["1-10", "11-50", "51-200", "200+"];
const businessTypes = ["GmbH", "AG", "Startup", "Freelancer", "Non-profit"];
const employeeRoleOptions = ["Management", "HR", "Legal/Compliance", "Finance", "Developers", "Sales", "Operations"];
const regulatoryConcerns = ["Labor laws", "Tax changes", "Data privacy (DSGVO)", "Environmental", "Health/safety", "Import/export"];
const revenueModels = ["B2B", "B2C", "Subscription", "One-time sales"];
const contractTypes = ["Employees", "Suppliers", "Customers", "Landlords"];

const TOTAL_STEPS = 4;

const BusinessOnboarding = () => {
  const { profile, updateProfile } = useAuth();
  const { spaces, loading: spacesLoading, createSpace } = useSpaces();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Step 1: Basics
  const [companyName, setCompanyName] = useState(profile?.company_name || "");
  const [industry, setIndustry] = useState(profile?.industry || "");
  const [companySize, setCompanySize] = useState(profile?.company_size || "");
  const [city, setCity] = useState(profile?.city || "");

  // Step 2: Business identity
  const [businessType, setBusinessType] = useState("");

  // Step 3: Multi-select
  const [employeeRoles, setEmployeeRoles] = useState<string[]>([]);
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);
  const [selectedRevenue, setSelectedRevenue] = useState<string[]>([]);
  const [selectedContracts, setSelectedContracts] = useState<string[]>([]);

  // Step 4: Custom instructions
  const [customInstructions, setCustomInstructions] = useState("");

  useEffect(() => {
    if (!spacesLoading && profile?.account_type === "business" && profile?.company_name && spaces.length > 0) {
      navigate("/feed", { replace: true });
    }
  }, [spacesLoading, profile, spaces, navigate]);

  const toggleItem = (arr: string[], setArr: (v: string[]) => void, item: string) => {
    setArr(arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item]);
  };

  const canProceed = () => {
    switch (step) {
      case 1: return companyName.trim() && industry && companySize && city.trim();
      case 2: return !!businessType;
      case 3: return employeeRoles.length > 0 && selectedConcerns.length > 0;
      case 4: return true;
      default: return false;
    }
  };

  const handleSubmit = async () => {
    setSaving(true);
    setError("");
    try {
      await updateProfile({
        full_name: profile?.full_name || companyName.trim(),
        company_name: companyName.trim(),
        industry,
        company_size: companySize,
        city: city.trim(),
      });

      await createSpace({
        name: companyName.trim(),
        emoji: "🏢",
        city: city.trim(),
        key_concerns: selectedConcerns,
        custom_instructions: customInstructions.trim() || undefined,
        primary_roles: employeeRoles,
        // Extra business fields stored via extended SpaceFormData
        business_type: businessType,
        employee_roles: employeeRoles,
        regulatory_concerns: selectedConcerns,
        revenue_model: selectedRevenue,
        contracts_affected: selectedContracts,
        company_size: companySize,
      } as any);

      navigate("/feed", { replace: true });
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const next = () => {
    if (step === TOTAL_STEPS) {
      handleSubmit();
    } else {
      setStep((s) => s + 1);
    }
  };

  const ChipSelect = ({
    options,
    selected,
    onToggle,
    multi = false,
  }: {
    options: string[];
    selected: string | string[];
    onToggle: (v: string) => void;
    multi?: boolean;
  }) => (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const isSelected = multi
          ? (selected as string[]).includes(opt)
          : selected === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onToggle(opt)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
              isSelected
                ? "border-primary bg-primary/10 text-foreground ring-1 ring-primary"
                : "border-border bg-background text-muted-foreground hover:border-foreground/20 hover:text-foreground"
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );

  const CheckboxGrid = ({
    options,
    selected,
    onChange,
    cols = 2,
  }: {
    options: string[];
    selected: string[];
    onChange: (v: string[]) => void;
    cols?: number;
  }) => (
    <div className={`grid grid-cols-${cols} gap-2`}>
      {options.map((opt) => {
        const checked = selected.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => toggleItem(selected, onChange, opt)}
            className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-all text-left ${
              checked
                ? "border-primary bg-primary/5 text-foreground ring-1 ring-primary"
                : "border-border bg-background text-muted-foreground hover:border-foreground/20 hover:text-foreground"
            }`}
          >
            <div
              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border transition-colors ${
                checked ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40"
              }`}
            >
              {checked && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            {opt}
          </button>
        );
      })}
    </div>
  );

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="companyName">Business Name</Label>
              <Input id="companyName" placeholder="e.g. TechCorp GmbH" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Industry</Label>
              <ChipSelect options={industries} selected={industry} onToggle={setIndustry} />
            </div>
            <div className="space-y-2">
              <Label>Company Size</Label>
              <ChipSelect options={companySizes} selected={companySize} onToggle={setCompanySize} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">Primary Location</Label>
              <Input id="city" placeholder="e.g. Munich" value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-5">
            <div className="space-y-2">
              <Label>Business Type</Label>
              <ChipSelect options={businessTypes} selected={businessType} onToggle={setBusinessType} />
            </div>
            <div className="space-y-2">
              <Label>Revenue Model <span className="text-muted-foreground font-normal">(optional)</span></Label>
              <CheckboxGrid options={revenueModels} selected={selectedRevenue} onChange={setSelectedRevenue} />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-5">
            <div className="space-y-2">
              <Label>Employee Roles <span className="text-muted-foreground font-normal">(pick relevant ones)</span></Label>
              <CheckboxGrid options={employeeRoleOptions} selected={employeeRoles} onChange={setEmployeeRoles} />
            </div>
            <div className="space-y-2">
              <Label>Key Regulatory Concerns</Label>
              <CheckboxGrid options={regulatoryConcerns} selected={selectedConcerns} onChange={setSelectedConcerns} />
            </div>
            <div className="space-y-2">
              <Label>Contracts Affected <span className="text-muted-foreground font-normal">(optional)</span></Label>
              <CheckboxGrid options={contractTypes} selected={selectedContracts} onChange={setSelectedContracts} />
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="instructions">Custom Instructions <span className="text-muted-foreground font-normal">(optional)</span></Label>
              <p className="text-xs text-muted-foreground">Tell us what specific laws or regulations you want tracked.</p>
              <Textarea
                id="instructions"
                rows={4}
                placeholder={`e.g. Track Munich labor laws affecting ${companySize || "50"}-employee ${industry || "tech"} ${businessType || "GmbH"}`}
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
              />
            </div>
            {/* Summary */}
            <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-2">
              <p className="text-sm font-medium text-foreground">Your business space</p>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>🏢 {companyName} · {businessType} · {city}</p>
                <p>📊 {industry} · {companySize} employees</p>
                {employeeRoles.length > 0 && <p>👥 {employeeRoles.join(", ")}</p>}
                {selectedConcerns.length > 0 && <p>⚖️ {selectedConcerns.join(", ")}</p>}
              </div>
            </div>
          </div>
        );
    }
  };

  const stepTitles = [
    "Company basics",
    "Business identity",
    "Roles & concerns",
    "Final touches",
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-5">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-foreground">Set up your business space</h1>
          <p className="mt-1 text-sm text-muted-foreground">Step {step} of {TOTAL_STEPS} — {stepTitles[step - 1]}</p>
        </div>

        {/* Progress bar */}
        <div className="mb-6 flex gap-1.5">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i < step ? "bg-primary" : "bg-muted"}`} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

        <div className="mt-6 flex gap-3">
          {step > 1 && (
            <Button variant="outline" className="rounded-full" onClick={() => setStep((s) => s - 1)}>
              <ArrowLeft className="mr-1 h-4 w-4" /> Back
            </Button>
          )}
          <Button className="flex-1 rounded-full" size="lg" disabled={!canProceed() || saving} onClick={next}>
            {step === TOTAL_STEPS ? (saving ? "Setting up…" : "Create business space") : "Continue"}
            {!saving && <ArrowRight className="ml-1.5 h-4 w-4" />}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default BusinessOnboarding;
