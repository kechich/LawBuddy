
CREATE TABLE public.feed_cache (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  space_id uuid NOT NULL REFERENCES public.spaces(id) ON DELETE CASCADE,
  tab text NOT NULL CHECK (tab IN ('published', 'discussion')),
  laws_json jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (space_id, tab)
);

ALTER TABLE public.feed_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own feed cache"
ON public.feed_cache
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.spaces
    WHERE spaces.id = feed_cache.space_id
    AND spaces.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert their own feed cache"
ON public.feed_cache
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.spaces
    WHERE spaces.id = feed_cache.space_id
    AND spaces.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete their own feed cache"
ON public.feed_cache
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.spaces
    WHERE spaces.id = feed_cache.space_id
    AND spaces.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own feed cache"
ON public.feed_cache
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.spaces
    WHERE spaces.id = feed_cache.space_id
    AND spaces.user_id = auth.uid()
  )
);
