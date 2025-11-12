-- Create announcements table
CREATE TABLE public.announcements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read announcements
CREATE POLICY "Anyone can view announcements"
ON public.announcements
FOR SELECT
USING (true);

-- Only authenticated users can create announcements
CREATE POLICY "Authenticated users can create announcements"
ON public.announcements
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Users can update their own announcements
CREATE POLICY "Users can update their own announcements"
ON public.announcements
FOR UPDATE
USING (auth.uid() = author_id);

-- Users can delete their own announcements
CREATE POLICY "Users can delete their own announcements"
ON public.announcements
FOR DELETE
USING (auth.uid() = author_id);

-- Create trigger for updating updated_at
CREATE TRIGGER update_announcements_updated_at
BEFORE UPDATE ON public.announcements
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();