
ALTER TABLE public.spaces
  ADD COLUMN IF NOT EXISTS emoji text,
  ADD COLUMN IF NOT EXISTS bundesland text,
  ADD COLUMN IF NOT EXISTS housing_situation text[],
  ADD COLUMN IF NOT EXISTS work_study_status text[],
  ADD COLUMN IF NOT EXISTS key_concerns text[],
  ADD COLUMN IF NOT EXISTS income_level text,
  ADD COLUMN IF NOT EXISTS custom_instructions text,
  ADD COLUMN IF NOT EXISTS primary_roles text[];
