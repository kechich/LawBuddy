
ALTER TABLE public.profiles
  ADD COLUMN account_type text NOT NULL DEFAULT 'citizen',
  ADD COLUMN company_name text,
  ADD COLUMN industry text,
  ADD COLUMN company_size text,
  ADD COLUMN stripe_customer_id text,
  ADD COLUMN subscription_status text;
