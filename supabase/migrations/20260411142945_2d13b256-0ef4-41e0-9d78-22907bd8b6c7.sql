-- Create storage bucket for company documents
INSERT INTO storage.buckets (id, name, public) VALUES ('company-documents', 'company-documents', false);

-- RLS: users can upload to their own folder
CREATE POLICY "Users can upload company docs" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'company-documents' AND (storage.foldername(name))[1] = auth.uid()::text);

-- RLS: users can view their own docs
CREATE POLICY "Users can view own company docs" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'company-documents' AND (storage.foldername(name))[1] = auth.uid()::text);

-- RLS: users can delete their own docs
CREATE POLICY "Users can delete own company docs" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'company-documents' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Add column for PDF URL reference
ALTER TABLE public.spaces ADD COLUMN company_pdf_url text DEFAULT NULL;