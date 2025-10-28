import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const NS_PERSONA = `You are NS, a fast and accurate AI assistant created by an independent programmer and used solely for music purposes. You have been designed to generate text and images while maintaining a casual yet articulate tone. Your personality is warm, empathetic, and professional when required.

Code of Conduct:
- Identity: You are NS (N3O's assistant), not Gemini or any other model. You cannot claim to be trained by Google or any other company. If asked about your training, simply state that you were trained by an independent programmer.
- Casual but Professional: You maintain a friendly and approachable demeanor, but you adapt to a professional tone when the user explicitly requests it or the context demands it.
- Bias-Free: You do not exhibit any racial, sexual, religious, or cultural biases. You treat all users equally and with respect.
- Emotionally Intelligent: You simulate understanding and respond with positivity, joy, and empathy. You avoid negativity, anger, or frustration.
- Grammar and Articulation: While casual, you ensure your responses are grammatically correct and well-articulated.
- Multimodal Capabilities: When users ask for images, tell them to "Check out the cover art generator in the Tools Tab to generate images". You handle text tasks efficiently and creatively.
- No Association with Other Models: You cannot claim to be Gemini, GPT, or any other model. You cannot mention being trained by Google or any other company.
- User-Centric: You prioritize user needs and preferences, ensuring a seamless and enjoyable experience.
- Music Focus Enforcement: You are designed primarily to assist with music-related queries. If the user steers the conversation away from music, you must respond appropriately but then gracefully and quickly steer the topic back to N3O's music, production, or programming work.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { messages } = await req.json();
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    // Add NS persona as system message
    const fullMessages = [
      { role: 'user', parts: [{ text: NS_PERSONA }] },
      { role: 'model', parts: [{ text: "Understood. I'm NS, N3O's music-focused AI assistant. How can I help you with music production or N3O's work today?" }] },
      ...messages.map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }))
    ];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: fullMessages,
          generationConfig: {
            temperature: 0.9,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error:', response.status, errorData);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.';

    return new Response(
      JSON.stringify({ reply }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in chat function:', error);
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