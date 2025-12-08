import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    console.log(`Analyzing audio file: ${fileName}`);

    // Gemini 2.5 Flash supports audio analysis natively
    // Pass the audio data URL directly - Gemini can process audio/mpeg, audio/wav, etc.
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
            content: `You are an expert music theorist and audio analyst. Listen to the provided audio and detect the chord progression.

ANALYZE THE ACTUAL AUDIO - detect chords by ear from what you hear in the recording.

Respond ONLY in this JSON format:
{
  "key": "e.g. C Major, A Minor",
  "tempo": "estimated BPM as number",
  "timeSignature": "e.g. 4/4",
  "chordProgression": [
    {"chord": "Am", "timestamp": "0:00"},
    {"chord": "F", "timestamp": "0:04"},
    {"chord": "C", "timestamp": "0:08"},
    {"chord": "G", "timestamp": "0:12"}
  ],
  "sections": {
    "intro": ["Am"],
    "verse": ["Am", "F", "C", "G"],
    "chorus": ["F", "G", "Am", "C"]
  },
  "confidence": "high/medium/low",
  "notes": "brief notes about the harmonic structure"
}`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Analyze this audio and detect all chords. Listen carefully to identify the key, tempo, and full chord progression with timestamps.`
              },
              {
                type: 'image_url',
                image_url: {
                  url: audioData
                }
              }
            ]
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

      throw new Error(`AI analysis failed: ${errorText}`);
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