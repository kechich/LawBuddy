ALTER TABLE public.spaces ADD COLUMN newsletter_enabled boolean NOT NULL DEFAULT false;
ALTER TABLE public.spaces ADD COLUMN newsletter_frequency text;