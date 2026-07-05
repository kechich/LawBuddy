import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Mail } from "lucide-react";

const frequencies = [
  { value: "daily", label: "Daily", desc: "Every morning" },
  { value: "weekly", label: "Weekly", desc: "Every Monday" },
  { value: "monthly", label: "Monthly", desc: "1st of the month" },
];

interface Props {
  enabled: boolean;
  frequency: string;
  onEnabledChange: (v: boolean) => void;
  onFrequencyChange: (v: string) => void;
}

const NewsletterStep = ({ enabled, frequency, onEnabledChange, onFrequencyChange }: Props) => (
  <div className="space-y-5">
    <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 p-4">
      <Mail className="h-5 w-5 text-primary mt-0.5 shrink-0" />
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Email updates for this space</Label>
          <Switch checked={enabled} onCheckedChange={onEnabledChange} />
        </div>
        <p className="text-xs text-muted-foreground">
          Get a personalized digest of new laws and changes relevant to this space, delivered straight to your inbox.
        </p>
      </div>
    </div>

    {enabled && (
      <div className="space-y-2">
        <Label className="text-sm font-medium">How often?</Label>
        <div className="grid grid-cols-3 gap-2">
          {frequencies.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => onFrequencyChange(f.value)}
              className={`flex flex-col items-center gap-1 rounded-lg border px-3 py-3 text-sm font-medium transition-all ${
                frequency === f.value
                  ? "border-primary bg-primary/5 text-foreground ring-1 ring-primary"
                  : "border-border bg-background text-muted-foreground hover:border-foreground/20 hover:text-foreground"
              }`}
            >
              <span>{f.label}</span>
              <span className="text-[11px] text-muted-foreground font-normal">{f.desc}</span>
            </button>
          ))}
        </div>
      </div>
    )}
  </div>
);

export default NewsletterStep;
