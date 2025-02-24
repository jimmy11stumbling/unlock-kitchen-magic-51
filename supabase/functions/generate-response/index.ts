
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const claudeApiKey = Deno.env.get('CLAUDE_API_KEY');
    
    if (!claudeApiKey) {
      console.error('Claude API key not configured');
      throw new Error('Claude API key not configured');
    }

    const { messages, system } = await req.json();
    console.log('Received request with messages:', messages);
    console.log('System prompt:', system);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': claudeApiKey,
        'anthropic-version': '2024-02-15-preview'
      },
      body: JSON.stringify({
        model: 'claude-3-opus-20240229',
        max_tokens: 1000,
        messages: messages.map((msg: any) => ({
          role: msg.role,
          content: msg.content
        })),
        system: system || "You are a helpful AI assistant that helps users with their questions."
      })
    });

    console.log('Claude API Response Status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Claude API Error:', errorData);
      throw new Error(`Claude API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Claude API Response:', data);

    if (!data.content || !data.content[0] || !data.content[0].text) {
      console.error('Unexpected response structure:', data);
      throw new Error('Unexpected response format from Claude API');
    }

    const message = data.content[0].text;
    
    return new Response(
      JSON.stringify({ message }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );
  } catch (error) {
    console.error('Error in generate-response function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An unexpected error occurred',
        details: error instanceof Error ? error.stack : undefined
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});
