
CREATE TABLE public.spaces (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL DEFAULT 'Personal',
  persona_type public.persona_type NULL,
  city TEXT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.spaces ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own spaces" ON public.spaces FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own spaces" ON public.spaces FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own spaces" ON public.spaces FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own spaces" ON public.spaces FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_spaces_updated_at BEFORE UPDATE ON public.spaces FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_spaces_user_id ON public.spaces (user_id);
CREATE INDEX idx_spaces_active ON public.spaces (user_id, is_active);
