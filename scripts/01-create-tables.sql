-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'basic',
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Movies and TV Shows
CREATE TABLE public.content (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('movie', 'tv_show')),
  genre TEXT[] DEFAULT '{}',
  release_year INTEGER,
  duration_minutes INTEGER,
  rating DECIMAL(3,1),
  poster_url TEXT,
  backdrop_url TEXT,
  video_url TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User viewing history
CREATE TABLE public.viewing_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id UUID REFERENCES public.content(id) ON DELETE CASCADE,
  watched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  watch_duration_seconds INTEGER DEFAULT 0,
  completion_percentage DECIMAL(5,2) DEFAULT 0,
  device_type TEXT,
  session_id TEXT,
  UNIQUE(user_id, content_id, session_id)
);

-- User preferences and ratings
CREATE TABLE public.user_preferences (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  preferred_genres TEXT[] DEFAULT '{}',
  disliked_genres TEXT[] DEFAULT '{}',
  preferred_duration_range INTEGER[] DEFAULT '{60, 180}',
  language_preferences TEXT[] DEFAULT '{"en"}',
  content_rating_preference TEXT DEFAULT 'PG-13',
  autoplay_enabled BOOLEAN DEFAULT true,
  notifications_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Content ratings by users
CREATE TABLE public.user_ratings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id UUID REFERENCES public.content(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, content_id)
);

-- Search history for personalization
CREATE TABLE public.search_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  filters JSONB DEFAULT '{}',
  result_count INTEGER DEFAULT 0,
  clicked_results UUID[] DEFAULT '{}',
  searched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recommendation logs for analytics
CREATE TABLE public.recommendation_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  request_type TEXT NOT NULL,
  filters JSONB DEFAULT '{}',
  recommended_content_ids UUID[] DEFAULT '{}',
  clicked_content_ids UUID[] DEFAULT '{}',
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User sessions for analytics
CREATE TABLE public.user_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_end TIMESTAMP WITH TIME ZONE,
  device_type TEXT,
  browser_info TEXT,
  ip_address INET,
  pages_visited TEXT[] DEFAULT '{}',
  actions_performed JSONB DEFAULT '[]'
);

-- Content performance metrics
CREATE TABLE public.content_metrics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  content_id UUID REFERENCES public.content(id) ON DELETE CASCADE,
  date DATE DEFAULT CURRENT_DATE,
  view_count INTEGER DEFAULT 0,
  unique_viewers INTEGER DEFAULT 0,
  total_watch_time_seconds BIGINT DEFAULT 0,
  average_completion_rate DECIMAL(5,2) DEFAULT 0,
  rating_average DECIMAL(3,1) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  UNIQUE(content_id, date)
);

-- Create indexes for performance
CREATE INDEX idx_viewing_history_user_id ON public.viewing_history(user_id);
CREATE INDEX idx_viewing_history_content_id ON public.viewing_history(content_id);
CREATE INDEX idx_viewing_history_watched_at ON public.viewing_history(watched_at);
CREATE INDEX idx_content_type ON public.content(type);
CREATE INDEX idx_content_genre ON public.content USING GIN(genre);
CREATE INDEX idx_content_rating ON public.content(rating);
CREATE INDEX idx_search_history_user_id ON public.search_history(user_id);
CREATE INDEX idx_search_history_searched_at ON public.search_history(searched_at);
CREATE INDEX idx_recommendation_logs_user_id ON public.recommendation_logs(user_id);
CREATE INDEX idx_recommendation_logs_timestamp ON public.recommendation_logs(timestamp);
CREATE INDEX idx_content_metrics_date ON public.content_metrics(date);
CREATE INDEX idx_content_metrics_content_id ON public.content_metrics(content_id);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.viewing_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own viewing history" ON public.viewing_history
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own preferences" ON public.user_preferences
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own ratings" ON public.user_ratings
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own search history" ON public.search_history
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own recommendation logs" ON public.recommendation_logs
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own sessions" ON public.user_sessions
  FOR ALL USING (auth.uid() = user_id);

-- Public read access for content
CREATE POLICY "Anyone can view content" ON public.content
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view content metrics" ON public.content_metrics
  FOR SELECT USING (true);
