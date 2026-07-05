import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSpaces } from "@/contexts/SpacesContext";
import CreateSpaceWizard from "@/components/CreateSpaceWizard";
import type { SpaceFormData } from "@/contexts/SpacesContext";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const Onboarding = () => {
  const { profile, updateProfile } = useAuth();
  const { spaces, loading: spacesLoading, createSpace } = useSpaces();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  // Step 0: collect name, then show full wizard
  const [nameStep, setNameStep] = useState(true);
  const [fullName, setFullName] = useState(profile?.full_name || "");

  // Skip if already onboarded
  useEffect(() => {
    if (!spacesLoading && profile?.persona_type && profile?.city && spaces.length > 0) {
      navigate("/feed", { replace: true });
    }
  }, [spacesLoading, profile, spaces, navigate]);

  // If profile already has a name, skip name step
  useEffect(() => {
    if (profile?.full_name) {
      setFullName(profile.full_name);
      setNameStep(false);
    }
  }, [profile?.full_name]);

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;
    try {
      await updateProfile({ full_name: fullName.trim() });
      setNameStep(false);
    } catch (err) {
      console.error("Failed to save name:", err);
    }
  };

  const handleSpaceComplete = async (data: SpaceFormData) => {
    setSaving(true);
    try {
      // Update profile with persona info from space
      await updateProfile({
        full_name: fullName.trim(),
        city: data.city || undefined,
        persona_type: data.persona_type as any,
      });
      await createSpace(data);
      navigate("/feed", { replace: true });
    } catch (err) {
      console.error("Failed to create space:", err);
    } finally {
      setSaving(false);
    }
  };

  if (nameStep) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-foreground">Welcome to Law Buddy</h1>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
              Let's set up your first personalized space. First, what's your name?
            </p>
          </div>
          <form onSubmit={handleNameSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Your name</Label>
              <Input
                id="fullName"
                placeholder="e.g. Anna Müller"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                autoFocus
              />
            </div>
            <Button type="submit" className="w-full rounded-full" size="lg" disabled={!fullName.trim()}>
              Continue <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-5 py-10">
      <div className="w-full max-w-lg">
        <CreateSpaceWizard
          onComplete={handleSpaceComplete}
          onCancel={() => setNameStep(true)}
          saving={saving}
        />
      </div>
    </div>
  );
};

export default Onboarding;
