export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      feed_cache: {
        Row: {
          created_at: string
          id: string
          laws_json: Json
          space_id: string
          tab: string
        }
        Insert: {
          created_at?: string
          id?: string
          laws_json?: Json
          space_id: string
          tab: string
        }
        Update: {
          created_at?: string
          id?: string
          laws_json?: Json
          space_id?: string
          tab?: string
        }
        Relationships: [
          {
            foreignKeyName: "feed_cache_space_id_fkey"
            columns: ["space_id"]
            isOneToOne: false
            referencedRelation: "spaces"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          account_type: string
          city: string | null
          company_name: string | null
          company_size: string | null
          created_at: string
          full_name: string | null
          id: string
          industry: string | null
          persona_type: Database["public"]["Enums"]["persona_type"] | null
          stripe_customer_id: string | null
          subscription_status: string | null
          updated_at: string
        }
        Insert: {
          account_type?: string
          city?: string | null
          company_name?: string | null
          company_size?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          industry?: string | null
          persona_type?: Database["public"]["Enums"]["persona_type"] | null
          stripe_customer_id?: string | null
          subscription_status?: string | null
          updated_at?: string
        }
        Update: {
          account_type?: string
          city?: string | null
          company_name?: string | null
          company_size?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          industry?: string | null
          persona_type?: Database["public"]["Enums"]["persona_type"] | null
          stripe_customer_id?: string | null
          subscription_status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      spaces: {
        Row: {
          bundesland: string | null
          business_type: string | null
          city: string | null
          company_pdf_url: string | null
          company_size: string | null
          contracts_affected: string[] | null
          created_at: string
          custom_instructions: string | null
          emoji: string | null
          employee_roles: string[] | null
          housing_situation: string[] | null
          id: string
          income_level: string | null
          is_active: boolean
          key_concerns: string[] | null
          name: string
          newsletter_enabled: boolean
          newsletter_frequency: string | null
          persona_type: Database["public"]["Enums"]["persona_type"] | null
          primary_roles: string[] | null
          regulatory_concerns: string[] | null
          revenue_model: string[] | null
          updated_at: string
          user_id: string
          work_study_status: string[] | null
        }
        Insert: {
          bundesland?: string | null
          business_type?: string | null
          city?: string | null
          company_pdf_url?: string | null
          company_size?: string | null
          contracts_affected?: string[] | null
          created_at?: string
          custom_instructions?: string | null
          emoji?: string | null
          employee_roles?: string[] | null
          housing_situation?: string[] | null
          id?: string
          income_level?: string | null
          is_active?: boolean
          key_concerns?: string[] | null
          name?: string
          newsletter_enabled?: boolean
          newsletter_frequency?: string | null
          persona_type?: Database["public"]["Enums"]["persona_type"] | null
          primary_roles?: string[] | null
          regulatory_concerns?: string[] | null
          revenue_model?: string[] | null
          updated_at?: string
          user_id: string
          work_study_status?: string[] | null
        }
        Update: {
          bundesland?: string | null
          business_type?: string | null
          city?: string | null
          company_pdf_url?: string | null
          company_size?: string | null
          contracts_affected?: string[] | null
          created_at?: string
          custom_instructions?: string | null
          emoji?: string | null
          employee_roles?: string[] | null
          housing_situation?: string[] | null
          id?: string
          income_level?: string | null
          is_active?: boolean
          key_concerns?: string[] | null
          name?: string
          newsletter_enabled?: boolean
          newsletter_frequency?: string | null
          persona_type?: Database["public"]["Enums"]["persona_type"] | null
          primary_roles?: string[] | null
          regulatory_concerns?: string[] | null
          revenue_model?: string[] | null
          updated_at?: string
          user_id?: string
          work_study_status?: string[] | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      persona_type: "student" | "renter" | "freelancer" | "worker"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      persona_type: ["student", "renter", "freelancer", "worker"],
    },
  },
} as const
