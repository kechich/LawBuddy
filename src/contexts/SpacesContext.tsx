import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Space {
  id: string;
  user_id: string;
  name: string;
  persona_type: "student" | "renter" | "freelancer" | "worker" | null;
  city: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  emoji: string | null;
  bundesland: string | null;
  housing_situation: string[] | null;
  work_study_status: string[] | null;
  key_concerns: string[] | null;
  income_level: string | null;
  custom_instructions: string | null;
  primary_roles: string[] | null;
  business_type: string | null;
  employee_roles: string[] | null;
  regulatory_concerns: string[] | null;
  revenue_model: string[] | null;
  contracts_affected: string[] | null;
  company_size: string | null;
  company_pdf_url: string | null;
}

export interface SpaceFormData {
  name: string;
  emoji?: string;
  city?: string;
  bundesland?: string;
  persona_type?: string;
  primary_roles?: string[];
  housing_situation?: string[];
  work_study_status?: string[];
  key_concerns?: string[];
  income_level?: string;
  custom_instructions?: string;
  newsletter_enabled?: boolean;
  newsletter_frequency?: string;
  business_type?: string;
  employee_roles?: string[];
  regulatory_concerns?: string[];
  revenue_model?: string[];
  contracts_affected?: string[];
  company_size?: string;
  company_pdf_url?: string;
}

interface SpacesContextType {
  spaces: Space[];
  activeSpace: Space | null;
  loading: boolean;
  createSpace: (data: SpaceFormData) => Promise<Space>;
  updateSpace: (spaceId: string, data: SpaceFormData) => Promise<void>;
  deleteSpace: (spaceId: string) => Promise<void>;
  switchSpace: (spaceId: string) => Promise<void>;
  refreshSpaces: () => Promise<void>;
}

const SpacesContext = createContext<SpacesContextType | undefined>(undefined);

export const useSpaces = () => {
  const ctx = useContext(SpacesContext);
  if (!ctx) throw new Error("useSpaces must be used within SpacesProvider");
  return ctx;
};

export const SpacesProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSpaces = useCallback(async () => {
    if (!user) {
      setSpaces([]);
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from("spaces")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });
    setSpaces((data as Space[]) || []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchSpaces();
  }, [fetchSpaces]);

  const activeSpace = spaces.find((s) => s.is_active) || spaces[0] || null;

  const createSpace = async (data: SpaceFormData) => {
    if (!user) throw new Error("Not authenticated");
    if (spaces.length > 0) {
      await supabase
        .from("spaces")
        .update({ is_active: false })
        .eq("user_id", user.id);
    }
    const { data: newSpace, error } = await supabase
      .from("spaces")
      .insert({
        user_id: user.id,
        name: data.name,
        emoji: data.emoji,
        persona_type: data.persona_type as any,
        city: data.city,
        bundesland: data.bundesland,
        primary_roles: data.primary_roles,
        housing_situation: data.housing_situation,
        work_study_status: data.work_study_status,
        key_concerns: data.key_concerns,
        income_level: data.income_level,
        custom_instructions: data.custom_instructions,
        newsletter_enabled: data.newsletter_enabled ?? false,
        newsletter_frequency: data.newsletter_frequency,
        business_type: data.business_type,
        employee_roles: data.employee_roles,
        regulatory_concerns: data.regulatory_concerns,
        revenue_model: data.revenue_model,
        contracts_affected: data.contracts_affected,
        company_size: data.company_size,
        company_pdf_url: data.company_pdf_url,
        is_active: true,
      })
      .select()
      .single();
    if (error) throw error;
    await fetchSpaces();
    return newSpace as Space;
  };

  const updateSpace = async (spaceId: string, data: SpaceFormData) => {
    if (!user) return;
    const { error } = await supabase
      .from("spaces")
      .update({
        name: data.name,
        emoji: data.emoji,
        persona_type: data.persona_type as any,
        city: data.city,
        bundesland: data.bundesland,
        primary_roles: data.primary_roles,
        housing_situation: data.housing_situation,
        work_study_status: data.work_study_status,
        key_concerns: data.key_concerns,
        income_level: data.income_level,
        custom_instructions: data.custom_instructions,
        newsletter_enabled: data.newsletter_enabled ?? false,
        newsletter_frequency: data.newsletter_frequency,
      })
      .eq("id", spaceId)
      .eq("user_id", user.id);
    if (error) throw error;
    await fetchSpaces();
  };

  const deleteSpace = async (spaceId: string) => {
    if (!user) return;
    if (spaces.length <= 1) throw new Error("You must keep at least one space.");
    const { error } = await supabase
      .from("spaces")
      .delete()
      .eq("id", spaceId)
      .eq("user_id", user.id);
    if (error) throw error;
    await fetchSpaces();
  };

  const switchSpace = async (spaceId: string) => {
    if (!user) return;
    await supabase.from("spaces").update({ is_active: false }).eq("user_id", user.id);
    await supabase.from("spaces").update({ is_active: true }).eq("id", spaceId);
    await fetchSpaces();
  };

  const refreshSpaces = fetchSpaces;

  return (
    <SpacesContext.Provider value={{ spaces, activeSpace, loading, createSpace, updateSpace, deleteSpace, switchSpace, refreshSpaces }}>
      {children}
    </SpacesContext.Provider>
  );
};
