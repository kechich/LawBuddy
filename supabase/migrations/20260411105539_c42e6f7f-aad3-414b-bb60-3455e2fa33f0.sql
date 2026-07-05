ALTER TABLE public.spaces
  ADD COLUMN IF NOT EXISTS business_type text,
  ADD COLUMN IF NOT EXISTS employee_roles text[],
  ADD COLUMN IF NOT EXISTS regulatory_concerns text[],
  ADD COLUMN IF NOT EXISTS revenue_model text[],
  ADD COLUMN IF NOT EXISTS contracts_affected text[],
  ADD COLUMN IF NOT EXISTS company_size text;