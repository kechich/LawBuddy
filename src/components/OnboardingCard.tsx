import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, X } from "lucide-react";

const OnboardingCard = () => {
  const { profile, updateProfile } = useAuth();
  const [personaType, setPersonaType] = useState("");
  const [city, setCity] = useState("");
  const [saving, setSaving] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Don't show if profile is complete or dismissed
  if (dismissed || (profile?.persona_type && profile?.city)) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({
        ...(personaType ? { persona_type: personaType as any } : {}),
        ...(city ? { city } : {}),
      });
    } catch (err) {
      console.error("Failed to update profile:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="mx-5 mb-6 border-accent/30 bg-accent/5">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-serif text-base font-semibold text-foreground">
              Personalize your feed
            </h3>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Tell us a little about yourself so we can show laws that matter to you.
            </p>
          </div>
          <button onClick={() => setDismissed(true)} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs">I am a…</Label>
            <Select value={personaType} onValueChange={setPersonaType}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="renter">Renter</SelectItem>
                <SelectItem value="freelancer">Freelancer</SelectItem>
                <SelectItem value="worker">Worker</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">City</Label>
            <Input
              placeholder="e.g. Munich"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
        </div>

        <Button
          onClick={handleSave}
          disabled={saving || (!personaType && !city)}
          className="mt-4 rounded-full"
          size="sm"
        >
          {saving ? "Saving…" : "Save preferences"}
          {!saving && <ArrowRight className="ml-1 h-3.5 w-3.5" />}
        </Button>
      </CardContent>
    </Card>
  );
};

export default OnboardingCard;
