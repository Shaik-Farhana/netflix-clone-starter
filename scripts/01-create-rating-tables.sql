-- Create user_ratings table for storing movie ratings
CREATE TABLE IF NOT EXISTS public.user_ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id UUID REFERENCES public.content(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, content_id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_ratings_user_id ON public.user_ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_user_ratings_content_id ON public.user_ratings(content_id);

-- Enable RLS
ALTER TABLE public.user_ratings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own ratings" ON public.user_ratings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own ratings" ON public.user_ratings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ratings" ON public.user_ratings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ratings" ON public.user_ratings
  FOR DELETE USING (auth.uid() = user_id);

-- Add streaming_platforms column to content table if it doesn't exist
ALTER TABLE public.content 
ADD COLUMN IF NOT EXISTS streaming_platforms TEXT[] DEFAULT '{}';

-- Update existing content with some streaming platforms
UPDATE public.content 
SET streaming_platforms = ARRAY['Netflix', 'Amazon Prime', 'Hulu']
WHERE streaming_platforms IS NULL OR streaming_platforms = '{}';
