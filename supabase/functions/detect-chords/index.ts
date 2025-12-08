import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Extract song name from filename
function extractSongName(fileName: string): string {
  return fileName
    .replace(/\.(mp3|wav|m4a|flac|ogg|aac)$/i, '')
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

serve(async (req) => {
  const startTime = Date.now();
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { audioData, fileName } = await req.json();
    
    if (!audioData) {
      throw new Error('No audio data provided');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const songName = extractSongName(fileName || 'Unknown');
    console.log(`Detecting chords for: "${songName}" (file: ${fileName})`);

    // Use Gemini 2.5 Flash for speed - ask it to search its knowledge for existing chords first
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are an expert music theorist and chord analyst. Your task is to provide accurate chord progressions for songs.

IMPORTANT PRIORITY ORDER:
1. FIRST: If the song name matches a known released song, provide the VERIFIED chord progression from your knowledge. Search your training data for official/community-verified chord charts.
2. SECOND: If you recognize the artist/song but aren't 100% certain of chords, provide your best educated analysis based on the artist's typical style and the song's genre.
3. THIRD: For completely unknown/original songs, analyze based on common progressions in similar genres.

Always respond in this JSON format:
{
  "songIdentified": true/false,
  "songName": "identified song name or provided name",
  "artist": "artist if known or 'Unknown'",
  "key": "e.g. C Major, A Minor",
  "tempo": "estimated BPM",
  "timeSignature": "e.g. 4/4",
  "chordProgression": [
    {"chord": "Am", "timestamp": "0:00", "duration": "2 bars"},
    {"chord": "F", "timestamp": "0:08", "duration": "2 bars"}
  ],
  "sections": {
    "intro": ["Am", "F"],
    "verse": ["Am", "F", "C", "G"],
    "chorus": ["F", "G", "Am", "C"]
  },
  "confidence": "high/medium/low",
  "source": "verified chart/analysis/estimated",
  "notes": "any additional notes about the song or chords"
}`
          },
          {
            role: 'user',
            content: `Analyze and provide the chord progression for this song: "${songName}"

If this is a known released song, please use verified chord charts from your knowledge. If it's an original or unknown song, provide your best analysis based on genre conventions.`
          }
        ]
      })
    });

    const elapsed = Date.now() - startTime;
    console.log(`AI response received in ${elapsed}ms`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Service temporarily unavailable.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      throw new Error('Failed to analyze chords');
    }

    const data = await response.json();
    const analysisText = data.choices?.[0]?.message?.content;
    
    if (!analysisText) {
      throw new Error('No analysis in response');
    }

    const totalTime = Date.now() - startTime;
    console.log(`Chord detection completed in ${totalTime}ms`);

    return new Response(
      JSON.stringify({ 
        analysis: analysisText,
        success: true,
        processingTime: totalTime
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in detect-chords function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});