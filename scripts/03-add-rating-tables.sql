-- Add user ratings table
CREATE TABLE IF NOT EXISTS public.user_ratings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id UUID REFERENCES public.content(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  review_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, content_id)
);

-- Add helpful votes table for rating reviews
CREATE TABLE IF NOT EXISTS public.rating_helpful_votes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating_id UUID REFERENCES public.user_ratings(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, rating_id)
);

-- Add watchlist table
CREATE TABLE IF NOT EXISTS public.user_watchlist (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id UUID REFERENCES public.content(id) ON DELETE CASCADE,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, content_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_ratings_content_id ON public.user_ratings(content_id);
CREATE INDEX IF NOT EXISTS idx_user_ratings_user_id ON public.user_ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_user_ratings_rating ON public.user_ratings(rating);
CREATE INDEX IF NOT EXISTS idx_rating_helpful_votes_rating_id ON public.rating_helpful_votes(rating_id);
CREATE INDEX IF NOT EXISTS idx_user_watchlist_user_id ON public.user_watchlist(user_id);

-- Enable Row Level Security
ALTER TABLE public.user_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rating_helpful_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_watchlist ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_ratings
CREATE POLICY "Users can view all ratings" ON public.user_ratings
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own ratings" ON public.user_ratings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ratings" ON public.user_ratings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own ratings" ON public.user_ratings
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for rating_helpful_votes
CREATE POLICY "Users can view helpful votes" ON public.rating_helpful_votes
  FOR SELECT USING (true);

CREATE POLICY "Users can manage own helpful votes" ON public.rating_helpful_votes
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for user_watchlist
CREATE POLICY "Users can manage own watchlist" ON public.user_watchlist
  FOR ALL USING (auth.uid() = user_id);

-- Function to update content average rating
CREATE OR REPLACE FUNCTION update_content_average_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.content 
  SET rating = (
    SELECT COALESCE(AVG(rating::decimal), 0)
    FROM public.user_ratings 
    WHERE content_id = COALESCE(NEW.content_id, OLD.content_id)
  )
  WHERE id = COALESCE(NEW.content_id, OLD.content_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update content rating when user ratings change
DROP TRIGGER IF EXISTS trigger_update_content_rating ON public.user_ratings;
CREATE TRIGGER trigger_update_content_rating
  AFTER INSERT OR UPDATE OR DELETE ON public.user_ratings
  FOR EACH ROW EXECUTE FUNCTION update_content_average_rating();
