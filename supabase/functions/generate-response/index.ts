
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface RequestBody {
  messages: Message[];
  system?: string;
}

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_API_KEY = Deno.env.get('CLAUDE_API_KEY') || '';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check if this is a request from our Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    // Get current user
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    // Parse request body
    const body: RequestBody = await req.json();
    const { messages, system } = body;

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({
          error: 'Invalid request: messages array is required'
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Generating response for user message:', messages[messages.length - 1].content);

    // Default system prompt if none provided
    const systemPrompt = system || 
      "You are a helpful AI assistant for a MaestroAI restaurant management system. " + 
      "You provide specific advice for restaurant management, menu planning, staff scheduling, " +
      "inventory management, customer service, and other restaurant operations. " +
      "Keep your responses practical and focused on restaurant management.";

    // Format messages for Anthropic
    const anthropicMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    // Call Anthropic Claude API
    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1000,
        messages: anthropicMessages,
        system: systemPrompt
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Anthropic API error:', errorText);
      
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const responseData = await response.json();
    
    // Log the successful completion
    console.log('Successfully generated response');

    // Return the response with CORS headers
    return new Response(
      JSON.stringify({ 
        message: responseData.content[0].text,
        model: responseData.model
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error in generate-response function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An error occurred while generating a response' 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
