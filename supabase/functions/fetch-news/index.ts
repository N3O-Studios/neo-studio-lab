import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NewsItem {
  title: string;
  description?: string;
  url: string;
  source: string;
  published_at?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Starting news fetch...');

    // Delete old articles (older than 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const { error: deleteError } = await supabase
      .from('news_articles')
      .delete()
      .lt('fetched_at', sevenDaysAgo.toISOString());

    if (deleteError) {
      console.error('Error deleting old articles:', deleteError);
    } else {
      console.log('Old articles deleted');
    }

    // Fetch news from RSS feeds
    const newsItems: NewsItem[] = [];

    // Music production news sources
    const rssSources = [
      { url: 'https://www.musicradar.com/news/feed', source: 'Music Radar' },
      { url: 'https://cdm.link/feed/', source: 'CDM' },
    ];

    for (const rssSource of rssSources) {
      try {
        const response = await fetch(rssSource.url, {
          headers: {
            'User-Agent': 'N3OStudios-NewsBot/1.0',
          },
        });

        if (!response.ok) {
          console.error(`Failed to fetch ${rssSource.source}: ${response.status}`);
          continue;
        }

        const xmlText = await response.text();
        
        // Simple RSS parsing
        const itemRegex = /<item>([\s\S]*?)<\/item>/g;
        const titleRegex = /<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/;
        const linkRegex = /<link>(.*?)<\/link>/;
        const descRegex = /<description><!\[CDATA\[(.*?)\]\]><\/description>|<description>(.*?)<\/description>/;
        const pubDateRegex = /<pubDate>(.*?)<\/pubDate>/;

        let match;
        let count = 0;
        while ((match = itemRegex.exec(xmlText)) !== null && count < 10) {
          const item = match[1];
          
          const titleMatch = titleRegex.exec(item);
          const linkMatch = linkRegex.exec(item);
          const descMatch = descRegex.exec(item);
          const pubDateMatch = pubDateRegex.exec(item);

          if (titleMatch && linkMatch) {
            const title = (titleMatch[1] || titleMatch[2] || '').trim();
            const url = linkMatch[1].trim();
            const description = (descMatch?.[1] || descMatch?.[2] || '').replace(/<[^>]*>/g, '').trim().substring(0, 200);
            const publishedAt = pubDateMatch?.[1];

            newsItems.push({
              title,
              description,
              url,
              source: rssSource.source,
              published_at: publishedAt,
            });
            count++;
          }
        }

        console.log(`Fetched ${count} articles from ${rssSource.source}`);
      } catch (error) {
        console.error(`Error fetching ${rssSource.source}:`, error);
      }
    }

    // Limit to 20 articles
    const limitedNews = newsItems.slice(0, 20);

    // Insert new articles
    if (limitedNews.length > 0) {
      const { error: insertError } = await supabase
        .from('news_articles')
        .upsert(limitedNews, { onConflict: 'url', ignoreDuplicates: true });

      if (insertError) {
        console.error('Error inserting articles:', insertError);
        throw insertError;
      }

      console.log(`Successfully inserted ${limitedNews.length} articles`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        articlesInserted: limitedNews.length,
        message: 'News fetch completed successfully' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in fetch-news function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});