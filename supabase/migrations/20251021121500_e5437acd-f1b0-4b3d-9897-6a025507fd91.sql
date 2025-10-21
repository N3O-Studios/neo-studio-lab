-- Create news_articles table for storing crawled news
CREATE TABLE public.news_articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL UNIQUE,
  source TEXT NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE,
  fetched_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (no auth required)
CREATE POLICY "Anyone can view news articles" 
ON public.news_articles 
FOR SELECT 
USING (true);

-- Create index for efficient querying
CREATE INDEX idx_news_articles_fetched_at ON public.news_articles(fetched_at DESC);
CREATE INDEX idx_news_articles_published_at ON public.news_articles(published_at DESC);