-- Create storage bucket for institution images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'institution-images',
  'institution-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
);

-- Create table for image metadata
CREATE TABLE public.institution_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  image_type TEXT NOT NULL CHECK (image_type IN ('hero', 'gallery', 'activity', 'facility')),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  uploaded_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.institution_images ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view active images
CREATE POLICY "Anyone can view active images"
ON public.institution_images
FOR SELECT
USING (is_active = true);

-- Allow authenticated users to view all images
CREATE POLICY "Authenticated users can view all images"
ON public.institution_images
FOR SELECT
TO authenticated
USING (true);

-- Allow authenticated users to insert images
CREATE POLICY "Authenticated users can insert images"
ON public.institution_images
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = uploaded_by);

-- Allow users to update their own images
CREATE POLICY "Users can update their own images"
ON public.institution_images
FOR UPDATE
TO authenticated
USING (auth.uid() = uploaded_by);

-- Allow users to delete their own images
CREATE POLICY "Users can delete their own images"
ON public.institution_images
FOR DELETE
TO authenticated
USING (auth.uid() = uploaded_by);

-- Storage policies for institution-images bucket
CREATE POLICY "Anyone can view images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'institution-images');

CREATE POLICY "Authenticated users can upload images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'institution-images');

CREATE POLICY "Users can update their own images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'institution-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'institution-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_institution_images_updated_at
BEFORE UPDATE ON public.institution_images
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_institution_images_type_active ON public.institution_images(image_type, is_active, display_order);
CREATE INDEX idx_institution_images_active ON public.institution_images(is_active, display_order);