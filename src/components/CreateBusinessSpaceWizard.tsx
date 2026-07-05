import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, ArrowLeft, Upload, FileText, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { SpaceFormData } from "@/contexts/SpacesContext";
import NewsletterStep from "@/components/NewsletterStep";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const industries = ["Tech", "Legal", "Healthcare", "Retail", "Finance", "Manufacturing", "Other"];
const companySizes = ["1-10", "11-50", "51-200", "200+"];
const businessTypes = ["GmbH", "AG", "Startup", "Freelancer", "Non-profit"];
const employeeRoleOptions = ["Management", "HR", "Legal/Compliance", "Finance", "Developers", "Sales", "Operations"];
const regulatoryConcernOptions = ["Labor laws", "Tax changes", "Data privacy (DSGVO)", "Environmental", "Health/safety", "Import/export"];
const revenueModels = ["B2B", "B2C", "Subscription", "One-time sales"];
const contractTypes = ["Employees", "Suppliers", "Customers", "Landlords"];

const TOTAL_STEPS = 6;

interface Props {
  onComplete: (data: SpaceFormData) => Promise<void> | void;
  onCancel: () => void;
  saving?: boolean;
  initialData?: Partial<SpaceFormData>;
}

const CreateBusinessSpaceWizard = ({ onComplete, onCancel, saving, initialData }: Props) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [companyName, setCompanyName] = useState(initialData?.name || "");
  const [industry, setIndustry] = useState("");
  const [companySize, setCompanySize] = useState(initialData?.company_size || "");
  const [city, setCity] = useState(initialData?.city || "");
  const [businessType, setBusinessType] = useState(initialData?.business_type || "");
  const [employeeRoles, setEmployeeRoles] = useState<string[]>(initialData?.employee_roles || []);
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>(initialData?.regulatory_concerns || initialData?.key_concerns || []);
  const [selectedRevenue, setSelectedRevenue] = useState<string[]>(initialData?.revenue_model || []);
  const [selectedContracts, setSelectedContracts] = useState<string[]>(initialData?.contracts_affected || []);
  const [customInstructions, setCustomInstructions] = useState(initialData?.custom_instructions || "");
  const [newsletterEnabled, setNewsletterEnabled] = useState(false);
  const [newsletterFrequency, setNewsletterFrequency] = useState("weekly");

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | undefined>(initialData?.company_pdf_url);
  const [uploading, setUploading] = useState(false);

  const toggleItem = (arr: string[], setArr: (v: string[]) => void, item: string) => {
    setArr(arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item]);
  };

  const canProceed = () => {
    switch (step) {
      case 1: return companyName.trim() && industry && companySize && city.trim();
      case 2: return !!businessType;
      case 3: return employeeRoles.length > 0 && selectedConcerns.length > 0;
      case 4: return true;
      case 5: return !uploading;
      case 6: return true;
      default: return false;
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      toast.error("File must be under 20 MB");
      return;
    }
    setPdfFile(file);
    setPdfUrl(undefined);
  };

  const uploadPdf = async (): Promise<string | undefined> => {
    if (!pdfFile || !user) return pdfUrl;
    setUploading(true);
    try {
      const path = `${user.id}/${Date.now()}-${pdfFile.name}`;
      const { error } = await supabase.storage
        .from("company-documents")
        .upload(path, pdfFile, { upsert: true });
      if (error) throw error;
      const url = path;
      setPdfUrl(url);
      setPdfFile(null);
      return url;
    } catch (err: any) {
      toast.error("Upload failed: " + (err.message || "Unknown error"));
      return pdfUrl;
    } finally {
      setUploading(false);
    }
  };

  const removePdf = () => {
    setPdfFile(null);
    setPdfUrl(undefined);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async () => {
    const uploadedUrl = await uploadPdf();
    onComplete({
      name: companyName.trim(),
      emoji: "🏢",
      city: city.trim(),
      key_concerns: selectedConcerns,
      custom_instructions: customInstructions.trim() || undefined,
      primary_roles: employeeRoles,
      business_type: businessType,
      employee_roles: employeeRoles,
      regulatory_concerns: selectedConcerns,
      revenue_model: selectedRevenue,
      contracts_affected: selectedContracts,
      company_size: companySize,
      company_pdf_url: uploadedUrl,
      newsletter_enabled: newsletterEnabled,
      newsletter_frequency: newsletterEnabled ? newsletterFrequency : undefined,
    });
  };

  const next = () => {
    if (step === TOTAL_STEPS) handleSubmit();
    else setStep((s) => s + 1);
  };

  const ChipSelect = ({ options, selected, onToggle, multi = false }: {
    options: string[]; selected: string | string[]; onToggle: (v: string) => void; multi?: boolean;
  }) => (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const isSelected = multi ? (selected as string[]).includes(opt) : selected === opt;
        return (
          <button key={opt} type="button" onClick={() => onToggle(opt)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
              isSelected
                ? "border-primary bg-primary/10 text-foreground ring-1 ring-primary"
                : "border-border bg-background text-muted-foreground hover:border-foreground/20 hover:text-foreground"
            }`}
          >{opt}</button>
        );
      })}
    </div>
  );

  const CheckboxGrid = ({ options, selected, onChange }: {
    options: string[]; selected: string[]; onChange: (v: string[]) => void;
  }) => (
    <div className="grid grid-cols-2 gap-2">
      {options.map((opt) => {
        const checked = selected.includes(opt);
        return (
          <button key={opt} type="button" onClick={() => toggleItem(selected, onChange, opt)}
            className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-all text-left ${
              checked
                ? "border-primary bg-primary/5 text-foreground ring-1 ring-primary"
                : "border-border bg-background text-muted-foreground hover:border-foreground/20 hover:text-foreground"
            }`}
          >
            <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border transition-colors ${
              checked ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40"
            }`}>
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

  const stepTitles = ["Company basics", "Business identity", "Roles & concerns", "Final touches", "Company documents", "Email updates"];

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Step {step} of {TOTAL_STEPS} — {stepTitles[step - 1]}</p>
      <div className="flex gap-1.5">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i < step ? "bg-primary" : "bg-muted"}`} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Business Name</Label>
                <Input placeholder="e.g. TechCorp GmbH" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
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
                <Label>Primary Location</Label>
                <Input placeholder="e.g. Munich" value={city} onChange={(e) => setCity(e.target.value)} />
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Business Type</Label>
                <ChipSelect options={businessTypes} selected={businessType} onToggle={setBusinessType} />
              </div>
              <div className="space-y-2">
                <Label>Revenue Model <span className="text-muted-foreground font-normal">(optional)</span></Label>
                <CheckboxGrid options={revenueModels} selected={selectedRevenue} onChange={setSelectedRevenue} />
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Employee Roles</Label>
                <CheckboxGrid options={employeeRoleOptions} selected={employeeRoles} onChange={setEmployeeRoles} />
              </div>
              <div className="space-y-2">
                <Label>Key Regulatory Concerns</Label>
                <CheckboxGrid options={regulatoryConcernOptions} selected={selectedConcerns} onChange={setSelectedConcerns} />
              </div>
              <div className="space-y-2">
                <Label>Contracts Affected <span className="text-muted-foreground font-normal">(optional)</span></Label>
                <CheckboxGrid options={contractTypes} selected={selectedContracts} onChange={setSelectedContracts} />
              </div>
            </div>
          )}
          {step === 4 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Custom Instructions <span className="text-muted-foreground font-normal">(optional)</span></Label>
                <p className="text-xs text-muted-foreground">Tell us what specific laws or regulations you want tracked.</p>
                <Textarea rows={4} placeholder={`e.g. Track Munich labor laws affecting ${companySize || "50"}-employee tech GmbH`}
                  value={customInstructions} onChange={(e) => setCustomInstructions(e.target.value)} />
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-1">
                <p className="text-sm font-medium text-foreground">Summary</p>
                <div className="text-xs text-muted-foreground space-y-0.5">
                  <p>🏢 {companyName} · {businessType} · {city}</p>
                  <p>📊 {industry} · {companySize} employees</p>
                  {employeeRoles.length > 0 && <p>👥 {employeeRoles.join(", ")}</p>}
                  {selectedConcerns.length > 0 && <p>⚖️ {selectedConcerns.join(", ")}</p>}
                </div>
              </div>
            </div>
          )}
          {step === 5 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Upload Company Document <span className="text-muted-foreground font-normal">(optional)</span></Label>
                <p className="text-xs text-muted-foreground">
                  Upload a PDF about your company — e.g. company profile, org chart, compliance handbook, or articles of association. 
                  This helps us tailor law tracking to your specific business context.
                </p>
              </div>

              {!pdfFile && !pdfUrl ? (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex w-full flex-col items-center gap-3 rounded-xl border-2 border-dashed border-border bg-muted/20 p-8 text-muted-foreground transition-colors hover:border-primary/40 hover:bg-muted/40"
                >
                  <Upload className="h-8 w-8" />
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">Click to upload PDF</p>
                    <p className="text-xs">Max 20 MB · PDF only</p>
                  </div>
                </button>
              ) : (
                <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-4">
                  <FileText className="h-8 w-8 shrink-0 text-primary" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {pdfFile?.name || pdfUrl?.split("/").pop() || "Company document"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {pdfFile ? `${(pdfFile.size / 1024 / 1024).toFixed(1)} MB — ready to upload` : "Uploaded"}
                    </p>
                  </div>
                  <button type="button" onClick={removePdf} className="shrink-0 rounded-full p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleFileSelect}
              />

              <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-1.5">
                <p className="text-xs font-medium text-foreground">Recommended documents:</p>
                <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Company profile or pitch deck</li>
                  <li>Organizational chart</li>
                  <li>Compliance handbook or policies</li>
                  <li>Articles of association (Gesellschaftsvertrag)</li>
                  <li>Industry certifications overview</li>
                </ul>
              </div>
            </div>
          )}
          {step === 6 && (
            <NewsletterStep
              enabled={newsletterEnabled}
              frequency={newsletterFrequency}
              onEnabledChange={setNewsletterEnabled}
              onFrequencyChange={setNewsletterFrequency}
            />
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex gap-3 pt-2">
        {step > 1 ? (
          <Button variant="outline" className="rounded-md" onClick={() => setStep((s) => s - 1)}>
            <ArrowLeft className="mr-1 h-4 w-4" /> Back
          </Button>
        ) : (
          <Button variant="outline" className="rounded-md" onClick={onCancel}>Cancel</Button>
        )}
        <Button className="flex-1 rounded-md" disabled={!canProceed() || saving || uploading} onClick={next}>
          {uploading ? (
            <><Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> Uploading…</>
          ) : step === TOTAL_STEPS ? (saving ? "Creating…" : "Create space") : "Continue"}
          {!saving && !uploading && step < TOTAL_STEPS && <ArrowRight className="ml-1.5 h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};

export default CreateBusinessSpaceWizard;
